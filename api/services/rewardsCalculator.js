const { LightningNodeClient } = require('./lightningClient');
const Contribution = require('../models/Contribution');
const User = require('../models/User');

class RewardsCalculator {
  
  constructor() {
    this.lightningClient = new LightningNodeClient();
    
    // Barème de récompenses de base selon les spécifications
    this.baseRewards = {
      'guide': 200,
      'tutorial': 150,
      'troubleshooting': 80,
      'analysis': 120,
      'script': 100,
      'security': 180,
      'translation': 60,
      'review': 25
    };
    
    // Multiplicateurs spécialisés
    this.multipliers = {
      complexity: { min: 1.5, max: 3.0 },
      originality: 1.2,
      roi_impact: { min: 1.3, max: 2.5 },
      urgency: { min: 1.2, max: 2.0 },
      rarity: 1.5,
      research_depth: { min: 1.3, max: 2.0 },
      community_utility: { min: 1.2, max: 2.5 },
      criticality: { min: 1.5, max: 3.0 },
      language_factor: { min: 1.0, max: 1.4 },
      quality: 1.2,
      precision: { min: 1.1, max: 1.8 },
      speed: 1.1,
      domain_expertise: { min: 1.2, max: 2.0 }
    };
    
    this.pioneerBonus = 100;
  }
  
  /**
   * Calcule les récompenses T4G pour une contribution
   */
  async calculateT4GRewards(contribution, networkMetrics = {}) {
    try {
      const baseValue = this.baseRewards[contribution.type] || 100;
      
      // Facteurs spécialisés Lightning/DazBox
      const technicalAccuracy = await this.assessTechnicalAccuracy(contribution);
      const economicImpact = await this.measureEconomicImpact(contribution, networkMetrics);
      const adoptionRate = this.calculateAdoptionRate(contribution);
      const networkHealth = this.assessNetworkHealthContribution(contribution);
      
      // Bonus décentralisation
      const decentralizationBonus = this.calculateDecentralizationBonus(contribution);
      
      // Bonus innovation T4G
      const innovationBonus = this.calculateInnovationBonus(contribution);
      
      const finalReward = Math.floor(
        baseValue * 
        technicalAccuracy * 
        economicImpact * 
        adoptionRate * 
        networkHealth +
        decentralizationBonus +
        innovationBonus
      );
      
      return {
        baseValue,
        technicalAccuracy,
        economicImpact,
        adoptionRate,
        networkHealth,
        decentralizationBonus,
        innovationBonus,
        finalReward
      };
      
    } catch (error) {
      console.error('Error calculating T4G rewards:', error);
      throw error;
    }
  }
  
  /**
   * Évalue la précision technique d'une contribution
   */
  async assessTechnicalAccuracy(contribution) {
    try {
      // Validation par tests automatisés + peer review
      const automatedTests = await this.runAutomatedTests(contribution);
      const peerReviews = this.getPeerReviewScores(contribution);
      const communityFeedback = this.getCommunitySuccess(contribution);
      
      return (automatedTests * 0.3 + peerReviews * 0.4 + communityFeedback * 0.3);
      
    } catch (error) {
      console.error('Error assessing technical accuracy:', error);
      return 1.0; // Valeur par défaut
    }
  }
  
  /**
   * Mesure l'impact économique réel
   */
  async measureEconomicImpact(contribution, networkMetrics) {
    try {
      // Calcul basé sur amélioration ROI réelle des utilisateurs
      const roiImprovement = networkMetrics.avgROIImprovement || 1;
      const usersImpacted = networkMetrics.adoptingNodes || 1;
      const sustainabilityFactor = networkMetrics.longTermSuccess || 1;
      
      const impact = Math.min(
        roiImprovement * Math.log(usersImpacted) * sustainabilityFactor, 
        3
      );
      
      return Math.max(0.5, impact); // Minimum 0.5, maximum 3.0
      
    } catch (error) {
      console.error('Error measuring economic impact:', error);
      return 1.0;
    }
  }
  
