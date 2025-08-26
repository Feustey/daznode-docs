/**
 * Mobile-First Navigation System
 * Navigation adaptative et intuitive avec gestures et PWA
 */

class MobileNavigationSystem {
  constructor() {
    this.isInitialized = false;
    this.currentView = null;
    this.navigationStack = [];
    this.gestureHandlers = new Map();
    this.touchData = {};
    this.searchActive = false;
    this.init();
  }

  init() {
    this.createMobileStructure();
    this.setupGestureHandlers();
    this.initializeBottomNavigation();
    this.createFloatingActionButton();
    this.setupSwipeNavigation();
    this.initializeSearch();
    this.setupVoiceNavigation();
    this.createBreadcrumbsSystem();
    this.initializePWAFeatures();
    this.setupAdaptiveMenu();
    this.isInitialized = true;
  }

  createMobileStructure() {
    // Structure de navigation mobile complète
    const mobileNavHTML = `
      <!-- Mobile Header -->
      <header class="mobile-header" id="mobile-header">
        <button class="menu-toggle" id="menu-toggle" aria-label="Ouvrir le menu">
          <span class="hamburger-lines">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div class="header-title" id="header-title">
          <img src="/assets/images/logo.png" alt="Dazno" class="logo-mobile">
          <span class="page-title">Lightning Docs</span>
        </div>
        
        <div class="header-actions">
          <button class="btn-search" id="mobile-search-btn" aria-label="Rechercher">
            <svg class="icon-search" width="20" height="20" viewBox="0 0 24 24">
              <path d="M21.71 20.29L18 16.58A8.26 8.26 0 0 0 20 10a8 8 0 1 0-8 8 8.26 8.26 0 0 0 6.58-2l3.71 3.71a1 1 0 0 0 1.42-1.42zM4 10a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"/>
            </svg>
          </button>
          
          <button class="btn-voice" id="voice-search-btn" aria-label="Recherche vocale">
            <svg class="icon-mic" width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 2C10.9 2 10 2.9 10 4V12C10 13.1 10.9 14 12 14S14 13.1 14 12V4C14 2.9 13.1 2 12 2Z"/>
              <path d="M6 12C6 15.31 8.69 18 12 18S18 15.31 18 12"/>
              <path d="M12 18V22"/>
              <path d="M8 22H16"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Mobile Drawer Menu -->
      <nav class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
        <div class="drawer-overlay" id="drawer-overlay"></div>
        <div class="drawer-content">
          <div class="drawer-header">
            <div class="user-profile">
              <div class="avatar-container">
                <div class="user-avatar">⚡</div>
                <div class="level-badge">Nv.5</div>
              </div>
              <div class="user-info">
                <span class="username">Lightning Explorer</span>
                <span class="user-level">Expert Intermédiaire</span>
              </div>
            </div>
            
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-value" id="mobile-xp">2,450</span>
                <span class="stat-label">XP</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="mobile-streak">12</span>
                <span class="stat-label">Streak</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="mobile-modules">23</span>
                <span class="stat-label">Modules</span>
              </div>
            </div>
          </div>
          
          <div class="drawer-navigation">
            <!-- Navigation principale -->
          </div>
        </div>
      </nav>

      <!-- Bottom Navigation -->
      <nav class="bottom-navigation" id="bottom-nav">
        <a href="/" class="nav-item active" data-section="home">
          <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
          </svg>
          <span class="nav-label">Accueil</span>
        </a>
        
        <a href="/lightning-network" class="nav-item" data-section="lightning">
          <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
          </svg>
          <span class="nav-label">Lightning</span>
        </a>
        
        <a href="/bitcoin" class="nav-item" data-section="bitcoin">
          <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M17.88 12.04C17.93 11.67 17.95 11.31 17.95 10.95C17.95 10.59 17.93 10.23 17.88 9.86L19.73 8.43C19.9 8.3 19.95 8.07 19.85 7.87L18.13 5.13C18.03 4.93 17.8 4.87 17.6 4.95L15.46 5.86C14.97 5.5 14.43 5.19 13.84 4.96L13.5 2.68C13.46 2.47 13.28 2.31 13.06 2.31H9.62C9.4 2.31 9.22 2.47 9.18 2.68L8.84 4.96C8.25 5.19 7.71 5.5 7.22 5.86L5.08 4.95C4.88 4.87 4.65 4.93 4.55 5.13L2.83 7.87C2.73 8.07 2.78 8.3 2.95 8.43L4.8 9.86C4.75 10.23 4.73 10.59 4.73 10.95C4.73 11.31 4.75 11.67 4.8 12.04L2.95 13.47C2.78 13.6 2.73 13.83 2.83 14.03L4.55 16.77C4.65 16.97 4.88 17.03 5.08 16.95L7.22 16.04C7.71 16.4 8.25 16.71 8.84 16.94L9.18 19.22C9.22 19.43 9.4 19.59 9.62 19.59H13.06C13.28 19.59 13.46 19.43 13.5 19.22L13.84 16.94C14.43 16.71 14.97 16.4 15.46 16.04L17.6 16.95C17.8 17.03 18.03 16.97 18.13 16.77L19.85 14.03C19.95 13.83 19.9 13.6 19.73 13.47L17.88 12.04ZM11.34 14.06C9.68 14.06 8.34 12.72 8.34 11.06S9.68 8.06 11.34 8.06S14.34 9.4 14.34 11.06S12.99 14.06 11.34 14.06Z"/>
          </svg>
          <span class="nav-label">Bitcoin</span>
        </a>
        
        <a href="/learn" class="nav-item" data-section="learn">
          <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17"/>
            <path d="M2 12L12 17L22 12"/>
          </svg>
          <span class="nav-label">Apprendre</span>
        </a>
        
        <a href="/community" class="nav-item" data-section="community">
          <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M16 21V19C16 16.79 14.21 15 12 15H5C2.79 15 1 16.79 1 19V21"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="M23 21V19C23 17.13 21.73 15.57 20 15.15"/>
            <path d="M16 3.13C17.73 3.57 19 5.13 19 7S17.73 10.43 16 10.87"/>
          </svg>
          <span class="nav-label">Communauté</span>
        </a>
      </nav>

      <!-- Floating Action Button -->
      <div class="fab-container" id="fab-container">
        <button class="fab-main" id="fab-main" aria-label="Actions rapides">
          <svg class="fab-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </button>
        
        <div class="fab-menu" id="fab-menu">
          <button class="fab-option" data-action="quick-quiz" aria-label="Quiz rapide">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 6C13.1 6 14 6.9 14 8S13.1 10 12 10 10 9.1 10 8 10.9 6 12 6ZM16 16H8V14H16V16Z"/>
            </svg>
          </button>
          
          <button class="fab-option" data-action="bookmark" aria-label="Marquer cette page">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z"/>
            </svg>
          </button>
          
          <button class="fab-option" data-action="share" aria-label="Partager">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Overlay -->
      <div class="search-overlay" id="search-overlay">
        <div class="search-container">
          <div class="search-header">
            <input type="text" class="search-input" id="mobile-search-input" placeholder="Rechercher dans la documentation..." autocomplete="off">
            <button class="search-close" id="search-close" aria-label="Fermer la recherche">✕</button>
          </div>
          
          <div class="search-suggestions" id="search-suggestions">
            <!-- Suggestions dynamiques -->
          </div>
          
          <div class="search-results" id="search-results">
            <!-- Résultats de recherche -->
          </div>
        </div>
      </div>

      <!-- Breadcrumbs Mobile -->
      <div class="mobile-breadcrumbs" id="mobile-breadcrumbs">
        <!-- Fil d'Ariane adaptatif -->
      </div>

      <!-- Progress Indicator -->
      <div class="mobile-progress-indicator" id="mobile-progress">
        <div class="progress-bar-mobile" id="progress-bar-mobile"></div>
      </div>
    `;

    // Injection de la structure mobile
    document.body.insertAdjacentHTML('afterbegin', mobileNavHTML);
    
    // Mise à jour du layout existant pour mobile
    this.adaptExistingLayout();
  }

