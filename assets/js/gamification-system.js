/**
 * Lightning Learning Gamification System avec T4G Integration
 * Système complet Learn-to-Earn avec tokens T4G, badges NFT et récompenses
 */

class GamificationSystem {
  constructor() {
    this.user = this.loadUserData() || this.createNewUser();
    this.achievements = this.loadAchievements();
    this.t4gAPI = new T4GIntegration();
    this.init();
  }

  createNewUser() {
    return {
      id: this.generateUserId(),
      username: 'Lightning Explorer',
      level: 1,
      xp: 0,
      xpNextLevel: 100,
      totalXP: 0,
      badges: [],
      achievements: [],
      streakDays: 0,
      lastActive: new Date().toISOString(),
      completedModules: [],
      currentPath: null,
      // T4G Integration
      t4gBalance: 0,
      t4gTotal: 0,
      stakingBalance: 0,
      nftBadges: [],
      lightningWallet: null,
      reputationScore: 0,
      // Enhanced stats for T4G rewards
      stats: {
        modulesCompleted: 0,
        quizzesCompleted: 0,
        perfectQuizzes: 0,
        totalTimeSpent: 0,
        nodesOptimized: 0,
        roiImprovement: 0,
        // T4G specific stats
        questionsAnswered: 0,
        tutorialsCreated: 0,
        mentoringSessionsGiven: 0,
        communityContributions: 0,
        bugReportsSubmitted: 0,
        codeContributions: 0
      }
    };
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
    this.checkDailyStreak();
    this.startSessionTimer();
    this.initializeNotifications();
  }

  loadUserData() {
    const data = localStorage.getItem('lightningUserData');
    return data ? JSON.parse(data) : null;
  }

  saveUserData() {
    localStorage.setItem('lightningUserData', JSON.stringify(this.user));
    this.syncToServer();
  }

