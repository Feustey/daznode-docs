const mongoose = require('mongoose');

const contributionImpactSchema = new mongoose.Schema({
  impactType: {
    type: String,
    enum: ['roi_improvement', 'cost_reduction', 'uptime_increase', 'security_enhancement', 'education_value'],
    required: true
  },
  measuredValue: {
    type: Number,
    required: true
  },
  measurementPeriod: Number, // jours
  validatorNodes: [String], // nœuds ayant validé l'impact
  economicValue: Number, // valeur économique estimée en sats
  verifiedAt: Date
});

const peerReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    technicalAccuracy: { type: Number, min: 1, max: 5 },
    clarity: { type: Number, min: 1, max: 5 },
    completeness: { type: Number, min: 1, max: 5 },
    innovation: { type: Number, min: 1, max: 5 },
    economicImpact: { type: Number, min: 1, max: 5 }
  },
  overallScore: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  isExpertReview: {
    type: Boolean,
    default: false
  },
  reviewedAt: {
    type: Date,
    default: Date.now
  }
});

const fieldTestSchema = new mongoose.Schema({
  tester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nodePublicKey: String, // pour valider l'impact sur un vrai nœud
  testResults: {
    success: Boolean,
    beforeMetrics: mongoose.Schema.Types.Mixed,
    afterMetrics: mongoose.Schema.Types.Mixed,
    improvementPct: Number,
    issues: [String],
    timeToComplete: Number // minutes
  },
  feedback: String,
  testedAt: {
    type: Date,
    default: Date.now
  }
});

const contributionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  
  // Métadonnées de la contribution
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coAuthors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Classification
  type: {
    type: String,
    enum: ['guide', 'tutorial', 'troubleshooting', 'analysis', 'script', 'security', 'translation', 'review'],
    required: true
  },
  primaryDomain: {
    type: String,
    enum: ['lightning', 'hardware', 'security', 'economics', 'education', 'decentralization', 't4g_innovation'],
    required: true
  },
  secondaryDomains: [String],
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  
  // Targetting et prérequis
  targetAudience: [String], // ['node_operators', 'developers', 'merchants', 'beginners']
  prerequisites: [String],
  estimatedTime: Number, // minutes pour compléter
  
  // Validation et qualité
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'published', 'archived'],
    default: 'draft'
  },
  
  peerReviews: [peerReviewSchema],
  fieldTests: [fieldTestSchema],
  
  // Métriques d'impact
  impact: [contributionImpactSchema],
  
  // Métriques d'adoption
  adoption: {
    views: { type: Number, default: 0 },
    implementations: { type: Number, default: 0 }, // combien l'ont testé
    successRate: { type: Number, default: 0 }, // % de succès des tests
    avgRating: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 }
  },
  
  // Récompenses et gamification
  rewards: {
    baseReward: { type: Number, default: 0 },
    qualityMultiplier: { type: Number, default: 1.0 },
    impactMultiplier: { type: Number, default: 1.0 },
    pioneerBonus: { type: Number, default: 0 },
    totalReward: { type: Number, default: 0 },
    distributed: { type: Boolean, default: false },
    distributedAt: Date
  },
  
  // Intégration technique
  codeRepository: String, // GitHub/GitLab URL
  demoUrl: String,
  relatedResources: [String],
  
  // Métadonnées techniques pour scripts/outils
  technical: {
    language: String, // python, bash, javascript, etc.
    dependencies: [String],
    compatibility: [String], // ['LND', 'CLN', 'Eclair']
    version: String,
    license: String
  },
  
  // SEO et découvrabilité
  tags: [String],
  keywords: [String],
  
  // Versioning
  version: {
    type: String,
    default: '1.0.0'
  },
  parentContribution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  },
  
  // Métriques temps réel
  lastUpdated: Date,
  featured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes pour performance et recherche
contributionSchema.index({ slug: 1 });
contributionSchema.index({ author: 1, createdAt: -1 });
contributionSchema.index({ primaryDomain: 1, status: 1 });
contributionSchema.index({ type: 1, difficulty: 1 });
contributionSchema.index({ 'adoption.avgRating': -1, 'adoption.views': -1 });
contributionSchema.index({ tags: 1 });
contributionSchema.index({ status: 1, createdAt: -1 });
contributionSchema.index({ featured: 1, featuredUntil: -1 });

// Index texte pour recherche full-text
contributionSchema.index({
  title: 'text',
  description: 'text',
  content: 'text',
  tags: 'text',
  keywords: 'text'
});