  /**
   * Calcule le taux d'adoption
   */
  calculateAdoptionRate(contribution) {
    if (!contribution.adoption) return 1.0;
    
    const { implementations, views, successRate } = contribution.adoption;
    
    // Facteur basé sur le nombre d'implémentations
    let adoptionFactor = 1.0;
    if (implementations > 50) adoptionFactor = 2.0;
    else if (implementations > 20) adoptionFactor = 1.5;
    else if (implementations > 5) adoptionFactor = 1.2;
    
    // Bonus pour taux de succès élevé
    const successFactor = successRate > 80 ? 1.3 : (successRate > 60 ? 1.1 : 1.0);
    
    // Facteur visibilité
    const visibilityFactor = views > 1000 ? 1.2 : (views > 100 ? 1.1 : 1.0);
    
    return Math.min(adoptionFactor * successFactor * visibilityFactor, 2.5);
  }
  
  /**
   * Évalue la contribution à la santé du réseau
   */
  assessNetworkHealthContribution(contribution) {
    let healthScore = 1.0;
    
    // Bonus pour contributions liées à la décentralisation
    if (contribution.primaryDomain === 'decentralization') {
      healthScore *= 1.3;
    }
    
    // Bonus pour contributions sécurité
    if (contribution.primaryDomain === 'security' || contribution.type === 'security') {
      healthScore *= 1.4;
    }
    
    // Bonus pour guides d'optimisation réseau
    if (contribution.tags && contribution.tags.includes('network_optimization')) {
      healthScore *= 1.2;
    }
    
    return Math.min(healthScore, 2.0);
  }
  
  /**
   * Calcule le bonus décentralisation
   */
  calculateDecentralizationBonus(contribution) {
    let bonus = 0;
    
    if (contribution.primaryDomain === 'decentralization') {
      bonus += 50;
    }
    
    // Bonus pour guides géographiquement diversifiés
    if (contribution.tags && contribution.tags.includes('geographic_diversity')) {
      bonus += 30;
    }
    
    // Bonus pour résistance à la censure
    if (contribution.tags && contribution.tags.includes('censorship_resistance')) {
      bonus += 40;
    }
    
    return bonus;
  }
  
  /**
   * Calcule le bonus innovation T4G
   */
  calculateInnovationBonus(contribution) {
    let bonus = 0;
    
    if (contribution.primaryDomain === 't4g_innovation') {
      bonus += 100;
    }
    
    // Bonus pour intégration RGB
    if (contribution.tags && contribution.tags.includes('rgb_integration')) {
      bonus += 80;
    }
    
    // Bonus pour projets à impact social
    if (contribution.tags && contribution.tags.includes('social_impact')) {
      bonus += 60;
    }
    
    return bonus;
  }
  
  /**
   * Lance des tests automatisés sur une contribution
   */
  async runAutomatedTests(contribution) {
    try {
      if (contribution.type !== 'script' || !contribution.codeRepository) {
        return 1.0; // Pas de tests automatisés pour ce type
      }
      
      // Ici on intégrerait avec des outils comme GitHub Actions, Docker, etc.
      // Pour l'instant, simulation basée sur les reviews existantes
      
      const testScore = contribution.peerReviews.length > 0 ? 
        contribution.peerReviews.reduce((sum, review) => sum + review.score.technicalAccuracy, 0) / contribution.peerReviews.length / 5 :
        0.8; // Score par défaut
      
      return Math.max(0.5, Math.min(1.5, testScore));
      
    } catch (error) {
      console.error('Error running automated tests:', error);
      return 0.8;
    }
  }
  
