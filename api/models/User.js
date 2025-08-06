const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userExpertiseSchema = new mongoose.Schema({
  domain: {
    type: String,
    enum: ['lightning', 'hardware', 'security', 'economics', 'education', 'decentralization', 't4g_innovation'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'master'],
    default: 'beginner'
  },
  reputationScore: {
    type: Number,
    default: 0
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: Date,
  specializations: [String], // ['channel_management', 'fee_optimization', 'tor_setup']
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    location: String,
    website: String,
    social: {
      telegram: String,
      nostr: String,
      github: String,
      twitter: String
    }
  },
  
  // Token4Good integration
  t4gWallet: {
    address: String,
    balance: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    pendingRewards: {
      type: Number,
      default: 0
    }
  },
  
  // Expertise tracking multi-domaines
  expertises: [userExpertiseSchema],
  
  // Global reputation metrics
  reputation: {
    totalScore: {
      type: Number,
      default: 0
    },
    contributionsCount: {
      type: Number,
      default: 0
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    mentoringSessions: {
      type: Number,
      default: 0
    },
    challengesWon: {
      type: Number,
      default: 0
    }
  },
  
  // Lightning Network integration
  lightningNode: {
    publicKey: String,
    alias: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    metrics: {
      channels: Number,
      capacity: Number,
      uptime: Number,
      routingRevenue: Number
    }
  },
  
  // Community features
  mentoring: {
    isMentor: {
      type: Boolean,
      default: false
    },
    isSeekingMentor: {
      type: Boolean,
      default: false
    },
    mentorDomains: [String],
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    }
  },
  
  // Gamification
  achievements: [{
    type: {
      type: String,
      enum: ['first_contribution', 'expert_reviewer', 'mentor_graduate', 'challenge_winner', 'pioneer', 'community_helper']
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Account settings
  settings: {
    emailNotifications: {
      newChallenges: { type: Boolean, default: true },
      mentorRequests: { type: Boolean, default: true },
      rewardsUpdates: { type: Boolean, default: true },
      communityUpdates: { type: Boolean, default: false }
    },
    privacy: {
      showRealName: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: false },
      showNodeMetrics: { type: Boolean, default: true }
    }
  },
  
  // Account status
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'reputation.totalScore': -1 });
userSchema.index({ 'expertises.domain': 1, 'expertises.reputationScore': -1 });
userSchema.index({ 'lightningNode.publicKey': 1 });

// Virtual pour le niveau d'expertise global
userSchema.virtual('overallExpertiseLevel').get(function() {
  if (this.expertises.length === 0) return 'beginner';
  
  const avgScore = this.expertises.reduce((sum, exp) => {
    const levelScores = { beginner: 1, intermediate: 2, advanced: 3, expert: 4, master: 5 };
    return sum + levelScores[exp.level];
  }, 0) / this.expertises.length;
  
  if (avgScore >= 4.5) return 'master';
  if (avgScore >= 3.5) return 'expert';
  if (avgScore >= 2.5) return 'advanced';
  if (avgScore >= 1.5) return 'intermediate';
  return 'beginner';
});

// Virtual pour les domaines d'expertise principaux
userSchema.virtual('primaryExpertises').get(function() {
  return this.expertises
    .filter(exp => exp.reputationScore >= 100)
    .sort((a, b) => b.reputationScore - a.reputationScore)
    .slice(0, 3);
});

// Middleware pour hasher le mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour ajouter une expertise
userSchema.methods.addExpertise = function(domain, specializations = []) {
  const existingExpertise = this.expertises.find(exp => exp.domain === domain);
  
  if (existingExpertise) {
    existingExpertise.specializations = [...new Set([...existingExpertise.specializations, ...specializations])];
  } else {
    this.expertises.push({
      domain,
      specializations,
      level: 'beginner',
      reputationScore: 0
    });
  }
  
  return this.save();
};

// Méthode pour mettre à jour la réputation dans un domaine
userSchema.methods.updateDomainReputation = function(domain, points) {
  const expertise = this.expertises.find(exp => exp.domain === domain);
  
  if (expertise) {
    expertise.reputationScore += points;
    
    // Mise à jour automatique du niveau basé sur le score
    if (expertise.reputationScore >= 1000) expertise.level = 'master';
    else if (expertise.reputationScore >= 500) expertise.level = 'expert';
    else if (expertise.reputationScore >= 200) expertise.level = 'advanced';
    else if (expertise.reputationScore >= 50) expertise.level = 'intermediate';
  }
  
  // Mise à jour de la réputation globale
  this.reputation.totalScore += points;
  
  return this.save();
};

// Méthode pour distribuer des récompenses T4G
userSchema.methods.awardT4G = function(amount, reason) {
  this.t4gWallet.balance += amount;
  this.t4gWallet.totalEarned += amount;
  
  // Log de la transaction (à implémenter dans un modèle Transaction séparé)
  return this.save();
};

// Méthode pour vérifier l'éligibilité au mentoring
userSchema.methods.canMentor = function(domain) {
  const expertise = this.expertises.find(exp => exp.domain === domain);
  return expertise && expertise.level in ['advanced', 'expert', 'master'] && expertise.reputationScore >= 200;
};

module.exports = mongoose.model('User', userSchema);