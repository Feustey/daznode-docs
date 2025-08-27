/**
 * Système de Badges Minimal - Priorité Critique
 * Gamification simple et efficace pour maintenir l'engagement
 */

class BadgeSystem {
  constructor() {
    this.badgeDefinitions = this.loadBadgeDefinitions();
    this.userBadges = this.loadUserBadges();
    this.init();
  }

  loadBadgeDefinitions() {
    return {
      // === PROGRESSION BADGES ===
      'first_steps': {
        id: 'first_steps',
        name: 'Premiers Pas',
        description: 'Complétez votre premier module',
        icon: '🚀',
        rarity: 'common',
        category: 'progression',
        points: 50,
        condition: (progress) => progress.modules.completed.length >= 1,
        message: 'Félicitations ! Vous avez franchi le premier pas vers la maîtrise de Bitcoin.'
      },
      'bitcoin_basics': {
        id: 'bitcoin_basics',
        name: 'Maître Bitcoin',
        description: 'Terminez le parcours Bitcoin Fondamentaux',
        icon: '₿',
        rarity: 'rare',
        category: 'mastery',
        points: 200,
        condition: (progress) => progress.paths && progress.paths['bitcoin-basics']?.completed,
        message: 'Vous maîtrisez maintenant les fondamentaux de Bitcoin ! '
      },
      'lightning_wizard': {
        id: 'lightning_wizard',
        name: 'Wizard Lightning',
        description: 'Terminez le parcours Lightning Network',
        icon: '⚡',
        rarity: 'epic',
        category: 'mastery',
        points: 500,
        condition: (progress) => progress.paths && progress.paths['lightning-network']?.completed,
        message: 'Impressionnant ! Vous êtes maintenant un expert Lightning Network.'
      },
      'node_operator': {
        id: 'node_operator',
        name: 'Opérateur Pro',
        description: 'Terminez le parcours Opérateur de Nœud',
        icon: '🖥️',
        rarity: 'epic',
        category: 'mastery',
        points: 600,
        condition: (progress) => progress.paths && progress.paths['node-operation']?.completed,
        message: 'Vous êtes maintenant capable d\'opérer un nœud Lightning professionnel !'
      },
      'developer': {
        id: 'developer',
        name: 'Dev Lightning',
        description: 'Terminez le parcours Développement',
        icon: '👩‍💻',
        rarity: 'legendary',
        category: 'mastery',
        points: 800,
        condition: (progress) => progress.paths && progress.paths['development']?.completed,
        message: 'Extraordinaire ! Vous pouvez maintenant créer des applications Lightning.'
      },

      // === ENGAGEMENT BADGES ===
      'early_bird': {
        id: 'early_bird',
        name: 'Lève-tôt',
        description: 'Connectez-vous avant 8h du matin',
        icon: '🌅',
        rarity: 'uncommon',
        category: 'engagement',
        points: 25,
        condition: (progress) => {
          const now = new Date();
          return now.getHours() < 8;
        },
        message: 'L\'avenir appartient à ceux qui se lèvent tôt ! Continuez comme ça.'
      },
      'night_owl': {
        id: 'night_owl',
        name: 'Chouette de Nuit',
        description: 'Apprenez après 22h',
        icon: '🦉',
        rarity: 'uncommon',
        category: 'engagement',
        points: 25,
        condition: (progress) => {
          const now = new Date();
          return now.getHours() >= 22;
        },
        message: 'La nuit porte conseil ! Votre dévouement est admirable.'
      },
      'streak_week': {
        id: 'streak_week',
        name: 'Régulier',
        description: '7 jours consécutifs d\'apprentissage',
        icon: '🔥',
        rarity: 'rare',
        category: 'engagement',
        points: 150,
        condition: (progress) => progress.statistics && progress.statistics.streakDays >= 7,
        message: 'Une semaine complète ! Votre régularité est la clé du succès.'
      },
      'streak_month': {
        id: 'streak_month',
        name: 'Dévoué',
        description: '30 jours consécutifs d\'apprentissage',
        icon: '🏆',
        rarity: 'epic',
        category: 'engagement',
        points: 500,
        condition: (progress) => progress.statistics && progress.statistics.streakDays >= 30,
        message: 'Un mois entier ! Votre détermination est exceptionnelle.'
      },

      // === PERFORMANCE BADGES ===
      'perfectionist': {
        id: 'perfectionist',
        name: 'Perfectionniste',
        description: 'Obtenez 100% sur 5 modules',
        icon: '💯',
        rarity: 'rare',
        category: 'performance',
        points: 300,
        condition: (progress) => {
          const perfectScores = Object.values(progress.modules?.scores || {}).filter(score => score === 100);
          return perfectScores.length >= 5;
        },
        message: 'Excellence ! Votre quête de perfection porte ses fruits.'
      },
      'speed_learner': {
        id: 'speed_learner',
        name: 'Apprenant Rapide',
        description: 'Complétez 3 modules en une journée',
        icon: '💨',
        rarity: 'uncommon',
        category: 'performance',
        points: 100,
        condition: (progress) => {
          const today = new Date().toDateString();
          const todayCompletions = progress.modules?.completed?.filter(moduleId => {
            // Cette condition nécessiterait des timestamps, simplifiée pour l'exemple
            return true; // Placeholder
          }) || [];
          return todayCompletions.length >= 3;
        },
        message: 'Rapide comme l\'éclair ! Votre rythme d\'apprentissage est impressionnant.'
      },
      'time_invested': {
        id: 'time_invested',
        name: 'Investisseur Temps',
        description: 'Passez plus de 10 heures à apprendre',
        icon: '⏰',
        rarity: 'rare',
        category: 'engagement',
        points: 250,
        condition: (progress) => (progress.statistics?.totalTimeSpent || 0) >= 600, // 10 heures en minutes
        message: 'Votre investissement en temps est remarquable ! Le savoir n\'a pas de prix.'
      },

      // === SPECIAL BADGES ===
      'community_helper': {
        id: 'community_helper',
        name: 'Helper Communautaire',
        description: 'Aidez d\'autres membres (simulé)',
        icon: '🤝',
        rarity: 'epic',
        category: 'community',
        points: 400,
        condition: (progress) => false, // Sera activé avec les fonctionnalités communautaires
        message: 'Merci d\'aider la communauté ! Ensemble, nous apprenons mieux.'
      },
      'quiz_master': {
        id: 'quiz_master',
        name: 'Maître Quiz',
        description: 'Réussissez 10 quiz d\'affilée',
        icon: '🎯',
        rarity: 'rare',
        category: 'performance',
        points: 300,
        condition: (progress) => {
          // Logique pour vérifier les quiz consécutifs réussis
          return false; // Placeholder
        },
        message: 'Champion ! Votre maîtrise des concepts est indéniable.'
      },
      'explorer': {
        id: 'explorer',
        name: 'Explorateur',
        description: 'Visitez toutes les sections principales',
        icon: '🗺️',
        rarity: 'uncommon',
        category: 'exploration',
        points: 75,
        condition: (progress) => {
          const visitedSections = progress.visitedSections || [];
          const mainSections = ['bitcoin', 'lightning-network', 'solutions', 'devs'];
          return mainSections.every(section => visitedSections.includes(section));
        },
        message: 'Bravo ! Vous avez exploré tout l\'écosystème Dazno.'
      },
      'social_sharer': {
        id: 'social_sharer',
        name: 'Ambassadeur',
        description: 'Partagez votre progression sur les réseaux',
        icon: '📢',
        rarity: 'uncommon',
        category: 'social',
        points: 50,
        condition: (progress) => progress.shared || false,
        message: 'Merci de faire connaître Dazno ! Vous êtes un vrai ambassadeur.'
      }
    };
  }

