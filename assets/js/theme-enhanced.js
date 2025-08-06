/**
 * Gestionnaire de thème amélioré avec respect des préférences système
 * et transitions fluides entre les modes
 */

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.systemPreference = null;
    this.userPreference = null;
    this.mediaQuery = null;
    this.transitionTimeout = null;
    
    this.init();
  }

  init() {
    console.log('🎨 Initialisation du gestionnaire de thème...');
    
    // Détecter les préférences
    this.detectSystemPreference();
    this.loadUserPreference();
    
    // Déterminer le thème initial
    this.determineInitialTheme();
    
    // Appliquer le thème
    this.applyTheme(this.currentTheme, false);
    
    // Écouter les changements
    this.setupEventListeners();
    
    // Initialiser l'interface
    this.initializeToggleButton();
    
    console.log(`✅ Thème initialisé: ${this.currentTheme}`);
  }

  detectSystemPreference() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPreference = this.mediaQuery.matches ? 'dark' : 'light';
    
    console.log(`🔍 Préférence système détectée: ${this.systemPreference}`);
  }

  loadUserPreference() {
    this.userPreference = localStorage.getItem('daznode-theme');
    
    if (this.userPreference) {
      console.log(`👤 Préférence utilisateur: ${this.userPreference}`);
    } else {
      console.log('👤 Aucune préférence utilisateur enregistrée');
    }
  }

  determineInitialTheme() {
    // Priorité: préférence utilisateur > préférence système > mode clair par défaut
    if (this.userPreference && ['light', 'dark', 'auto'].includes(this.userPreference)) {
      if (this.userPreference === 'auto') {
        this.currentTheme = this.systemPreference;
      } else {
        this.currentTheme = this.userPreference;
      }
    } else {
      // Par défaut, respecter les préférences système
      this.currentTheme = this.systemPreference;
    }
    
    console.log(`🎯 Thème initial déterminé: ${this.currentTheme}`);
  }

  applyTheme(theme, animate = true) {
    if (!['light', 'dark'].includes(theme)) {
      console.warn(`⚠️ Thème invalide: ${theme}`);
      return;
    }

    // Préparer la transition si animation demandée
    if (animate) {
      this.prepareTransition();
    }

    // Appliquer la classe de thème
    document.documentElement.className = `theme-${theme}`;
    
    // Mettre à jour les méta-données
    this.updateMetaThemeColor(theme);
    
    // Mettre à jour l'interface
    this.updateToggleButton(theme);
    
    // Émettre un événement personnalisé
    this.dispatchThemeChangeEvent(theme);
    
    // Analytics
    this.trackThemeChange(theme);
    
    this.currentTheme = theme;
    
    console.log(`🎨 Thème appliqué: ${theme}`);
  }

  prepareTransition() {
    // Ajouter une classe pour contrôler les transitions
    document.documentElement.classList.add('theme-transitioning');
    
    // Retirer la classe après la transition
    clearTimeout(this.transitionTimeout);
    this.transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 200);
  }

  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        light: '#ffffff',
        dark: '#1a202c'
      };
      metaThemeColor.setAttribute('content', colors[theme] || colors.light);
    }
  }

  updateToggleButton(theme) {
    const toggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    if (!toggleButton || !sunIcon || !moonIcon) return;
    
    // Labels accessibles
    const labels = {
      light: 'Passer en mode sombre',
      dark: 'Passer en mode clair'
    };
    
    toggleButton.setAttribute('aria-label', labels[theme]);
    toggleButton.setAttribute('title', labels[theme]);
    
    // Icônes
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  setupEventListeners() {
    // Écouter les changements de préférences système
    if (this.mediaQuery) {
      this.mediaQuery.addEventListener('change', (e) => {
        this.systemPreference = e.matches ? 'dark' : 'light';
        console.log(`🔄 Préférence système changée: ${this.systemPreference}`);
        
        // Si l'utilisateur n'a pas de préférence explicite, suivre le système
        if (!this.userPreference || this.userPreference === 'auto') {
          this.applyTheme(this.systemPreference);
        }
      });
    }

    // Bouton de toggle
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Raccourci clavier (Ctrl+Shift+T ou Cmd+Shift+T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Écouter les changements de localStorage depuis d'autres onglets
    window.addEventListener('storage', (e) => {
      if (e.key === 'daznode-theme' && e.newValue !== this.userPreference) {
        this.userPreference = e.newValue;
        this.determineInitialTheme();
        this.applyTheme(this.currentTheme);
      }
    });
  }

  initializeToggleButton() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    // Améliorer l'accessibilité
    toggleButton.setAttribute('role', 'switch');
    toggleButton.setAttribute('aria-checked', this.currentTheme === 'dark');
    
    // Ajouter les classes CSS appropriées
    toggleButton.classList.add('theme-toggle-enhanced');
  }

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    
    // Sauvegarder la préférence utilisateur
    this.userPreference = newTheme;
    localStorage.setItem('daznode-theme', newTheme);
    
    // Appliquer le nouveau thème
    this.applyTheme(newTheme);
    
    // Feedback pour les lecteurs d'écran
    this.announceThemeChange(newTheme);
    
    console.log(`🔄 Thème basculé vers: ${newTheme}`);
  }

  setTheme(theme) {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.warn(`⚠️ Thème invalide: ${theme}`);
      return;
    }

    this.userPreference = theme;
    localStorage.setItem('daznode-theme', theme);
    
    if (theme === 'auto') {
      this.applyTheme(this.systemPreference);
    } else {
      this.applyTheme(theme);
    }
    
    console.log(`⚙️ Thème défini: ${theme}`);
  }

  getTheme() {
    return {
      current: this.currentTheme,
      user: this.userPreference,
      system: this.systemPreference
    };
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: {
        theme,
        userPreference: this.userPreference,
        systemPreference: this.systemPreference
      }
    });
    
    document.dispatchEvent(event);
  }

  announceThemeChange(theme) {
    const messages = {
      light: 'Mode clair activé',
      dark: 'Mode sombre activé'
    };
    
    // Créer un élément temporaire pour l'annonce
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = messages[theme];
    
    document.body.appendChild(announcement);
    
    // Supprimer après annonce
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  trackThemeChange(theme) {
    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_change', {
        'theme': theme,
        'user_preference': this.userPreference,
        'system_preference': this.systemPreference
      });
    }

    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
      plausible('Theme Change', {
        props: {
          theme,
          user_preference: this.userPreference
        }
      });
    }
  }

  // Méthode pour déboguer
  debug() {
    console.group('🎨 Gestionnaire de thème - État actuel');
    console.log('Thème actuel:', this.currentTheme);
    console.log('Préférence utilisateur:', this.userPreference);
    console.log('Préférence système:', this.systemPreference);
    console.log('Classes du document:', document.documentElement.className);
    console.groupEnd();
  }

  // Cleanup pour les SPA
  destroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemChange);
    }
    
    clearTimeout(this.transitionTimeout);
    
    console.log('🧹 Gestionnaire de thème nettoyé');
  }
}

// Classe utilitaire pour les écrans seulement (screen readers)
const srOnlyStyles = `
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
`;

// Injecter les styles sr-only
const styleSheet = document.createElement('style');
styleSheet.textContent = srOnlyStyles;
document.head.appendChild(styleSheet);

// Initialisation
let themeManager = null;

document.addEventListener('DOMContentLoaded', () => {
  themeManager = new ThemeManager();
  
  // Exposer globalement pour le debug
  window.themeManager = themeManager;
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}

// API publique
window.setTheme = (theme) => {
  if (themeManager) {
    themeManager.setTheme(theme);
  }
};

window.toggleTheme = () => {
  if (themeManager) {
    themeManager.toggle();
  }
};

window.getTheme = () => {
  return themeManager ? themeManager.getTheme() : null;
};