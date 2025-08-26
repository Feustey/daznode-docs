/**
 * Système de Parcours d'Apprentissage Adaptatifs
 * IA de personnalisation et recommandations intelligentes
 */

class AdaptiveLearningSystem {
  constructor() {
    this.userProfile = this.initializeUserProfile();
    this.learningPaths = this.loadLearningPaths();
    this.contentLibrary = this.loadContentLibrary();
    this.adaptiveEngine = new AdaptiveEngine();
    this.init();
  }

  initializeUserProfile() {
    const saved = localStorage.getItem('userLearningProfile');
    return saved ? JSON.parse(saved) : {
      id: this.generateId(),
      level: 'beginner',
      interests: [],
      learningStyle: null,
      pace: 'moderate',
      goals: [],
      strengths: [],
      weaknesses: [],
      completedContent: [],
      timePreferences: {
        dailyMinutes: 30,
        preferredTime: 'evening'
      },
      performance: {
        quizScores: [],
        completionRates: {},
        engagementScore: 0
      }
    };
  }

  generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  loadLearningPaths() {
    return {
      'bitcoin_fundamentals': {
        id: 'bitcoin_fundamentals',
        name: '🎯 Débutant Complet',
        icon: '₿',
        description: 'Maîtrisez les bases du Bitcoin',
        estimatedTime: 5,
        difficulty: 'beginner',
        modules: [
          {
            id: 'btc_101',
            title: 'Bitcoin 101',
            duration: 60,
            type: 'video',
            topics: ['histoire', 'blockchain', 'décentralisation'],
            prerequisites: []
          },
          {
            id: 'wallets_basics',
            title: 'Portefeuilles',
            duration: 45,
            type: 'interactive',
            topics: ['sécurité', 'types', 'configuration'],
            prerequisites: ['btc_101']
          },
          {
            id: 'first_transaction',
            title: 'Première Transaction',
            duration: 30,
            type: 'hands-on',
            topics: ['envoi', 'réception', 'frais'],
            prerequisites: ['wallets_basics']
          }
        ],
        assessments: [
          {
            id: 'btc_quiz_1',
            type: 'quiz',
            difficulty: 'easy',
            questions: 10
          }
        ],
        rewards: {
          xp: 500,
          badges: ['bitcoin_starter'],
          certificates: ['bitcoin_basics_cert']
        }
      },
      'lightning_explorer': {
        id: 'lightning_explorer',
        name: '⚡ Lightning Explorer',
        icon: '⚡',
        description: 'Explorez le Lightning Network',
        estimatedTime: 10,
        difficulty: 'intermediate',
        modules: [
          {
            id: 'ln_intro',
            title: 'Introduction Lightning',
            duration: 90,
            type: 'video',
            topics: ['canaux', 'routing', 'capacité'],
            prerequisites: ['bitcoin_fundamentals']
          },
          {
            id: 'channels_deep',
            title: 'Canaux de Paiement',
            duration: 120,
            type: 'interactive',
            topics: ['ouverture', 'fermeture', 'équilibrage'],
            prerequisites: ['ln_intro']
          },
          {
            id: 'routing_mastery',
            title: 'Maîtrise du Routage',
            duration: 150,
            type: 'simulation',
            topics: ['pathfinding', 'fees', 'probabilités'],
            prerequisites: ['channels_deep']
          },
          {
            id: 'liquidity_mgmt',
            title: 'Gestion de Liquidité',
            duration: 180,
            type: 'case-study',
            topics: ['inbound', 'outbound', 'loop'],
            prerequisites: ['routing_mastery']
          }
        ],
        assessments: [
          {
            id: 'ln_practical',
            type: 'practical',
            difficulty: 'medium',
            tasks: 5
          }
        ],
        rewards: {
          xp: 1000,
          badges: ['lightning_expert'],
          certificates: ['lightning_specialist_cert']
        }
      },
      'node_master': {
        id: 'node_master',
        name: '🏆 Node Master',
        icon: '🖥️',
        description: 'Devenez opérateur de nœud professionnel',
        estimatedTime: 20,
        difficulty: 'advanced',
        modules: [
          {
            id: 'node_setup',
            title: 'Installation LND/CLN',
            duration: 240,
            type: 'tutorial',
            topics: ['hardware', 'software', 'configuration'],
            prerequisites: ['lightning_explorer']
          },
          {
            id: 'channel_strategy',
            title: 'Stratégie de Canaux',
            duration: 180,
            type: 'workshop',
            topics: ['sélection', 'taille', 'partenaires'],
            prerequisites: ['node_setup']
          },
          {
            id: 'roi_optimization',
            title: 'Optimisation ROI',
            duration: 300,
            type: 'advanced',
            topics: ['fees', 'routing', 'automation'],
            prerequisites: ['channel_strategy']
          },
          {
            id: 'monitoring_tools',
            title: 'Monitoring Avancé',
            duration: 150,
            type: 'hands-on',
            topics: ['metrics', 'alerts', 'dashboards'],
            prerequisites: ['roi_optimization']
          },
          {
            id: 'troubleshooting',
            title: 'Résolution de Problèmes',
            duration: 200,
            type: 'scenarios',
            topics: ['force-close', 'stuck-payments', 'recovery'],
            prerequisites: ['monitoring_tools']
          }
        ],
        assessments: [
          {
            id: 'node_certification',
            type: 'certification',
            difficulty: 'hard',
            duration: 120
          }
        ],
        rewards: {
          xp: 2000,
          badges: ['node_operator', 'roi_champion'],
          certificates: ['professional_node_operator_cert']
        }
      }
    };
  }

