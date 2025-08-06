/**
 * Utilitaires d'accessibilité pour améliorer l'expérience utilisateur
 */

class AccessibilityUtils {
  constructor() {
    this.announcements = [];
    this.init();
  }

  init() {
    this.setupLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderUtils();
    
    console.log('♿ Utilitaires d\'accessibilité initialisés');
  }

  setupLiveRegion() {
    // Créer une région live pour les annonces
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }

  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) return;

    // Changer temporairement la priorité si nécessaire
    if (priority === 'assertive') {
      liveRegion.setAttribute('aria-live', 'assertive');
      setTimeout(() => {
        liveRegion.setAttribute('aria-live', 'polite');
      }, 1000);
    }

    // Effacer le contenu précédent et ajouter le nouveau message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);

    // Nettoyer après 5 secondes
    setTimeout(() => {
      if (liveRegion.textContent === message) {
        liveRegion.textContent = '';
      }
    }, 5000);

    console.log(`📢 Annonce: ${message}`);
  }

  setupKeyboardNavigation() {
    // Navigation par raccourcis clavier
    document.addEventListener('keydown', (e) => {
      // Alt + M = Menu principal
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const mainNav = document.querySelector('.sidebar-nav');
        if (mainNav) {
          const firstLink = mainNav.querySelector('a, button');
          if (firstLink) {
            firstLink.focus();
            this.announce('Navigation principale activée');
          }
        }
      }

      // Alt + S = Recherche
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('#search input, .search-input');
        if (searchInput) {
          searchInput.focus();
          this.announce('Recherche activée');
        }
      }

      // Alt + C = Contenu principal
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const mainContent = document.querySelector('main, #main-content');
        if (mainContent) {
          mainContent.focus();
          this.announce('Contenu principal activé');
        }
      }

      // Échap = Fermer les éléments ouverts
      if (e.key === 'Escape') {
        this.closeAllOverlays();
      }
    });
  }

  setupFocusManagement() {
    // Améliorer la visibilité du focus
    let focusedElement = null;

    document.addEventListener('focusin', (e) => {
      focusedElement = e.target;
      
      // Annoncer le type d'élément pour les lecteurs d'écran
      if (e.target.tagName === 'BUTTON' && !e.target.getAttribute('aria-label')) {
        const text = e.target.textContent.trim();
        if (text) {
          e.target.setAttribute('aria-label', `Bouton ${text}`);
        }
      }
    });

    document.addEventListener('focusout', (e) => {
      focusedElement = null;
    });

    // Gérer le focus sur les éléments dynamiques
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.enhanceAddedElements(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  enhanceAddedElements(element) {
    // Améliorer les éléments ajoutés dynamiquement
    
    // Boutons sans label
    const buttons = element.querySelectorAll ? element.querySelectorAll('button:not([aria-label]):not([aria-labelledby])') : [];
    buttons.forEach(button => {
      const text = button.textContent.trim();
      if (text && text.length > 0) {
        button.setAttribute('aria-label', text);
      }
    });

    // Images sans alt
    const images = element.querySelectorAll ? element.querySelectorAll('img:not([alt])') : [];
    images.forEach(img => {
      img.setAttribute('alt', ''); // Image décorative par défaut
    });

    // Liens externes
    const externalLinks = element.querySelectorAll ? element.querySelectorAll('a[href^="http"]:not([aria-label])') : [];
    externalLinks.forEach(link => {
      if (!link.hostname || link.hostname !== window.location.hostname) {
        const currentLabel = link.getAttribute('aria-label') || link.textContent.trim();
        link.setAttribute('aria-label', `${currentLabel} (ouvre dans un nouvel onglet)`);
        
        if (!link.getAttribute('target')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
  }

  setupScreenReaderUtils() {
    // Utilitaires pour les lecteurs d'écran
    
    // Détecter les lecteurs d'écran
    this.screenReaderDetected = this.detectScreenReader();
    
    if (this.screenReaderDetected) {
      document.body.classList.add('screen-reader-detected');
      console.log('📖 Lecteur d\'écran détecté');
      
      // Améliorations spécifiques aux lecteurs d'écran
      this.enhanceForScreenReaders();
    }
  }

  detectScreenReader() {
    // Méthodes de détection des lecteurs d'écran
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis ||
           window.webkitSpeechSynthesis ||
           'speechSynthesis' in window;
  }

  enhanceForScreenReaders() {
    // Ajouter des descriptions plus détaillées
    document.querySelectorAll('img[alt=""]').forEach(img => {
      if (img.closest('button') || img.closest('a')) {
        img.setAttribute('role', 'presentation');
      }
    });

    // Améliorer les tableaux
    document.querySelectorAll('table').forEach(table => {
      if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
        const firstHeader = table.querySelector('th');
        if (firstHeader) {
          table.setAttribute('aria-label', `Tableau: ${firstHeader.textContent}`);
        }
      }
    });

    // Améliorer les listes
    document.querySelectorAll('ul, ol').forEach(list => {
      if (!list.getAttribute('aria-label') && list.children.length > 0) {
        const firstItem = list.querySelector('li');
        if (firstItem) {
          const context = list.closest('nav') ? 'navigation' : 'liste';
          list.setAttribute('aria-label', `${context} de ${list.children.length} éléments`);
        }
      }
    });
  }

  closeAllOverlays() {
    // Fermer tous les éléments overlay ouverts
    
    // Tooltips
    document.querySelectorAll('.help-tooltip, .glossary-tooltip').forEach(tooltip => {
      tooltip.style.display = 'none';
      tooltip.setAttribute('aria-hidden', 'true');
    });

    // Menus déroulants
    document.querySelectorAll('[aria-expanded="true"]').forEach(element => {
      element.setAttribute('aria-expanded', 'false');
      const controlledElement = document.getElementById(element.getAttribute('aria-controls'));
      if (controlledElement) {
        controlledElement.hidden = true;
      }
    });

    // Wizard
    if (window.onboardingWizard) {
      window.onboardingWizard.close();
    }

    this.announce('Éléments fermés');
  }

  // Méthodes utilitaires publiques

  skipToContent() {
    const mainContent = document.querySelector('main, #main-content, .content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      this.announce('Contenu principal');
    }
  }

  skipToNavigation() {
    const nav = document.querySelector('nav, .navigation, .sidebar-nav');
    if (nav) {
      const firstFocusable = nav.querySelector('a, button, input');
      if (firstFocusable) {
        firstFocusable.focus();
        this.announce('Navigation principale');
      }
    }
  }

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isEnabled = document.body.classList.contains('high-contrast');
    this.announce(`Contraste élevé ${isEnabled ? 'activé' : 'désactivé'}`);
    
    localStorage.setItem('high-contrast', isEnabled);
  }

  toggleReducedMotion() {
    document.body.classList.toggle('reduce-motion');
    const isEnabled = document.body.classList.contains('reduce-motion');
    this.announce(`Mouvement réduit ${isEnabled ? 'activé' : 'désactivé'}`);
    
    localStorage.setItem('reduce-motion', isEnabled);
  }

  increaseFontSize() {
    const currentSize = parseInt(getComputedStyle(document.body).fontSize);
    const newSize = Math.min(currentSize + 2, 24);
    document.body.style.fontSize = newSize + 'px';
    this.announce(`Taille de police augmentée à ${newSize}px`);
    
    localStorage.setItem('font-size', newSize);
  }

  decreaseFontSize() {
    const currentSize = parseInt(getComputedStyle(document.body).fontSize);
    const newSize = Math.max(currentSize - 2, 12);
    document.body.style.fontSize = newSize + 'px';
    this.announce(`Taille de police réduite à ${newSize}px`);
    
    localStorage.setItem('font-size', newSize);
  }

  resetFontSize() {
    document.body.style.fontSize = '';
    this.announce('Taille de police réinitialisée');
    localStorage.removeItem('font-size');
  }

  // Charger les préférences sauvegardées
  loadPreferences() {
    // Contraste élevé
    if (localStorage.getItem('high-contrast') === 'true') {
      document.body.classList.add('high-contrast');
    }

    // Mouvement réduit
    if (localStorage.getItem('reduce-motion') === 'true') {
      document.body.classList.add('reduce-motion');
    }

    // Taille de police
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize) {
      document.body.style.fontSize = savedFontSize + 'px';
    }
  }

  // Créer un panneau d'accessibilité
  createAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'accessibility-panel-title');
    panel.style.display = 'none';
    
    panel.innerHTML = `
      <div class="accessibility-panel-header">
        <h2 id="accessibility-panel-title">Options d'accessibilité</h2>
        <button class="accessibility-panel-close" aria-label="Fermer le panneau">×</button>
      </div>
      <div class="accessibility-panel-content">
        <div class="accessibility-option">
          <button onclick="accessibilityUtils.toggleHighContrast()">
            Contraste élevé
          </button>
        </div>
        <div class="accessibility-option">
          <button onclick="accessibilityUtils.toggleReducedMotion()">
            Réduire les animations
          </button>
        </div>
        <div class="accessibility-option">
          <label>Taille de police :</label>
          <div class="font-size-controls">
            <button onclick="accessibilityUtils.decreaseFontSize()">A-</button>
            <button onclick="accessibilityUtils.resetFontSize()">A</button>
            <button onclick="accessibilityUtils.increaseFontSize()">A+</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Event listeners
    panel.querySelector('.accessibility-panel-close').addEventListener('click', () => {
      this.hideAccessibilityPanel();
    });
    
    return panel;
  }

  showAccessibilityPanel() {
    let panel = document.getElementById('accessibility-panel');
    if (!panel) {
      panel = this.createAccessibilityPanel();
    }
    
    panel.style.display = 'block';
    panel.querySelector('button').focus();
  }

  hideAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  // Créer un bouton d'accès rapide à l'accessibilité
  createAccessibilityButton() {
    const button = document.createElement('button');
    button.id = 'accessibility-toggle';
    button.className = 'accessibility-toggle';
    button.innerHTML = '♿';
    button.setAttribute('aria-label', 'Options d\'accessibilité');
    button.setAttribute('title', 'Options d\'accessibilité (Alt+A)');
    
    button.addEventListener('click', () => {
      this.showAccessibilityPanel();
    });
    
    // Raccourci clavier Alt+A
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        this.showAccessibilityPanel();
      }
    });
    
    document.body.appendChild(button);
    return button;
  }

  // Initialisation complète
  initComplete() {
    this.loadPreferences();
    this.createAccessibilityButton();
    this.announce('Fonctionnalités d\'accessibilité disponibles. Appuyez sur Alt+A pour les options.');
  }
}

// Styles CSS pour le panneau d'accessibilité
const accessibilityStyles = `
<style>
.accessibility-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9998;
  transition: all 0.2s;
}

.accessibility-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.accessibility-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 0;
  min-width: 300px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.accessibility-panel-header {
  background: var(--color-primary);
  color: white;
  padding: 16px 20px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accessibility-panel-header h2 {
  margin: 0;
  font-size: 18px;
}

.accessibility-panel-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.accessibility-panel-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.accessibility-panel-content {
  padding: 20px;
}

.accessibility-option {
  margin-bottom: 16px;
}

.accessibility-option button {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.2s;
}

.accessibility-option button:hover {
  background: var(--color-nav-active);
  border-color: var(--color-primary);
}

.font-size-controls {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.font-size-controls button {
  width: auto;
  flex: 1;
  text-align: center;
}

/* Classes d'accessibilité */
.high-contrast {
  filter: contrast(150%);
}

.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

.screen-reader-detected .decorative {
  display: none;
}

@media (max-width: 480px) {
  .accessibility-toggle {
    bottom: 80px;
    right: 16px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .accessibility-panel {
    width: 90vw;
    min-width: auto;
  }
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', accessibilityStyles);

// Initialisation
let accessibilityUtils = null;

document.addEventListener('DOMContentLoaded', () => {
  accessibilityUtils = new AccessibilityUtils();
  
  // Initialisation complète après un court délai
  setTimeout(() => {
    accessibilityUtils.initComplete();
  }, 1000);
  
  // Exposer globalement
  window.accessibilityUtils = accessibilityUtils;
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityUtils;
}