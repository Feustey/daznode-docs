const User = require('../models/User');
const MentoringSession = require('../models/MentoringSession');

class MentoringService {
  
  /**
   * Trouve des mentors appropriés pour un mentee
   */
  async findMentors(menteeProfile, domain, limit = 10) {
    try {
      // Critères de base pour être mentor
      const mentorQuery = {
        'mentoring.isMentor': true,
        'mentoring.availability': { $ne: 'unavailable' },
        'mentoring.mentorDomains': domain,
        'expertises.domain': domain,
        'expertises.level': { $in: ['advanced', 'expert', 'master'] },
        'expertises.reputationScore': { $gte: 200 }
      };
      
      // Exclure le mentee lui-même
      if (menteeProfile._id) {
        mentorQuery._id = { $ne: menteeProfile._id };
      }
      
      const availableMentors = await User.find(mentorQuery)
        .select('username profile expertises reputation mentoring lightningNode')
        .limit(limit * 2); // Récupérer plus pour filtrer ensuite
      
      if (availableMentors.length === 0) {
        return [];
      }
      
      // Calculer la compatibilité pour chaque mentor
      const mentorCompatibility = availableMentors.map(mentor => {
        const compatibility = this.calculateCompatibility(menteeProfile, mentor, domain);
        
        return {
          mentor,
          compatibilityScore: compatibility.score,
          matchingFactors: compatibility.factors,
          availability: mentor.mentoring.availability,
          expertise: mentor.expertises.find(exp => exp.domain === domain),
          sessionHistory: compatibility.sessionHistory
        };
      });
      
      // Trier par score de compatibilité et disponibilité
      mentorCompatibility.sort((a, b) => {
        // Priorité à la disponibilité
        if (a.availability === 'available' && b.availability !== 'available') return -1;
        if (b.availability === 'available' && a.availability !== 'available') return 1;
        
        // Puis par score de compatibilité
        return b.compatibilityScore - a.compatibilityScore;
      });
      
      return mentorCompatibility.slice(0, limit);
      
    } catch (error) {
      console.error('Error finding mentors:', error);
      throw error;
    }
  }
  
  /**
   * Calcule la compatibilité entre un mentee et un mentor
   */
  calculateCompatibility(menteeProfile, mentor, domain) {
    let score = 0;
    const factors = [];
    
    // Expertise dans le domaine (25 points max)
    const mentorExpertise = mentor.expertises.find(exp => exp.domain === domain);
    if (mentorExpertise) {
      const expertiseScore = this.getExpertiseScore(mentorExpertise.level);
      score += Math.min(25, expertiseScore);
      factors.push({
        type: 'expertise',
        value: expertiseScore,
        description: `${mentorExpertise.level} level in ${domain}`
      });
    }
    
    // Score de réputation global (20 points max)
    const reputationScore = Math.min(20, mentor.reputation.totalScore / 200);
    score += reputationScore;
    factors.push({
      type: 'reputation',
      value: reputationScore,
      description: `${mentor.reputation.totalScore} reputation points`
    });
    
    // Spécialisations correspondantes (15 points max)
    if (menteeProfile.learningGoals && mentorExpertise?.specializations) {
      const matchingSpecs = menteeProfile.learningGoals.filter(goal =>
        mentorExpertise.specializations.some(spec => 
          spec.toLowerCase().includes(goal.toLowerCase()) || 
          goal.toLowerCase().includes(spec.toLowerCase())
        )
      );
      
      const specScore = Math.min(15, matchingSpecs.length * 5);
      score += specScore;
      factors.push({
        type: 'specializations',
        value: specScore,
        description: `${matchingSpecs.length} matching specializations`
      });
    }
    
    // Expérience de mentoring (15 points max)
    const mentoringExperience = mentor.reputation.mentoringSessions || 0;
    const experienceScore = Math.min(15, mentoringExperience / 2);
    score += experienceScore;
    factors.push({
      type: 'experience',
      value: experienceScore,
      description: `${mentoringExperience} mentoring sessions completed`
    });
    
    // Nœud Lightning actif (bonus 10 points)
    if (mentor.lightningNode?.isVerified && mentor.lightningNode?.metrics?.uptime > 95) {
      score += 10;
      factors.push({
        type: 'lightning_node',
        value: 10,
        description: 'Active and verified Lightning node'
      });
    }
    
    // Location/timezone compatibility (10 points max)
    if (menteeProfile.profile?.location && mentor.profile?.location) {
      // Logique simplifiée - dans un vrai système, utiliser des APIs de géolocalisation
      const locationScore = menteeProfile.profile.location === mentor.profile.location ? 10 : 5;
      score += locationScore;
      factors.push({
        type: 'location',
        value: locationScore,
        description: 'Geographic proximity'
      });
    }
    
    // Bonus pour disponibilité immédiate (5 points)
    if (mentor.mentoring.availability === 'available') {
      score += 5;
      factors.push({
        type: 'availability',
        value: 5,
        description: 'Immediately available'
      });
    }
    
    return {
      score: Math.min(100, score),
      factors
    };
  }
  