  loadUserBadges() {
    const saved = localStorage.getItem('dazno_user_badges');
    return saved ? JSON.parse(saved) : [];
  }

  init() {
    this.setupBadgeContainer();
    this.checkAllBadges();
    this.setupEventListeners();
  }

  setupBadgeContainer() {
    // Créer le conteneur de badges dans la navigation ou le profil utilisateur
    const badgeContainer = document.createElement('div');
    badgeContainer.id = 'user-badges-container';
    badgeContainer.className = 'user-badges-container';
    
    badgeContainer.innerHTML = `
      <div class="badges-header">
        <h4>🏅 Badges Obtenus</h4>
        <span class="badges-count">${this.userBadges.length}</span>
      </div>
      <div class="badges-grid" id="badges-grid">
        ${this.renderBadges()}
      </div>
      <div class="badges-actions">
        <button class="btn-view-all-badges" onclick="window.badgeSystem.showBadgeModal()">
          Voir tous les badges
        </button>
      </div>
    `;

    // Insérer dans la sidebar ou créer une section dédiée
    const sidebar = document.querySelector('.sidebar, .profile-section');
    if (sidebar) {
      sidebar.appendChild(badgeContainer);
    } else {
      this.createBadgeWidget(badgeContainer);
    }
  }

  createBadgeWidget(badgeContainer) {
    // Créer un widget flottant si pas de sidebar
    const widget = document.createElement('div');
    widget.className = 'floating-badge-widget';
    widget.innerHTML = `
      <button class="badge-widget-toggle" onclick="this.parentElement.classList.toggle('expanded')">
        🏅 <span class="badge-count">${this.userBadges.length}</span>
      </button>
      <div class="badge-widget-content">
        ${badgeContainer.innerHTML}
      </div>
    `;
    
    document.body.appendChild(widget);
  }

