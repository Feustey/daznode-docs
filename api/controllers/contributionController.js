const Contribution = require('../models/Contribution');
const User = require('../models/User');
const { calculateEconomicImpact, calculateT4GRewards, validateLightningMetrics } = require('../services/rewardsCalculator');
const { validateContributionContent, runAutomatedTests } = require('../services/contentValidator');

class ContributionController {
  
  // Créer une nouvelle contribution
  async createContribution(req, res) {
    try {
      const {
        title,
        description,
        content,
        type,
        primaryDomain,
        secondaryDomains,
        difficulty,
        targetAudience,
        prerequisites,
        estimatedTime,
        tags,
        technical,
        codeRepository,
        demoUrl
      } = req.body;
      
      // Validation du contenu
      const validationResult = await validateContributionContent(content, type, primaryDomain);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Content validation failed',
          errors: validationResult.errors
        });
      }
      
      const contribution = new Contribution({
        title,
        description,
        content,
        author: req.user._id,
        type,
        primaryDomain,
        secondaryDomains: secondaryDomains || [],
        difficulty,
        targetAudience: targetAudience || [],
        prerequisites: prerequisites || [],
        estimatedTime,
        tags: tags || [],
        technical,
        codeRepository,
        demoUrl,
        status: 'submitted'
      });
      
      // Calcul des récompenses de base
      const baseReward = contribution.calculateRewards();
      
      await contribution.save();
      
      // Mise à jour du compteur de contributions de l'utilisateur
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'reputation.contributionsCount': 1 }
      });
      
      // Si c'est un script ou un outil, lancer les tests automatisés
      if (type === 'script' && codeRepository) {
        setTimeout(async () => {
          try {
            const testResults = await runAutomatedTests(contribution._id, codeRepository);
            await contribution.updateOne({ 
              $set: { 'technical.testResults': testResults }
            });
          } catch (error) {
            console.error('Automated tests failed:', error);
          }
        }, 5000);
      }
      
      res.status(201).json({
        success: true,
        data: contribution,
        message: 'Contribution created successfully',
        estimatedReward: baseReward
      });
      
    } catch (error) {
      console.error('Create contribution error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Obtenir toutes les contributions avec filtrage
  async getContributions(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        domain,
        type,
        difficulty,
        status,
        author,
        featured,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search
      } = req.query;
      
      const query = {};
      
      // Filtres
      if (domain) query.primaryDomain = domain;
      if (type) query.type = type;
      if (difficulty) query.difficulty = difficulty;
      if (status) query.status = status;
      if (author) query.author = author;
      if (featured === 'true') query.featured = true;
      
      // Recherche textuelle
      if (search) {
        query.$text = { $search: search };
      }
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
        populate: [
          {
            path: 'author',
            select: 'username profile.firstName profile.lastName profile.avatar reputation.totalScore expertises'
          },
          {
            path: 'peerReviews.reviewer',
            select: 'username profile.avatar expertises'
          }
        ]
      };
      
      const contributions = await Contribution.paginate(query, options);
      
      res.json({
        success: true,
        data: contributions.docs,
        pagination: {
          page: contributions.page,
          pages: contributions.pages,
          total: contributions.total,
          limit: contributions.limit
        }
      });
      
    } catch (error) {
      console.error('Get contributions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Obtenir une contribution spécifique
  async getContribution(req, res) {
    try {
      const { id } = req.params;
      
      const contribution = await Contribution.findById(id)
        .populate('author', 'username profile reputation expertises lightningNode')
        .populate('coAuthors', 'username profile')
        .populate('peerReviews.reviewer', 'username profile.avatar expertises')
        .populate('fieldTests.tester', 'username profile.avatar');
      
      if (!contribution) {
        return res.status(404).json({
          success: false,
          message: 'Contribution not found'
        });
      }
      
      // Incrémenter les vues
      contribution.adoption.views += 1;
      await contribution.save();
      
      res.json({
        success: true,
        data: contribution
      });
      
    } catch (error) {
      console.error('Get contribution error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Ajouter une peer review
  async addPeerReview(req, res) {
    try {
      const { id } = req.params;
      const { scores, feedback } = req.body;
      
      const contribution = await Contribution.findById(id);
      if (!contribution) {
        return res.status(404).json({
          success: false,
          message: 'Contribution not found'
        });
      }
      
      // Vérifier que l'utilisateur n'est pas l'auteur
      if (contribution.author.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot review your own contribution'
        });
      }
      
      // Déterminer si c'est une review d'expert
      const user = await User.findById(req.user._id);
      const expertise = user.expertises.find(exp => exp.domain === contribution.primaryDomain);
      const isExpertReview = expertise && expertise.level in ['advanced', 'expert', 'master'] && expertise.reputationScore >= 200;
      
      await contribution.addPeerReview(req.user._id, scores, feedback, isExpertReview);
      
      // Récompenser le reviewer
      const reviewReward = isExpertReview ? 50 : 25;
      await user.awardT4G(reviewReward, `Expert review of contribution: ${contribution.title}`);
      await user.updateDomainReputation(contribution.primaryDomain, reviewReward / 2);
      
      // Recalculer les récompenses de la contribution basées sur la nouvelle review
      const updatedReward = contribution.calculateRewards();
      
      res.json({
        success: true,
        message: 'Review added successfully',
        data: {
          contribution: contribution,
          reviewerReward: reviewReward,
          updatedContributionReward: updatedReward
        }
      });
      
    } catch (error) {
      console.error('Add peer review error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
  
  // Ajouter un test terrain
  async addFieldTest(req, res) {
    try {
      const { id } = req.params;
      const { testResults, feedback, nodePublicKey } = req.body;
      
      const contribution = await Contribution.findById(id);
      if (!contribution) {
        return res.status(404).json({
          success: false,
          message: 'Contribution not found'
        });
      }
      
      // Valider les métriques Lightning si un nœud est fourni
      let validatedMetrics = testResults;
      if (nodePublicKey && testResults.beforeMetrics && testResults.afterMetrics) {
        try {
          validatedMetrics = await validateLightningMetrics(
            nodePublicKey, 
            testResults.beforeMetrics, 
            testResults.afterMetrics
          );
        } catch (validationError) {
          console.error('Lightning metrics validation failed:', validationError);
        }
      }
      
      await contribution.addFieldTest(req.user._id, {
        ...validatedMetrics,
        nodePublicKey
      }, feedback);
      
      // Récompenser le testeur
      const testReward = testResults.success ? 30 : 15;
      const user = await User.findById(req.user._id);
      await user.awardT4G(testReward, `Field test of contribution: ${contribution.title}`);
      
      // Si le test montre une amélioration significative, bonus à l'auteur
      if (testResults.success && testResults.improvementPct > 10) {
        const author = await User.findById(contribution.author);
        const improvementBonus = Math.floor(testResults.improvementPct * 2);
        await author.awardT4G(improvementBonus, `Performance improvement bonus: ${contribution.title}`);
      }
      
      res.json({
        success: true,
        message: 'Field test added successfully',
        data: {
          contribution,
          testerReward: testReward
        }
      });
      
    } catch (error) {
      console.error('Add field test error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
  
  // Calculer et distribuer les récompenses finales
  async distributeRewards(req, res) {
    try {
      const { id } = req.params;
      
      const contribution = await Contribution.findById(id)
        .populate('author')
        .populate('coAuthors');
      
      if (!contribution) {
        return res.status(404).json({
          success: false,
          message: 'Contribution not found'
        });
      }
      
      if (contribution.rewards.distributed) {
        return res.status(400).json({
          success: false,
          message: 'Rewards already distributed'
        });
      }
      
      // Vérifier que la contribution a été suffisamment validée
      if (contribution.peerReviews.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Contribution needs at least 2 peer reviews before reward distribution'
        });
      }
      
      // Calculer les récompenses finales avec tous les multiplicateurs
      const finalReward = contribution.calculateRewards();
      
      // Calculer l'impact économique si applicable
      const economicImpact = await calculateEconomicImpact(contribution);
      if (economicImpact.totalValue > 0) {
        contribution.impact.push({
          impactType: 'roi_improvement',
          measuredValue: economicImpact.totalValue,
          economicValue: economicImpact.totalValue,
          verifiedAt: new Date()
        });
      }
      
      // Distribution des récompenses
      const author = await User.findById(contribution.author);
      
      // 70% à l'auteur principal
      const authorReward = Math.floor(finalReward * 0.7);
      await author.awardT4G(authorReward, `Final reward for contribution: ${contribution.title}`);
      await author.updateDomainReputation(contribution.primaryDomain, authorReward / 4);
      
      // 30% partagé entre co-auteurs s'il y en a
      const coAuthorReward = Math.floor(finalReward * 0.3);
      if (contribution.coAuthors.length > 0) {
        const rewardPerCoAuthor = Math.floor(coAuthorReward / contribution.coAuthors.length);
        
        for (const coAuthorId of contribution.coAuthors) {
          const coAuthor = await User.findById(coAuthorId);
          await coAuthor.awardT4G(rewardPerCoAuthor, `Co-author reward for: ${contribution.title}`);
          await coAuthor.updateDomainReputation(contribution.primaryDomain, rewardPerCoAuthor / 4);
        }
      } else {
        // Si pas de co-auteurs, tout va à l'auteur principal
        await author.awardT4G(coAuthorReward, `Additional reward for solo contribution: ${contribution.title}`);
      }
      
      // Marquer les récompenses comme distribuées
      contribution.rewards.distributed = true;
      contribution.rewards.distributedAt = new Date();
      contribution.status = 'published';
      
      await contribution.save();
      
      res.json({
        success: true,
        message: 'Rewards distributed successfully',
        data: {
          totalReward: finalReward,
          authorReward: authorReward + (contribution.coAuthors.length === 0 ? coAuthorReward : 0),
          coAuthorReward: contribution.coAuthors.length > 0 ? Math.floor(coAuthorReward / contribution.coAuthors.length) : 0,
          economicImpact: economicImpact.totalValue,
          contribution
        }
      });
      
    } catch (error) {
      console.error('Distribute rewards error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Obtenir les statistiques des contributions
  async getContributionStats(req, res) {
    try {
      const stats = await Promise.all([
        // Total contributions par domaine
        Contribution.aggregate([
          { $match: { status: 'published' } },
          { $group: { _id: '$primaryDomain', count: { $sum: 1 } } }
        ]),
        
        // Total récompenses distribuées
        Contribution.aggregate([
          { $match: { 'rewards.distributed': true } },
          { $group: { _id: null, totalRewards: { $sum: '$rewards.totalReward' } } }
        ]),
        
        // Top contributeurs
        User.find({})
          .sort({ 'reputation.totalScore': -1 })
          .limit(10)
          .select('username profile.avatar reputation expertises t4gWallet.totalEarned')
      ]);
      
      const [domainStats, rewardStats, topContributors] = stats;
      
      res.json({
        success: true,
        data: {
          contributionsByDomain: domainStats,
          totalRewardsDistributed: rewardStats[0]?.totalRewards || 0,
          topContributors
        }
      });
      
    } catch (error) {
      console.error('Get contribution stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  
}

module.exports = new ContributionController();