  /**
   * Convertit le niveau d'expertise en score numérique
   */
  getExpertiseScore(level) {
    const scores = {
      'beginner': 5,
      'intermediate': 10,
      'advanced': 15,
      'expert': 20,
      'master': 25
    };
    return scores[level] || 0;
  }
  
  /**
   * Crée une demande de session de mentoring
   */
  async createMentoringRequest(menteeId, mentorId, sessionData) {
    try {
      // Vérifier que le mentor est disponible
      const mentor = await User.findById(mentorId);
      if (!mentor || !mentor.mentoring.isMentor) {
        throw new Error('User is not available as a mentor');
      }
      
      // Vérifier que le mentee n'a pas déjà une session active avec ce mentor
      const existingSession = await MentoringSession.findOne({
        mentor: mentorId,
        mentee: menteeId,
        status: { $in: ['requested', 'accepted', 'scheduled', 'in_progress'] }
      });
      
      if (existingSession) {
        throw new Error('Active session already exists with this mentor');
      }
      
      // Créer la session
      const session = new MentoringSession({
        mentor: mentorId,
        mentee: menteeId,
        domain: sessionData.domain,
        topics: sessionData.topics || [],
        sessionType: sessionData.sessionType || 'one_time',
        scheduledAt: sessionData.scheduledAt,
        duration: sessionData.duration || 60,
        timezone: sessionData.timezone,
        location: sessionData.location || 'online',
        agenda: sessionData.agenda,
        goals: sessionData.goals ? sessionData.goals.map(goal => ({ goal })) : [],
        learningPath: {
          currentLevel: sessionData.currentLevel || 'beginner',
          targetLevel: sessionData.targetLevel || 'intermediate'
        }
      });
      
      await session.save();
      
      // Notifier le mentor
      await this.notifyMentor(mentor, session);
      
      return session;
      
    } catch (error) {
      console.error('Error creating mentoring request:', error);
      throw error;
    }
  }
  
