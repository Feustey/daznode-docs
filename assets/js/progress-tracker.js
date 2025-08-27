/**
 * Système de Tracking de Progression Utilisateur
 * Priorité Critique - Implémentation immédiate
 */

class ProgressTracker {
  constructor() {
    this.storageKey = 'dazno_progress';
    this.userProgress = this.loadProgress() || this.createInitialProgress();
    this.init();
  }

  createInitialProgress() {
    return {
      userId: this.generateUserId(),
      profile: {
        level: 'beginner',
        preferredPath: null,
        timePerSession: 30, // minutes
        learningGoals: [],
        startDate: new Date().toISOString()
      },
      modules: {
        completed: [],
        inProgress: [],
        timeSpent: {}, // moduleId -> minutes
        scores: {} // moduleId -> score
      },
      badges: [],
      achievements: [],
      statistics: {
        totalTimeSpent: 0,
        modulesCompleted: 0,
        averageScore: 0,
        streakDays: 0,
        lastActivity: new Date().toISOString()
      },
      paths: {
        'bitcoin-basics': { progress: 0, completed: false },
        'lightning-network': { progress: 0, completed: false },
        'node-operation': { progress: 0, completed: false },
        'development': { progress: 0, completed: false }
      }
    };
  }

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  init() {
    this.trackPageViews();
    this.trackTimeSpent();
    this.updateDailyStreak();
    this.setupEventListeners();
    this.displayProgress();
  }

  // === TRACKING METHODS ===
  trackPageViews() {
    const currentPage = window.location.pathname;
    const moduleId = this.extractModuleId(currentPage);
    
    if (moduleId && !this.userProgress.modules.inProgress.includes(moduleId)) {
      this.startModule(moduleId);
    }

    // Umami tracking (utilise l'existant)
    if (typeof umami !== 'undefined') {
      umami.track('page-view', { 
        module: moduleId,
        userLevel: this.userProgress.profile.level,
        progress: this.getOverallProgress()
      });
    }
  }

  extractModuleId(path) {
    // Extrait l'ID du module depuis l'URL
    const patterns = {
      '/getting-started/': 'bitcoin-basics-intro',
      '/bitcoin/': 'bitcoin-fundamentals',
      '/lightning-network/': 'lightning-basics',
      '/lightning-network/basics/': 'lightning-concepts',
      '/lightning-network/channels/': 'channels-management',
      '/solutions/dazbox/': 'dazbox-setup',
      '/solutions/dazia/': 'dazia-optimization',
      '/devs/': 'development-basics',
      '/devs/api/': 'api-integration'
    };

    for (const [pattern, moduleId] of Object.entries(patterns)) {
      if (path.startsWith(pattern)) {
        return moduleId;
      }
    }
    return null;
  }

  startModule(moduleId) {
    if (!this.userProgress.modules.inProgress.includes(moduleId)) {
      this.userProgress.modules.inProgress.push(moduleId);
      this.userProgress.modules.timeSpent[moduleId] = 0;
      this.saveProgress();
      this.showModuleStarted(moduleId);
    }
  }

  completeModule(moduleId, score = 100) {
    // Remove from in progress
    this.userProgress.modules.inProgress = this.userProgress.modules.inProgress
      .filter(id => id !== moduleId);
    
    // Add to completed
    if (!this.userProgress.modules.completed.includes(moduleId)) {
      this.userProgress.modules.completed.push(moduleId);
      this.userProgress.modules.scores[moduleId] = score;
      this.userProgress.statistics.modulesCompleted++;
      
      // Update path progress
      this.updatePathProgress(moduleId);
      
      // Check for badges/achievements
      this.checkAchievements();
      
      // Show celebration
      this.showModuleCompleted(moduleId, score);
      
      // Integrate with existing gamification
      if (window.gamification) {
        window.gamification.completeModule(moduleId, score);
      }
      
      this.saveProgress();
    }
  }