  adaptExistingLayout() {
    // Ajoute les classes mobile au contenu existant
    const mainContent = document.querySelector('main') || document.querySelector('.content') || document.body;
    mainContent.classList.add('mobile-adapted');
    
    // Ajuste le padding pour la navigation mobile
    document.body.style.paddingTop = '60px'; // Header height
    document.body.style.paddingBottom = '70px'; // Bottom nav height
  }

  setupGestureHandlers() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isSwipeActive = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      currentY = startY;
      isSwipeActive = true;
    };

    const handleTouchMove = (e) => {
      if (!isSwipeActive) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      
      const diffX = currentX - startX;
      const diffY = currentY - startY;
      
      // Drawer swipe
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50 && startX < 50) {
          this.openDrawer();
        } else if (diffX < -50 && this.isDrawerOpen()) {
          this.closeDrawer();
        }
      }
      
      // Navigation swipe
      if (Math.abs(diffX) > 100 && Math.abs(diffY) < 50) {
        if (diffX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    };

    const handleTouchEnd = () => {
      isSwipeActive = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  initializeBottomNavigation() {
    const bottomNav = document.getElementById('bottom-nav');
    const navItems = bottomNav.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(item.dataset.section, item.href);
      });
    });

    // Active state management
    this.updateActiveNavItem();
    
    // Auto-hide on scroll
    this.setupBottomNavAutoHide();
  }

  updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.href && currentPath.includes(item.getAttribute('href'))) {
        item.classList.add('active');
      }
    });
  }

  setupBottomNavAutoHide() {
    let lastScrollTop = 0;
    const bottomNav = document.getElementById('bottom-nav');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        bottomNav.style.transform = 'translateY(100%)';
      } else {
        // Scrolling up
        bottomNav.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  createFloatingActionButton() {
    const fabMain = document.getElementById('fab-main');
    const fabMenu = document.getElementById('fab-menu');
    let isOpen = false;

    fabMain.addEventListener('click', () => {
      isOpen = !isOpen;
      fabMenu.classList.toggle('open', isOpen);
      fabMain.classList.toggle('open', isOpen);
      
      // Rotation de l'icône
      fabMain.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    });

    // Actions FAB
    document.querySelectorAll('.fab-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleFabAction(action);
        
        // Ferme le menu après action
        isOpen = false;
        fabMenu.classList.remove('open');
        fabMain.classList.remove('open');
        fabMain.style.transform = 'rotate(0deg)';
      });
    });

    // Ferme le FAB menu en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.fab-container') && isOpen) {
        isOpen = false;
        fabMenu.classList.remove('open');
        fabMain.classList.remove('open');
        fabMain.style.transform = 'rotate(0deg)';
      }
    });
  }

  handleFabAction(action) {
    switch (action) {
      case 'quick-quiz':
        this.startQuickQuiz();
        break;
      case 'bookmark':
        this.bookmarkCurrentPage();
        break;
      case 'share':
        this.shareCurrentPage();
        break;
    }
  }

  setupSwipeNavigation() {
    // Navigation par swipe entre les sections
    const sections = ['home', 'lightning', 'bitcoin', 'learn', 'community'];
    let currentSectionIndex = 0;

    this.handleSwipeLeft = () => {
      if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        this.navigateToSection(sections[currentSectionIndex]);
      }
    };

    this.handleSwipeRight = () => {
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
        this.navigateToSection(sections[currentSectionIndex]);
      }
    };
  }

  navigateToSection(section) {
    const navItem = document.querySelector(`[data-section="${section}"]`);
    if (navItem) {
      navItem.click();
    }
  }

  initializeSearch() {
    const searchBtn = document.getElementById('mobile-search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('mobile-search-input');
    const searchClose = document.getElementById('search-close');
    const searchResults = document.getElementById('search-results');
    const searchSuggestions = document.getElementById('search-suggestions');

    // Ouvrir la recherche
    searchBtn.addEventListener('click', () => {
      this.openSearch();
    });

    // Fermer la recherche
    searchClose.addEventListener('click', () => {
      this.closeSearch();
    });

    // Recherche en temps réel
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          this.performSearch(query);
        }, 300);
      } else {
        this.showSearchSuggestions();
      }
    });

    // Navigation au clavier
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });
  }

  openSearch() {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('mobile-search-input');
    
    searchOverlay.classList.add('active');
    document.body.classList.add('search-active');
    
    setTimeout(() => {
      searchInput.focus();
    }, 300);
    
    this.showSearchSuggestions();
  }

  closeSearch() {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('mobile-search-input');
    
    searchOverlay.classList.remove('active');
    document.body.classList.remove('search-active');
    
    searchInput.value = '';
    this.clearSearchResults();
  }

  performSearch(query) {
    const searchResults = document.getElementById('search-results');
    
    // Simulation de recherche - remplacer par vraie API
    const mockResults = [
      {
        title: 'Lightning Network Basics',
        description: 'Introduction aux concepts fondamentaux du Lightning Network...',
        url: '/lightning-network/basics',
        category: 'Lightning'
      },
      {
        title: 'Configuration de Node',
        description: 'Guide complet pour configurer votre premier nœud Lightning...',
        url: '/lightning-network/node-setup',
        category: 'Tutorial'
      },
      {
        title: 'Optimisation ROI',
        description: 'Techniques avancées pour maximiser le retour sur investissement...',
        url: '/lightning-network/roi-optimization',
        category: 'Advanced'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = mockResults.length > 0 ? `
      <div class="search-results-header">
        <span>Résultats pour "${query}" (${mockResults.length})</span>
      </div>
      ${mockResults.map(result => `
        <a href="${result.url}" class="search-result-item">
          <div class="result-category">${result.category}</div>
          <div class="result-title">${result.title}</div>
          <div class="result-description">${result.description}</div>
        </a>
      `).join('')}
    ` : `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <div class="no-results-text">Aucun résultat pour "${query}"</div>
        <div class="no-results-suggestion">Essayez des termes plus généraux</div>
      </div>
    `;
  }

  showSearchSuggestions() {
    const searchSuggestions = document.getElementById('search-suggestions');
    const popularSearches = [
      'Lightning Network',
      'Configuration nœud',
      'Bitcoin basics',
      'ROI calculator',
      'Channel management',
      'Fee optimization'
    ];

    searchSuggestions.innerHTML = `
      <div class="suggestions-header">Recherches populaires</div>
      <div class="suggestions-list">
        ${popularSearches.map(suggestion => `
          <button class="suggestion-item" onclick="window.mobileNav.searchFor('${suggestion}')">
            <svg class="suggestion-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M21.71 20.29L18 16.58A8.26 8.26 0 0 0 20 10a8 8 0 1 0-8 8 8.26 8.26 0 0 0 6.58-2l3.71 3.71a1 1 0 0 0 1.42-1.42zM4 10a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"/>
            </svg>
            ${suggestion}
          </button>
        `).join('')}
      </div>
    `;
  }

  searchFor(query) {
    const searchInput = document.getElementById('mobile-search-input');
    searchInput.value = query;
    this.performSearch(query);
  }

  clearSearchResults() {
    const searchResults = document.getElementById('search-results');
    const searchSuggestions = document.getElementById('search-suggestions');
    searchResults.innerHTML = '';
    searchSuggestions.innerHTML = '';
  }

  setupVoiceNavigation() {
    const voiceBtn = document.getElementById('voice-search-btn');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.classList.add('listening');
      });

      recognition.addEventListener('result', (e) => {
        const command = e.results[0][0].transcript.toLowerCase();
        this.processVoiceCommand(command);
        voiceBtn.classList.remove('listening');
      });

      recognition.addEventListener('end', () => {
        voiceBtn.classList.remove('listening');
      });

      recognition.addEventListener('error', () => {
        voiceBtn.classList.remove('listening');
        this.showToast('Erreur de reconnaissance vocale', 'error');
      });
    } else {
      voiceBtn.style.display = 'none';
    }
  }

  processVoiceCommand(command) {
    if (command.includes('recherche') || command.includes('cherche')) {
      this.openSearch();
    } else if (command.includes('accueil')) {
      this.navigateToSection('home');
    } else if (command.includes('lightning')) {
      this.navigateToSection('lightning');
    } else if (command.includes('bitcoin')) {
      this.navigateToSection('bitcoin');
    } else if (command.includes('apprendre')) {
      this.navigateToSection('learn');
    } else if (command.includes('communauté')) {
      this.navigateToSection('community');
    } else {
      // Utilise la commande comme recherche
      const searchInput = document.getElementById('mobile-search-input');
      searchInput.value = command;
      this.openSearch();
      this.performSearch(command);
    }
  }

  createBreadcrumbsSystem() {
    const breadcrumbsContainer = document.getElementById('mobile-breadcrumbs');
    
    // Génère les breadcrumbs basé sur l'URL
    this.updateBreadcrumbs();
    
    // Update sur changement de page
    window.addEventListener('popstate', () => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    const breadcrumbsContainer = document.getElementById('mobile-breadcrumbs');
    
    if (segments.length <= 1) {
      breadcrumbsContainer.style.display = 'none';
      return;
    }

    breadcrumbsContainer.style.display = 'flex';
    
    const breadcrumbs = segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const href = '/' + segments.slice(0, index + 1).join('/');
      const title = this.formatBreadcrumbTitle(segment);
      
      return `
        <span class="breadcrumb-item ${isLast ? 'current' : ''}">
          ${isLast ? title : `<a href="${href}">${title}</a>`}
        </span>
      `;
    }).join('<span class="breadcrumb-separator">›</span>');
    
    breadcrumbsContainer.innerHTML = `
      <a href="/" class="breadcrumb-home">🏠</a>
      <span class="breadcrumb-separator">›</span>
      ${breadcrumbs}
    `;
  }

  formatBreadcrumbTitle(segment) {
    const titleMap = {
      'lightning-network': 'Lightning Network',
      'bitcoin': 'Bitcoin',
      'getting-started': 'Guide de Démarrage',
      'advanced': 'Avancé',
      'community': 'Communauté'
    };
    
    return titleMap[segment] || segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  initializePWAFeatures() {
    // Détection d'installation PWA
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallBanner();
    });
    
    // Offline indicator
    this.setupOfflineIndicator();
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }

  showInstallBanner() {
    const installBanner = document.createElement('div');
    installBanner.className = 'install-banner';
    installBanner.innerHTML = `
      <div class="install-content">
        <div class="install-icon">📱</div>
        <div class="install-text">
          <strong>Installer Dazno Docs</strong>
          <span>Accédez rapidement à vos cours</span>
        </div>
        <button class="btn-install" id="btn-install">Installer</button>
        <button class="btn-dismiss" id="btn-dismiss">✕</button>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('btn-install').addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('Application installée!', 'success');
        }
        installBanner.remove();
        deferredPrompt = null;
      });
    });
    
    document.getElementById('btn-dismiss').addEventListener('click', () => {
      installBanner.remove();
    });
  }

  setupOfflineIndicator() {
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.innerHTML = '📡 Mode hors ligne';
    document.body.appendChild(offlineIndicator);
    
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        offlineIndicator.classList.remove('show');
      } else {
        offlineIndicator.classList.add('show');
      }
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  setupAdaptiveMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');

    menuToggle.addEventListener('click', () => {
      this.toggleDrawer();
    });

    overlay.addEventListener('click', () => {
      this.closeDrawer();
    });

    // Génère le contenu du menu
    this.generateDrawerContent();
  }

  generateDrawerContent() {
    const navigation = document.querySelector('.drawer-navigation');
    
    const menuStructure = [
      {
        title: 'Getting Started',
        icon: '🚀',
        items: [
          { title: 'Introduction', url: '/getting-started' },
          { title: 'Installation', url: '/getting-started/installation' },
          { title: 'Premier Nœud', url: '/getting-started/first-node' }
        ]
      },
      {
        title: 'Bitcoin',
        icon: '₿',
        items: [
          { title: 'Fondamentaux', url: '/bitcoin/introduction' },
          { title: 'Wallets', url: '/bitcoin/wallets' },
          { title: 'Transactions', url: '/bitcoin/transactions' }
        ]
      },
      {
        title: 'Lightning Network',
        icon: '⚡',
        items: [
          { title: 'Introduction', url: '/lightning-network' },
          { title: 'Canaux', url: '/lightning-network/channels' },
          { title: 'Routage', url: '/lightning-network/routing' },
          { title: 'Optimisation', url: '/lightning-network/optimization' }
        ]
      },
      {
        title: 'Communauté',
        icon: '👥',
        items: [
          { title: 'Forum', url: '/community' },
          { title: 'Discord', url: '/community/discord' },
          { title: 'Événements', url: '/community/events' }
        ]
      }
    ];

    navigation.innerHTML = menuStructure.map(section => `
      <div class="menu-section">
        <div class="menu-section-header">
          <span class="section-icon">${section.icon}</span>
          <span class="section-title">${section.title}</span>
        </div>
        <div class="menu-section-items">
          ${section.items.map(item => `
            <a href="${item.url}" class="menu-item">
              <span class="item-title">${item.title}</span>
              <span class="item-arrow">›</span>
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Event listeners pour les items du menu
    navigation.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        this.closeDrawer();
      });
    });
  }

  toggleDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const isOpen = drawer.classList.contains('open');
    
    if (isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  }

  closeDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  isDrawerOpen() {
    return document.getElementById('mobile-drawer').classList.contains('open');
  }

  handleNavigation(section, url) {
    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Navigate
    if (url && window.location.href !== url) {
      window.location.href = url;
    }
    
    // Update header title
    const titles = {
      home: 'Accueil',
      lightning: 'Lightning Network',
      bitcoin: 'Bitcoin',
      learn: 'Apprendre',
      community: 'Communauté'
    };
    
    document.querySelector('.page-title').textContent = titles[section] || 'Dazno Docs';
  }

  startQuickQuiz() {
    // Lance un quiz rapide contextuel
    if (window.gamification) {
      window.gamification.startQuickQuiz();
    }
  }

  bookmarkCurrentPage() {
    const url = window.location.href;
    const title = document.title;
    
    // Sauvegarde locale
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!bookmarks.some(b => b.url === url)) {
      bookmarks.push({ url, title, date: new Date().toISOString() });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      this.showToast('Page ajoutée aux favoris', 'success');
    } else {
      this.showToast('Page déjà dans les favoris', 'info');
    }
  }

  shareCurrentPage() {
    const url = window.location.href;
    const title = document.title;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url
      });
    } else {
      // Fallback: copie dans le presse-papiers
      navigator.clipboard.writeText(url);
      this.showToast('Lien copié dans le presse-papiers', 'success');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // API publique
  navigate(section) {
    this.navigateToSection(section);
  }

  openMenu() {
    this.openDrawer();
  }

  closeMenu() {
    this.closeDrawer();
  }

  search(query) {
    this.openSearch();
    if (query) {
      document.getElementById('mobile-search-input').value = query;
      this.performSearch(query);
    }
  }

  destroy() {
    // Cleanup event listeners et DOM elements
    if (this.isInitialized) {
      document.removeEventListener('touchstart', this.handleTouchStart);
      document.removeEventListener('touchmove', this.handleTouchMove);
      document.removeEventListener('touchend', this.handleTouchEnd);
    }
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.mobileNav = new MobileNavigationSystem();
  
  // API globale
  window.MobileNavigation = {
    navigate: (section) => window.mobileNav.navigate(section),
    openMenu: () => window.mobileNav.openMenu(),
    closeMenu: () => window.mobileNav.closeMenu(),
    search: (query) => window.mobileNav.search(query),
    showToast: (message, type) => window.mobileNav.showToast(message, type)
  };
});