  renderBadges() {
    if (this.userBadges.length === 0) {
      return '<div class="no-badges">Aucun badge obtenu pour le moment</div>';
    }

    return this.userBadges.map(userBadge => {
      const badge = this.badgeDefinitions[userBadge.id];
      if (!badge) return '';
      
      return `
        <div class="badge-item ${badge.rarity}" data-badge="${badge.id}" title="${badge.description}">
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-info">
            <span class="badge-name">${badge.name}</span>
            <span class="badge-points">+${badge.points} pts</span>
          </div>
          <div class="badge-date">
            ${this.formatDate(userBadge.earnedAt)}
          </div>
        </div>
      `;
    }).join('');
  }

  checkAllBadges() {
    if (!window.progressTracker) return;
    
    const userProgress = window.progressTracker.getUserProgress();
    let newBadgesEarned = [];

    Object.values(this.badgeDefinitions).forEach(badge => {
      if (!this.hasBadge(badge.id)) {
        if (badge.condition(userProgress)) {
          this.awardBadge(badge.id);
          newBadgesEarned.push(badge);
        }
      }
    });

    if (newBadgesEarned.length > 0) {
      this.showBadgeNotifications(newBadgesEarned);
    }
  }

  hasBadge(badgeId) {
    return this.userBadges.some(badge => badge.id === badgeId);
  }

  awardBadge(badgeId) {
    const badge = this.badgeDefinitions[badgeId];
    if (!badge || this.hasBadge(badgeId)) return;

    const userBadge = {
      id: badgeId,
      earnedAt: new Date().toISOString(),
      points: badge.points
    };

    this.userBadges.push(userBadge);
    this.saveUserBadges();
    
    // Intégration avec le système de gamification existant
    if (window.gamification) {
      window.gamification.addXP(badge.points, `Badge obtenu: ${badge.name}`);
    }

    // Track avec Umami
    if (typeof umami !== 'undefined') {
      umami.track('badge-earned', {
        badgeId: badgeId,
        badgeName: badge.name,
        rarity: badge.rarity
      });
    }

    this.updateBadgeDisplay();
  }

  showBadgeNotifications(badges) {
    badges.forEach((badge, index) => {
      setTimeout(() => {
        this.showBadgeNotification(badge);
      }, index * 1000); // Stagger notifications
    });
  }

  showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = `badge-notification ${badge.rarity}`;
    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-icon">🏅</span>
        <h4>Badge Débloqué !</h4>
      </div>
      <div class="notification-content">
        <div class="badge-preview">
          <span class="badge-icon-large">${badge.icon}</span>
          <div class="badge-details">
            <h5>${badge.name}</h5>
            <p>${badge.description}</p>
            <span class="badge-points">+${badge.points} points</span>
          </div>
        </div>
        <p class="badge-message">${badge.message}</p>
      </div>
      <div class="notification-actions">
        <button class="btn-share-badge" onclick="window.badgeSystem.shareBadge('${badge.id}')">
          Partager 📢
        </button>
        <button class="btn-close-notification" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-dismiss après 8 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 8000);

    // Son de notification (si non muté)
    this.playBadgeSound(badge.rarity);
  }

  showBadgeModal() {
    const modal = document.createElement('div');
    modal.className = 'badge-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🏆 Collection de Badges</h2>
          <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="badges-stats">
            <div class="stat">
              <span class="stat-value">${this.userBadges.length}</span>
              <span class="stat-label">Badges Obtenus</span>
            </div>
            <div class="stat">
              <span class="stat-value">${Object.keys(this.badgeDefinitions).length}</span>
              <span class="stat-label">Total Disponible</span>
            </div>
            <div class="stat">
              <span class="stat-value">${this.getTotalBadgePoints()}</span>
              <span class="stat-label">Points Gagnés</span>
            </div>
          </div>

          <div class="badge-categories">
            <div class="category-tabs">
              <button class="tab-btn active" data-category="all">Tous</button>
              <button class="tab-btn" data-category="progression">Progression</button>
              <button class="tab-btn" data-category="mastery">Maîtrise</button>
              <button class="tab-btn" data-category="engagement">Engagement</button>
              <button class="tab-btn" data-category="performance">Performance</button>
            </div>
            
            <div class="badges-showcase">
              ${this.renderAllBadges()}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    
    this.setupModalTabs(modal);
  }

  renderAllBadges() {
    return Object.values(this.badgeDefinitions).map(badge => {
      const isEarned = this.hasBadge(badge.id);
      const userBadge = this.userBadges.find(ub => ub.id === badge.id);
      
      return `
        <div class="showcase-badge ${badge.rarity} ${isEarned ? 'earned' : 'locked'}" 
             data-category="${badge.category}">
          <div class="badge-showcase-icon">
            ${isEarned ? badge.icon : '🔒'}
          </div>
          <div class="badge-showcase-info">
            <h5 class="badge-showcase-name">${isEarned ? badge.name : '???'}</h5>
            <p class="badge-showcase-desc">${isEarned ? badge.description : 'Badge verrouillé'}</p>
            <div class="badge-showcase-meta">
              <span class="badge-rarity ${badge.rarity}">${this.getRarityLabel(badge.rarity)}</span>
              <span class="badge-points">+${badge.points} pts</span>
            </div>
            ${isEarned && userBadge ? `
              <div class="badge-earned-date">
                Obtenu le ${this.formatDate(userBadge.earnedAt)}
              </div>
            ` : ''}
          </div>
          ${isEarned ? `
            <button class="btn-share-badge-modal" onclick="window.badgeSystem.shareBadge('${badge.id}')">
              Partager
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  setupModalTabs(modal) {
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const badges = modal.querySelectorAll('.showcase-badge');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter badges
        badges.forEach(badge => {
          if (category === 'all' || badge.dataset.category === category) {
            badge.style.display = 'flex';
          } else {
            badge.style.display = 'none';
          }
        });
      });
    });
  }

  shareBadge(badgeId) {
    const badge = this.badgeDefinitions[badgeId];
    if (!badge || !this.hasBadge(badgeId)) return;

    const shareText = `🏅 Je viens d'obtenir le badge "${badge.name}" sur Dazno ! ${badge.description} #Bitcoin #LightningNetwork`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      // API Web Share native
      navigator.share({
        title: `Badge: ${badge.name}`,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback vers presse-papiers
      navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(() => {
        this.showToast('Lien de partage copié dans le presse-papiers !');
      });
    }

    // Mark user as having shared (for social_sharer badge)
    if (window.progressTracker) {
      const progress = window.progressTracker.getUserProgress();
      progress.shared = true;
      window.progressTracker.saveProgress();
      this.checkAllBadges(); // Recheck badges
    }

    // Track sharing
    if (typeof umami !== 'undefined') {
      umami.track('badge-shared', { badgeId, badgeName: badge.name });
    }
  }

  setupEventListeners() {
    // Listen for progress events
    document.addEventListener('moduleComplete', () => {
      setTimeout(() => this.checkAllBadges(), 100);
    });

    document.addEventListener('pathComplete', () => {
      setTimeout(() => this.checkAllBadges(), 100);
    });

    // Check time-based badges periodically
    setInterval(() => {
      this.checkTimeBadges();
    }, 60000); // Check every minute

    // Check badges on page load
    setTimeout(() => this.checkAllBadges(), 2000);
  }

  checkTimeBadges() {
    const timeBasedBadges = ['early_bird', 'night_owl'];
    timeBasedBadges.forEach(badgeId => {
      if (!this.hasBadge(badgeId)) {
        const badge = this.badgeDefinitions[badgeId];
        if (badge && badge.condition({})) {
          this.awardBadge(badgeId);
        }
      }
    });
  }

  updateBadgeDisplay() {
    // Update badge count
    document.querySelectorAll('.badges-count, .badge-count').forEach(el => {
      el.textContent = this.userBadges.length;
    });

    // Update badges grid
    const badgesGrid = document.getElementById('badges-grid');
    if (badgesGrid) {
      badgesGrid.innerHTML = this.renderBadges();
    }
  }

  playBadgeSound(rarity) {
    if (window.gamification && !window.gamification.user.soundsMuted) {
      const soundFile = {
        'common': '/assets/sounds/badge-common.mp3',
        'uncommon': '/assets/sounds/badge-uncommon.mp3', 
        'rare': '/assets/sounds/badge-rare.mp3',
        'epic': '/assets/sounds/badge-epic.mp3',
        'legendary': '/assets/sounds/badge-legendary.mp3'
      }[rarity] || '/assets/sounds/badge-common.mp3';

      const audio = new Audio(soundFile);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Badge sound failed:', e));
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // === UTILITY METHODS ===
  getTotalBadgePoints() {
    return this.userBadges.reduce((total, userBadge) => {
      const badge = this.badgeDefinitions[userBadge.id];
      return total + (badge ? badge.points : 0);
    }, 0);
  }

  getRarityLabel(rarity) {
    const labels = {
      'common': 'Commun',
      'uncommon': 'Peu commun',
      'rare': 'Rare',
      'epic': 'Épique',
      'legendary': 'Légendaire'
    };
    return labels[rarity] || rarity;
  }

  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  }

  saveUserBadges() {
    localStorage.setItem('dazno_user_badges', JSON.stringify(this.userBadges));
  }

  // === PUBLIC API ===
  getUserBadges() {
    return [...this.userBadges];
  }

  getBadgeDefinition(badgeId) {
    return this.badgeDefinitions[badgeId];
  }

  forceCheckBadges() {
    this.checkAllBadges();
  }

  resetBadges() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous vos badges ?')) {
      this.userBadges = [];
      this.saveUserBadges();
      this.updateBadgeDisplay();
      this.showToast('Badges réinitialisés');
    }
  }

  exportBadges() {
    const data = {
      badges: this.userBadges,
      exportedAt: new Date().toISOString(),
      totalPoints: this.getTotalBadgePoints()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dazno-badges-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Styles CSS pour le système de badges
const badgeStyles = `
<style>
/* === BADGE CONTAINER === */
.user-badges-container {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: var(--space-lg);
  margin: var(--space-lg) 0;
  border: 1px solid var(--border-color);
}

.badges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.badges-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.badges-count {
  background: var(--lightning-purple);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badges-grid {
  display: grid;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.no-badges {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  padding: var(--space-lg);
}

.badge-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--bg-primary);
  border-radius: 8px;
  border-left: 4px solid;
  transition: all 0.2s ease;
  cursor: pointer;
}

.badge-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

/* Rarity Colors */
.badge-item.common { border-left-color: #9CA3AF; }
.badge-item.uncommon { border-left-color: #22C55E; }
.badge-item.rare { border-left-color: #3B82F6; }
.badge-item.epic { border-left-color: #A855F7; }
.badge-item.legendary { border-left-color: #F59E0B; }

.badge-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.badge-info {
  flex: 1;
  min-width: 0;
}

.badge-name {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.badge-points {
  font-size: 0.75rem;
  color: var(--lightning-purple);
  font-weight: 500;
}

.badge-date {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-align: right;
}

.badges-actions {
  text-align: center;
}

.btn-view-all-badges {
  padding: var(--space-sm) var(--space-lg);
  background: transparent;
  border: 2px solid var(--lightning-purple);
  color: var(--lightning-purple);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-view-all-badges:hover {
  background: var(--lightning-purple);
  color: white;
}

/* === FLOATING WIDGET === */
.floating-badge-widget {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  transition: all 0.3s ease;
}

.badge-widget-toggle {
  background: var(--gradient-lightning);
  border: none;
  color: white;
  padding: var(--space-md);
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  transition: all 0.2s ease;
}

.badge-widget-toggle:hover {
  transform: scale(1.05);
}

.badge-widget-content {
  position: absolute;
  right: 0;
  bottom: calc(100% + var(--space-sm));
  width: 300px;
  background: var(--bg-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.floating-badge-widget.expanded .badge-widget-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* === BADGE NOTIFICATIONS === */
.badge-notification {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 350px;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10001;
}

.badge-notification.show {
  opacity: 1;
  transform: translateX(0);
}

.badge-notification.common { border-left: 4px solid #9CA3AF; }
.badge-notification.uncommon { border-left: 4px solid #22C55E; }
.badge-notification.rare { border-left: 4px solid #3B82F6; }
.badge-notification.epic { border-left: 4px solid #A855F7; }
.badge-notification.legendary { 
  border-left: 4px solid #F59E0B;
  animation: legendary-glow 2s infinite;
}

@keyframes legendary-glow {
  0%, 100% { box-shadow: var(--shadow-xl); }
  50% { box-shadow: var(--shadow-xl), 0 0 20px rgba(245, 158, 11, 0.5); }
}

.notification-header {
  background: var(--gradient-lightning);
  color: white;
  padding: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.notification-content {
  padding: var(--space-lg);
}

.badge-preview {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.badge-icon-large {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.badge-details h5 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.badge-details p {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.badge-points {
  background: var(--lightning-yellow);
  color: var(--dark-bg);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-message {
  font-style: italic;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.notification-actions {
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-primary);
  display: flex;
  gap: var(--space-sm);
  justify-content: space-between;
}

.btn-share-badge {
  background: var(--lightning-blue);
  color: white;
  border: none;
  padding: var(--space-xs) var(--space-md);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-share-badge:hover {
  background: var(--lightning-blue-hover);
  transform: scale(1.05);
}

.btn-close-notification {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  font-size: 1.2rem;
}

/* === BADGE MODAL === */
.badge-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.badge-modal.show {
  opacity: 1;
  visibility: visible;
}

.badge-modal .modal-content {
  background: var(--bg-surface);
  border-radius: 16px;
  width: 90vw;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: var(--space-xs);
}

.modal-body {
  padding: var(--space-xl);
}

.badges-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: var(--bg-primary);
  border-radius: 12px;
}

.badges-stats .stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--lightning-purple);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.category-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  overflow-x: auto;
}

.tab-btn {
  padding: var(--space-sm) var(--space-lg);
  background: transparent;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn.active,
.tab-btn:hover {
  border-color: var(--lightning-purple);
  color: var(--lightning-purple);
  background: rgba(107, 70, 193, 0.1);
}

.badges-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.showcase-badge {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.showcase-badge.earned {
  border-left: 4px solid;
}

.showcase-badge.earned.common { border-left-color: #9CA3AF; }
.showcase-badge.earned.uncommon { border-left-color: #22C55E; }
.showcase-badge.earned.rare { border-left-color: #3B82F6; }
.showcase-badge.earned.epic { border-left-color: #A855F7; }
.showcase-badge.earned.legendary { border-left-color: #F59E0B; }

.showcase-badge.locked {
  opacity: 0.6;
}

.showcase-badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.badge-showcase-icon {
  font-size: 2rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--bg-surface);
  border-radius: 50%;
}

.badge-showcase-info {
  flex: 1;
  min-width: 0;
}

.badge-showcase-name {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.badge-showcase-desc {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.badge-showcase-meta {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.badge-rarity {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-rarity.common { background: #F3F4F6; color: #374151; }
.badge-rarity.uncommon { background: #DCFCE7; color: #166534; }
.badge-rarity.rare { background: #DBEAFE; color: #1E40AF; }
.badge-rarity.epic { background: #F3E8FF; color: #7C2D12; }
.badge-rarity.legendary { background: #FEF3C7; color: #92400E; }

.badge-earned-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: italic;
}

.btn-share-badge-modal {
  align-self: flex-start;
  padding: var(--space-xs) var(--space-sm);
  background: var(--lightning-blue);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-share-badge-modal:hover {
  background: var(--lightning-blue-hover);
  transform: scale(1.05);
}

/* === TOAST === */
.badge-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--dark-surface);
  color: white;
  padding: var(--space-md) var(--space-lg);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10002;
}

.badge-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .badge-notification {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
  
  .floating-badge-widget {
    right: 10px;
  }
  
  .badge-widget-content {
    width: 280px;
  }
  
  .badges-showcase {
    grid-template-columns: 1fr;
  }
  
  .showcase-badge {
    flex-direction: column;
    text-align: center;
  }
  
  .badge-showcase-icon {
    align-self: center;
  }
  
  .category-tabs {
    gap: var(--space-xs);
  }
  
  .tab-btn {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.875rem;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', badgeStyles);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.badgeSystem = new BadgeSystem();
});