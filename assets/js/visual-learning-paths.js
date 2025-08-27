/**
 * Parcours Visuels avec Barres de Progression - Priorité Critique
 * Interface moderne pour suivre la progression d'apprentissage
 */

class VisualLearningPaths {
  constructor() {
    this.pathsData = this.loadPathsData();
    this.userProgress = null;
    this.init();
  }

  loadPathsData() {
    return {
      'bitcoin-basics': {
        id: 'bitcoin-basics',
        title: '₿ Parcours Bitcoin Fondamentaux',
        description: 'Maîtrisez les bases de Bitcoin de zéro à héros',
        color: '#F7931A',
        gradient: 'linear-gradient(135deg, #F7931A 0%, #FF6B35 100%)',
        estimatedTime: '3-4 semaines',
        difficulty: 'Débutant',
        modules: [
          {
            id: 'bitcoin-basics-intro',
            title: 'Qu\'est-ce que Bitcoin ?',
            description: 'Histoire, concept et révolution monétaire',
            duration: 45,
            type: 'theory',
            url: '/getting-started/',
            prerequisites: [],
            learningObjectives: [
              'Comprendre l\'histoire de Bitcoin',
              'Saisir les problèmes résolus par Bitcoin',
              'Connaître les acteurs clés'
            ]
          },
          {
            id: 'bitcoin-fundamentals',
            title: 'Comment fonctionne Bitcoin',
            description: 'Blockchain, transactions et sécurité',
            duration: 60,
            type: 'technical',
            url: '/bitcoin/',
            prerequisites: ['bitcoin-basics-intro'],
            learningObjectives: [
              'Comprendre la blockchain',
              'Maîtriser les transactions',
              'Connaître les mécanismes de sécurité'
            ]
          },
          {
            id: 'bitcoin-wallets',
            title: 'Portefeuilles Bitcoin',
            description: 'Types, sécurité et meilleures pratiques',
            duration: 40,
            type: 'practical',
            url: '/wallets/',
            prerequisites: ['bitcoin-fundamentals'],
            learningObjectives: [
              'Choisir le bon wallet',
              'Sécuriser ses bitcoins',
              'Effectuer des transactions'
            ]
          },
          {
            id: 'bitcoin-economics',
            title: 'Économie Bitcoin',
            description: 'Inflation, halving et adoption',
            duration: 50,
            type: 'theory',
            url: '/bitcoin/evolution-prix/',
            prerequisites: ['bitcoin-wallets'],
            learningObjectives: [
              'Comprendre la politique monétaire',
              'Analyser les cycles de marché',
              'Évaluer l\'adoption mondiale'
            ]
          }
        ]
      },
      'lightning-network': {
        id: 'lightning-network',
        title: '⚡ Parcours Lightning Network',
        description: 'Maîtrisez les paiements Bitcoin instantanés',
        color: '#6366F1',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        estimatedTime: '2-3 semaines',
        difficulty: 'Intermédiaire',
        modules: [
          {
            id: 'lightning-basics',
            title: 'Introduction Lightning',
            description: 'Concept et avantages du Lightning Network',
            duration: 50,
            type: 'theory',
            url: '/lightning-network/',
            prerequisites: ['bitcoin-fundamentals'],
            learningObjectives: [
              'Comprendre les limites de Bitcoin',
              'Saisir le concept de Lightning',
              'Identifier les cas d\'usage'
            ]
          },
          {
            id: 'lightning-channels',
            title: 'Canaux de Paiement',
            description: 'Ouverture, gestion et fermeture des canaux',
            duration: 70,
            type: 'technical',
            url: '/lightning-network/channels/',
            prerequisites: ['lightning-basics'],
            learningObjectives: [
              'Créer des canaux de paiement',
              'Gérer la liquidité',
              'Optimiser les frais'
            ]
          },
          {
            id: 'lightning-routing',
            title: 'Routage et Pathfinding',
            description: 'Comment les paiements trouvent leur chemin',
            duration: 60,
            type: 'technical',
            url: '/lightning-network/basics/',
            prerequisites: ['lightning-channels'],
            learningObjectives: [
              'Comprendre le routage',
              'Optimiser les chemins',
              'Gérer les échecs de paiement'
            ]
          },
          {
            id: 'lightning-practical',
            title: 'Premier Paiement Lightning',
            description: 'Utilisez Lightning en pratique',
            duration: 40,
            type: 'practical',
            url: '/lightning-network/getting-started/',
            prerequisites: ['lightning-routing'],
            learningObjectives: [
              'Configurer un wallet Lightning',
              'Effectuer des paiements',
              'Recevoir des paiements'
            ]
          }
        ]
      },
      'node-operation': {
        id: 'node-operation',
        title: '🖥️ Parcours Opérateur de Nœud',
        description: 'Monétisez votre infrastructure Lightning',
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        estimatedTime: '4-5 semaines',
        difficulty: 'Avancé',
        modules: [
          {
            id: 'node-basics',
            title: 'Bases des Nœuds Lightning',
            description: 'Types de nœuds et rôles dans le réseau',
            duration: 45,
            type: 'theory',
            url: '/lightning-network/optimization/',
            prerequisites: ['lightning-practical'],
            learningObjectives: [
              'Types de nœuds Lightning',
              'Rôles dans le réseau',
              'Modèles économiques'
            ]
          },
          {
            id: 'dazbox-setup',
            title: 'Installation DazBox',
            description: 'Déployez votre nœud Lightning optimisé',
            duration: 90,
            type: 'practical',
            url: '/solutions/dazbox/',
            prerequisites: ['node-basics'],
            learningObjectives: [
              'Installer DazBox',
              'Configuration initiale',
              'Tests de connectivité'
            ]
          },
          {
            id: 'channel-management',
            title: 'Gestion Avancée des Canaux',
            description: 'Stratégies d\'ouverture et d\'optimisation',
            duration: 80,
            type: 'technical',
            url: '/lightning-network/canaux-et-paiements/',
            prerequisites: ['dazbox-setup'],
            learningObjectives: [
              'Stratégies de canaux',
              'Gestion de liquidité',
              'Équilibrage automatique'
            ]
          },
          {
            id: 'roi-optimization',
            title: 'Optimisation ROI avec DazIA',
            description: 'IA pour maximiser les revenus',
            duration: 100,
            type: 'advanced',
            url: '/solutions/dazia/',
            prerequisites: ['channel-management'],
            learningObjectives: [
              'Configuration DazIA',
              'Stratégies de fees',
              'Monitoring avancé'
            ]
          }
        ]
      },
      'development': {
        id: 'development',
        title: '👩‍💻 Parcours Développement',
        description: 'Créez des applications Lightning',
        color: '#8B5CF6',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        estimatedTime: '5-6 semaines',
        difficulty: 'Expert',
        modules: [
          {
            id: 'dev-environment',
            title: 'Environnement de Développement',
            description: 'Outils et configuration pour développer',
            duration: 60,
            type: 'practical',
            url: '/devs/',
            prerequisites: ['lightning-practical'],
            learningObjectives: [
              'Setup environnement dev',
              'Outils Lightning',
              'Testnet configuration'
            ]
          },
          {
            id: 'lightning-apis',
            title: 'APIs Lightning Network',
            description: 'Intégrez Lightning dans vos apps',
            duration: 90,
            type: 'technical',
            url: '/devs/api/',
            prerequisites: ['dev-environment'],
            learningObjectives: [
              'APIs REST Lightning',
              'WebSockets temps réel',
              'Gestion des erreurs'
            ]
          },
          {
            id: 'payment-integration',
            title: 'Intégration Paiements',
            description: 'Recevoir et envoyer des paiements',
            duration: 120,
            type: 'practical',
            url: '/devs/examples/',
            prerequisites: ['lightning-apis'],
            learningObjectives: [
              'Flow de paiement',
              'Invoices et webhooks',
              'Gestion des timeouts'
            ]
          },
          {
            id: 'advanced-features',
            title: 'Fonctionnalités Avancées',
            description: 'Keysend, LNURL et plus',
            duration: 100,
            type: 'advanced',
            url: '/devs/rgb/',
            prerequisites: ['payment-integration'],
            learningObjectives: [
              'Keysend et streaming',
              'LNURL protocol',
              'RGB et smart contracts'
            ]
          }
        ]
      }
    };
  }