  updatePathProgress(completedModuleId) {
    const moduleToPath = {
      'bitcoin-basics-intro': 'bitcoin-basics',
      'bitcoin-fundamentals': 'bitcoin-basics',
      'lightning-basics': 'lightning-network',
      'lightning-concepts': 'lightning-network',
      'channels-management': 'lightning-network',
      'dazbox-setup': 'node-operation',
      'dazia-optimization': 'node-operation',
      'development-basics': 'development',
      'api-integration': 'development'
    };

    const pathModules = {
      'bitcoin-basics': ['bitcoin-basics-intro', 'bitcoin-fundamentals'],
      'lightning-network': ['lightning-basics', 'lightning-concepts', 'channels-management'],
      'node-operation': ['dazbox-setup', 'dazia-optimization'],
      'development': ['development-basics', 'api-integration']
    };

    const pathId = moduleToPath[completedModuleId];
    if (pathId && pathModules[pathId]) {
      const totalModules = pathModules[pathId].length;
      const completedInPath = pathModules[pathId].filter(moduleId => 
        this.userProgress.modules.completed.includes(moduleId)
      ).length;
      
      const progress = Math.round((completedInPath / totalModules) * 100);
      this.userProgress.paths[pathId].progress = progress;
      this.userProgress.paths[pathId].completed = progress === 100;

      if (progress === 100) {
        this.awardPathBadge(pathId);
      }
    }
  }