  async syncToServer() {
    // Synchronisation avec le serveur (si disponible)
    if (window.DAZNODE_API) {
      try {
        await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.user)
        });
      } catch (error) {
        console.error('Sync error:', error);
      }
    }
  }

  loadAchievements() {
    return [
      {
        id: 'first_steps',
        name: 'Premiers Pas',
        description: 'Complétez votre premier module',
        icon: '🚀',
        xp: 50,
        condition: (user) => user.stats.modulesCompleted >= 1
      },
      {
        id: 'bitcoin_basics',
        name: 'Bitcoin Basics Master',
        description: 'Maîtrisez tous les modules Bitcoin fondamentaux',
        icon: '₿',
        xp: 200,
        condition: (user) => user.completedModules.filter(m => m.category === 'bitcoin').length >= 5
      },
      {
        id: 'lightning_wizard',
        name: 'Lightning Wizard',
        description: 'Devenez expert du Lightning Network',
        icon: '⚡',
        xp: 500,
        condition: (user) => user.completedModules.filter(m => m.category === 'lightning').length >= 10
      },
      {
        id: 'node_operator',
        name: 'Node Operator',
        description: 'Optimisez votre premier nœud Lightning',
        icon: '🖥️',
        xp: 300,
        condition: (user) => user.stats.nodesOptimized >= 1
      },
      {
        id: 'roi_champion',
        name: 'ROI Champion',
        description: 'Améliorez le ROI de 25% ou plus',
        icon: '📈',
        xp: 400,
        condition: (user) => user.stats.roiImprovement >= 25
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: '10 quiz parfaits consécutifs',
        icon: '🎯',
        xp: 250,
        condition: (user) => user.stats.perfectQuizzes >= 10
      },
      {
        id: 'dedicated_learner',
        name: 'Apprenant Dévoué',
        description: '30 jours de streak',
        icon: '🔥',
        xp: 600,
        condition: (user) => user.streakDays >= 30
      },
      {
        id: 'community_helper',
        name: 'Helper Communautaire',
        description: 'Aidez 10 membres de la communauté',
        icon: '🤝',
        xp: 350,
        condition: (user) => user.stats.helpGiven >= 10
      }
    ];
  }

  addXP(amount, reason = '') {
    const previousLevel = this.user.level;
    this.user.xp += amount;
    this.user.totalXP += amount;

    // Check level up
    while (this.user.xp >= this.user.xpNextLevel) {
      this.user.xp -= this.user.xpNextLevel;
      this.user.level++;
      this.user.xpNextLevel = this.calculateNextLevelXP(this.user.level);
      this.onLevelUp(previousLevel, this.user.level);
    }

    this.showXPNotification(amount, reason);
    this.checkAchievements();
    this.updateUI();
    this.saveUserData();
  }

  calculateNextLevelXP(level) {
    // Formule progressive: 100 * level * 1.5
    return Math.floor(100 * level * 1.5);
  }

  onLevelUp(oldLevel, newLevel) {
    this.showLevelUpAnimation(oldLevel, newLevel);
    this.unlockLevelRewards(newLevel);
    
    // Notification spéciale
    this.showNotification({
      title: `Niveau ${newLevel} Atteint!`,
      message: 'Félicitations! Vous progressez rapidement!',
      type: 'level-up',
      icon: '🎉'
    });

    // Effet sonore
    this.playSound('level-up');
  }

  unlockLevelRewards(level) {
    const rewards = {
      5: { badge: 'bronze_explorer', title: 'Explorateur Bronze' },
      10: { badge: 'silver_expert', title: 'Expert Argent' },
      20: { badge: 'gold_master', title: 'Maître Or' },
      30: { badge: 'platinum_legend', title: 'Légende Platine' },
      50: { badge: 'diamond_wizard', title: 'Wizard Diamant' }
    };

    if (rewards[level]) {
      this.awardBadge(rewards[level].badge, rewards[level].title);
    }
  }

  completeModule(moduleId, score = 100) {
    const module = {
      id: moduleId,
      completedAt: new Date().toISOString(),
      score: score,
      category: this.getModuleCategory(moduleId)
    };

    this.user.completedModules.push(module);
    this.user.stats.modulesCompleted++;

    // XP basé sur le score
    const baseXP = 100;
    const bonusXP = Math.floor((score / 100) * 50);
    this.addXP(baseXP + bonusXP, `Module "${moduleId}" complété`);

    // T4G Rewards Integration
    this.awardT4GForModule(moduleId, score);

    // Check for path completion
    this.checkPathProgress();
    
    this.saveUserData();
  }

  getModuleCategory(moduleId) {
    // Logique pour déterminer la catégorie du module
    if (moduleId.includes('bitcoin')) return 'bitcoin';
    if (moduleId.includes('lightning')) return 'lightning';
    if (moduleId.includes('node')) return 'node';
    return 'general';
  }

  completeQuiz(quizId, score) {
    this.user.stats.quizzesCompleted++;
    
    if (score === 100) {
      this.user.stats.perfectQuizzes++;
      this.addXP(150, 'Quiz parfait!');
    } else if (score >= 80) {
      this.addXP(100, 'Quiz réussi');
    } else {
      this.addXP(50, 'Quiz complété');
    }

    // T4G Rewards Integration
    this.awardT4GForQuiz(quizId, score);

    this.checkAchievements();
    this.saveUserData();
  }

  checkAchievements() {
    this.achievements.forEach(achievement => {
      if (!this.user.achievements.includes(achievement.id)) {
        if (achievement.condition(this.user)) {
          this.unlockAchievement(achievement);
        }
      }
    });
  }

  unlockAchievement(achievement) {
    this.user.achievements.push(achievement.id);
    this.addXP(achievement.xp, `Achievement débloqué: ${achievement.name}`);
    
    this.showAchievementUnlock(achievement);
    this.playSound('achievement');
    
    this.saveUserData();
  }

  showAchievementUnlock(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
      <div class="achievement-popup-content">
        <div class="achievement-icon-large">${achievement.icon}</div>
        <h3>Achievement Débloqué!</h3>
        <h4>${achievement.name}</h4>
        <p>${achievement.description}</p>
        <div class="xp-reward">+${achievement.xp} XP</div>
      </div>
    `;

    document.body.appendChild(popup);
    
    // Animation d'entrée
    setTimeout(() => popup.classList.add('show'), 100);
    
    // Auto-dismiss après 5 secondes
    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 500);
    }, 5000);
  }

  awardBadge(badgeId, badgeName) {
    if (!this.user.badges.includes(badgeId)) {
      this.user.badges.push(badgeId);
      
      this.showNotification({
        title: 'Nouveau Badge!',
        message: `Vous avez obtenu: ${badgeName}`,
        type: 'badge',
        icon: '🏅'
      });
      
      this.saveUserData();
    }
  }

  checkDailyStreak() {
    const lastActive = new Date(this.user.lastActive);
    const now = new Date();
    const daysDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Streak continue
      this.user.streakDays++;
      this.addXP(20, 'Bonus de streak quotidien');
    } else if (daysDiff > 1) {
      // Streak perdu
      if (this.user.streakDays > 0) {
        this.showNotification({
          title: 'Streak Perdu',
          message: `Votre streak de ${this.user.streakDays} jours est terminé`,
          type: 'warning'
        });
      }
      this.user.streakDays = 0;
    }

    this.user.lastActive = now.toISOString();
    this.saveUserData();
  }

  startSessionTimer() {
    this.sessionStart = Date.now();
    
    // Update time spent every minute
    setInterval(() => {
      const minutesSpent = Math.floor((Date.now() - this.sessionStart) / 60000);
      this.user.stats.totalTimeSpent += minutesSpent;
      this.sessionStart = Date.now();
      
      // Bonus XP pour temps d'apprentissage
      if (minutesSpent >= 30) {
        this.addXP(50, 'Bonus session prolongée');
      }
      
      this.saveUserData();
    }, 60000);
  }

  showXPNotification(amount, reason) {
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.innerHTML = `
      <span class="xp-amount">+${amount} XP</span>
      ${reason ? `<span class="xp-reason">${reason}</span>` : ''}
    `;

    const container = document.getElementById('xp-notifications') || document.body;
    container.appendChild(notification);

    // Animation et auto-remove
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  showNotification(config) {
    // Utilise l'API Notification si disponible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(config.title, {
        body: config.message,
        icon: '/assets/images/favicon/favicon-192x192.png',
        badge: config.icon
      });
    }

    // Notification in-app
    const toast = document.createElement('div');
    toast.className = `toast toast-${config.type || 'info'}`;
    toast.innerHTML = `
      <span class="toast-icon">${config.icon || '💡'}</span>
      <div class="toast-content">
        <strong>${config.title}</strong>
        <p>${config.message}</p>
      </div>
    `;

    const container = document.getElementById('toast-container') || this.createToastContainer();
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  initializeNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  playSound(type) {
    const sounds = {
      'xp': '/assets/sounds/xp-gain.mp3',
      'level-up': '/assets/sounds/level-up.mp3',
      'achievement': '/assets/sounds/achievement.mp3',
      'complete': '/assets/sounds/module-complete.mp3'
    };

    if (sounds[type] && !this.user.soundsMuted) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }

  showLevelUpAnimation(oldLevel, newLevel) {
    const animation = document.createElement('div');
    animation.className = 'level-up-animation';
    animation.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-stars">⭐⭐⭐</div>
        <h2>LEVEL UP!</h2>
        <div class="level-change">
          <span class="old-level">Niveau ${oldLevel}</span>
          <span class="arrow">→</span>
          <span class="new-level">Niveau ${newLevel}</span>
        </div>
        <div class="level-up-effects"></div>
      </div>
    `;

    document.body.appendChild(animation);
    
    setTimeout(() => animation.classList.add('show'), 100);
    setTimeout(() => {
      animation.classList.remove('show');
      setTimeout(() => animation.remove(), 1000);
    }, 3000);
  }

  checkPathProgress() {
    if (!this.user.currentPath) return;

    const pathModules = this.getPathModules(this.user.currentPath);
    const completedInPath = pathModules.filter(m => 
      this.user.completedModules.some(cm => cm.id === m.id)
    );

    const progress = (completedInPath.length / pathModules.length) * 100;

    if (progress === 100) {
      this.completePath(this.user.currentPath);
    }

    this.updatePathProgress(progress);
  }

  getPathModules(pathId) {
    // Retourne les modules d'un parcours spécifique
    const paths = {
      'beginner': [
        { id: 'bitcoin-basics', name: 'Bitcoin Basics' },
        { id: 'wallet-setup', name: 'Wallet Setup' },
        { id: 'first-transaction', name: 'First Transaction' }
      ],
      'lightning': [
        { id: 'lightning-intro', name: 'Lightning Introduction' },
        { id: 'channels-basics', name: 'Channels Basics' },
        { id: 'routing-fundamentals', name: 'Routing Fundamentals' },
        { id: 'liquidity-management', name: 'Liquidity Management' }
      ],
      'node-operator': [
        { id: 'node-setup', name: 'Node Setup' },
        { id: 'channel-management', name: 'Channel Management' },
        { id: 'fee-optimization', name: 'Fee Optimization' },
        { id: 'monitoring-tools', name: 'Monitoring Tools' },
        { id: 'roi-maximization', name: 'ROI Maximization' }
      ]
    };

    return paths[pathId] || [];
  }

  completePath(pathId) {
    const pathRewards = {
      'beginner': { xp: 500, badge: 'path_beginner' },
      'lightning': { xp: 1000, badge: 'path_lightning' },
      'node-operator': { xp: 1500, badge: 'path_node_operator' }
    };

    const reward = pathRewards[pathId];
    if (reward) {
      this.addXP(reward.xp, `Parcours "${pathId}" complété!`);
      this.awardBadge(reward.badge, `Maître du parcours ${pathId}`);
    }

    this.user.currentPath = null;
    this.saveUserData();
  }

  updatePathProgress(progress) {
    const progressBar = document.querySelector('.path-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.querySelector('.progress-text').textContent = `${Math.round(progress)}%`;
    }
  }

  updateUI() {
    // Update niveau et XP
    const levelDisplay = document.getElementById('user-level');
    if (levelDisplay) {
      levelDisplay.textContent = this.user.level;
    }

    const xpBar = document.getElementById('xp-progress');
    if (xpBar) {
      const percentage = (this.user.xp / this.user.xpNextLevel) * 100;
      xpBar.style.width = `${percentage}%`;
    }

    const xpText = document.getElementById('xp-text');
    if (xpText) {
      xpText.textContent = `${this.user.xp} / ${this.user.xpNextLevel} XP`;
    }

    // Update badges
    const badgesContainer = document.getElementById('user-badges');
    if (badgesContainer) {
      badgesContainer.innerHTML = this.user.badges.map(badge => 
        `<div class="badge-item" data-badge="${badge}"></div>`
      ).join('');
    }

    // Update achievements
    const achievementsGrid = document.getElementById('achievements-grid');
    if (achievementsGrid) {
      achievementsGrid.innerHTML = this.achievements.map(achievement => {
        const unlocked = this.user.achievements.includes(achievement.id);
        return `
          <div class="achievement-badge ${unlocked ? 'unlocked' : 'locked'}" 
               data-achievement="${achievement.id}">
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-tooltip">
              <strong>${achievement.name}</strong>
              <p>${achievement.description}</p>
              <span class="achievement-xp">+${achievement.xp} XP</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update streak
    const streakDisplay = document.getElementById('streak-days');
    if (streakDisplay) {
      streakDisplay.textContent = this.user.streakDays;
    }

    // Update stats
    this.updateStats();
  }

  updateStats() {
    const statsElements = {
      'stat-modules': this.user.stats.modulesCompleted,
      'stat-quizzes': this.user.stats.quizzesCompleted,
      'stat-perfect': this.user.stats.perfectQuizzes,
      'stat-time': Math.floor(this.user.stats.totalTimeSpent / 60) + 'h',
      'stat-nodes': this.user.stats.nodesOptimized,
      'stat-roi': this.user.stats.roiImprovement + '%'
    };

    Object.entries(statsElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  setupEventListeners() {
    // Module completion
    document.addEventListener('moduleComplete', (e) => {
      this.completeModule(e.detail.moduleId, e.detail.score);
    });

    // Quiz completion
    document.addEventListener('quizComplete', (e) => {
      this.completeQuiz(e.detail.quizId, e.detail.score);
    });

    // Path selection
    document.addEventListener('pathSelected', (e) => {
      this.user.currentPath = e.detail.pathId;
      this.saveUserData();
    });

    // Settings toggle
    document.addEventListener('toggleSounds', (e) => {
      this.user.soundsMuted = !this.user.soundsMuted;
      this.saveUserData();
    });
  }

  // T4G Reward Methods
  async awardT4GForModule(moduleId, score) {
    const baseAmount = this.t4gAPI.rewardRates.learning.moduleCompletion;
    const metadata = {
      moduleId: moduleId,
      score: score,
      difficulty: this.getModuleDifficulty(moduleId),
      streakDays: this.user.streakDays,
      isPremium: this.user.isPremium || false,
      isEarlyAdopter: this.isEarlyAdopter()
    };

    await this.t4gAPI.awardT4G('module-completion', baseAmount, metadata);
    this.user.t4gBalance += baseAmount;
    this.user.t4gTotal += baseAmount;
  }

  async awardT4GForQuiz(quizId, score) {
    const baseAmount = this.t4gAPI.rewardRates.learning.quizCompletion;
    const metadata = {
      quizId: quizId,
      score: score,
      streakDays: this.user.streakDays,
      isPerfect: score === 100
    };

    await this.t4gAPI.awardT4G('quiz-completion', baseAmount, metadata);
    this.user.t4gBalance += baseAmount;
    this.user.t4gTotal += baseAmount;
  }

  async awardT4GForContribution(contributionType, metadata = {}) {
    const rates = this.t4gAPI.rewardRates.community;
    let baseAmount = 0;

    switch (contributionType) {
      case 'question-answer':
        baseAmount = rates.questionAnswer;
        if (metadata.isBestAnswer) baseAmount = rates.bestAnswer;
        break;
      case 'tutorial-created':
        baseAmount = rates.tutorialCreated;
        if (metadata.isPopular) baseAmount = rates.tutorialPopular;
        break;
      case 'mentoring-session':
        baseAmount = rates.mentoringSession;
        if (metadata.nps > 8) baseAmount = rates.mentoringExcellent;
        break;
      case 'bug-report':
        baseAmount = rates.bugReport;
        break;
      case 'translation':
        baseAmount = rates.translation;
        if (metadata.isRareLanguage) baseAmount = rates.translationRare;
        break;
    }

    if (baseAmount > 0) {
      await this.t4gAPI.awardT4G(contributionType, baseAmount, metadata);
      this.user.t4gBalance += baseAmount;
      this.user.t4gTotal += baseAmount;
    }
  }

  getModuleDifficulty(moduleId) {
    // Détermine la difficulté du module pour les multiplicateurs
    if (moduleId.includes('basics') || moduleId.includes('intro')) return 'beginner';
    if (moduleId.includes('advanced') || moduleId.includes('expert')) return 'advanced';
    if (moduleId.includes('optimization') || moduleId.includes('roi')) return 'expert';
    return 'intermediate';
  }

  isEarlyAdopter() {
    // Vérifie si l'utilisateur est un early adopter (Genesis Mining)
    const createdAt = new Date(this.user.createdAt || Date.now());
    const genesisEndDate = new Date('2024-12-31'); // À ajuster selon le lancement
    return createdAt <= genesisEndDate;
  }

  // Public API for other scripts
  getUser() {
    return this.user;
  }

  resetProgress() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre progression?')) {
      this.user = this.createNewUser();
      this.saveUserData();
      this.updateUI();
      location.reload();
    }
  }

  exportProgress() {
    const data = JSON.stringify(this.user, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lightning-progress-${this.user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importProgress(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.user = data;
        this.saveUserData();
        this.updateUI();
        this.showNotification({
          title: 'Import Réussi',
          message: 'Votre progression a été restaurée',
          type: 'success'
        });
      } catch (error) {
        this.showNotification({
          title: 'Erreur d\'import',
          message: 'Le fichier n\'est pas valide',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.gamification = new GamificationSystem();
  
  // Expose API globale
  window.LightningGamification = {
    addXP: (amount, reason) => window.gamification.addXP(amount, reason),
    completeModule: (moduleId, score) => window.gamification.completeModule(moduleId, score),
    completeQuiz: (quizId, score) => window.gamification.completeQuiz(quizId, score),
    getUser: () => window.gamification.getUser(),
    resetProgress: () => window.gamification.resetProgress(),
    exportProgress: () => window.gamification.exportProgress(),
    importProgress: (file) => window.gamification.importProgress(file)
  };
});

// CSS for gamification elements (to be added to lightning-design-system.css)
const gamificationStyles = `
<style>
/* XP Notifications */
.xp-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, var(--lightning-purple) 0%, var(--lightning-blue) 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 20px rgba(107, 70, 193, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.xp-notification.show {
  opacity: 1;
  transform: translateY(0);
}

.xp-amount {
  font-size: 1.25rem;
  font-weight: 700;
}

.xp-reason {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Achievement Popup */
.achievement-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: linear-gradient(135deg, var(--dark-surface) 0%, var(--dark-bg) 100%);
  border: 2px solid var(--lightning-purple);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(107, 70, 193, 0.5);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
}

.achievement-popup.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.achievement-popup-content {
  text-align: center;
  color: white;
}

.achievement-icon-large {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.xp-reward {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 16px;
  background: var(--gradient-lightning);
  border-radius: 20px;
  font-weight: 700;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--dark-surface);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  min-width: 300px;
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-icon {
  font-size: 1.5rem;
}

.toast-content strong {
  display: block;
  margin-bottom: 4px;
  color: white;
}

.toast-content p {
  margin: 0;
  color: var(--dark-text-secondary);
  font-size: 0.875rem;
}

.toast-success {
  border-left: 4px solid #22C55E;
}

.toast-warning {
  border-left: 4px solid var(--lightning-yellow);
}

.toast-error {
  border-left: 4px solid #EF4444;
}

.toast-badge {
  border-left: 4px solid var(--lightning-purple);
}

.toast-level-up {
  border-left: 4px solid transparent;
  border-image: var(--gradient-lightning) 1;
}

/* Level Up Animation */
.level-up-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.level-up-animation.show {
  opacity: 1;
}

.level-up-content {
  text-align: center;
  color: white;
}

.level-up-stars {
  font-size: 3rem;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.level-up-content h2 {
  font-size: 3rem;
  background: var(--gradient-lightning);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 20px 0;
  animation: pulse 1s ease infinite;
}

.level-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 1.5rem;
}

.old-level {
  opacity: 0.5;
}

.new-level {
  color: var(--lightning-yellow);
  font-weight: 700;
  animation: glow 1s ease infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px var(--lightning-yellow); }
  50% { text-shadow: 0 0 20px var(--lightning-yellow), 0 0 30px var(--lightning-yellow); }
}

.level-up-effects {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  pointer-events: none;
}

.level-up-effects::before,
.level-up-effects::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--lightning-purple);
  transform: translate(-50%, -50%);
  animation: ripple 2s linear infinite;
}

.level-up-effects::after {
  animation-delay: 1s;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', gamificationStyles);