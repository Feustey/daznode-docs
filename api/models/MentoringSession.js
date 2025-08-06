const mongoose = require('mongoose');

const sessionGoalSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  targetDate: Date,
  completedAt: Date,
  notes: String
});

const sessionFeedbackSchema = new mongoose.Schema({
  from: {
    type: String,
    enum: ['mentor', 'mentee'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  categories: {
    expertise: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    helpfulness: { type: Number, min: 1, max: 5 },
    patience: { type: Number, min: 1, max: 5 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const mentoringSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Configuration de la session
  domain: {
    type: String,
    enum: ['lightning', 'hardware', 'security', 'economics', 'education', 'decentralization', 't4g_innovation'],
    required: true
  },
  topics: [String], // ['channel_management', 'fee_optimization', 'node_security']
  sessionType: {
    type: String,
    enum: ['one_time', 'recurring', 'project_based'],
    default: 'one_time'
  },
  
  // Planning
  scheduledAt: Date,
  duration: {
    type: Number,
    default: 60 // minutes
  },
  timezone: String,
  location: {
    type: String,
    enum: ['online', 'in_person'],
    default: 'online'
  },
  meetingDetails: {
    platform: String, // 'zoom', 'discord', 'telegram'
    link: String,
    meetingId: String,
    password: String
  },
  
  // Statut et progression
  status: {
    type: String,
    enum: ['requested', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'requested'
  },
  
  // Objectifs et progression
  goals: [sessionGoalSchema],
  learningPath: {
    currentLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    targetLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Contenu et ressources
  agenda: String,
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'tool', 'guide', 'exercise']
    },
    shared_by: {
      type: String,
      enum: ['mentor', 'mentee']
    }
  }],
  
  // Notes et suivi
  mentorNotes: String,
  menteeNotes: String,
  actionItems: [{
    task: String,
    assignedTo: {
      type: String,
      enum: ['mentor', 'mentee', 'both']
    },
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completedAt: Date
  }],
  
  // Métriques de session
  metrics: {
    actualDuration: Number, // minutes réelles
    attendanceStatus: {
      mentor: {
        type: String,
        enum: ['present', 'late', 'absent'],
        default: 'present'
      },
      mentee: {
        type: String,
        enum: ['present', 'late', 'absent'],
        default: 'present'
      }
    },
    engagementLevel: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Feedback mutuel
  feedback: [sessionFeedbackSchema],
  
  // Récompenses et reconnaissance
  rewards: {
    mentorReward: {
      type: Number,
      default: 0
    },
    menteeReward: {
      type: Number,
      default: 0
    },
    bonusReward: {
      type: Number,
      default: 0
    },
    distributed: {
      type: Boolean,
      default: false
    },
    distributedAt: Date
  },
  
  // Session suivante (pour recurring)
  nextSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentoringSession'
  },
  previousSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentoringSession'
  },
  
  // Gestion des annulations/reprogrammations
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  
  rescheduledFrom: Date,
  rescheduledReason: String,
  rescheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes pour performance
mentoringSessionSchema.index({ mentor: 1, createdAt: -1 });
mentoringSessionSchema.index({ mentee: 1, createdAt: -1 });
mentoringSessionSchema.index({ domain: 1, status: 1 });
mentoringSessionSchema.index({ scheduledAt: 1 });
mentoringSessionSchema.index({ status: 1, scheduledAt: 1 });

// Virtuals
mentoringSessionSchema.virtual('isUpcoming').get(function() {
  return this.scheduledAt && this.scheduledAt > new Date() && this.status === 'scheduled';
});

mentoringSessionSchema.virtual('isOverdue').get(function() {
  return this.scheduledAt && this.scheduledAt < new Date() && this.status === 'scheduled';
});

mentoringSessionSchema.virtual('averageRating').get(function() {
  if (this.feedback.length === 0) return null;
  
  const totalRating = this.feedback.reduce((sum, fb) => sum + fb.rating, 0);
  return totalRating / this.feedback.length;
});

mentoringSessionSchema.virtual('goalCompletionRate').get(function() {
  if (this.goals.length === 0) return 0;
  
  const completedGoals = this.goals.filter(goal => goal.status === 'completed').length;
  return (completedGoals / this.goals.length) * 100;
});

// Méthodes du modèle
mentoringSessionSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const sessionTime = new Date(this.scheduledAt);
  const timeDiff = sessionTime - now;
  
  // Peut être annulé jusqu'à 2 heures avant
  return timeDiff > (2 * 60 * 60 * 1000) && ['requested', 'accepted', 'scheduled'].includes(this.status);
};

mentoringSessionSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const sessionTime = new Date(this.scheduledAt);
  const timeDiff = sessionTime - now;
  
  // Peut être reprogrammé jusqu'à 4 heures avant
  return timeDiff > (4 * 60 * 60 * 1000) && ['requested', 'accepted', 'scheduled'].includes(this.status);
};

mentoringSessionSchema.methods.addFeedback = function(userId, rating, feedback, categories, userType) {
  // Vérifier que l'utilisateur n'a pas déjà donné de feedback
  const existingFeedback = this.feedback.find(fb => 
    fb.from === userType
  );
  
  if (existingFeedback) {
    throw new Error('Feedback already provided');
  }
  
  this.feedback.push({
    from: userType,
    rating,
    feedback,
    categories: categories || {}
  });
  
  return this.save();
};

mentoringSessionSchema.methods.addGoal = function(goal, targetDate) {
  this.goals.push({
    goal,
    targetDate: targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default: 30 days
  });
  
  return this.save();
};

mentoringSessionSchema.methods.updateGoalStatus = function(goalId, status, notes) {
  const goal = this.goals.id(goalId);
  if (!goal) {
    throw new Error('Goal not found');
  }
  
  goal.status = status;
  if (notes) goal.notes = notes;
  if (status === 'completed') goal.completedAt = new Date();
  
  return this.save();
};

mentoringSessionSchema.methods.calculateRewards = function() {
  let mentorReward = 50; // Base reward pour le mentor
  let menteeReward = 20; // Base reward pour le mentee
  let bonusReward = 0;
  
  // Bonus basé sur la durée effective
  if (this.metrics.actualDuration >= this.duration) {
    mentorReward += 10;
    menteeReward += 5;
  }
  
  // Bonus basé sur l'engagement
  if (this.metrics.engagementLevel >= 4) {
    bonusReward += 15;
  }
  
  // Bonus basé sur la completion des objectifs
  const completionRate = this.goalCompletionRate;
  if (completionRate >= 80) {
    bonusReward += 20;
  } else if (completionRate >= 60) {
    bonusReward += 10;
  }
  
  // Bonus basé sur le feedback mutuel
  if (this.feedback.length === 2) { // Les deux ont donné du feedback
    const avgRating = this.averageRating;
    if (avgRating >= 4.5) {
      bonusReward += 25;
    } else if (avgRating >= 4) {
      bonusReward += 15;
    }
  }
  
  this.rewards.mentorReward = mentorReward;
  this.rewards.menteeReward = menteeReward;
  this.rewards.bonusReward = bonusReward;
  
  return {
    mentorReward: mentorReward + Math.floor(bonusReward * 0.7), // 70% du bonus au mentor
    menteeReward: menteeReward + Math.floor(bonusReward * 0.3), // 30% du bonus au mentee
    totalReward: mentorReward + menteeReward + bonusReward
  };
};

mentoringSessionSchema.methods.markCompleted = async function() {
  this.status = 'completed';
  
  // Calculer et attribuer les récompenses
  const rewards = this.calculateRewards();
  
  // Mettre à jour le learning path progress
  if (this.goalCompletionRate >= 70) {
    this.learningPath.progress = Math.min(100, this.learningPath.progress + 15);
  }
  
  return this.save();
};

// Middleware pre-save
mentoringSessionSchema.pre('save', function(next) {
  // Auto-update learning path level based on progress
  if (this.learningPath.progress >= 80 && this.learningPath.currentLevel === 'beginner') {
    this.learningPath.currentLevel = 'intermediate';
  } else if (this.learningPath.progress >= 60 && this.learningPath.currentLevel === 'intermediate') {
    this.learningPath.currentLevel = 'advanced';
  } else if (this.learningPath.progress >= 40 && this.learningPath.currentLevel === 'advanced') {
    this.learningPath.currentLevel = 'expert';
  }
  
  next();
});

module.exports = mongoose.model('MentoringSession', mentoringSessionSchema);