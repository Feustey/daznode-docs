/**
 * Application moderne pour docs.dazno.de
 * Style et fonctionnalités dazno.de
 */

class ModernApp {
  constructor() {
    this.isLoaded = false;
    this.scrollProgress = 0;
    this.readingTime = 0;
    this.contextualSuggestions = [];
    
    this.init();
  }

  init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.initializeTheme();
    this.initializeMobileNavigation();
    this.initializeReadingProgress();
    this.initializeScrollToTop();
    this.initializeAnimations();
    this.initializeContextualSuggestions();
    this.calculateReadingTime();
    this.bindGlobalEvents();
    this.markAsLoaded();
    
    console.log('🚀 ModernApp initialized');
  }

  /* Theme Management */
  initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    this.setTheme(currentTheme);
    
    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');
    
    if (theme === 'dark') {
      if (lightIcon) lightIcon.style.display = 'none';
      if (darkIcon) darkIcon.style.display = 'block';
    } else {
      if (lightIcon) lightIcon.style.display = 'block';
      if (darkIcon) darkIcon.style.display = 'none';
    }
  }

  /* Mobile Navigation */
  initializeMobileNavigation() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-close');
    
    if (!menuBtn || !overlay) return;

    menuBtn.addEventListener('click', () => this.toggleMobileMenu());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeMobileMenu());
    
    // Fermer au clic sur overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeMobileMenu();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });

    // Fermer lors de la navigation
    const navLinks = overlay.querySelectorAll('a[href^="/"]');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => this.closeMobileMenu(), 100);
      });
    });
  }

  toggleMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    
    menuBtn.setAttribute('aria-expanded', !isOpen);
    overlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', isOpen ? 'mobile_menu_close' : 'mobile_menu_open', {
        event_category: 'navigation',
        event_label: 'mobile'
      });
    }
  }

  closeMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    
    menuBtn.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* Reading Progress */
  initializeReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    let ticking = false;
    
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.max(0, Math.min(100, (scrollTop / docHeight) * 100));
      
      this.scrollProgress = scrollPercent;
      
      const progressFill = progressBar.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = `${scrollPercent}%`;
      }
      
      // Afficher/masquer la barre
      if (scrollTop > 200) {
        progressBar.classList.add('visible');
      } else {
        progressBar.classList.remove('visible');
      }
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    updateProgress(); // Initial call
  }

  /* Scroll to Top */
  initializeScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    };

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_to_top', {
          event_category: 'navigation',
          event_label: 'button'
        });
      }
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Initial call
  }

  /* Animations */
  initializeAnimations() {
    // Intersection Observer pour les animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Staggered animations pour les listes
          if (entry.target.matches('.suggestion-grid, .hero-stats')) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animate-fade-in-up');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // Observer les éléments animables
    const animateElements = document.querySelectorAll(`
      .animate-fade-in-up,
      .animate-scale-in,
      .animate-slide-in-right,
      .card,
      .hero-content,
      .hero-visual,
      .article-header,
      .suggestion-grid
    `);

    animateElements.forEach(el => observer.observe(el));
  }

  /* Contextual Suggestions */
  initializeContextualSuggestions() {
    const suggestionsContainer = document.getElementById('contextual-suggestions');
    if (!suggestionsContainer) return;

    const currentPath = window.location.pathname;
    let suggestions = this.getContextualSuggestions(currentPath);

    if (suggestions.length === 0) {
      suggestions = this.getDefaultSuggestions();
    }

    this.renderSuggestions(suggestions, suggestionsContainer);
  }

  getContextualSuggestions(path) {
    const suggestions = [];

    if (path.includes('/lightning-network/')) {
      return [
        {
          icon: '⚡',
          title: 'Optimiser vos canaux Lightning',
          description: 'Techniques avancées de gestion des canaux',
          url: '/lightning-network/channels/',
          category: 'Technique'
        },
        {
          icon: '🛠️',
          title: 'Configuration DazBox',
          description: 'Setup automatisé de votre nœud Lightning',
          url: '/solutions/dazbox/presentation/',
          category: 'Solution'
        },
        {
          icon: '🎯',
          title: 'Calculateur ROI Lightning',
          description: 'Estimez vos revenus potentiels',
          url: '/technical/tools/roi-calculator/',
          category: 'Outil'
        }
      ];
    }

    if (path.includes('/bitcoin/')) {
      return [
        {
          icon: '⚡',
          title: 'Découvrir Lightning Network',
          description: 'Paiements Bitcoin instantanés et peu coûteux',
          url: '/lightning-network/',
          category: 'Guide'
        },
        {
          icon: '🔒',
          title: 'Sécurité Bitcoin',
          description: 'Meilleures pratiques de sécurisation',
          url: '/securisation/',
          category: 'Sécurité'
        },
        {
          icon: '👥',
          title: 'Contribuer à Token4Good',
          description: 'Rejoignez notre communauté',
          url: '/token4good/contribuer/',
          category: 'Communauté'
        }
      ];
    }

    if (path.includes('/solutions/')) {
      return [
        {
          icon: '📋',
          title: 'Guide de démarrage complet',
          description: 'Vos premiers pas avec nos solutions',
          url: '/getting-started/',
          category: 'Guide'
        },
        {
          icon: '🔧',
          title: 'Support technique',
          description: 'FAQ et assistance produits',
          url: '/solutions/dazbox/faq/',
          category: 'Support'
        },
        {
          icon: '💡',
          title: 'Comparaison des solutions',
          description: 'Choisir la meilleure solution pour vous',
          url: '/solutions/comparison/',
          category: 'Comparatif'
        }
      ];
    }

    if (path.includes('/token4good/')) {
      return [
        {
          icon: '🎓',
          title: 'Formation Lightning',
          description: 'Apprenez et gagnez des tokens',
          url: '/learn/lightning/',
          category: 'Formation'
        },
        {
          icon: '🏆',
          title: 'Challenges communautaires',
          description: 'Participez aux défis T4G',
          url: '/community/challenges/',
          category: 'Challenge'
        },
        {
          icon: '👥',
          title: 'Mentorat technique',
          description: 'Accompagnement personnalisé',
          url: '/community/mentoring/',
          category: 'Mentorat'
        }
      ];
    }

    return suggestions;
  }

  getDefaultSuggestions() {
    return [
      {
        icon: '🚀',
        title: 'Quick Start DazBox',
        description: 'Configuration en 30 minutes',
        url: '/quick-start/dazbox-30min/',
        category: 'Quick Start'
      },
      {
        icon: '⚡',
        title: 'Guide Lightning Network',
        description: 'Comprendre le réseau Lightning',
        url: '/lightning-network/',
        category: 'Guide'
      },
      {
        icon: '🌟',
        title: 'Découvrir Token4Good',
        description: 'Contribuez et gagnez des récompenses',
        url: '/token4good/',
        category: 'Communauté'
      }
    ];
  }

  renderSuggestions(suggestions, container) {
    if (!container || !suggestions.length) return;

    const html = suggestions.map((suggestion, index) => `
      <div class="suggestion-card animate-fade-in-up" style="animation-delay: ${index * 0.1}s">
        <div class="suggestion-icon">${suggestion.icon}</div>
        <div class="suggestion-content">
          <div class="suggestion-meta">
            <span class="suggestion-category">${suggestion.category}</span>
          </div>
          <h4 class="suggestion-title">${suggestion.title}</h4>
          <p class="suggestion-description">${suggestion.description}</p>
          <a href="${suggestion.url}" class="suggestion-link">
            Découvrir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;

    // Ajouter les event listeners pour analytics
    const links = container.querySelectorAll('.suggestion-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contextual_suggestion_click', {
            event_category: 'navigation',
            event_label: link.href,
            suggestion_type: 'contextual'
          });
        }
      });
    });
  }

  /* Reading Time Calculation */
  calculateReadingTime() {
    const readingTimeEl = document.getElementById('reading-time');
    if (!readingTimeEl) return;

    const content = document.querySelector('[data-pagefind-body]') || document.querySelector('.article-content');
    if (!content) return;

    const text = content.textContent || content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const averageWPM = 200; // mots par minute
    const readingMinutes = Math.ceil(wordCount / averageWPM);

    this.readingTime = readingMinutes;
    readingTimeEl.textContent = `~${readingMinutes} min de lecture`;
  }

  /* Global Events */
  bindGlobalEvents() {
    // Gestion du resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Fermer le menu mobile si on passe en desktop
        if (window.innerWidth > 1024) {
          this.closeMobileMenu();
        }
      }, 250);
    });

    // Gestion des liens externes
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="http"]');
      if (link && !link.href.includes(window.location.hostname)) {
        // Analytics pour liens externes
        if (typeof gtag !== 'undefined') {
          gtag('event', 'external_link_click', {
            event_category: 'navigation',
            event_label: link.href
          });
        }
      }
    });

    // Performance: lazy load des images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /* Utilities */
  markAsLoaded() {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    this.isLoaded = true;
  }

  // API publique pour d'autres scripts
  getScrollProgress() {
    return this.scrollProgress;
  }

  getReadingTime() {
    return this.readingTime;
  }

  showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'error' ? '#EF4444' : '#3B82F6',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      zIndex: '1000',
      opacity: '0',
      transform: 'translateY(-20px)',
      transition: 'all 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Additional CSS pour les suggestions
const additionalCSS = `
.suggestion-card {
  background: var(--dazno-surface);
  border: 1px solid var(--dazno-border-light);
  border-radius: var(--dazno-radius-lg);
  padding: var(--dazno-space-lg);
  transition: all var(--dazno-transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.suggestion-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--dazno-shadow-lg);
  border-color: var(--dazno-primary);
}

.suggestion-icon {
  font-size: 2rem;
  margin-bottom: var(--dazno-space-md);
}

.suggestion-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.suggestion-meta {
  margin-bottom: var(--dazno-space-xs);
}

.suggestion-category {
  font-size: var(--dazno-text-xs);
  font-weight: 600;
  color: var(--dazno-primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 8px;
  border-radius: var(--dazno-radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestion-title {
  font-size: var(--dazno-text-lg);
  font-weight: 600;
  color: var(--dazno-text-primary);
  margin: 0 0 var(--dazno-space-sm) 0;
}

.suggestion-description {
  font-size: var(--dazno-text-sm);
  color: var(--dazno-text-secondary);
  line-height: var(--dazno-leading-relaxed);
  margin: 0 0 var(--dazno-space-md) 0;
  flex: 1;
}

.suggestion-link {
  display: inline-flex;
  align-items: center;
  gap: var(--dazno-space-xs);
  color: var(--dazno-primary);
  font-weight: 500;
  font-size: var(--dazno-text-sm);
  text-decoration: none;
  margin-top: auto;
  transition: all var(--dazno-transition-fast);
}

.suggestion-link:hover {
  color: var(--dazno-primary-dark);
  transform: translateX(2px);
}

.suggestion-link svg {
  transition: transform var(--dazno-transition-fast);
}

.suggestion-link:hover svg {
  transform: translateX(2px);
}
`;

// Injecter le CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Initialiser l'application
window.modernApp = new ModernApp();

// Export pour compatibilité modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernApp;
}