  loadContentLibrary() {
    return {
      videos: [],
      articles: [],
      simulations: [],
      quizzes: [],
      exercises: []
    };
  }

  init() {
    this.analyzeUserBehavior();
    this.setupEventListeners();
    this.renderPathSelection();
    this.startAdaptiveEngine();
  }

  analyzeUserBehavior() {
    // Analyse le comportement pour personnaliser l'expérience
    const analytics = {
      clickPatterns: [],
      scrollDepth: [],
      timeOnContent: {},
      interactionRate: 0,
      preferredContentTypes: []
    };

    // Track user interactions
    document.addEventListener('click', (e) => {
      analytics.clickPatterns.push({
        target: e.target.tagName,
        time: Date.now(),
        path: e.composedPath()
      });
      this.updateLearningStyle(analytics);
    });

    // Track scroll behavior
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const depth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
        analytics.scrollDepth.push(depth);
        this.adjustContentPace(depth);
      }, 150);
    });

    // Track time spent
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - startTime;
      this.updateEngagementScore(timeSpent);
    });
  }

  updateLearningStyle(analytics) {
    // Détermine le style d'apprentissage basé sur le comportement
    const styles = {
      visual: 0,
      textual: 0,
      interactive: 0,
      practical: 0
    };

    // Analyse des patterns
    analytics.clickPatterns.forEach(pattern => {
      if (pattern.target === 'VIDEO') styles.visual += 2;
      if (pattern.target === 'ARTICLE') styles.textual += 2;
      if (pattern.target === 'BUTTON') styles.interactive += 1;
      if (pattern.target === 'CODE') styles.practical += 2;
    });

    // Détermine le style dominant
    const dominantStyle = Object.keys(styles).reduce((a, b) => 
      styles[a] > styles[b] ? a : b
    );

    if (this.userProfile.learningStyle !== dominantStyle) {
      this.userProfile.learningStyle = dominantStyle;
      this.saveProfile();
      this.adaptContent();
    }
  }

  adjustContentPace(scrollDepth) {
    // Ajuste le rythme basé sur la vitesse de lecture
    if (scrollDepth < 0.3 && Date.now() - this.lastScrollCheck > 30000) {
      this.userProfile.pace = 'slow';
    } else if (scrollDepth > 0.8 && Date.now() - this.lastScrollCheck < 5000) {
      this.userProfile.pace = 'fast';
    }
    this.lastScrollCheck = Date.now();
  }

  updateEngagementScore(timeSpent) {
    const expectedTime = 30 * 60 * 1000; // 30 minutes
    const ratio = timeSpent / expectedTime;
    this.userProfile.performance.engagementScore = 
      Math.min(100, Math.round(ratio * 100));
    this.saveProfile();
  }

  startAdaptiveEngine() {
    this.adaptiveEngine.start(this.userProfile, (recommendations) => {
      this.displayRecommendations(recommendations);
    });
  }

  renderPathSelection() {
    const container = document.createElement('div');
    container.className = 'adaptive-paths-container';
    container.innerHTML = `
      <h2>Parcours d'Apprentissage Personnalisés</h2>
      <div class="path-assessment">
        <button class="btn-assessment" onclick="window.adaptiveLearning.startAssessment()">
          🎯 Évaluer mon niveau
        </button>
      </div>
      <div class="learning-paths-grid">
        ${Object.values(this.learningPaths).map(path => this.renderPath(path)).join('')}
      </div>
      <div id="recommendations" class="recommendations-section"></div>
    `;

    const target = document.getElementById('learning-paths') || document.body;
    target.appendChild(container);
  }

  renderPath(path) {
    const progress = this.calculatePathProgress(path.id);
    const isRecommended = this.isPathRecommended(path);
    
    return `
      <div class="learning-path-card ${isRecommended ? 'recommended' : ''}" 
           data-path="${path.id}">
        ${isRecommended ? '<span class="recommended-badge">Recommandé</span>' : ''}
        <div class="path-icon">${path.icon}</div>
        <h3>${path.name}</h3>
        <p>${path.description}</p>
        
        <div class="path-meta">
          <span class="path-duration">
            <svg class="icon-clock" width="16" height="16">
              <use href="#icon-clock"></use>
            </svg>
            ${path.estimatedTime}h
          </span>
          <span class="path-difficulty difficulty-${path.difficulty}">
            ${this.getDifficultyLabel(path.difficulty)}
          </span>
        </div>
        
        <div class="path-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${Math.round(progress)}% complété</span>
        </div>
        
        <div class="path-modules">
          <h4>Modules (${path.modules.length})</h4>
          <ul class="modules-list">
            ${path.modules.slice(0, 3).map(module => `
              <li class="module-item ${this.isModuleCompleted(module.id) ? 'completed' : ''}">
                <span class="module-status"></span>
                <span class="module-title">${module.title}</span>
                <span class="module-duration">${module.duration}min</span>
              </li>
            `).join('')}
            ${path.modules.length > 3 ? `
              <li class="more-modules">+${path.modules.length - 3} autres modules</li>
            ` : ''}
          </ul>
        </div>
        
        <button class="btn-start-path" onclick="window.adaptiveLearning.startPath('${path.id}')">
          ${progress > 0 ? 'Continuer' : 'Commencer'} le parcours
        </button>
      </div>
    `;
  }

  calculatePathProgress(pathId) {
    const path = this.learningPaths[pathId];
    if (!path) return 0;

    const completedModules = path.modules.filter(module => 
      this.userProfile.completedContent.includes(module.id)
    ).length;

    return (completedModules / path.modules.length) * 100;
  }

  isPathRecommended(path) {
    // Logique de recommandation basée sur le profil utilisateur
    if (this.userProfile.level === 'beginner' && path.difficulty === 'beginner') return true;
    if (this.userProfile.level === 'intermediate' && path.difficulty === 'intermediate') return true;
    if (this.userProfile.level === 'advanced' && path.difficulty === 'advanced') return true;
    
    // Recommandations basées sur les intérêts
    return path.modules.some(module => 
      module.topics.some(topic => this.userProfile.interests.includes(topic))
    );
  }

  isModuleCompleted(moduleId) {
    return this.userProfile.completedContent.includes(moduleId);
  }

  getDifficultyLabel(difficulty) {
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé'
    };
    return labels[difficulty] || difficulty;
  }

  startAssessment() {
    const assessment = new AssessmentQuiz();
    assessment.start((results) => {
      this.processAssessmentResults(results);
    });
  }

  processAssessmentResults(results) {
    // Mise à jour du profil basée sur l'évaluation
    this.userProfile.level = results.level;
    this.userProfile.interests = results.interests;
    this.userProfile.goals = results.goals;
    this.userProfile.strengths = results.strengths;
    this.userProfile.weaknesses = results.weaknesses;
    
    this.saveProfile();
    this.generatePersonalizedPath();
    this.showAssessmentResults(results);
  }

  generatePersonalizedPath() {
    const customPath = {
      id: 'custom_' + Date.now(),
      name: 'Parcours Personnalisé',
      modules: []
    };

    // Sélection intelligente des modules
    Object.values(this.learningPaths).forEach(path => {
      path.modules.forEach(module => {
        if (this.shouldIncludeModule(module)) {
          customPath.modules.push(module);
        }
      });
    });

    // Tri par difficulté et prérequis
    customPath.modules.sort((a, b) => {
      if (a.prerequisites.length !== b.prerequisites.length) {
        return a.prerequisites.length - b.prerequisites.length;
      }
      return a.duration - b.duration;
    });

    this.userProfile.currentPath = customPath;
    this.saveProfile();
    return customPath;
  }

  shouldIncludeModule(module) {
    // Vérifie si le module correspond au profil
    const topicMatch = module.topics.some(topic => 
      this.userProfile.interests.includes(topic) ||
      this.userProfile.weaknesses.includes(topic)
    );
    
    const styleMatch = this.userProfile.learningStyle === null ||
      module.type === this.getPreferredContentType();
    
    return topicMatch && styleMatch;
  }

  getPreferredContentType() {
    const typeMap = {
      'visual': 'video',
      'textual': 'article',
      'interactive': 'interactive',
      'practical': 'hands-on'
    };
    return typeMap[this.userProfile.learningStyle] || 'video';
  }

  startPath(pathId) {
    const path = this.learningPaths[pathId];
    if (!path) return;

    this.userProfile.currentPath = pathId;
    this.saveProfile();

    // Trouve le prochain module non complété
    const nextModule = path.modules.find(module => 
      !this.isModuleCompleted(module.id)
    );

    if (nextModule) {
      this.loadModule(nextModule);
    } else {
      this.showPathCompletion(path);
    }
  }

  loadModule(module) {
    const moduleLoader = new ModuleLoader();
    moduleLoader.load(module, {
      onComplete: (score) => this.completeModule(module, score),
      onProgress: (progress) => this.updateModuleProgress(module, progress),
      adaptiveSettings: this.getAdaptiveSettings()
    });
  }

  getAdaptiveSettings() {
    return {
      pace: this.userProfile.pace,
      difficulty: this.userProfile.level,
      hints: this.userProfile.weaknesses.length > 2,
      autoAdvance: this.userProfile.pace === 'fast',
      fontSize: this.userProfile.accessibility?.fontSize || 'medium',
      highContrast: this.userProfile.accessibility?.highContrast || false
    };
  }

  completeModule(module, score) {
    this.userProfile.completedContent.push(module.id);
    this.userProfile.performance.quizScores.push({
      moduleId: module.id,
      score: score,
      date: new Date().toISOString()
    });

    // Mise à jour des forces/faiblesses
    if (score >= 80) {
      module.topics.forEach(topic => {
        if (!this.userProfile.strengths.includes(topic)) {
          this.userProfile.strengths.push(topic);
        }
      });
    } else {
      module.topics.forEach(topic => {
        if (!this.userProfile.weaknesses.includes(topic)) {
          this.userProfile.weaknesses.push(topic);
        }
      });
    }

    this.saveProfile();
    this.recommendNextContent();
    
    // Trigger gamification
    if (window.gamification) {
      window.gamification.completeModule(module.id, score);
    }
  }

  updateModuleProgress(module, progress) {
    // Sauvegarde la progression en temps réel
    const progressKey = `progress_${module.id}`;
    localStorage.setItem(progressKey, progress);
  }

  recommendNextContent() {
    const recommendations = this.adaptiveEngine.getRecommendations(
      this.userProfile,
      this.learningPaths,
      3
    );
    
    this.displayRecommendations(recommendations);
  }

  displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    if (!container) return;

    container.innerHTML = `
      <h3>Contenu Recommandé Pour Vous</h3>
      <div class="recommendations-grid">
        ${recommendations.map(rec => `
          <div class="recommendation-card">
            <span class="match-score">${rec.matchScore}% match</span>
            <h4>${rec.title}</h4>
            <p>${rec.reason}</p>
            <button onclick="window.adaptiveLearning.loadContent('${rec.id}')">
              Commencer
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  showAssessmentResults(results) {
    const modal = document.createElement('div');
    modal.className = 'assessment-results-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Votre Profil d'Apprentissage</h2>
        
        <div class="profile-summary">
          <div class="level-badge level-${results.level}">
            ${this.getDifficultyLabel(results.level)}
          </div>
          
          <div class="interests">
            <h4>Vos Intérêts</h4>
            <div class="tags">
              ${results.interests.map(interest => 
                `<span class="tag">${interest}</span>`
              ).join('')}
            </div>
          </div>
          
          <div class="strengths">
            <h4>Points Forts</h4>
            <ul>
              ${results.strengths.map(strength => 
                `<li>${strength}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div class="areas-to-improve">
            <h4>À Améliorer</h4>
            <ul>
              ${results.weaknesses.map(weakness => 
                `<li>${weakness}</li>`
              ).join('')}
            </ul>
          </div>
        </div>
        
        <div class="recommended-path">
          <h3>Parcours Recommandé</h3>
          <p>Basé sur votre profil, nous recommandons de commencer par:</p>
          <button class="btn-primary" onclick="window.adaptiveLearning.startRecommendedPath()">
            Commencer Mon Parcours Personnalisé
          </button>
        </div>
        
        <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
  }

  startRecommendedPath() {
    const customPath = this.generatePersonalizedPath();
    this.startPath(customPath.id);
  }

  showPathCompletion(path) {
    const celebration = document.createElement('div');
    celebration.className = 'path-completion-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="fireworks"></div>
        <h1>🎉 Félicitations!</h1>
        <h2>Vous avez complété ${path.name}</h2>
        
        <div class="completion-stats">
          <div class="stat">
            <span class="stat-value">${path.modules.length}</span>
            <span class="stat-label">Modules Complétés</span>
          </div>
          <div class="stat">
            <span class="stat-value">${path.rewards.xp}</span>
            <span class="stat-label">XP Gagnés</span>
          </div>
          <div class="stat">
            <span class="stat-value">${path.rewards.badges.length}</span>
            <span class="stat-label">Badges Débloqués</span>
          </div>
        </div>
        
        <div class="next-steps">
          <h3>Prochaines Étapes</h3>
          <button onclick="window.adaptiveLearning.suggestNextPath()">
            Voir les Parcours Suivants
          </button>
          <button onclick="window.adaptiveLearning.downloadCertificate('${path.id}')">
            Télécharger le Certificat
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(celebration);
    this.playCompletionAnimation();
  }

  playCompletionAnimation() {
    // Animation de feux d'artifice
    const fireworks = new Fireworks();
    fireworks.start();
    setTimeout(() => fireworks.stop(), 5000);
  }

  suggestNextPath() {
    // Suggère le prochain parcours basé sur la progression
    const completedPaths = this.userProfile.completedPaths || [];
    const availablePaths = Object.values(this.learningPaths).filter(path => 
      !completedPaths.includes(path.id)
    );
    
    // Tri par pertinence
    availablePaths.sort((a, b) => {
      const scoreA = this.calculatePathRelevance(a);
      const scoreB = this.calculatePathRelevance(b);
      return scoreB - scoreA;
    });
    
    this.displayPathSuggestions(availablePaths.slice(0, 3));
  }

  calculatePathRelevance(path) {
    let score = 0;
    
    // Difficulté appropriée
    if (path.difficulty === this.getNextDifficulty()) score += 50;
    
    // Intérêts correspondants
    path.modules.forEach(module => {
      module.topics.forEach(topic => {
        if (this.userProfile.interests.includes(topic)) score += 10;
      });
    });
    
    // Prérequis satisfaits
    const prereqsSatisfied = path.modules.every(module => 
      module.prerequisites.every(prereq => 
        this.userProfile.completedContent.includes(prereq)
      )
    );
    if (prereqsSatisfied) score += 30;
    
    return score;
  }

  getNextDifficulty() {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = difficulties.indexOf(this.userProfile.level);
    return difficulties[Math.min(currentIndex + 1, difficulties.length - 1)];
  }

  displayPathSuggestions(paths) {
    const modal = document.createElement('div');
    modal.className = 'path-suggestions-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Parcours Suivants Recommandés</h2>
        <div class="suggested-paths">
          ${paths.map(path => this.renderPath(path)).join('')}
        </div>
        <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
          Fermer
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
  }

  downloadCertificate(pathId) {
    const path = this.learningPaths[pathId];
    if (!path) return;
    
    // Génération du certificat
    const certificate = new CertificateGenerator();
    certificate.generate({
      userName: this.userProfile.username || 'Lightning Learner',
      courseName: path.name,
      completionDate: new Date().toLocaleDateString('fr-FR'),
      courseHours: path.estimatedTime,
      certificateId: this.generateCertificateId()
    });
  }

  generateCertificateId() {
    return 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  saveProfile() {
    localStorage.setItem('userLearningProfile', JSON.stringify(this.userProfile));
  }

  setupEventListeners() {
    // Écoute les événements de progression
    document.addEventListener('moduleProgress', (e) => {
      this.updateModuleProgress(e.detail.module, e.detail.progress);
    });
    
    document.addEventListener('contentInteraction', (e) => {
      this.trackInteraction(e.detail);
    });
  }

  trackInteraction(interaction) {
    // Tracking des interactions pour l'adaptation
    if (!this.userProfile.interactions) {
      this.userProfile.interactions = [];
    }
    
    this.userProfile.interactions.push({
      type: interaction.type,
      content: interaction.contentId,
      timestamp: Date.now(),
      duration: interaction.duration
    });
    
    // Limite à 100 dernières interactions
    if (this.userProfile.interactions.length > 100) {
      this.userProfile.interactions = this.userProfile.interactions.slice(-100);
    }
    
    this.saveProfile();
  }

  adaptContent() {
    // Adapte le contenu basé sur le profil mis à jour
    const adaptations = {
      visual: () => {
        document.querySelectorAll('.content-text').forEach(el => {
          el.classList.add('compact');
        });
        document.querySelectorAll('.content-video').forEach(el => {
          el.classList.add('emphasized');
        });
      },
      textual: () => {
        document.querySelectorAll('.content-video').forEach(el => {
          el.classList.add('compact');
        });
        document.querySelectorAll('.content-text').forEach(el => {
          el.classList.add('emphasized');
        });
      },
      interactive: () => {
        document.querySelectorAll('.interactive-element').forEach(el => {
          el.classList.add('highlighted');
        });
      },
      practical: () => {
        document.querySelectorAll('.code-example, .exercise').forEach(el => {
          el.classList.add('emphasized');
        });
      }
    };
    
    const adaptation = adaptations[this.userProfile.learningStyle];
    if (adaptation) adaptation();
  }
}

// Moteur d'Adaptation Intelligent
class AdaptiveEngine {
  constructor() {
    this.model = this.initializeModel();
  }

  initializeModel() {
    // Modèle simplifié d'apprentissage adaptatif
    return {
      weights: {
        difficulty: 0.3,
        interests: 0.25,
        performance: 0.2,
        engagement: 0.15,
        time: 0.1
      }
    };
  }

  start(profile, callback) {
    // Analyse continue du profil
    this.analyzeInterval = setInterval(() => {
      const recommendations = this.generateRecommendations(profile);
      callback(recommendations);
    }, 30000); // Toutes les 30 secondes
  }

  stop() {
    clearInterval(this.analyzeInterval);
  }

  generateRecommendations(profile) {
    const recommendations = [];
    
    // Analyse des performances récentes
    const recentScores = profile.performance.quizScores.slice(-5);
    const avgScore = recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length;
    
    // Ajustement de la difficulté
    let targetDifficulty = profile.level;
    if (avgScore > 85) {
      targetDifficulty = this.increaseDifficulty(targetDifficulty);
    } else if (avgScore < 60) {
      targetDifficulty = this.decreaseDifficulty(targetDifficulty);
    }
    
    // Génération des recommandations
    const contentPool = this.getContentPool(targetDifficulty, profile.interests);
    
    contentPool.forEach(content => {
      const score = this.calculateMatchScore(content, profile);
      recommendations.push({
        id: content.id,
        title: content.title,
        matchScore: Math.round(score),
        reason: this.getRecommendationReason(content, profile)
      });
    });
    
    // Tri par score de correspondance
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    
    return recommendations.slice(0, 5);
  }

  calculateMatchScore(content, profile) {
    let score = 0;
    
    // Correspondance difficulté
    if (content.difficulty === profile.level) {
      score += this.model.weights.difficulty * 100;
    }
    
    // Correspondance intérêts
    const interestMatch = content.topics.filter(topic => 
      profile.interests.includes(topic)
    ).length;
    score += (interestMatch / content.topics.length) * this.model.weights.interests * 100;
    
    // Performance sur contenu similaire
    const similarPerformance = this.getSimilarContentPerformance(content, profile);
    score += similarPerformance * this.model.weights.performance;
    
    // Score d'engagement
    score += profile.performance.engagementScore * this.model.weights.engagement;
    
    // Préférence temporelle
    const timeMatch = this.calculateTimeMatch(content.duration, profile.timePreferences.dailyMinutes);
    score += timeMatch * this.model.weights.time * 100;
    
    return Math.min(100, score);
  }

  getRecommendationReason(content, profile) {
    const reasons = [];
    
    if (content.difficulty === profile.level) {
      reasons.push('Correspond à votre niveau');
    }
    
    const matchingTopics = content.topics.filter(topic => 
      profile.interests.includes(topic)
    );
    if (matchingTopics.length > 0) {
      reasons.push(`Traite de: ${matchingTopics.join(', ')}`);
    }
    
    if (profile.weaknesses.some(w => content.topics.includes(w))) {
      reasons.push('Renforce vos points faibles');
    }
    
    return reasons.join(' • ') || 'Contenu recommandé pour vous';
  }

  getSimilarContentPerformance(content, profile) {
    const similar = profile.performance.quizScores.filter(score => 
      score.topics?.some(topic => content.topics.includes(topic))
    );
    
    if (similar.length === 0) return 50; // Score neutre
    
    return similar.reduce((sum, s) => sum + s.score, 0) / similar.length;
  }

  calculateTimeMatch(contentDuration, preferredDuration) {
    const ratio = contentDuration / preferredDuration;
    if (ratio >= 0.8 && ratio <= 1.2) return 1;
    if (ratio < 0.8) return ratio;
    return 1 / ratio;
  }

  increaseDifficulty(current) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const index = levels.indexOf(current);
    return levels[Math.min(index + 1, levels.length - 1)];
  }

  decreaseDifficulty(current) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const index = levels.indexOf(current);
    return levels[Math.max(index - 1, 0)];
  }

  getContentPool(difficulty, interests) {
    // Simule une base de contenu
    return [
      {
        id: 'content_1',
        title: 'Optimisation des Canaux Lightning',
        difficulty: difficulty,
        topics: ['lightning', 'optimization', 'channels'],
        duration: 45
      },
      {
        id: 'content_2',
        title: 'Sécurité des Wallets Bitcoin',
        difficulty: difficulty,
        topics: ['bitcoin', 'security', 'wallets'],
        duration: 30
      },
      {
        id: 'content_3',
        title: 'Routing et Pathfinding',
        difficulty: difficulty,
        topics: ['lightning', 'routing', 'algorithms'],
        duration: 60
      }
    ];
  }

  getRecommendations(profile, paths, count = 3) {
    return this.generateRecommendations(profile).slice(0, count);
  }
}

// Classes auxiliaires nécessaires
class AssessmentQuiz {
  start(callback) {
    // Implémentation du quiz d'évaluation
    const questions = this.getQuestions();
    // ... logique du quiz
    
    // Résultats simulés
    setTimeout(() => {
      callback({
        level: 'intermediate',
        interests: ['lightning', 'node-operation'],
        goals: ['roi-optimization', 'professional-node'],
        strengths: ['technical-understanding', 'problem-solving'],
        weaknesses: ['liquidity-management', 'fee-optimization']
      });
    }, 100);
  }

  getQuestions() {
    return [
      {
        question: "Quelle est votre expérience avec Bitcoin?",
        options: ["Débutant", "Intermédiaire", "Avancé", "Expert"]
      },
      {
        question: "Qu'est-ce qui vous intéresse le plus?",
        options: ["Trading", "Technologie", "Paiements", "Mining"]
      }
    ];
  }
}

class ModuleLoader {
  load(module, options) {
    // Charge et affiche un module
    console.log('Loading module:', module.id);
    
    // Simulation du chargement
    setTimeout(() => {
      if (options.onComplete) {
        options.onComplete(Math.floor(Math.random() * 40) + 60);
      }
    }, 2000);
  }
}

class CertificateGenerator {
  generate(data) {
    // Génère un certificat PDF
    console.log('Generating certificate:', data);
    
    // Simulation de génération
    const blob = new Blob(['Certificate for ' + data.userName], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${data.certificateId}.pdf`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

class Fireworks {
  start() {
    console.log('🎆 Fireworks started!');
  }
  
  stop() {
    console.log('Fireworks stopped');
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.adaptiveLearning = new AdaptiveLearningSystem();
});