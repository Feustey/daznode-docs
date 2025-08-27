/**
 * Mobile UX Manager - Gestionnaire d'optimisations UX mobile
 * Expert UX Claude - Gestion complète de l'expérience mobile
 */

class MobileUXManager {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.activeModals = new Set();
    this.scrollPosition = 0;
    
    this.init();
  }

  init() {
    if (!this.isMobile) return;
    
    this.setupViewportHandler();
    this.setupModalManager();
    this.setupTouchOptimizations();
    this.setupScrollManager();
    this.setupFormOptimizations();
    this.setupPopupManager();
    
    console.log('📱 Mobile UX Manager initialized');
  }

  setupViewportHandler() {
    // Fix pour la hauteur de viewport iOS
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    // Orientation change handler
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });
  }

  setupModalManager() {
    // Gestionnaire universel des modales
    document.addEventListener('click', (e) => {
      // Fermeture des modales au clic sur backdrop
      if (e.target.classList.contains('modal-backdrop') || 
          e.target.classList.contains('overlay-backdrop') ||
          e.target.classList.contains('journey-popup') ||
          e.target.classList.contains('t4g-modal')) {
        this.closeAllModals();
      }
      
      // Gestion des boutons de fermeture
      if (e.target.classList.contains('modal-close') || 
          e.target.classList.contains('popup-close') ||
          e.target.classList.contains('close-btn')) {
        this.closeAllModals();
      }
    });

    // Fermeture des modales avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  setupTouchOptimizations() {
    // Suppression du délai de 300ms sur les taps
    if ('ontouchstart' in window) {
      document.body.style.touchAction = 'manipulation';
    }

    // Amélioration du feedback tactile
    document.addEventListener('touchstart', (e) => {
      if (this.isClickableElement(e.target)) {
        e.target.style.transform = 'scale(0.95)';
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (this.isClickableElement(e.target)) {
        setTimeout(() => {
          e.target.style.transform = '';
        }, 150);
      }
    }, { passive: true });

    document.addEventListener('touchcancel', (e) => {
      if (this.isClickableElement(e.target)) {
        e.target.style.transform = '';
      }
    }, { passive: true });
  }

  setupScrollManager() {
    let ticking = false;

    // Optimisation du scroll avec requestAnimationFrame
    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Prévention du scroll horizontal
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prévention du pinch-to-zoom
      }
    }, { passive: false });
  }

  setupFormOptimizations() {
    // Optimisation des formulaires pour mobile
    document.querySelectorAll('input, textarea, select').forEach(field => {
      // Prévention du zoom sur iOS
      if (this.isIOS && !field.hasAttribute('data-mobile-optimized')) {
        const currentSize = window.getComputedStyle(field).fontSize;
        const currentSizeValue = parseFloat(currentSize);
        
        if (currentSizeValue < 16) {
          field.style.fontSize = '16px';
        }
        
        field.setAttribute('data-mobile-optimized', 'true');
      }

      // Amélioration de la navigation au clavier virtuel
      field.addEventListener('focus', () => {
        setTimeout(() => {
          if (document.activeElement === field) {
            field.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 300); // Délai pour l'apparition du clavier
      });
    });
  }

  setupPopupManager() {
    // Gestionnaire spécifique pour les popups et widgets
    this.observePopups();
    this.optimizePopupPositioning();
  }

  observePopups() {
    const popupSelector = '.journey-popup, .t4g-modal, .modal, .popup, .tooltip';
    
    // Observer les changements dans le DOM pour détecter les nouveaux popups
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.matches && node.matches(popupSelector)) {
              this.optimizePopup(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Optimisation des popups existants
    document.querySelectorAll(popupSelector).forEach(popup => {
      this.optimizePopup(popup);
    });
  }

  optimizePopup(popup) {
    if (!popup || popup.hasAttribute('data-mobile-optimized')) return;

    // Ajout des classes d'optimisation mobile
    popup.classList.add('mobile-optimized');
    
    // Optimisation de la position
    if (popup.style.position === 'fixed' || popup.style.position === 'absolute') {
      popup.style.maxWidth = 'calc(100vw - 32px)';
      popup.style.maxHeight = 'calc(100vh - 32px)';
    }

    // Ajout d'un système de fermeture amélioré
    if (!popup.querySelector('.mobile-close-area')) {
      const closeArea = document.createElement('div');
      closeArea.className = 'mobile-close-area';
      closeArea.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 44px;
        height: 44px;
        z-index: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        font-size: 24px;
        border-radius: 0 8px 0 8px;
        background: rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(4px);
      `;
      closeArea.innerHTML = '×';
      closeArea.addEventListener('click', () => this.closePopup(popup));
      popup.appendChild(closeArea);
    }

    popup.setAttribute('data-mobile-optimized', 'true');
  }

  optimizePopupPositioning() {
    const repositionPopups = () => {
      document.querySelectorAll('.mobile-optimized').forEach(popup => {
        if (popup.style.display === 'none' || !popup.offsetParent) return;

        const rect = popup.getBoundingClientRect();
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        // Repositionnement si le popup dépasse
        if (rect.right > viewport.width) {
          popup.style.left = Math.max(16, viewport.width - rect.width - 16) + 'px';
        }
        
        if (rect.bottom > viewport.height) {
          popup.style.top = Math.max(16, viewport.height - rect.height - 16) + 'px';
        }

        // Gestion du scroll si le contenu dépasse
        if (rect.height > viewport.height - 32) {
          popup.style.height = viewport.height - 32 + 'px';
          popup.style.overflowY = 'auto';
        }
      });
    };

    // Repositionnement au resize et à l'orientation change
    window.addEventListener('resize', repositionPopups);
    window.addEventListener('orientationchange', () => {
      setTimeout(repositionPopups, 200);
    });
  }

  closePopup(popup) {
    if (popup.classList.contains('show')) {
      popup.classList.remove('show');
    }
    
    if (popup.classList.contains('active')) {
      popup.classList.remove('active');
    }

    // Tentatives de fermeture avec différentes méthodes
    setTimeout(() => {
      if (popup.style.display !== 'none') {
        popup.style.display = 'none';
      }
      
      // Suppression du DOM si c'est un popup temporaire
      if (popup.hasAttribute('data-temporary')) {
        popup.remove();
      }
    }, 300);

    // Restauration du scroll du body
    this.restoreBodyScroll();
    
    this.activeModals.delete(popup);
  }

  closeAllModals() {
    document.querySelectorAll('.journey-popup.show, .t4g-modal.show, .modal.show, .popup.active').forEach(modal => {
      this.closePopup(modal);
    });
    
    // Reset général
    this.restoreBodyScroll();
    this.activeModals.clear();
  }

  lockBodyScroll() {
    this.scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
  }

  restoreBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, this.scrollPosition);
  }

  isClickableElement(element) {
    const clickableSelectors = [
      'button', '.btn', 'a', '.clickable', '.interactive', 
      '.nav-link', '.menu-link', '.card', '.t4g-btn'
    ];
    
    return clickableSelectors.some(selector => {
      return element.matches && element.matches(selector);
    });
  }

  handleScroll() {
    // Gestion du scroll avec optimisations
    const scrollY = window.scrollY;
    
    // Masquage/affichage des éléments selon le scroll
    document.querySelectorAll('.t4g-widget, .floating-widget').forEach(widget => {
      if (scrollY > 200) {
        widget.style.transform = widget.style.transform.includes('translateX') 
          ? widget.style.transform.replace(/translateY\([^)]*\)/, 'translateY(-10px)')
          : 'translateY(-10px)';
      } else {
        widget.style.transform = widget.style.transform.replace(/translateY\([^)]*\)/, '');
      }
    });
  }

  // API publique pour interaction externe
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `mobile-notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('data-temporary', 'true');
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 16px;
      right: 16px;
      padding: 16px;
      background: var(--color-primary, #2563eb);
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  // Méthode pour forcer l'optimisation d'un élément
  optimizeElement(element) {
    if (this.isMobile && element) {
      this.optimizePopup(element);
    }
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  window.mobileUXManager = new MobileUXManager();
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileUXManager;
}