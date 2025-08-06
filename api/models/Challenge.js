const mongoose = require('mongoose');

const challengeParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  },
  score: {
    type: Number,
    default: 0
  },
  metrics: mongoose.Schema.Types.Mixed, // métriques spécifiques au challenge
  status: {
    type: String,
    enum: ['participating', 'submitted', 'evaluated', 'winner', 'completed'],
    default: 'participating'
  }
});

const challengeSchema = new mongoose.Schema({
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
    required: true
  },
  detailedDescription: String,
  
  // Classification du challenge
  type: {
    type: String,
    enum: ['monthly_challenge', 'hackathon', 'bug_bounty', 'peer_review_contest', 'optimization_contest'],
    required: true
  },
  category: {
    type: String,
    enum: ['lightning', 'hardware', 'security', 'economics', 'education', 'decentralization', 't4g_innovation'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  
  // Organisateur et modération
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Timing
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  submissionDeadline: Date,
  evaluationDeadline: Date,
  
  // Statut
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'active', 'submission_phase', 'evaluation_phase', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Participants et soumissions
  participants: [challengeParticipantSchema],
  maxParticipants: Number,
  minParticipants: {
    type: Number,
    default: 1
  },
  
  // Critères d'évaluation
  evaluationCriteria: [{
    name: String,
    description: String,
    weight: Number, // pourcentage du score total
    maxScore: {
      type: Number,
      default: 100
    }
  }],
  
  // Récompenses
  rewards: {
    totalPool: {
      type: Number,
      required: true
    },
    distribution: [{
      position: Number, // 1 = winner, 2 = second, etc.
      percentage: Number,
      amount: Number,
      description: String
    }],
    participation_reward: {
      type: Number,
      default: 0
    }
  },
  
  // Objectifs spécifiques au challenge
  objectives: {
    targetMetric: String, // 'network_optimization', 'cost_reduction', 'security_improvement'
    baselineValue: Number,
    targetValue: Number,
    measurementMethod: String
  },
  
  // Ressources et assets
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['documentation', 'tool', 'dataset', 'api', 'template']
    }
  }],
  
  // Règles et conditions
  rules: String,
  eligibilityCriteria: [String],
  submissionRequirements: [String],
  
  // Résultats et analytics
  results: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    totalSubmissions: {
      type: Number,
      default: 0
    },
    winners: [{
      position: Number,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contribution'
      },
      score: Number,
      reward: Number
    }],
    impactMetrics: mongoose.Schema.Types.Mixed,
    communityFeedback: {
      avgRating: Number,
      totalVotes: Number,
      comments: Number
    }
  },
  
  // Features spéciales
  features: {
    isTeamChallenge: {
      type: Boolean,
      default: false
    },
    maxTeamSize: Number,
    allowLateSubmissions: {
      type: Boolean,
      default: false
    },
    publicLeaderboard: {
      type: Boolean,
      default: true
    },
    realTimeMetrics: {
      type: Boolean,
      default: false
    }
  },
  
  // Intégration avec le réseau Lightning
  networkIntegration: {
    requiresLightningNode: {
      type: Boolean,
      default: false
    },
    testnetOnly: {
      type: Boolean,
      default: true
    },
    requiredCapacity: Number, // sats minimum
    monitoringNodes: [String] // public keys des nœuds de monitoring
  },
  
  // Métriques et engagement
  engagement: {
    views: {
      type: Number,
      default: 0
    },
    registrations: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    }
  },
  
  // Tags et recherche
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
challengeSchema.index({ slug: 1 });
challengeSchema.index({ status: 1, startDate: -1 });
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ endDate: 1 });
challengeSchema.index({ featured: 1, startDate: -1 });
challengeSchema.index({ tags: 1 });

// Index pour recherche full-text
challengeSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Virtuals
challengeSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
});

challengeSchema.virtual('timeRemaining').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return 0;
  
  const now = new Date();
  const deadline = this.status === 'submission_phase' ? this.submissionDeadline : this.endDate;
  
  return Math.max(0, deadline - now);
});

challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

challengeSchema.virtual('submissionCount').get(function() {
  return this.participants.filter(p => p.status === 'submitted').length;
});

// Middleware pour générer le slug
challengeSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Méthodes du modèle
challengeSchema.methods.canParticipate = function(user) {
  // Vérifier si le challenge est ouvert
  if (!this.isActive) return { canParticipate: false, reason: 'Challenge not active' };
  
  // Vérifier les limites de participants
  if (this.maxParticipants && this.participantCount >= this.maxParticipants) {
    return { canParticipate: false, reason: 'Challenge is full' };
  }
  
  // Vérifier si l'utilisateur participe déjà
  const alreadyParticipating = this.participants.some(p => p.user.toString() === user._id.toString());
  if (alreadyParticipating) {
    return { canParticipate: false, reason: 'Already participating' };
  }
  
  // Vérifier les critères d'éligibilité (à implémenter selon les besoins)
  
  return { canParticipate: true };
};

challengeSchema.methods.addParticipant = async function(userId) {
  const participationCheck = await this.canParticipate({ _id: userId });
  if (!participationCheck.canParticipate) {
    throw new Error(participationCheck.reason);
  }
  
  this.participants.push({
    user: userId,
    status: 'participating'
  });
  
  this.engagement.registrations += 1;
  
  return this.save();
};

challengeSchema.methods.submitEntry = async function(userId, contributionId, metrics = {}) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (!participant) {
    throw new Error('User is not participating in this challenge');
  }
  
  if (participant.status === 'submitted') {
    throw new Error('User has already submitted');
  }
  
  participant.submission = contributionId;
  participant.status = 'submitted';
  participant.metrics = metrics;
  participant.submittedAt = new Date();
  
  return this.save();
};

challengeSchema.methods.evaluateSubmissions = async function() {
  const submittedParticipants = this.participants.filter(p => p.status === 'submitted');
  
  // Logique d'évaluation à implémenter selon les critères
  // Pour l'instant, tri par score
  submittedParticipants.sort((a, b) => b.score - a.score);
  
  // Attribuer les positions et récompenses
  this.results.winners = [];
  
  submittedParticipants.forEach((participant, index) => {
    const position = index + 1;
    const rewardConfig = this.rewards.distribution.find(d => d.position === position);
    
    if (rewardConfig) {
      this.results.winners.push({
        position,
        user: participant.user,
        submission: participant.submission,
        score: participant.score,
        reward: rewardConfig.amount
      });
      
      participant.status = position === 1 ? 'winner' : 'completed';
    } else {
      participant.status = 'completed';
    }
  });
  
  this.status = 'completed';
  this.results.totalParticipants = this.participants.length;
  this.results.totalSubmissions = submittedParticipants.length;
  
  return this.save();
};

challengeSchema.methods.updateEngagement = function(action) {
  switch(action) {
    case 'view':
      this.engagement.views += 1;
      break;
    case 'share':
      this.engagement.shareCount += 1;
      break;
  }
  
  // Calcul du taux de completion
  if (this.participants.length > 0) {
    const completedParticipants = this.participants.filter(p => 
      p.status === 'submitted' || p.status === 'completed' || p.status === 'winner'
    ).length;
    
    this.engagement.completionRate = (completedParticipants / this.participants.length) * 100;
  }
  
  return this.save();
};

module.exports = mongoose.model('Challenge', challengeSchema);