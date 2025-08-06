const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Contribution = require('../models/Contribution');
const { calculateChallengeRewards, validateChallengeSubmission } = require('../services/challengeService');

class ChallengeController {
  
  // Créer un nouveau challenge
  async createChallenge(req, res) {
    try {
      const {
        title,
        description,
        detailedDescription,
        type,
        category,
        difficulty,
        startDate,
        endDate,
        submissionDeadline,
        evaluationDeadline,
        maxParticipants,
        minParticipants,
        evaluationCriteria,
        rewards,
        objectives,
        resources,
        rules,
        eligibilityCriteria,
        submissionRequirements,
        networkIntegration,
        features,
        tags
      } = req.body;
      
      // Validation des permissions (seuls les moderators/admins peuvent créer des challenges)
      const user = await User.findById(req.user._id);
      if (!user.canCreateChallenges && !user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create challenges'
        });
      }
      
      const challenge = new Challenge({
        title,
        description,
        detailedDescription,
        type,
        category,
        difficulty,
        organizer: req.user._id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : new Date(endDate),
        evaluationDeadline: evaluationDeadline ? new Date(evaluationDeadline) : null,
        maxParticipants,
        minParticipants: minParticipants || 1,
        evaluationCriteria: evaluationCriteria || [],
        rewards: {
          totalPool: rewards.totalPool,
          distribution: rewards.distribution || [],
          participation_reward: rewards.participation_reward || 0
        },
        objectives,
        resources: resources || [],
        rules,
        eligibilityCriteria: eligibilityCriteria || [],
        submissionRequirements: submissionRequirements || [],
        networkIntegration: networkIntegration || {},
        features: features || {},
        tags: tags || [],
        status: 'draft'
      });
      
      await challenge.save();
      