  init() {
    this.loadUserProgress();
    this.injectPathVisuals();
    this.setupEventListeners();
    this.updateAllProgressBars();
  }

  loadUserProgress() {
    // Integration with progress tracker
    if (window.progressTracker) {
      this.userProgress = window.progressTracker.getUserProgress();
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem('dazno_progress');
      this.userProgress = saved ? JSON.parse(saved) : null;
    }
  }

  injectPathVisuals() {
    // Find containers where to inject path visuals
    const containers = document.querySelectorAll('.learning-paths-container, #learning-paths-visual');
    
    if (containers.length === 0) {
      // Create container if none exists
      this.createPathsContainer();
    } else {
      containers.forEach(container => this.renderPathsIn(container));
    }

    // Inject individual progress widgets
    this.injectProgressWidgets();
  }

  createPathsContainer() {
    const container = document.createElement('div');
    container.id = 'learning-paths-visual';
    container.className = 'learning-paths-visual-container';
    
    // Try to insert after hero section or at beginning of main
    const hero = document.querySelector('.hero, .journey-selector');
    const main = document.querySelector('main, .main-content');
    
    if (hero && hero.nextElementSibling) {
      hero.parentNode.insertBefore(container, hero.nextElementSibling);
    } else if (main) {
      main.insertBefore(container, main.firstChild);
    } else {
      document.body.appendChild(container);
    }
    
    this.renderPathsIn(container);
  }