  trackTimeSpent() {
    this.sessionStart = Date.now();
    this.currentModule = this.extractModuleId(window.location.pathname);
    
    // Update time every 30 seconds
    setInterval(() => {
      const timeSpent = Math.floor((Date.now() - this.sessionStart) / 1000 / 60); // minutes
      this.userProgress.statistics.totalTimeSpent += timeSpent;
      
      if (this.currentModule) {
        this.userProgress.modules.timeSpent[this.currentModule] = 
          (this.userProgress.modules.timeSpent[this.currentModule] || 0) + timeSpent;
      }
      
      this.sessionStart = Date.now();
      this.saveProgress();
    }, 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.floor((Date.now() - this.sessionStart) / 1000 / 60);
      this.userProgress.statistics.totalTimeSpent += timeSpent;
      if (this.currentModule) {
        this.userProgress.modules.timeSpent[this.currentModule] = 
          (this.userProgress.modules.timeSpent[this.currentModule] || 0) + timeSpent;
      }
      this.saveProgress();
    });
  }

  updateDailyStreak() {
    const lastActivity = new Date(this.userProgress.statistics.lastActivity);
    const today = new Date();
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Streak continues
      this.userProgress.statistics.streakDays++;
      this.showStreakBonus();
    } else if (daysDiff > 1) {
      // Streak broken
      this.userProgress.statistics.streakDays = 1;
    }
    // Same day = no change

    this.userProgress.statistics.lastActivity = today.toISOString();
    this.saveProgress();
  }

  // === ACHIEVEMENT SYSTEM ===
  checkAchievements() {
    const achievements = [
      {
        id: 'first_module',
        name: 'Premier Pas',
        description: 'Complétez votre premier module',
        condition: () => this.userProgress.statistics.modulesCompleted >= 1,
        badge: '🚀'
      },
      {
        id: 'bitcoin_master',
        name: 'Maître Bitcoin',
        description: 'Complétez le parcours Bitcoin',
        condition: () => this.userProgress.paths['bitcoin-basics'].completed,
        badge: '₿'
      },
      {
        id: 'lightning_expert',
        name: 'Expert Lightning',
        description: 'Complétez le parcours Lightning Network',
        condition: () => this.userProgress.paths['lightning-network'].completed,
        badge: '⚡'
      },
      {
        id: 'node_operator',
        name: 'Opérateur de Nœud',
        description: 'Complétez le parcours Node Operation',
        condition: () => this.userProgress.paths['node-operation'].completed,
        badge: '🖥️'
      },
      {
        id: 'developer',
        name: 'Développeur Lightning',
        description: 'Complétez le parcours Development',
        condition: () => this.userProgress.paths['development'].completed,
        badge: '👩‍💻'
      },
      {
        id: 'streak_week',
        name: 'Régulier',
        description: '7 jours consécutifs d\'apprentissage',
        condition: () => this.userProgress.statistics.streakDays >= 7,
        badge: '🔥'
      },
      {
        id: 'time_invested',
        name: 'Investisseur Temps',
        description: '10 heures d\'apprentissage total',
        condition: () => this.userProgress.statistics.totalTimeSpent >= 600,
        badge: '⏰'
      },
      {
        id: 'perfectionist',
        name: 'Perfectionniste',
        description: 'Score moyen supérieur à 90%',
        condition: () => this.getAverageScore() >= 90,
        badge: '💯'
      }
    ];

    achievements.forEach(achievement => {
      if (!this.userProgress.achievements.includes(achievement.id)) {
        if (achievement.condition()) {
          this.unlockAchievement(achievement);
        }
      }
    });
  }

  unlockAchievement(achievement) {
    this.userProgress.achievements.push(achievement.id);
    this.userProgress.badges.push({
      id: achievement.id,
      name: achievement.name,
      badge: achievement.badge,
      unlockedAt: new Date().toISOString()
    });
    
    this.showAchievementUnlocked(achievement);
    this.saveProgress();
  }

  awardPathBadge(pathId) {
    const pathBadges = {
      'bitcoin-basics': { name: 'Maître Bitcoin', badge: '₿' },
      'lightning-network': { name: 'Expert Lightning', badge: '⚡' },
      'node-operation': { name: 'Opérateur Pro', badge: '🖥️' },
      'development': { name: 'Dev Lightning', badge: '👩‍💻' }
    };

    const badge = pathBadges[pathId];
    if (badge) {
      this.userProgress.badges.push({
        id: pathId + '_master',
        name: badge.name,
        badge: badge.badge,
        type: 'path_completion',
        unlockedAt: new Date().toISOString()
      });
      
      this.showPathCompleted(pathId, badge);
      this.saveProgress();
    }
  }

  // === UI UPDATES ===
  displayProgress() {
    this.updateProgressWidgets();
    this.updatePathProgress();
    this.updateBadges();
    this.updateStats();
  }

  updateProgressWidgets() {
    // Update progress bars on page
    document.querySelectorAll('.progress-widget').forEach(widget => {
      const pathId = widget.dataset.path;
      if (pathId && this.userProgress.paths[pathId]) {
        const progress = this.userProgress.paths[pathId].progress;
        const progressBar = widget.querySelector('.progress-fill');
        const progressText = widget.querySelector('.progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}% complété`;
      }
    });
  }

  updatePathProgress() {
    // Update main progress display
    const overallProgress = this.getOverallProgress();
    const mainProgress = document.querySelector('#main-progress');
    if (mainProgress) {
      mainProgress.style.width = `${overallProgress}%`;
      mainProgress.parentElement.querySelector('.progress-text').textContent = 
        `${overallProgress}% de progression globale`;
    }
  }

  updateBadges() {
    const badgeContainer = document.querySelector('#user-badges');
    if (badgeContainer) {
      badgeContainer.innerHTML = this.userProgress.badges.map(badge => `
        <div class="badge-item" title="${badge.name}">
          <span class="badge-icon">${badge.badge}</span>
          <span class="badge-name">${badge.name}</span>
        </div>
      `).join('');
    }
  }

  updateStats() {
    const stats = {
      'modules-completed': this.userProgress.statistics.modulesCompleted,
      'time-spent': Math.floor(this.userProgress.statistics.totalTimeSpent / 60) + 'h',
      'streak-days': this.userProgress.statistics.streakDays,
      'badges-earned': this.userProgress.badges.length,
      'average-score': Math.round(this.getAverageScore()) + '%'
    };

    Object.entries(stats).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  // === NOTIFICATIONS ===
  showModuleStarted(moduleId) {
    this.showNotification({
      title: 'Module commencé !',
      message: `Vous avez débuté: ${this.getModuleName(moduleId)}`,
      type: 'info',
      duration: 3000
    });
  }

  showModuleCompleted(moduleId, score) {
    this.showNotification({
      title: '🎉 Module terminé !',
      message: `${this.getModuleName(moduleId)} - Score: ${score}%`,
      type: 'success',
      duration: 5000
    });
  }

  showAchievementUnlocked(achievement) {
    this.showNotification({
      title: `${achievement.badge} Achievement débloqué !`,
      message: achievement.name,
      type: 'achievement',
      duration: 7000
    });
  }

  showPathCompleted(pathId, badge) {
    this.showNotification({
      title: `${badge.badge} Parcours complété !`,
      message: `Félicitations ! Vous êtes maintenant ${badge.name}`,
      type: 'celebration',
      duration: 10000
    });
  }

  showStreakBonus() {
    const days = this.userProgress.statistics.streakDays;
    this.showNotification({
      title: `🔥 Streak de ${days} jours !`,
      message: 'Continuez sur cette lancée !',
      type: 'streak',
      duration: 4000
    });
  }

  showNotification(config) {
    const notification = document.createElement('div');
    notification.className = `progress-notification ${config.type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <h4>${config.title}</h4>
        <p>${config.message}</p>
      </div>
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, config.duration);
  }

  // === UTILITY METHODS ===
  getOverallProgress() {
    const pathProgresses = Object.values(this.userProgress.paths).map(p => p.progress);
    return Math.round(pathProgresses.reduce((sum, p) => sum + p, 0) / pathProgresses.length);
  }

  getAverageScore() {
    const scores = Object.values(this.userProgress.modules.scores);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  getModuleName(moduleId) {
    const moduleNames = {
      'bitcoin-basics-intro': 'Introduction Bitcoin',
      'bitcoin-fundamentals': 'Fondamentaux Bitcoin',
      'lightning-basics': 'Bases Lightning Network',
      'lightning-concepts': 'Concepts Lightning',
      'channels-management': 'Gestion des Canaux',
      'dazbox-setup': 'Installation DazBox',
      'dazia-optimization': 'Optimisation DazIA',
      'development-basics': 'Bases Développement',
      'api-integration': 'Intégration APIs'
    };
    return moduleNames[moduleId] || moduleId;
  }

  setupEventListeners() {
    // Listen for custom events
    document.addEventListener('moduleComplete', (e) => {
      this.completeModule(e.detail.moduleId, e.detail.score || 100);
    });

    document.addEventListener('pathSelected', (e) => {
      this.userProgress.profile.preferredPath = e.detail.pathId;
      this.saveProgress();
    });

    // Track scroll depth (engagement)
    let maxScrolled = 0;
    window.addEventListener('scroll', () => {
      const scrolled = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrolled > maxScrolled) {
        maxScrolled = scrolled;
        // Track with Umami
        if (typeof umami !== 'undefined' && scrolled % 25 === 0) {
          umami.track('scroll-depth', { depth: scrolled });
        }
      }
    });
  }

  // === STORAGE ===
  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.userProgress));
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  // === PUBLIC API ===
  getUserProgress() {
    return { ...this.userProgress };
  }

  markModuleComplete(moduleId, score = 100) {
    this.completeModule(moduleId, score);
  }

  exportProgress() {
    const data = {
      ...this.userProgress,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dazno-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  resetProgress() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre progression ?')) {
      localStorage.removeItem(this.storageKey);
      this.userProgress = this.createInitialProgress();
      this.displayProgress();
      this.showNotification({
        title: 'Progression réinitialisée',
        message: 'Votre progression a été remise à zéro.',
        type: 'info',
        duration: 3000
      });
    }
  }
}

// Styles CSS pour les notifications
const progressStyles = `
<style>
.progress-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--bg-surface);
  border-radius: 12px;
  padding: var(--space-lg);
  box-shadow: var(--shadow-xl);
  border-left: 4px solid var(--lightning-purple);
  max-width: 350px;
  transform: translateX(400px);
  transition: transform var(--transition-base);
  z-index: 10000;
}

.progress-notification.show {
  transform: translateX(0);
}

.progress-notification.success {
  border-left-color: #10B981;
}

.progress-notification.achievement {
  border-left-color: var(--lightning-yellow);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(107, 70, 193, 0.1));
}