// Virtual pour le score de qualité global
contributionSchema.virtual('qualityScore').get(function() {
  if (this.peerReviews.length === 0) return 0;
  
  const expertReviews = this.peerReviews.filter(review => review.isExpertReview);
  const regularReviews = this.peerReviews.filter(review => !review.isExpertReview);
  
  // Pondération : expert reviews comptent 3x plus
  const expertWeight = expertReviews.length * 3;
  const regularWeight = regularReviews.length;
  const totalWeight = expertWeight + regularWeight;
  
  if (totalWeight === 0) return 0;
  
  const expertAvg = expertReviews.reduce((sum, review) => sum + review.overallScore, 0);
  const regularAvg = regularReviews.reduce((sum, review) => sum + review.overallScore, 0);
  
  return ((expertAvg * 3) + regularAvg) / totalWeight;
});

// Virtual pour le taux de succès des tests terrain
contributionSchema.virtual('fieldTestSuccessRate').get(function() {
  if (this.fieldTests.length === 0) return null;
  
  const successfulTests = this.fieldTests.filter(test => test.testResults.success);
  return (successfulTests.length / this.fieldTests.length) * 100;
});

// Virtual pour l'impact économique total
contributionSchema.virtual('totalEconomicImpact').get(function() {
  return this.impact.reduce((sum, impact) => sum + (impact.economicValue || 0), 0);
});

// Middleware pour générer le slug automatiquement
contributionSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Méthode pour calculer les récompenses
contributionSchema.methods.calculateRewards = function() {
  const baseRewards = {
    guide: 200,
    tutorial: 150,
    troubleshooting: 80,
    analysis: 120,
    script: 100,
    security: 180,
    translation: 60,
    review: 25
  };
  
  this.rewards.baseReward = baseRewards[this.type] || 100;
  
  // Multiplicateur de qualité basé sur les peer reviews
  const qualityScore = this.qualityScore;
  this.rewards.qualityMultiplier = qualityScore ? Math.max(0.5, qualityScore / 5 * 2) : 1.0;
  
  // Multiplicateur d'impact basé sur l'adoption et les tests
  let impactMultiplier = 1.0;
  
  if (this.adoption.implementations > 10) impactMultiplier += 0.5;
  if (this.adoption.implementations > 50) impactMultiplier += 0.5;
  if (this.fieldTestSuccessRate > 80) impactMultiplier += 0.3;
  if (this.totalEconomicImpact > 0) impactMultiplier += Math.min(1.0, this.totalEconomicImpact / 100000);
  
  this.rewards.impactMultiplier = impactMultiplier;
  
  // Bonus pionnier pour les premières contributions dans une catégorie
  // (à calculer via une requête séparée)
  
  // Calcul final
  this.rewards.totalReward = Math.floor(
    this.rewards.baseReward * 
    this.rewards.qualityMultiplier * 
    this.rewards.impactMultiplier + 
    this.rewards.pioneerBonus
  );
  
  return this.rewards.totalReward;
};

// Méthode pour ajouter une review
contributionSchema.methods.addPeerReview = async function(reviewerId, scores, feedback, isExpert = false) {
  // Vérifier que le reviewer n'a pas déjà reviewé
  const existingReview = this.peerReviews.find(review => 
    review.reviewer.toString() === reviewerId.toString()
  );
  
  if (existingReview) {
    throw new Error('User has already reviewed this contribution');
  }
  
  const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
  
  this.peerReviews.push({
    reviewer: reviewerId,
    score: scores,
    overallScore,
    feedback,
    isExpertReview: isExpert
  });
  
  // Recalculer la note moyenne
  this.adoption.avgRating = this.peerReviews.reduce((sum, review) => sum + review.overallScore, 0) / this.peerReviews.length;
  
  return this.save();
};

// Méthode pour ajouter un test terrain
contributionSchema.methods.addFieldTest = async function(testerId, testResults, feedback) {
  this.fieldTests.push({
    tester: testerId,
    testResults,
    feedback
  });
  
  // Mettre à jour les métriques d'adoption
  this.adoption.implementations += 1;
  
  const successfulTests = this.fieldTests.filter(test => test.testResults.success).length;
  this.adoption.successRate = (successfulTests / this.fieldTests.length) * 100;
  
  return this.save();
};

module.exports = mongoose.model('Contribution', contributionSchema);