  renderPathsIn(container) {
    container.innerHTML = `
      <div class="visual-paths-wrapper">
        <div class="paths-header">
          <h2>📚 Parcours d'Apprentissage Visuels</h2>
          <p>Suivez votre progression étape par étape</p>
          
          <div class="paths-filters">
            <button class="filter-btn active" data-filter="all">Tous</button>
            <button class="filter-btn" data-filter="beginner">Débutant</button>
            <button class="filter-btn" data-filter="intermediate">Intermédiaire</button>
            <button class="filter-btn" data-filter="advanced">Avancé</button>
          </div>
        </div>

        <div class="visual-paths-grid">
          ${Object.values(this.pathsData).map(path => this.renderPathCard(path)).join('')}
        </div>

        <div class="paths-stats">
          <div class="stat-item">
            <span class="stat-number" id="total-progress">${this.calculateOverallProgress()}%</span>
            <span class="stat-label">Progression Globale</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="completed-modules">${this.getCompletedModulesCount()}</span>
            <span class="stat-label">Modules Terminés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="time-invested">${this.getTotalTimeInvested()}h</span>
            <span class="stat-label">Temps Investi</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="paths-completed">${this.getCompletedPathsCount()}</span>
            <span class="stat-label">Parcours Finis</span>
          </div>
        </div>
      </div>
    `;

    this.setupPathFilters(container);
  }

  renderPathCard(path) {
    const progress = this.calculatePathProgress(path.id);
    const isCompleted = progress === 100;
    const isStarted = progress > 0;
    const nextModule = this.getNextModule(path);
    
    return `
      <div class="visual-path-card" 
           data-path="${path.id}" 
           data-difficulty="${path.difficulty.toLowerCase()}"
           style="--path-color: ${path.color}; --path-gradient: ${path.gradient}">
        
        <div class="path-card-header">
          <div class="path-title-section">
            <h3 class="path-title">${path.title}</h3>
            <p class="path-description">${path.description}</p>
          </div>
          
          <div class="path-meta">
            <span class="path-difficulty ${path.difficulty.toLowerCase()}">${path.difficulty}</span>
            <span class="path-duration">${path.estimatedTime}</span>
          </div>
        </div>

        <div class="path-progress-section">
          <div class="main-progress-bar">
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress}%; background: ${path.gradient}"></div>
            </div>
            <span class="progress-percentage">${progress}%</span>
          </div>
          
          <div class="progress-status">
            ${isCompleted ? 
              '<span class="status-badge completed">✅ Terminé</span>' :
              isStarted ?
                '<span class="status-badge in-progress">⚡ En cours</span>' :
                '<span class="status-badge not-started">🚀 À commencer</span>'
            }
          </div>
        </div>

        <div class="path-modules-visual">
          ${path.modules.map((module, index) => this.renderModuleNode(module, index, path)).join('')}
        </div>

        <div class="path-actions">
          ${nextModule ? `
            <button class="btn-continue-path" onclick="window.visualPaths.continueModule('${nextModule.id}', '${nextModule.url}')">
              ${isStarted ? '📖 Continuer' : '🚀 Commencer'}: ${nextModule.title}
            </button>
          ` : `
            <button class="btn-completed-path" disabled>
              🎉 Parcours Terminé !
            </button>
          `}
          
          <button class="btn-path-details" onclick="window.visualPaths.showPathDetails('${path.id}')">
            📋 Voir les détails
          </button>
        </div>
      </div>
    `;
  }