  /**
   * Calcule le score moyen des peer reviews
   */
  getPeerReviewScores(contribution) {
    if (!contribution.peerReviews || contribution.peerReviews.length === 0) {
      return 1.0;
    }
    
    const expertReviews = contribution.peerReviews.filter(review => review.isExpertReview);
    const regularReviews = contribution.peerReviews.filter(review => !review.isExpertReview);
    
    // Pondération : expert reviews comptent 3x plus
    const expertWeight = expertReviews.length * 3;
    const regularWeight = regularReviews.length;
    const totalWeight = expertWeight + regularWeight;
    
    if (totalWeight === 0) return 1.0;
    
    const expertAvg = expertReviews.reduce((sum, review) => sum + review.overallScore, 0);
    const regularAvg = regularReviews.reduce((sum, review) => sum + review.overallScore, 0);
    
    const avgScore = ((expertAvg * 3) + regularAvg) / totalWeight;
    
    return Math.max(0.5, Math.min(2.0, avgScore / 5 * 2)); // Normalisation 0.5-2.0
  }
  
  /**
   * Évalue le succès communautaire basé sur les tests terrain
   */
  getCommunitySuccess(contribution) {
    if (!contribution.fieldTests || contribution.fieldTests.length === 0) {
      return 1.0;
    }
    
    const successfulTests = contribution.fieldTests.filter(test => test.testResults.success);
    const successRate = successfulTests.length / contribution.fieldTests.length;
    
    // Bonus pour amélioration mesurable
    const avgImprovement = successfulTests.reduce((sum, test) => 
      sum + (test.testResults.improvementPct || 0), 0
    ) / successfulTests.length;
    
    let communityScore = 0.8 + (successRate * 0.4); // Base 0.8-1.2
    
    if (avgImprovement > 20) communityScore *= 1.3;
    else if (avgImprovement > 10) communityScore *= 1.15;
    
    return Math.max(0.5, Math.min(2.0, communityScore));
  }
  
  /**
   * Calcule l'impact économique global d'une contribution
   */
  async calculateEconomicImpact(contribution) {
    try {
      let totalValue = 0;
      let impactedNodes = 0;
      
      // Analyser les tests terrain pour l'impact économique
      for (const fieldTest of contribution.fieldTests || []) {
        if (fieldTest.testResults.success && fieldTest.testResults.improvementPct > 0) {
          // Estimation de la valeur économique basée sur l'amélioration
          const nodeCapacity = fieldTest.testResults.afterMetrics?.capacity || 1000000; // 1M sats par défaut
          const improvementValue = (nodeCapacity * fieldTest.testResults.improvementPct / 100) * 0.1; // 10% de l'amélioration
          
          totalValue += improvementValue;
          impactedNodes += 1;
        }
      }
      
      // Extrapolation basée sur les vues et implémentations
      const extrapolationFactor = Math.min(contribution.adoption?.implementations || 1, 100);
      const estimatedTotalValue = totalValue * extrapolationFactor;
      
      return {
        directValue: totalValue,
        estimatedTotalValue,
        impactedNodes,
        extrapolationFactor
      };
      
    } catch (error) {
      console.error('Error calculating economic impact:', error);
      return { directValue: 0, estimatedTotalValue: 0, impactedNodes: 0 };
    }
  }
  
  /**
   * Valide les métriques Lightning Network
   */
  async validateLightningMetrics(nodePublicKey, beforeMetrics, afterMetrics) {
    try {
      // Intégration avec APIs Lightning Network (Amboss, 1ML, etc.)
      const nodeInfo = await this.lightningClient.getNodeInfo(nodePublicKey);
      
      if (!nodeInfo) {
        throw new Error('Cannot validate node metrics - node not found');
      }
      
      // Validation de cohérence des métriques
      const validatedMetrics = {
        ...afterMetrics,
        validated: true,
        validationTimestamp: Date.now(),
        nodeAlias: nodeInfo.alias,
        nodeCapacity: nodeInfo.capacity
      };
      
      // Calcul de l'amélioration validée
      if (beforeMetrics.routingRevenue && afterMetrics.routingRevenue) {
        const improvement = ((afterMetrics.routingRevenue - beforeMetrics.routingRevenue) / beforeMetrics.routingRevenue) * 100;
        validatedMetrics.validatedImprovementPct = improvement;
      }
      
      return validatedMetrics;
      
    } catch (error) {
      console.error('Error validating Lightning metrics:', error);
      return { ...afterMetrics, validated: false, validationError: error.message };
    }
  }
  
}

module.exports = new RewardsCalculator();