      res.status(201).json({
        success: true,
        data: challenge,
        message: 'Challenge created successfully'
      });
      
    } catch (error) {
      console.error('Create challenge error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Obtenir tous les challenges avec filtrage
  async getChallenges(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        category,
        difficulty,
        type,
        featured,
        active,
        upcoming,
        sortBy = 'startDate',
        sortOrder = 'desc'
      } = req.query;
      
      const query = {};
      
      // Filtres
      if (status) query.status = status;
      if (category) query.category = category;
      if (difficulty) query.difficulty = difficulty;
      if (type) query.type = type;
      if (featured === 'true') query.featured = true;
      
      // Filtres temporels
      const now = new Date();
      if (active === 'true') {
        query.status = 'active';
        query.startDate = { $lte: now };
        query.endDate = { $gte: now };
      }
      
      if (upcoming === 'true') {
        query.status = 'upcoming';
        query.startDate = { $gt: now };
      }
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
        populate: [
          {
            path: 'organizer',
            select: 'username profile.firstName profile.lastName profile.avatar'
          }
        ]
      };
      
      const challenges = await Challenge.paginate(query, options);
      
      // Ajouter des métriques calculées
      challenges.docs = challenges.docs.map(challenge => ({
        ...challenge.toObject(),
        participantCount: challenge.participants.length,
        submissionCount: challenge.participants.filter(p => p.status === 'submitted').length,
        timeRemaining: challenge.endDate - now,
        isActive: challenge.isActive
      }));
      
      res.json({
        success: true,
        data: challenges.docs,
        pagination: {
          page: challenges.page,
          pages: challenges.pages,
          total: challenges.total,
          limit: challenges.limit
        }
      });
      
    } catch (error) {
      console.error('Get challenges error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  
  // Obtenir un challenge spécifique
  async getChallenge(req, res) {
    try {
      const { id } = req.params;
      
      const challenge = await Challenge.findById(id)
        .populate('organizer', 'username profile reputation expertises')
        .populate('moderators', 'username profile')
        .populate('participants.user', 'username profile.avatar reputation')
        .populate('participants.submission', 'title description createdAt');
      
      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }
      
      // Incrémenter les vues
      await challenge.updateEngagement('view');
      
      // Ajouter des métriques en temps réel
      const challengeData = {
        ...challenge.toObject(),
        participantCount: challenge.participants.length,
        submissionCount: challenge.participants.filter(p => p.status === 'submitted').length,
        timeRemaining: challenge.timeRemaining,
        isActive: challenge.isActive,
        canParticipate: req.user ? challenge.canParticipate(req.user) : { canParticipate: false, reason: 'Not authenticated' }
      };
      
      res.json({
        success: true,
        data: challengeData
      });
      
    } catch (error) {
      console.error('Get challenge error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  
  // Participer à un challenge
  async participateInChallenge(req, res) {
    try {
      const { id } = req.params;
      
      const challenge = await Challenge.findById(id);
      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }
      
      // Vérifier l'éligibilité
      const user = await User.findById(req.user._id);
      const participationCheck = challenge.canParticipate(user);
      
      if (!participationCheck.canParticipate) {
        return res.status(400).json({
          success: false,
          message: participationCheck.reason
        });
      }
      
      await challenge.addParticipant(req.user._id);
      
      // Notifier l'organisateur
      // TODO: Implémenter système de notifications
      
      res.json({
        success: true,
        message: 'Successfully joined the challenge',
        data: {
          participantCount: challenge.participants.length,
          userStatus: 'participating'
        }
      });
      
    } catch (error) {
      console.error('Participate in challenge error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
  
  // Soumettre une contribution pour un challenge
  async submitToChallenge(req, res) {
    try {
      const { id } = req.params;
      const { contributionId, metrics } = req.body;
      
      const challenge = await Challenge.findById(id);
      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }
      
      // Vérifier que l'utilisateur participe
      const participant = challenge.participants.find(p => 
        p.user.toString() === req.user._id.toString()
      );
      
      if (!participant) {
        return res.status(400).json({
          success: false,
          message: 'You are not participating in this challenge'
        });
      }
      
      // Vérifier que la contribution existe
      const contribution = await Contribution.findById(contributionId);
      if (!contribution) {
        return res.status(404).json({
          success: false,
          message: 'Contribution not found'
        });
      }
      
      // Vérifier que l'utilisateur est l'auteur de la contribution
      if (contribution.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only submit your own contributions'
        });
      }
      
      // Valider la soumission selon les critères du challenge
      const validationResult = await validateChallengeSubmission(challenge, contribution, metrics);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Submission does not meet challenge requirements',
          errors: validationResult.errors
        });
      }
      
      await challenge.submitEntry(req.user._id, contributionId, metrics);
      
      res.json({
        success: true,
        message: 'Submission successful',
        data: {
          submissionCount: challenge.participants.filter(p => p.status === 'submitted').length,
          userStatus: 'submitted'
        }
      });
      
    } catch (error) {
      console.error('Submit to challenge error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
  
  // Évaluer les soumissions d'un challenge
  async evaluateChallenge(req, res) {
    try {
      const { id } = req.params;
      
      const challenge = await Challenge.findById(id)
        .populate('organizer')
        .populate('participants.user')
        .populate('participants.submission');
      
      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }
      
      // Vérifier les permissions (seul l'organisateur ou les modérateurs)
      if (challenge.organizer._id.toString() !== req.user._id.toString() && 
          !challenge.moderators.includes(req.user._id) && 
          !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to evaluate this challenge'
        });
      }
      
      // Vérifier que le challenge est en phase d'évaluation
      if (challenge.status !== 'evaluation_phase' && challenge.status !== 'submission_phase') {
        return res.status(400).json({
          success: false,
          message: 'Challenge is not ready for evaluation'
        });
      }
      
      // Calculer les scores et évaluer
      const evaluationResults = await this.calculateChallengeScores(challenge);
      
      await challenge.evaluateSubmissions();
      
      // Distribuer les récompenses aux gagnants
      for (const winner of challenge.results.winners) {
        const user = await User.findById(winner.user);
        await user.awardT4G(winner.reward, `Challenge winner reward: ${challenge.title}`);
        
        // Bonus réputation dans le domaine du challenge
        const reputationBonus = Math.floor(winner.reward / 4);
        await user.updateDomainReputation(challenge.category, reputationBonus);
      }
      
      // Récompenses de participation
      if (challenge.rewards.participation_reward > 0) {
        const participants = challenge.participants.filter(p => p.status !== 'participating');
        for (const participant of participants) {
          if (!challenge.results.winners.find(w => w.user.toString() === participant.user.toString())) {
            const user = await User.findById(participant.user);
            await user.awardT4G(challenge.rewards.participation_reward, `Challenge participation reward: ${challenge.title}`);
          }
        }
      }
      
      res.json({
        success: true,
        message: 'Challenge evaluated successfully',
        data: {
          winners: challenge.results.winners,
          totalParticipants: challenge.results.totalParticipants,
          totalSubmissions: challenge.results.totalSubmissions,
          evaluationResults
        }
      });
      
    } catch (error) {
      console.error('Evaluate challenge error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // Obtenir les statistiques des challenges
  async getChallengeStats(req, res) {
    try {
      const stats = await Promise.all([
        // Challenges actifs
        Challenge.countDocuments({ status: 'active' }),
        
        // Total participants ce mois
        Challenge.aggregate([
          { $match: { 
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }},
          { $unwind: '$participants' },
          { $group: { _id: null, count: { $sum: 1 } } }
        ]),
        
        // Récompenses distribuées
        Challenge.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, totalRewards: { $sum: '$rewards.totalPool' } } }
        ]),
        
        // Challenges par catégorie
        Challenge.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        
        // Top gagnants
        Challenge.aggregate([
          { $match: { status: 'completed' } },
          { $unwind: '$results.winners' },
          { $group: { 
            _id: '$results.winners.user',
            totalWins: { $sum: 1 },
            totalRewards: { $sum: '$results.winners.reward' }
          }},
          { $sort: { totalWins: -1 } },
          { $limit: 10 },
          { $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }},
          { $unwind: '$user' }
        ])
      ]);
      
      const [
        activeChallenges,
        monthlyParticipants,
        totalRewardsDistributed,
        challengesByCategory,
        topWinners
      ] = stats;
      
      res.json({
        success: true,
        data: {
          activeChallenges,
          monthlyParticipants: monthlyParticipants[0]?.count || 0,
          totalRewardsDistributed: totalRewardsDistributed[0]?.totalRewards || 0,
          challengesByCategory,
          topWinners: topWinners.map(winner => ({
            user: {
              username: winner.user.username,
              avatar: winner.user.profile?.avatar
            },
            totalWins: winner.totalWins,
            totalRewards: winner.totalRewards
          }))
        }
      });
      
    } catch (error) {
      console.error('Get challenge stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  
  // Calculer les scores des soumissions
  async calculateChallengeScores(challenge) {
    const submittedParticipants = challenge.participants.filter(p => p.status === 'submitted');
    const evaluationResults = [];
    
    for (const participant of submittedParticipants) {
      const contribution = participant.submission;
      const metrics = participant.metrics || {};
      
      let totalScore = 0;
      const criteriaScores = {};
      
      // Évaluer selon chaque critère
      for (const criterion of challenge.evaluationCriteria) {
        let score = 0;
        
        switch (criterion.name) {
          case 'technical_quality':
            score = await this.evaluateTechnicalQuality(contribution);
            break;
          case 'innovation':
            score = await this.evaluateInnovation(contribution);
            break;
          case 'economic_impact':
            score = await this.evaluateEconomicImpact(contribution, metrics);
            break;
          case 'community_value':
            score = await this.evaluateCommunityValue(contribution);
            break;
          case 'implementation_quality':
            score = await this.evaluateImplementation(contribution, metrics);
            break;
          default:
            score = 70; // Score par défaut
        }
        
        criteriaScores[criterion.name] = score;
        totalScore += (score * criterion.weight / 100);
      }
      
      participant.score = totalScore;
      
      evaluationResults.push({
        participant: participant.user,
        contribution: contribution.title,
        totalScore,
        criteriaScores
      });
    }
    
    return evaluationResults;
  }
  
  // Méthodes d'évaluation spécialisées
  async evaluateTechnicalQuality(contribution) {
    const qualityScore = contribution.qualityScore || 0;
    const fieldTestSuccess = contribution.fieldTestSuccessRate || 0;
    const peerReviewScore = contribution.peerReviews.length > 0 ? 
      contribution.peerReviews.reduce((sum, review) => sum + review.overallScore, 0) / contribution.peerReviews.length : 0;
    
    return Math.min(100, (qualityScore * 20) + (fieldTestSuccess * 0.4) + (peerReviewScore * 20));
  }
  
  async evaluateInnovation(contribution) {
    let innovationScore = 50; // Base score
    
    // Bonus pour nouveauté dans la catégorie
    const existingContributions = await Contribution.countDocuments({
      primaryDomain: contribution.primaryDomain,
      type: contribution.type,
      createdAt: { $lt: contribution.createdAt }
    });
    
    if (existingContributions < 5) innovationScore += 30;
    else if (existingContributions < 10) innovationScore += 15;
    
    // Bonus pour tags innovation
    if (contribution.tags.includes('innovation')) innovationScore += 20;
    if (contribution.tags.includes('first_of_kind')) innovationScore += 25;
    
    return Math.min(100, innovationScore);
  }
  
  async evaluateEconomicImpact(contribution, metrics) {
    const economicImpact = contribution.totalEconomicImpact || 0;
    const adoptionRate = contribution.adoption?.implementations || 0;
    const roiImprovement = metrics.avgROIImprovement || 0;
    
    let impactScore = Math.min(50, economicImpact / 1000); // Base sur impact économique
    impactScore += Math.min(30, adoptionRate * 2); // Bonus adoption
    impactScore += Math.min(20, roiImprovement); // Bonus ROI
    
    return Math.min(100, impactScore);
  }
  
  async evaluateCommunityValue(contribution) {
    const views = contribution.adoption?.views || 0;
    const bookmarks = contribution.adoption?.bookmarks || 0;
    const helpfulVotes = contribution.adoption?.helpfulVotes || 0;
    
    let communityScore = 0;
    communityScore += Math.min(30, views / 100); // Visibility
    communityScore += Math.min(25, bookmarks * 5); // Utility
    communityScore += Math.min(45, helpfulVotes * 10); // Community feedback
    
    return Math.min(100, communityScore);
  }
  
  async evaluateImplementation(contribution, metrics) {
    const successRate = contribution.fieldTestSuccessRate || 0;
    const avgImprovement = metrics.avgImprovement || 0;
    const implementationTime = metrics.avgImplementationTime || 0;
    
    let implementationScore = successRate; // Base sur taux de succès
    if (avgImprovement > 20) implementationScore += 20;
    else if (avgImprovement > 10) implementationScore += 10;
    
    // Bonus pour facilité d'implémentation (temps < 30 min)
    if (implementationTime < 30) implementationScore += 15;
    
    return Math.min(100, implementationScore);
  }
  
}

module.exports = new ChallengeController();