  renderModuleNode(module, index, path) {
    const isCompleted = this.isModuleCompleted(module.id);
    const isAccessible = this.isModuleAccessible(module);
    const isCurrent = this.isCurrentModule(module, path);
    
    const statusClass = isCompleted ? 'completed' : 
                       isCurrent ? 'current' :
                       isAccessible ? 'accessible' : 'locked';
                       
    const icon = isCompleted ? '✅' :
                isCurrent ? '⚡' :
                isAccessible ? '📖' : '🔒';

    return `
      <div class="module-node ${statusClass}" 
           data-module="${module.id}"
           onclick="${isAccessible ? `window.visualPaths.openModule('${module.id}', '${module.url}')` : 'void(0)'}">
        
        <div class="module-number">${index + 1}</div>
        <div class="module-icon">${icon}</div>
        
        <div class="module-info">
          <h4 class="module-title">${module.title}</h4>
          <p class="module-description">${module.description}</p>
          <div class="module-meta">
            <span class="module-duration">${module.duration}min</span>
            <span class="module-type">${this.getTypeLabel(module.type)}</span>
          </div>
        </div>

        ${index < path.modules.length - 1 ? '<div class="module-connector"></div>' : ''}
        
        <div class="module-tooltip">
          <div class="tooltip-content">
            <h5>${module.title}</h5>
            <p>${module.description}</p>
            <div class="learning-objectives">
              <strong>Objectifs :</strong>
              <ul>
                ${module.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
              </ul>
            </div>
            <div class="tooltip-meta">
              <span>⏱️ ${module.duration} minutes</span>
              <span>📚 ${this.getTypeLabel(module.type)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  injectProgressWidgets() {
    // Add progress widgets to existing pages
    const pageProgress = this.getCurrentPageProgress();
    if (pageProgress) {
      this.addPageProgressWidget(pageProgress);
    }

    // Add mini progress indicators in navigation
    this.addNavigationProgressIndicators();
  }

  addPageProgressWidget(pageProgress) {
    const widget = document.createElement('div');
    widget.className = 'page-progress-widget';
    widget.innerHTML = `
      <div class="widget-content">
        <div class="current-module-info">
          <h4>${pageProgress.module.title}</h4>
          <p>Module ${pageProgress.position} sur ${pageProgress.total} • ${pageProgress.path.title}</p>
        </div>
        
        <div class="module-progress-bar">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pageProgress.pathProgress}%"></div>
          </div>
          <span>${pageProgress.pathProgress}%</span>
        </div>
        
        <div class="navigation-controls">
          ${pageProgress.previousModule ? `
            <button class="btn-nav-prev" onclick="window.location.href='${pageProgress.previousModule.url}'">
              ← ${pageProgress.previousModule.title}
            </button>
          ` : ''}
          
