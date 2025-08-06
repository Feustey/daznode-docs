/**
 * Navigation mobile améliorée avec gestes et accessibilité
 */

class MobileNavigation {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.menuButton = null;
    this.closeButton = null;
    this.isOpen = false;
    this.touchStartX = null;
    this.touchStartY = null;
    this.focusableElements = [];
    this.previousFocus = null;
    
    this.init();
  }

  init() {
    // Vérifier si on est sur mobile
    if (window.innerWidth > 768) return;
    
    this.createElements();
    this.bindEvents();
    this.initAccessibility();
    
    console.log('🔨 Navigation mobile initialisée');
  }

  createElements() {
    this.sidebar = document.querySelector('.sidebar');
    this.menuButton = document.querySelector('.mobile-menu-button');
    
    if (!this.sidebar || !this.menuButton) {
      console.warn('⚠️ Éléments de navigation mobile non trouvés');
      return;
    }

    // Créer l'overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.overlay);

    // Améliorer le bouton burger
    this.improveBurgerButton();
    
    // Créer le bouton de fermeture dans la sidebar
    this.createCloseButton();
  }

  improveBurgerButton() {
    // Remplacer le contenu du bouton burger par une version animée
    this.menuButton.innerHTML = `
      <div class="burger-icon" aria-hidden="true">
        <div class="burger-line"></div>
        <div class="burger-line"></div>
        <div class="burger-line"></div>
      </div>
    `;
    
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.menuButton.setAttribute('aria-controls', 'mobile-sidebar');
    this.menuButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
  }

  createCloseButton() {
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'sidebar-close';
    this.closeButton.setAttribute('aria-label', 'Fermer le menu');
    this.closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    this.sidebar.appendChild(this.closeButton);
  }

  bindEvents() {
    if (!this.menuButton || !this.overlay) return;

    // Clic sur le bouton menu
    this.menuButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Clic sur l'overlay pour fermer
    this.overlay.addEventListener('click', () => {
      this.close();
    });

    // Clic sur le bouton de fermeture
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.close();
      });
    }

    // Gestes tactiles pour fermer
    this.bindTouchEvents();

    // Touche Escape pour fermer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close(false); // Fermer sans animation sur desktop
      }
    });

    // Fermer le menu lors de la navigation
    document.addEventListener('click', (e) => {
      if (this.isOpen && e.target.matches('.nav-link:not([aria-haspopup])')) {
        // Petit délai pour permettre la navigation
        setTimeout(() => this.close(), 100);
      }
    });
  }

  bindTouchEvents() {
    if (!this.sidebar) return;

    // Swipe pour fermer depuis la sidebar
    this.sidebar.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.sidebar.addEventListener('touchmove', (e) => {
      if (!this.touchStartX || !this.touchStartY) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      
      const deltaX = this.touchStartX - touchEndX;
      const deltaY = this.touchStartY - touchEndY;

      // Swipe horizontal vers la gauche pour fermer
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 50) {
        this.close();
      }
    }, { passive: true });

    this.sidebar.addEventListener('touchend', () => {
      this.touchStartX = null;
      this.touchStartY = null;
    }, { passive: true });

    // Swipe depuis le bord gauche pour ouvrir
    document.addEventListener('touchstart', (e) => {
      if (e.touches[0].clientX <= 20 && !this.isOpen) {
        this.touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (this.touchStartX !== null && this.touchStartX <= 20) {
        const deltaX = e.touches[0].clientX - this.touchStartX;
        if (deltaX > 50) {
          this.open();
          this.touchStartX = null;
        }
      }
    }, { passive: true });
  }

  initAccessibility() {
    if (!this.sidebar) return;

    this.sidebar.setAttribute('id', 'mobile-sidebar');
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Navigation mobile');

    // Collecter les éléments focusables
    this.updateFocusableElements();
  }

  updateFocusableElements() {
    if (!this.sidebar) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    this.focusableElements = Array.from(
      this.sidebar.querySelectorAll(focusableSelectors.join(', '))
    );
  }

  trapFocus(e) {
    if (!this.isOpen || this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen || !this.sidebar) return;

    this.isOpen = true;
    this.previousFocus = document.activeElement;

    // Classes et états
    this.sidebar.classList.add('open');
    this.overlay.classList.add('active');
    document.body.classList.add('menu-open');

    // ARIA
    this.menuButton.setAttribute('aria-expanded', 'true');
    this.menuButton.setAttribute('aria-label', 'Fermer le menu de navigation');
    this.sidebar.setAttribute('aria-hidden', 'false');
    this.overlay.setAttribute('aria-hidden', 'false');

    // Focus management
    this.updateFocusableElements();
    document.addEventListener('keydown', this.trapFocus.bind(this));
    
    // Focus sur le premier élément
    setTimeout(() => {
      if (this.closeButton) {
        this.closeButton.focus();
      } else if (this.focusableElements[0]) {
        this.focusableElements[0].focus();
      }
    }, 100);

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'mobile_menu_open', {
        'event_category': 'navigation',
        'event_label': 'mobile'
      });
    }

    console.log('📱 Menu mobile ouvert');
  }

  close(animate = true) {
    if (!this.isOpen || !this.sidebar) return;

    this.isOpen = false;

    // Classes et états
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('active');
    document.body.classList.remove('menu-open');

    // ARIA
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.menuButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');

    // Focus management
    document.removeEventListener('keydown', this.trapFocus.bind(this));
    
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'mobile_menu_close', {
        'event_category': 'navigation',
        'event_label': 'mobile'
      });
    }

    console.log('📱 Menu mobile fermé');
  }

  // Méthode publique pour fermer depuis l'extérieur
  closeMobileMenu() {
    this.close();
  }

  // Cleanup pour les SPA
  destroy() {
    if (this.overlay) {
      this.overlay.remove();
    }
    
    document.removeEventListener('keydown', this.trapFocus.bind(this));
    document.body.classList.remove('menu-open');
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que les éléments soient disponibles
  setTimeout(() => {
    window.mobileNav = new MobileNavigation();
  }, 100);
});

// Réinitialiser lors du redimensionnement
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth <= 768 && !window.mobileNav) {
      window.mobileNav = new MobileNavigation();
    }
  }, 250);
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileNavigation;
}