  /**
   * Accepte une demande de mentoring
   */
  async acceptMentoringRequest(sessionId, mentorId, meetingDetails = {}) {
    try {
      const session = await MentoringSession.findById(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      if (session.mentor.toString() !== mentorId.toString()) {
        throw new Error('Only the mentor can accept this request');
      }
      
      if (session.status !== 'requested') {
        throw new Error('Session is not in requested status');
      }
      
      session.status = 'accepted';
      if (session.scheduledAt) {
        session.status = 'scheduled';
      }
      
      // Ajouter les détails de la réunion
      if (meetingDetails.platform || meetingDetails.link) {
        session.meetingDetails = {
          platform: meetingDetails.platform,
          link: meetingDetails.link,
          meetingId: meetingDetails.meetingId,
          password: meetingDetails.password
        };
      }
      
      await session.save();
      
      // Notifier le mentee
      const mentee = await User.findById(session.mentee);
      await this.notifyMentee(mentee, session, 'accepted');
      
      return session;
      
    } catch (error) {
      console.error('Error accepting mentoring request:', error);
      throw error;
    }
  }
  
  /**
   * Programme une session de mentoring
   */
  async scheduleSession(sessionId, scheduledAt, duration, meetingDetails) {
    try {
      const session = await MentoringSession.findById(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      if (!['accepted', 'rescheduled'].includes(session.status)) {
        throw new Error('Session cannot be scheduled in current status');
      }
      
      session.scheduledAt = new Date(scheduledAt);
      session.duration = duration || session.duration;
      session.status = 'scheduled';
      
      if (meetingDetails) {
        session.meetingDetails = {
          ...session.meetingDetails,
          ...meetingDetails
        };
      }
      
      await session.save();
      
      // Notifier les participants
      const [mentor, mentee] = await Promise.all([
        User.findById(session.mentor),
        User.findById(session.mentee)
      ]);
      
      await Promise.all([
        this.notifyParticipant(mentor, session, 'scheduled'),
        this.notifyParticipant(mentee, session, 'scheduled')
      ]);
      
      return session;
      
    } catch (error) {
      console.error('Error scheduling session:', error);
      throw error;
    }
  }
  
  /**
   * Marque une session comme terminée et distribue les récompenses
   */
  async completeSession(sessionId, completionData) {
    try {
      const session = await MentoringSession.findById(sessionId)
        .populate('mentor')
        .populate('mentee');
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      if (session.status !== 'in_progress') {
        throw new Error('Session is not in progress');
      }
      
      // Mettre à jour les métriques
      if (completionData.actualDuration) {
        session.metrics.actualDuration = completionData.actualDuration;
      }
      
      if (completionData.engagementLevel) {
        session.metrics.engagementLevel = completionData.engagementLevel;
      }
      
      // Marquer comme terminé et calculer les récompenses
      await session.markCompleted();
      
      // Distribuer les récompenses T4G
      const rewards = session.calculateRewards();
      
      await session.mentor.awardT4G(
        rewards.mentorReward, 
        `Mentoring session reward: ${session.domain}`
      );
      
      await session.mentee.awardT4G(
        rewards.menteeReward, 
        `Mentoring session participation reward: ${session.domain}`
      );
      
      // Mettre à jour la réputation du mentor
      await session.mentor.updateDomainReputation(session.domain, Math.floor(rewards.mentorReward / 4));
      
      // Marquer les récompenses comme distribuées
      session.rewards.distributed = true;
      session.rewards.distributedAt = new Date();
      await session.save();
      
      // Notifier les participants
      await Promise.all([
        this.notifyParticipant(session.mentor, session, 'completed'),
        this.notifyParticipant(session.mentee, session, 'completed')
      ]);
      
      return {
        session,
        rewards
      };
      
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }
  
  /**
   * Obtient les sessions de mentoring pour un utilisateur
   */
  async getUserSessions(userId, options = {}) {
    try {
      const {
        role, // 'mentor', 'mentee', 'both'
        status,
        domain,
        page = 1,
        limit = 20
      } = options;
      
      let query = {};
      
      // Filtrer par rôle
      if (role === 'mentor') {
        query.mentor = userId;
      } else if (role === 'mentee') {
        query.mentee = userId;
      } else {
        query.$or = [{ mentor: userId }, { mentee: userId }];
      }
      
      // Autres filtres
      if (status) query.status = status;
      if (domain) query.domain = domain;
      
      const sessions = await MentoringSession.find(query)
        .populate('mentor', 'username profile.avatar expertises')
        .populate('mentee', 'username profile.avatar')
        .sort({ scheduledAt: -1 })
        .limit(limit * page)
        .skip((page - 1) * limit);
      
      const total = await MentoringSession.countDocuments(query);
      
      return {
        sessions,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      };
      
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  }
  
  /**
   * Obtient les statistiques de mentoring
   */
  async getMentoringStats(userId, role) {
    try {
      const query = role === 'mentor' ? { mentor: userId } : { mentee: userId };
      
      const stats = await Promise.all([
        // Total sessions
        MentoringSession.countDocuments(query),
        
        // Sessions par statut
        MentoringSession.aggregate([
          { $match: query },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        
        // Sessions par domaine
        MentoringSession.aggregate([
          { $match: query },
          { $group: { _id: '$domain', count: { $sum: 1 } } }
        ]),
        
        // Feedback moyen
        MentoringSession.aggregate([
          { $match: { ...query, 'feedback.0': { $exists: true } } },
          { $unwind: '$feedback' },
          { $match: { [`feedback.from`]: role === 'mentor' ? 'mentee' : 'mentor' } },
          { $group: { 
            _id: null, 
            avgRating: { $avg: '$feedback.rating' },
            totalFeedback: { $sum: 1 }
          }}
        ]),
        
        // Récompenses totales
        MentoringSession.aggregate([
          { $match: { ...query, 'rewards.distributed': true } },
          { $group: { 
            _id: null, 
            totalRewards: { $sum: role === 'mentor' ? '$rewards.mentorReward' : '$rewards.menteeReward' }
          }}
        ])
      ]);
      
      const [totalSessions, sessionsByStatus, sessionsByDomain, feedbackStats, rewardStats] = stats;
      
      return {
        totalSessions,
        sessionsByStatus: sessionsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        sessionsByDomain: sessionsByDomain.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        averageRating: feedbackStats[0]?.avgRating || null,
        totalFeedback: feedbackStats[0]?.totalFeedback || 0,
        totalRewards: rewardStats[0]?.totalRewards || 0
      };
      
    } catch (error) {
      console.error('Error getting mentoring stats:', error);
      throw error;
    }
  }
  
  // Méthodes de notification (à implémenter selon le système choisi)
  async notifyMentor(mentor, session) {
    // TODO: Implémenter notification (email, push, etc.)
    console.log(`Notifying mentor ${mentor.username} about new mentoring request`);
  }
  
  async notifyMentee(mentee, session, type) {
    // TODO: Implémenter notification
    console.log(`Notifying mentee ${mentee.username} about session ${type}`);
  }
  
  async notifyParticipant(user, session, type) {
    // TODO: Implémenter notification
    console.log(`Notifying ${user.username} about session ${type}`);
  }
  
}

module.exports = new MentoringService();