          ${pageProgress.nextModule ? `
            <button class="btn-nav-next" onclick="window.location.href='${pageProgress.nextModule.url}'">
              ${pageProgress.nextModule.title} →
            </button>
          ` : `
            <button class="btn-complete-module" onclick="window.visualPaths.completeCurrentModule()">
              ✅ Marquer comme terminé
            </button>
          `}
        </div>
      </div>
    `;

    // Insert at top of main content
    const main = document.querySelector('main, .main-content, article');
    if (main) {
      main.insertBefore(widget, main.firstChild);
    }
  }

  addNavigationProgressIndicators() {
    // Add small progress indicators to main navigation
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    navLinks.forEach(link => {
      const url = link.getAttribute('href');
      if (url) {
        const moduleId = this.getModuleIdFromUrl(url);
        if (moduleId) {
          const isCompleted = this.isModuleCompleted(moduleId);
          if (isCompleted) {
            link.classList.add('nav-completed');
            const indicator = document.createElement('span');
            indicator.className = 'nav-progress-indicator';
            indicator.textContent = '✅';
            link.appendChild(indicator);
          }
        }
      }
    });
  }

  // === INTERACTION METHODS ===
  continueModule(moduleId, url) {
    // Track module start
    if (typeof umami !== 'undefined') {
      umami.track('module-started', { moduleId });
    }
    
    // Mark as started if not already
    if (window.progressTracker) {
      window.progressTracker.startModule(moduleId);
    }
    
    // Navigate to module
    window.location.href = url;
  }

  openModule(moduleId, url) {
    this.continueModule(moduleId, url);
  }

  completeCurrentModule() {
    const currentModuleId = this.getCurrentModuleId();
    if (currentModuleId && window.progressTracker) {
      window.progressTracker.markModuleComplete(currentModuleId, 100);
      this.updateAllProgressBars();
      this.showCompletionCelebration();
    }
  }

  showPathDetails(pathId) {
    const path = this.pathsData[pathId];
    if (!path) return;

    const modal = this.createPathDetailsModal(path);
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
  }

  createPathDetailsModal(path) {
    const progress = this.calculatePathProgress(path.id);
    const completedModules = path.modules.filter(m => this.isModuleCompleted(m.id)).length;
    
    const modal = document.createElement('div');
    modal.className = 'path-details-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${path.title}</h2>
          <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="path-overview">
            <p>${path.description}</p>
            
            <div class="path-stats-grid">
              <div class="stat">
                <span class="stat-value">${progress}%</span>
                <span class="stat-label">Progression</span>
              </div>
              <div class="stat">
                <span class="stat-value">${completedModules}/${path.modules.length}</span>
                <span class="stat-label">Modules</span>
              </div>
              <div class="stat">
                <span class="stat-value">${path.estimatedTime}</span>
                <span class="stat-label">Durée estimée</span>
              </div>
              <div class="stat">
                <span class="stat-value">${path.difficulty}</span>
                <span class="stat-label">Niveau</span>
              </div>
            </div>
          </div>
          
          <div class="modules-detailed-list">
            <h3>Modules du parcours :</h3>
            ${path.modules.map((module, index) => `
              <div class="module-detail-item ${this.isModuleCompleted(module.id) ? 'completed' : ''}">
                <div class="module-detail-header">
                  <span class="module-number">${index + 1}</span>
                  <h4>${module.title}</h4>
                  <span class="module-status">
                    ${this.isModuleCompleted(module.id) ? '✅' : 
                      this.isModuleAccessible(module) ? '📖' : '🔒'}
                  </span>
                </div>
                <p>${module.description}</p>
                <div class="module-objectives">
                  <strong>Objectifs d'apprentissage :</strong>
                  <ul>
                    ${module.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
                  </ul>
                </div>
                <div class="module-meta">
                  <span>⏱️ ${module.duration} minutes</span>
                  <span>📚 ${this.getTypeLabel(module.type)}</span>
                </div>
                ${this.isModuleAccessible(module) ? `
                  <button class="btn-start-module" onclick="window.visualPaths.openModule('${module.id}', '${module.url}')">
                    ${this.isModuleCompleted(module.id) ? 'Revoir' : 'Commencer'}
                  </button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  setupPathFilters(container) {
    const filterBtns = container.querySelectorAll('.filter-btn');
    const pathCards = container.querySelectorAll('.visual-path-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter cards
        pathCards.forEach(card => {
          if (filter === 'all' || card.dataset.difficulty === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  setupEventListeners() {
    // Listen for progress updates
    document.addEventListener('moduleComplete', () => {
      this.updateAllProgressBars();
    });

    // Listen for scroll to update current module
    window.addEventListener('scroll', () => {
      this.updateCurrentModuleHighlight();
    });

    // Keyboard shortcuts for navigation
    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            this.gotoPreviousModule();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.gotoNextModule();
            break;
        }
      }
    });
  }

  // === UTILITY METHODS ===
  calculatePathProgress(pathId) {
    const path = this.pathsData[pathId];
    if (!path) return 0;
    
    const completedModules = path.modules.filter(module => 
      this.isModuleCompleted(module.id)
    ).length;
    
    return Math.round((completedModules / path.modules.length) * 100);
  }

  calculateOverallProgress() {
    const allPaths = Object.values(this.pathsData);
    const totalModules = allPaths.reduce((sum, path) => sum + path.modules.length, 0);
    const completedModules = allPaths.reduce((sum, path) => 
      sum + path.modules.filter(module => this.isModuleCompleted(module.id)).length, 0
    );
    
    return totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  }

  getCompletedModulesCount() {
    if (!this.userProgress) return 0;
    return this.userProgress.modules.completed.length;
  }

  getTotalTimeInvested() {
    if (!this.userProgress) return 0;
    return Math.floor(this.userProgress.statistics.totalTimeSpent / 60);
  }

  getCompletedPathsCount() {
    return Object.values(this.pathsData).filter(path => 
      this.calculatePathProgress(path.id) === 100
    ).length;
  }

  isModuleCompleted(moduleId) {
    return this.userProgress?.modules.completed.includes(moduleId) || false;
  }

  isModuleAccessible(module) {
    // Module is accessible if all prerequisites are completed
    return module.prerequisites.every(prereq => this.isModuleCompleted(prereq));
  }

  isCurrentModule(module, path) {
    // Check if this is the next module to complete in the path
    const previousModules = path.modules.slice(0, path.modules.indexOf(module));
    const allPreviousCompleted = previousModules.every(m => this.isModuleCompleted(m.id));
    const thisModuleNotCompleted = !this.isModuleCompleted(module.id);
    
    return allPreviousCompleted && thisModuleNotCompleted;
  }

  getNextModule(path) {
    return path.modules.find(module => 
      !this.isModuleCompleted(module.id) && this.isModuleAccessible(module)
    );
  }

  getCurrentPageProgress() {
    const currentUrl = window.location.pathname;
    const currentModuleId = this.getModuleIdFromUrl(currentUrl);
    
    if (!currentModuleId) return null;
    
    // Find which path this module belongs to
    for (const path of Object.values(this.pathsData)) {
      const moduleIndex = path.modules.findIndex(m => m.id === currentModuleId);
      if (moduleIndex !== -1) {
        const module = path.modules[moduleIndex];
        return {
          module,
          path,
          position: moduleIndex + 1,
          total: path.modules.length,
          pathProgress: this.calculatePathProgress(path.id),
          previousModule: moduleIndex > 0 ? path.modules[moduleIndex - 1] : null,
          nextModule: moduleIndex < path.modules.length - 1 ? path.modules[moduleIndex + 1] : null
        };
      }
    }
    
    return null;
  }

  getCurrentModuleId() {
    return this.getModuleIdFromUrl(window.location.pathname);
  }

  getModuleIdFromUrl(url) {
    // Map URLs to module IDs
    const urlModuleMap = {};
    Object.values(this.pathsData).forEach(path => {
      path.modules.forEach(module => {
        urlModuleMap[module.url] = module.id;
      });
    });
    
    return urlModuleMap[url] || null;
  }

  getTypeLabel(type) {
    const typeLabels = {
      theory: 'Théorie',
      technical: 'Technique',
      practical: 'Pratique',
      advanced: 'Avancé'
    };
    return typeLabels[type] || type;
  }

  updateAllProgressBars() {
    // Update main progress stats
    document.getElementById('total-progress')?.textContent = this.calculateOverallProgress() + '%';
    document.getElementById('completed-modules')?.textContent = this.getCompletedModulesCount();
    document.getElementById('time-invested')?.textContent = this.getTotalTimeInvested() + 'h';
    document.getElementById('paths-completed')?.textContent = this.getCompletedPathsCount();
    
    // Update individual path progress bars
    document.querySelectorAll('.visual-path-card').forEach(card => {
      const pathId = card.dataset.path;
      const progress = this.calculatePathProgress(pathId);
      
      const progressFill = card.querySelector('.progress-fill');
      const progressPercentage = card.querySelector('.progress-percentage');
      
      if (progressFill) progressFill.style.width = progress + '%';
      if (progressPercentage) progressPercentage.textContent = progress + '%';
      
      // Update status badge
      const statusBadge = card.querySelector('.status-badge');
      if (statusBadge) {
        statusBadge.className = 'status-badge';
        if (progress === 100) {
          statusBadge.classList.add('completed');
          statusBadge.textContent = '✅ Terminé';
        } else if (progress > 0) {
          statusBadge.classList.add('in-progress');
          statusBadge.textContent = '⚡ En cours';
        } else {
          statusBadge.classList.add('not-started');
          statusBadge.textContent = '🚀 À commencer';
        }
      }
    });
  }

  updateCurrentModuleHighlight() {
    // Highlight current module in visual paths based on scroll position
    const sections = document.querySelectorAll('h1, h2, h3');
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.textContent;
      }
    });
    
    // Update visual indication if needed
    document.querySelectorAll('.module-node.current').forEach(node => {
      node.classList.remove('current');
    });
  }

  showCompletionCelebration() {
    // Show celebration animation for module completion
    const celebration = document.createElement('div');
    celebration.className = 'completion-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">🎉</div>
        <h3>Module Terminé !</h3>
        <p>Félicitations pour votre progression</p>
      </div>
    `;
    
    document.body.appendChild(celebration);
    setTimeout(() => celebration.classList.add('show'), 100);
    setTimeout(() => {
      celebration.classList.remove('show');
      setTimeout(() => celebration.remove(), 500);
    }, 3000);
  }

  gotoPreviousModule() {
    const pageProgress = this.getCurrentPageProgress();
    if (pageProgress?.previousModule) {
      window.location.href = pageProgress.previousModule.url;
    }
  }

  gotoNextModule() {
    const pageProgress = this.getCurrentPageProgress();
    if (pageProgress?.nextModule) {
      window.location.href = pageProgress.nextModule.url;
    }
  }

  // === PUBLIC API ===
  getPathData(pathId) {
    return this.pathsData[pathId];
  }

  getAllPaths() {
    return Object.values(this.pathsData);
  }

  refreshProgress() {
    this.loadUserProgress();
    this.updateAllProgressBars();
  }
}

// Styles CSS pour les parcours visuels
const visualPathsStyles = `
<style>
/* === MAIN CONTAINER === */
.learning-paths-visual-container {
  margin: var(--space-2xl) 0;
  padding: 0 var(--space-lg);
}

.visual-paths-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.paths-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.paths-header h2 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.paths-header p {
  color: var(--text-secondary);
  margin: 0 0 var(--space-xl) 0;
  font-size: 1.125rem;
}

.paths-filters {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid var(--border-color);
  background: transparent;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-btn.active,
.filter-btn:hover {
  border-color: var(--lightning-purple);
  background: var(--lightning-purple);
  color: white;
}

/* === PATHS GRID === */
.visual-paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.visual-path-card {
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  padding: var(--space-xl);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.visual-path-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--path-gradient);
  opacity: 0.8;
}

.visual-path-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--path-color);
}

/* === PATH CARD HEADER === */
.path-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
  gap: var(--space-md);
}

.path-title {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 700;
}

.path-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.path-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  align-items: flex-end;
}

.path-difficulty {
  padding: var(--space-xs) var(--space-sm);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.path-difficulty.débutant { background: #DEF7EC; color: #03543F; }
.path-difficulty.intermédiaire { background: #FEF3C7; color: #92400E; }
.path-difficulty.avancé { background: #FEE2E2; color: #991B1B; }
.path-difficulty.expert { background: #EDE9FE; color: #5B21B6; }

.path-duration {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* === PROGRESS SECTION === */
.path-progress-section {
  margin-bottom: var(--space-xl);
}

.main-progress-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.progress-track {
  flex: 1;
  height: 12px;
  background: var(--bg-primary);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;
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

.progress-percentage {
  font-weight: 700;
  color: var(--text-primary);
  min-width: 40px;
  text-align: right;
}

.progress-status {
  text-align: center;
}

.status-badge {
  padding: var(--space-xs) var(--space-sm);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.completed {
  background: #DEF7EC;
  color: #03543F;
}

.status-badge.in-progress {
  background: #FEF3C7;
  color: #92400E;
}

.status-badge.not-started {
  background: var(--bg-primary);
  color: var(--text-secondary);
}

/* === MODULES VISUAL === */
.path-modules-visual {
  margin-bottom: var(--space-xl);
  position: relative;
}

.module-node {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: var(--space-md);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.module-node:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-md);
}

.module-node.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05));
  border-color: #10B981;
}

.module-node.current {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.05));
  border-color: var(--lightning-yellow);
  animation: pulse-glow 2s infinite;
}

.module-node.accessible {
  border-color: var(--lightning-blue);
}

.module-node.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.module-node.locked:hover {
  transform: none;
  box-shadow: none;
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
}

.module-number {
  width: 32px;
  height: 32px;
  background: var(--text-secondary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.module-node.completed .module-number {
  background: #10B981;
}

.module-node.current .module-number {
  background: var(--lightning-yellow);
  color: var(--dark-bg);
}

.module-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.module-info {
  flex: 1;
  min-width: 0;
}

.module-title {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.module-description {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.module-meta {
  display: flex;
  gap: var(--space-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.module-duration {
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: 4px;
}

.module-type {
  background: var(--lightning-purple);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}

/* === TOOLTIPS === */
.module-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark-surface);
  color: white;
  padding: var(--space-md);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  width: 280px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
  pointer-events: none;
}

.module-node:hover .module-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-8px);
}

.tooltip-content h5 {
  margin: 0 0 var(--space-xs) 0;
  font-size: 1rem;
}

.tooltip-content p {
  margin: 0 0 var(--space-sm) 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.learning-objectives {
  margin-bottom: var(--space-sm);
}

.learning-objectives strong {
  font-size: 0.875rem;
}

.learning-objectives ul {
  margin: var(--space-xs) 0 0 0;
  padding-left: var(--space-md);
  font-size: 0.8rem;
  opacity: 0.8;
}

.tooltip-meta {
  display: flex;
  gap: var(--space-sm);
  font-size: 0.75rem;
  opacity: 0.7;
}

/* === PATH ACTIONS === */
.path-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-continue-path {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  background: var(--path-gradient);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-continue-path:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.btn-completed-path {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  background: #10B981;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: default;
  font-weight: 600;
}

.btn-path-details {
  padding: var(--space-md) var(--space-lg);
  background: transparent;
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-path-details:hover {
  border-color: var(--lightning-purple);
  color: var(--lightning-purple);
}

/* === STATS SECTION === */
.paths-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  background: var(--bg-surface);
  padding: var(--space-xl);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--lightning-purple);
  margin-bottom: var(--space-xs);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

/* === PAGE PROGRESS WIDGET === */
.page-progress-widget {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

.current-module-info h4 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.current-module-info p {
  margin: 0 0 var(--space-md) 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.module-progress-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.navigation-controls {
  display: flex;
  gap: var(--space-sm);
}

.btn-nav-prev,
.btn-nav-next,
.btn-complete-module {
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid var(--lightning-purple);
  background: transparent;
  color: var(--lightning-purple);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-nav-prev:hover,
.btn-nav-next:hover {
  background: var(--lightning-purple);
  color: white;
}

.btn-complete-module {
  background: var(--gradient-lightning);
  color: white;
  border: none;
}

.btn-complete-module:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

/* === NAVIGATION INDICATORS === */
.nav-completed {
  position: relative;
}

.nav-progress-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 0.75rem;
  background: #10B981;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === COMPLETION CELEBRATION === */
.completion-celebration {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: var(--bg-surface);
  border-radius: 16px;
  padding: var(--space-2xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
}

.completion-celebration.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.celebration-icon {
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  animation: bounce 1s infinite;
}

.celebration-content h3 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
}

.celebration-content p {
  margin: 0;
  color: var(--text-secondary);
}

/* === PATH DETAILS MODAL === */
.path-details-modal {
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

.path-details-modal.show {
  opacity: 1;
  visibility: visible;
}

.path-details-modal .modal-content {
  background: var(--bg-surface);
  border-radius: 16px;
  width: 90vw;
  max-width: 800px;
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

.path-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-lg);
  margin: var(--space-lg) 0;
  padding: var(--space-lg);
  background: var(--bg-primary);
  border-radius: 8px;
}

.path-stats-grid .stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lightning-purple);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.modules-detailed-list h3 {
  margin: var(--space-xl) 0 var(--space-lg) 0;
  color: var(--text-primary);
}

.module-detail-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  background: var(--bg-primary);
}

.module-detail-item.completed {
  border-color: #10B981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(34, 197, 94, 0.02));
}

.module-detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.module-detail-header .module-number {
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
}

.module-detail-header h4 {
  flex: 1;
  margin: 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.module-status {
  font-size: 1.2rem;
}

.module-objectives {
  margin: var(--space-md) 0;
}

.module-objectives strong {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.module-objectives ul {
  margin: var(--space-xs) 0 0 0;
  padding-left: var(--space-lg);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.btn-start-module {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  background: var(--gradient-lightning);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-start-module:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-sm);
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 768px) {
  .visual-paths-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .path-card-header {
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .path-meta {
    align-items: flex-start;
    flex-direction: row;
    gap: var(--space-sm);
  }
  
  .paths-filters {
    gap: var(--space-xs);
  }
  
  .filter-btn {
    padding: var(--space-xs) var(--space-md);
    font-size: 0.875rem;
  }
  
  .paths-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .navigation-controls {
    flex-direction: column;
  }
  
  .module-node {
    flex-direction: column;
    text-align: center;
    gap: var(--space-sm);
  }
  
  .module-tooltip {
    position: static;
    transform: none;
    opacity: 1;
    visibility: visible;
    width: 100%;
    margin-top: var(--space-sm);
    display: none;
  }
  
  .module-node:hover .module-tooltip {
    display: block;
    transform: none;
  }
  
  .path-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .learning-paths-visual-container {
    padding: 0 var(--space-md);
  }
  
  .visual-path-card {
    padding: var(--space-lg);
  }
  
  .paths-header h2 {
    font-size: 1.5rem;
  }
  
  .paths-stats {
    grid-template-columns: 1fr;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', visualPathsStyles);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.visualPaths = new VisualLearningPaths();
});