.progress-notification.celebration {
  border-left-color: var(--lightning-yellow);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(107, 70, 193, 0.2));
  animation: celebration 0.5s ease;
}

.progress-notification.streak {
  border-left-color: #EF4444;
}

@keyframes celebration {
  0%, 100% { transform: translateX(0) scale(1); }
  50% { transform: translateX(0) scale(1.05); }
}

.notification-content h4 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.notification-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.progress-widget {
  background: var(--bg-surface);
  border-radius: 8px;
  padding: var(--space-md);
  margin: var(--space-md) 0;
}

.progress-container {
  width: 100%;
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-lightning);
  border-radius: 4px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.badge-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--gradient-lightning);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  margin: var(--space-xs);
}

.badge-icon {
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .progress-notification {
    left: 20px;
    right: 20px;
    max-width: none;
    transform: translateY(-100px);
  }
  
  .progress-notification.show {
    transform: translateY(0);
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', progressStyles);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.progressTracker = new ProgressTracker();
  
  // Global API
  window.DaznoProgress = {
    markComplete: (moduleId, score) => window.progressTracker.markModuleComplete(moduleId, score),
    getProgress: () => window.progressTracker.getUserProgress(),
    exportProgress: () => window.progressTracker.exportProgress(),
    resetProgress: () => window.progressTracker.resetProgress()
  };
});