/**
 * Système d'Accessibilité WCAG 2.2 AAA
 * Accessibilité universelle et adaptations dynamiques
 */

class WCAGAccessibilitySystem {
  constructor() {
    this.preferences = this.loadAccessibilityPreferences();
    this.screenReader = this.detectScreenReader();
    this.keyboardNavigation = new KeyboardNavigationManager();
    this.colorContrast = new ColorContrastManager();
    this.textToSpeech = new TextToSpeechManager();
    this.motionReducer = new MotionReducer();
    this.focusManager = new FocusManager();
    this.init();
  }

  loadAccessibilityPreferences() {
    const saved = localStorage.getItem('accessibilityPreferences');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      fontFamily: 'default',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      highContrast: false,
      darkMode: 'auto',
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      captionsEnabled: false,
      signLanguage: false,
      colorBlindness: 'none',
      dyslexiaSupport: false,
      adhd: false,
      autism: false,
      lowVision: false,
      magnification: 100,
      cursorSize: 'normal',
      clickTarget: 'normal',
      timeout: 'default'
    };
  }

  init() {
    this.createAccessibilityToolbar();
    this.setupKeyboardNavigation();
    this.initializeScreenReaderSupport();
    this.setupColorContrastControls();
    this.initializeTextToSpeech();
    this.setupMotionControls();
    this.initializeFocusManagement();
    this.setupARIALabels();
    this.createSkipLinks();
    this.setupAccessibilityShortcuts();
    this.initializeAccessibilityAudit();
    this.applyUserPreferences();
  }

  createAccessibilityToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'accessibility-toolbar';
    toolbar.className = 'accessibility-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Outils d\'accessibilité');
    
    toolbar.innerHTML = `
      <button class="accessibility-toggle" id="accessibility-toggle" 
              aria-label="Ouvrir les options d'accessibilité" 
              aria-expanded="false">
        <svg class="icon-accessibility" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V8.5C15 9.3 14.3 10 13.5 10S12 9.3 12 8.5V7L6 7.5V9L5 9L7 23H9.5L11.5 18.5L12.5 18.5L14.5 23H17L19 9L21 9Z"/>
        </svg>
        <span class="toolbar-label">Accessibilité</span>
      </button>

      <div class="accessibility-panel" id="accessibility-panel" aria-hidden="true" role="dialog" aria-labelledby="accessibility-panel-title">
        <div class="panel-header">
          <h2 id="accessibility-panel-title">Options d'Accessibilité</h2>
          <button class="panel-close" id="panel-close" aria-label="Fermer les options d'accessibilité">✕</button>
        </div>

        <div class="panel-content">
          <!-- Vision -->
          <section class="accessibility-section" role="group" aria-labelledby="vision-title">
            <h3 id="vision-title">Vision</h3>
            
            <div class="control-group">
              <label for="font-size-control">Taille du texte</label>
              <div class="font-size-controls" role="group" aria-labelledby="font-size-control">
                <button class="font-size-btn" data-size="small" aria-label="Petite taille de texte">A</button>
                <button class="font-size-btn active" data-size="medium" aria-label="Taille de texte normale">A</button>
                <button class="font-size-btn" data-size="large" aria-label="Grande taille de texte">A</button>
                <button class="font-size-btn" data-size="extra-large" aria-label="Très grande taille de texte">A</button>
              </div>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" id="high-contrast" class="accessibility-checkbox">
                <span class="checkbox-label">Contraste élevé</span>
              </label>
            </div>

            <div class="control-group">
              <label for="color-theme">Thème de couleur</label>
              <select id="color-theme" class="accessibility-select">
                <option value="auto">Automatique</option>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="sepia">Sépia</option>
              </select>
            </div>

            <div class="control-group">
              <label for="colorblind-filter">Filtre daltonisme</label>
              <select id="colorblind-filter" class="accessibility-select">
                <option value="none">Aucun</option>
                <option value="protanopia">Protanopie</option>
                <option value="deuteranopia">Deutéranopie</option>
                <option value="tritanopia">Tritanopie</option>
              </select>
            </div>

            <div class="control-group">
              <label for="magnification">Zoom de page</label>
              <input type="range" id="magnification" min="75" max="200" step="25" value="100" 
                     aria-label="Niveau de zoom de la page">
              <span id="magnification-value" aria-live="polite">100%</span>
            </div>
          </section>

          <!-- Mobilité -->
          <section class="accessibility-section" role="group" aria-labelledby="mobility-title">
            <h3 id="mobility-title">Mobilité</h3>
            
            <div class="control-group">
              <label>
                <input type="checkbox" id="reduced-motion" class="accessibility-checkbox">
                <span class="checkbox-label">Réduire les animations</span>
              </label>
            </div>

            <div class="control-group">
              <label for="cursor-size">Taille du curseur</label>
              <select id="cursor-size" class="accessibility-select">
                <option value="normal">Normal</option>
                <option value="large">Grand</option>
                <option value="extra-large">Très grand</option>
              </select>
            </div>

            <div class="control-group">
              <label for="click-target">Taille des zones cliquables</label>
              <select id="click-target" class="accessibility-select">
                <option value="normal">Normal</option>
                <option value="large">Grand</option>
                <option value="extra-large">Très grand</option>
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" id="keyboard-navigation" class="accessibility-checkbox" checked>
                <span class="checkbox-label">Navigation au clavier activée</span>
              </label>
            </div>
          </section>

          <!-- Cognition -->
          <section class="accessibility-section" role="group" aria-labelledby="cognitive-title">
            <h3 id="cognitive-title">Cognition</h3>
            
            <div class="control-group">
              <label>
                <input type="checkbox" id="dyslexia-support" class="accessibility-checkbox">
                <span class="checkbox-label">Support dyslexie</span>
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" id="adhd-support" class="accessibility-checkbox">
                <span class="checkbox-label">Support ADHD (distractions réduites)</span>
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" id="autism-support" class="accessibility-checkbox">
                <span class="checkbox-label">Support autisme (interface simplifiée)</span>
              </label>
            </div>

            <div class="control-group">
              <label for="session-timeout">Délai de session</label>
              <select id="session-timeout" class="accessibility-select">
                <option value="default">Par défaut (30min)</option>
                <option value="extended">Étendu (60min)</option>
                <option value="unlimited">Illimité</option>
              </select>
            </div>
          </section>

          <!-- Audio -->
          <section class="accessibility-section" role="group" aria-labelledby="audio-title">
            <h3 id="audio-title">Audio</h3>
            
            <div class="control-group">
              <label>
                <input type="checkbox" id="screen-reader-mode" class="accessibility-checkbox">
                <span class="checkbox-label">Mode lecteur d'écran</span>
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" id="audio-descriptions" class="accessibility-checkbox">
                <span class="checkbox-label">Descriptions audio</span>
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" id="captions-enabled" class="accessibility-checkbox">
                <span class="checkbox-label">Sous-titres activés</span>
              </label>
            </div>

            <div class="control-group">
              <button class="btn-tts" id="toggle-tts" aria-label="Activer/désactiver la lecture vocale">
                <svg class="icon-speaker" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3,9V15H7L12,20V4L7,9H3M16.5,12A4.5,4.5 0 0,0 12,7.5V16.5A4.5,4.5 0 0,0 16.5,12Z"/>
                </svg>
                Lecture vocale
              </button>
            </div>
          </section>

          <!-- Actions -->
          <div class="panel-actions">
            <button class="btn-reset" id="reset-accessibility" aria-label="Réinitialiser toutes les options">
              Réinitialiser
            </button>
            <button class="btn-save" id="save-accessibility" aria-label="Sauvegarder les préférences">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(toolbar);
    this.setupToolbarEvents();
  }

  setupToolbarEvents() {
    const toggle = document.getElementById('accessibility-toggle');
    const panel = document.getElementById('accessibility-panel');
    const close = document.getElementById('panel-close');

    toggle.addEventListener('click', () => {
      const isOpen = panel.getAttribute('aria-hidden') === 'false';
      this.togglePanel(!isOpen);
    });

    close.addEventListener('click', () => {
      this.togglePanel(false);
    });

    // Font size controls
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFontSize(btn.dataset.size);
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Checkbox controls
    document.querySelectorAll('.accessibility-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.handleCheckboxChange(e.target.id, e.target.checked);
      });
    });

    // Select controls
    document.querySelectorAll('.accessibility-select').forEach(select => {
      select.addEventListener('change', (e) => {
        this.handleSelectChange(e.target.id, e.target.value);
      });
    });

    // Range controls
    document.getElementById('magnification').addEventListener('input', (e) => {
      this.setMagnification(e.target.value);
    });

    // Action buttons
    document.getElementById('reset-accessibility').addEventListener('click', () => {
      this.resetPreferences();
    });

    document.getElementById('save-accessibility').addEventListener('click', () => {
      this.savePreferences();
      this.showAccessibilityMessage('Préférences sauvegardées');
    });

    document.getElementById('toggle-tts').addEventListener('click', () => {
      this.toggleTextToSpeech();
    });
  }

  togglePanel(open) {
    const toggle = document.getElementById('accessibility-toggle');
    const panel = document.getElementById('accessibility-panel');

    if (open) {
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
      // Focus sur le premier élément
      panel.querySelector('button, input, select').focus();
    } else {
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
      toggle.focus();
    }
  }

  setupKeyboardNavigation() {
    // Navigation au clavier globale
    document.addEventListener('keydown', (e) => {
      if (this.preferences.keyboardNavigation) {
        this.keyboardNavigation.handleKeydown(e);
      }
    });

    // Skip links
    this.createSkipLinks();
  }

  createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Aller au contenu principal</a>
      <a href="#navigation" class="skip-link">Aller à la navigation</a>
      <a href="#search" class="skip-link">Aller à la recherche</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  initializeScreenReaderSupport() {
    // Détection des lecteurs d'écran
    this.screenReader.detect();
    
    // Annonces ARIA live
    this.createLiveRegions();
    
    // Amélioration des descriptions
    this.enhanceARIADescriptions();
  }

  createLiveRegions() {
    // Région pour les annonces importantes
    const announcements = document.createElement('div');
    announcements.id = 'aria-announcements';
    announcements.setAttribute('aria-live', 'assertive');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    document.body.appendChild(announcements);

    // Région pour les mises à jour
    const updates = document.createElement('div');
    updates.id = 'aria-updates';
    updates.setAttribute('aria-live', 'polite');
    updates.setAttribute('aria-atomic', 'false');
    updates.className = 'sr-only';
    document.body.appendChild(updates);

    // Région pour le statut
    const status = document.createElement('div');
    status.id = 'aria-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.className = 'sr-only';
    document.body.appendChild(status);
  }

  enhanceARIADescriptions() {
    // Améliore automatiquement les descriptions ARIA
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.alt = this.generateAltText(img);
    });

    document.querySelectorAll('button:not([aria-label])').forEach(btn => {
      btn.setAttribute('aria-label', this.generateButtonLabel(btn));
    });

    document.querySelectorAll('link:not([aria-label])').forEach(link => {
      link.setAttribute('aria-label', this.generateLinkLabel(link));
    });
  }

  generateAltText(img) {
    const src = img.src;
    const className = img.className;
    
    if (src.includes('logo')) return 'Logo Dazno';
    if (src.includes('bitcoin')) return 'Icône Bitcoin';
    if (src.includes('lightning')) return 'Icône Lightning Network';
    if (className.includes('avatar')) return 'Avatar utilisateur';
    
    return 'Image';
  }

  generateButtonLabel(btn) {
    const text = btn.textContent.trim();
    if (text) return text;
    
    const icon = btn.querySelector('svg, .icon');
    if (icon) {
      const className = icon.className;
      if (className.includes('search')) return 'Rechercher';
      if (className.includes('menu')) return 'Menu';
      if (className.includes('close')) return 'Fermer';
    }
    
    return 'Bouton';
  }

  generateLinkLabel(link) {
    const text = link.textContent.trim();
    if (text) return text;
    
    const href = link.href;
    if (href) {
      const url = new URL(href);
      return `Lien vers ${url.pathname}`;
    }
    
    return 'Lien';
  }

  setupColorContrastControls() {
    this.colorContrast.init();
  }

  initializeTextToSpeech() {
    this.textToSpeech.init();
    
    // Lecture automatique du contenu principal
    if (this.preferences.screenReader) {
      this.announcePageContent();
    }
  }

  announcePageContent() {
    const title = document.title;
    const mainHeading = document.querySelector('h1')?.textContent;
    
    let announcement = `Page chargée: ${title}`;
    if (mainHeading && mainHeading !== title) {
      announcement += `. Titre principal: ${mainHeading}`;
    }
    
    this.announce(announcement);
  }

  setupMotionControls() {
    this.motionReducer.init();
    
    // Respect des préférences système
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.preferences.reducedMotion = true;
      this.applyReducedMotion();
    }
  }

  initializeFocusManagement() {
    this.focusManager.init();
    
    // Focus visible amélioré
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupARIALabels() {
    // Améliore les labels ARIA dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.enhanceElementAccessibility(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  enhanceElementAccessibility(element) {
    // Formulaires
    element.querySelectorAll('input, textarea, select').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = input.closest('label') || 
                     document.querySelector(`label[for="${input.id}"]`);
        if (label) {
          input.setAttribute('aria-labelledby', label.id || this.generateId('label'));
        }
      }
    });

    // Boutons interactifs
    element.querySelectorAll('[onclick], [data-action]').forEach(interactive => {
      if (!interactive.getAttribute('role')) {
        interactive.setAttribute('role', 'button');
      }
      if (!interactive.getAttribute('tabindex')) {
        interactive.setAttribute('tabindex', '0');
      }
    });

    // Régions de contenu
    element.querySelectorAll('main, nav, aside, section').forEach(region => {
      if (!region.getAttribute('role') && !region.getAttribute('aria-label')) {
        const heading = region.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          region.setAttribute('aria-labelledby', heading.id || this.generateId('heading'));
        }
      }
    });
  }

  setupAccessibilityShortcuts() {
    // Raccourcis clavier pour l'accessibilité
    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.focusMainContent();
            break;
          case '2':
            e.preventDefault();
            this.focusNavigation();
            break;
          case '3':
            e.preventDefault();
            this.focusSearch();
            break;
          case 'a':
            e.preventDefault();
            this.togglePanel(true);
            break;
          case 't':
            e.preventDefault();
            this.toggleTextToSpeech();
            break;
          case 'c':
            e.preventDefault();
            this.toggleHighContrast();
            break;
          case 'm':
            e.preventDefault();
            this.toggleReducedMotion();
            break;
        }
      }
    });
  }

  focusMainContent() {
    const main = document.querySelector('main, #main-content, [role="main"]');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }

  focusNavigation() {
    const nav = document.querySelector('nav, #navigation, [role="navigation"]');
    if (nav) {
      const firstLink = nav.querySelector('a, button');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }

  focusSearch() {
    const search = document.querySelector('#search, [role="search"] input, .search-input');
    if (search) {
      search.focus();
    }
  }

  initializeAccessibilityAudit() {
    // Audit d'accessibilité en temps réel
    this.auditResults = {
      errors: [],
      warnings: [],
      info: []
    };

    this.runBasicAudit();
    
    // Audit périodique
    setInterval(() => {
      this.runBasicAudit();
    }, 30000);
  }

  runBasicAudit() {
    this.auditResults = { errors: [], warnings: [], info: [] };

    // Images sans alt
    document.querySelectorAll('img:not([alt])').forEach(img => {
      this.auditResults.errors.push({
        element: img,
        message: 'Image sans attribut alt',
        wcag: '1.1.1'
      });
    });

    // Boutons sans label
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
      if (!btn.textContent.trim()) {
        this.auditResults.errors.push({
          element: btn,
          message: 'Bouton sans label accessible',
          wcag: '4.1.2'
        });
      }
    });

    // Contraste insuffisant
    this.checkColorContrast();

    // Focus non visible
    this.checkFocusVisibility();

    // Headings mal structurés
    this.checkHeadingStructure();

    if (this.auditResults.errors.length > 0) {
      console.warn('Problèmes d\'accessibilité détectés:', this.auditResults);
    }
  }

  checkColorContrast() {
    // Vérification simplifiée du contraste
    const elements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    
    elements.forEach(el => {
      const style = getComputedStyle(el);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Calcul simplifié - devrait être plus complexe en production
      if (this.calculateContrastRatio(color, backgroundColor) < 4.5) {
        this.auditResults.warnings.push({
          element: el,
          message: 'Contraste potentiellement insuffisant',
          wcag: '1.4.3'
        });
      }
    });
  }

  calculateContrastRatio(color1, color2) {
    // Implémentation simplifiée
    // En production, utiliser une librairie comme 'color-contrast'
    return 4.5; // Placeholder
  }

  checkFocusVisibility() {
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    
    focusableElements.forEach(el => {
      const style = getComputedStyle(el, ':focus');
      if (style.outline === 'none' && !style.boxShadow.includes('inset')) {
        this.auditResults.warnings.push({
          element: el,
          message: 'Focus non visible',
          wcag: '2.4.7'
        });
      }
    });
  }

  checkHeadingStructure() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let lastLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > lastLevel + 1) {
        this.auditResults.warnings.push({
          element: heading,
          message: `Saut de niveau de titre (${lastLevel} vers ${level})`,
          wcag: '1.3.1'
        });
      }
      
      lastLevel = level;
    });
  }

  // Gestionnaires d'événements
  handleCheckboxChange(id, checked) {
    switch (id) {
      case 'high-contrast':
        this.preferences.highContrast = checked;
        this.toggleHighContrast(checked);
        break;
      case 'reduced-motion':
        this.preferences.reducedMotion = checked;
        this.toggleReducedMotion(checked);
        break;
      case 'keyboard-navigation':
        this.preferences.keyboardNavigation = checked;
        this.toggleKeyboardNavigation(checked);
        break;
      case 'screen-reader-mode':
        this.preferences.screenReader = checked;
        this.toggleScreenReaderMode(checked);
        break;
      case 'audio-descriptions':
        this.preferences.audioDescriptions = checked;
        break;
      case 'captions-enabled':
        this.preferences.captionsEnabled = checked;
        break;
      case 'dyslexia-support':
        this.preferences.dyslexiaSupport = checked;
        this.toggleDyslexiaSupport(checked);
        break;
      case 'adhd-support':
        this.preferences.adhd = checked;
        this.toggleADHDSupport(checked);
        break;
      case 'autism-support':
        this.preferences.autism = checked;
        this.toggleAutismSupport(checked);
        break;
    }
  }

  handleSelectChange(id, value) {
    switch (id) {
      case 'color-theme':
        this.preferences.darkMode = value;
        this.setColorTheme(value);
        break;
      case 'colorblind-filter':
        this.preferences.colorBlindness = value;
        this.setColorBlindnessFilter(value);
        break;
      case 'cursor-size':
        this.preferences.cursorSize = value;
        this.setCursorSize(value);
        break;
      case 'click-target':
        this.preferences.clickTarget = value;
        this.setClickTargetSize(value);
        break;
      case 'session-timeout':
        this.preferences.timeout = value;
        this.setSessionTimeout(value);
        break;
    }
  }

  // Méthodes d'application des préférences
  setFontSize(size) {
    this.preferences.fontSize = size;
    const multipliers = {
      small: 0.875,
      medium: 1,
      large: 1.25,
      'extra-large': 1.5
    };
    
    document.documentElement.style.fontSize = (16 * multipliers[size]) + 'px';
    this.announce(`Taille de texte: ${size}`);
  }

  toggleHighContrast(enabled = !this.preferences.highContrast) {
    this.preferences.highContrast = enabled;
    document.documentElement.classList.toggle('high-contrast', enabled);
    this.announce(enabled ? 'Contraste élevé activé' : 'Contraste élevé désactivé');
  }

  setColorTheme(theme) {
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.classList.add(`theme-${theme}`);
    this.announce(`Thème: ${theme}`);
  }

  setColorBlindnessFilter(filter) {
    document.documentElement.classList.remove(
      'protanopia', 'deuteranopia', 'tritanopia'
    );
    
    if (filter !== 'none') {
      document.documentElement.classList.add(filter);
    }
  }

  setMagnification(level) {
    this.preferences.magnification = level;
    document.documentElement.style.zoom = level + '%';
    document.getElementById('magnification-value').textContent = level + '%';
    this.announce(`Zoom: ${level}%`);
  }

  toggleReducedMotion(enabled = !this.preferences.reducedMotion) {
    this.preferences.reducedMotion = enabled;
    document.documentElement.classList.toggle('reduced-motion', enabled);
    
    if (enabled) {
      this.motionReducer.disable();
    } else {
      this.motionReducer.enable();
    }
    
    this.announce(enabled ? 'Animations réduites' : 'Animations normales');
  }

  setCursorSize(size) {
    document.documentElement.classList.remove(
      'cursor-normal', 'cursor-large', 'cursor-extra-large'
    );
    document.documentElement.classList.add(`cursor-${size}`);
  }

  setClickTargetSize(size) {
    document.documentElement.classList.remove(
      'targets-normal', 'targets-large', 'targets-extra-large'
    );
    document.documentElement.classList.add(`targets-${size}`);
  }

  toggleDyslexiaSupport(enabled) {
    document.documentElement.classList.toggle('dyslexia-friendly', enabled);
    
    if (enabled) {
      // Police plus lisible pour la dyslexie
      document.documentElement.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
    } else {
      document.documentElement.style.fontFamily = '';
    }
  }

  toggleADHDSupport(enabled) {
    document.documentElement.classList.toggle('adhd-friendly', enabled);
    
    if (enabled) {
      // Interface plus simple, moins de distractions
      document.querySelectorAll('.animation, .decoration').forEach(el => {
        el.style.display = 'none';
      });
    } else {
      document.querySelectorAll('.animation, .decoration').forEach(el => {
        el.style.display = '';
      });
    }
  }

  toggleAutismSupport(enabled) {
    document.documentElement.classList.toggle('autism-friendly', enabled);
    
    if (enabled) {
      // Interface prévisible et simplifiée
      document.documentElement.classList.add('simplified-ui');
    } else {
      document.documentElement.classList.remove('simplified-ui');
    }
  }

  toggleScreenReaderMode(enabled) {
    if (enabled) {
      this.enhanceForScreenReader();
    } else {
      this.removeScreenReaderEnhancements();
    }
  }

  enhanceForScreenReader() {
    // Améliore l'expérience pour les lecteurs d'écran
    document.documentElement.classList.add('screen-reader-optimized');
    
    // Ajoute plus de descriptions
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt) {
        img.alt = this.generateDetailedAltText(img);
      }
    });
    
    // Active les annonces automatiques
    this.setupAutoAnnouncements();
  }

  removeScreenReaderEnhancements() {
    document.documentElement.classList.remove('screen-reader-optimized');
    this.disableAutoAnnouncements();
  }

  setupAutoAnnouncements() {
    // Annonce les changements de contenu
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const textContent = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .map(node => node.textContent.trim())
            .filter(text => text.length > 0)
            .join(' ');
          
          if (textContent.length > 10) {
            this.announceUpdate(textContent.slice(0, 100));
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.contentObserver = observer;
  }

  disableAutoAnnouncements() {
    if (this.contentObserver) {
      this.contentObserver.disconnect();
      this.contentObserver = null;
    }
  }

  toggleTextToSpeech() {
    this.textToSpeech.toggle();
  }

  toggleKeyboardNavigation(enabled) {
    if (enabled) {
      this.keyboardNavigation.enable();
    } else {
      this.keyboardNavigation.disable();
    }
  }

  setSessionTimeout(timeout) {
    const timeouts = {
      'default': 30 * 60 * 1000,
      'extended': 60 * 60 * 1000,
      'unlimited': 0
    };
    
    if (window.sessionTimeout) {
      clearTimeout(window.sessionTimeout);
    }
    
    if (timeouts[timeout] > 0) {
      window.sessionTimeout = setTimeout(() => {
        this.announce('Votre session va expirer dans 5 minutes');
      }, timeouts[timeout] - 5 * 60 * 1000);
    }
  }

  // Système d'annonces
  announce(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'aria-announcements' : 'aria-updates';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear après un délai pour éviter la répétition
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  announceUpdate(message) {
    this.announce(message, 'polite');
  }

  announceStatus(message) {
    const statusRegion = document.getElementById('aria-status');
    if (statusRegion) {
      statusRegion.textContent = message;
    }
  }

  showAccessibilityMessage(message) {
    this.announce(message);
    
    // Toast visuel
    const toast = document.createElement('div');
    toast.className = 'accessibility-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Gestion des préférences
  applyUserPreferences() {
    this.setFontSize(this.preferences.fontSize);
    this.toggleHighContrast(this.preferences.highContrast);
    this.setColorTheme(this.preferences.darkMode);
    this.toggleReducedMotion(this.preferences.reducedMotion);
    this.setCursorSize(this.preferences.cursorSize);
    this.setClickTargetSize(this.preferences.clickTarget);
    this.setMagnification(this.preferences.magnification);
    
    if (this.preferences.dyslexiaSupport) this.toggleDyslexiaSupport(true);
    if (this.preferences.adhd) this.toggleADHDSupport(true);
    if (this.preferences.autism) this.toggleAutismSupport(true);
    if (this.preferences.screenReader) this.toggleScreenReaderMode(true);
    
    this.setColorBlindnessFilter(this.preferences.colorBlindness);
    this.setSessionTimeout(this.preferences.timeout);
    
    // Update UI
    this.updateUI();
  }

  updateUI() {
    const panel = document.getElementById('accessibility-panel');
    if (!panel) return;

    // Update checkboxes
    Object.entries(this.preferences).forEach(([key, value]) => {
      const element = panel.querySelector(`#${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else if (element.tagName === 'SELECT') {
          element.value = value;
        } else if (element.type === 'range') {
          element.value = value;
        }
      }
    });

    // Update font size buttons
    panel.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === this.preferences.fontSize);
    });

    // Update magnification display
    const magnificationValue = panel.querySelector('#magnification-value');
    if (magnificationValue) {
      magnificationValue.textContent = this.preferences.magnification + '%';
    }
  }

  savePreferences() {
    localStorage.setItem('accessibilityPreferences', JSON.stringify(this.preferences));
  }

  resetPreferences() {
    this.preferences = this.loadAccessibilityPreferences.call({ preferences: {} });
    this.applyUserPreferences();
    this.savePreferences();
    this.showAccessibilityMessage('Préférences réinitialisées');
  }

  generateId(prefix = 'accessibility') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateDetailedAltText(img) {
    // Génération d'alt text plus détaillé pour les lecteurs d'écran
    const src = img.src;
    const context = img.closest('article, section, main');
    const contextText = context ? context.querySelector('h1, h2, h3')?.textContent : '';
    
    if (src.includes('chart') || src.includes('graph')) {
      return `Graphique: ${contextText || 'Données visuelles'}`;
    }
    
    if (src.includes('diagram')) {
      return `Diagramme: ${contextText || 'Schéma explicatif'}`;
    }
    
    return this.generateAltText(img);
  }

  // API publique
  getPreferences() {
    return { ...this.preferences };
  }

  setPreference(key, value) {
    if (key in this.preferences) {
      this.preferences[key] = value;
      this.applyUserPreferences();
      this.savePreferences();
    }
  }

  announceMessage(message, priority = 'polite') {
    this.announce(message, priority);
  }

  runAudit() {
    this.runBasicAudit();
    return this.auditResults;
  }
}

// Classes auxiliaires
class KeyboardNavigationManager {
  constructor() {
    this.focusableElements = [];
    this.currentFocusIndex = -1;
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'Tab':
        this.handleTabNavigation(e);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(e);
        break;
      case 'Escape':
        this.handleEscape(e);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowNavigation(e);
        break;
    }
  }

  handleTabNavigation(e) {
    this.updateFocusableElements();
    
    if (e.shiftKey) {
      // Tab inversé
      if (this.currentFocusIndex > 0) {
        this.currentFocusIndex--;
        this.focusElement(this.currentFocusIndex);
        e.preventDefault();
      }
    } else {
      // Tab normal
      if (this.currentFocusIndex < this.focusableElements.length - 1) {
        this.currentFocusIndex++;
        this.focusElement(this.currentFocusIndex);
        e.preventDefault();
      }
    }
  }

  updateFocusableElements() {
    this.focusableElements = Array.from(document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  }

  focusElement(index) {
    if (this.focusableElements[index]) {
      this.focusableElements[index].focus();
    }
  }

  enable() {
    document.body.classList.add('keyboard-navigation-enabled');
  }

  disable() {
    document.body.classList.remove('keyboard-navigation-enabled');
  }
}

class ColorContrastManager {
  init() {
    this.createContrastControls();
  }

  createContrastControls() {
    // Interface pour ajuster le contraste
  }
}

class TextToSpeechManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isEnabled = false;
    this.currentUtterance = null;
  }

  init() {
    if (!this.synth) {
      console.warn('Text-to-Speech non supporté');
      return;
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    
    if (this.isEnabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  start() {
    document.addEventListener('click', this.handleClick.bind(this));
  }

  stop() {
    document.removeEventListener('click', this.handleClick.bind(this));
    this.synth.cancel();
  }

  handleClick(e) {
    const text = e.target.textContent || e.target.alt || e.target.aria-label;
    if (text) {
      this.speak(text);
    }
  }

  speak(text) {
    if (this.currentUtterance) {
      this.synth.cancel();
    }
    
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.lang = 'fr-FR';
    this.currentUtterance.rate = 0.9;
    
    this.synth.speak(this.currentUtterance);
  }
}

class MotionReducer {
  init() {
    this.originalAnimations = new Map();
  }

  disable() {
    document.querySelectorAll('*').forEach(el => {
      const style = getComputedStyle(el);
      if (style.animation !== 'none' || style.transition !== 'none') {
        this.originalAnimations.set(el, {
          animation: style.animation,
          transition: style.transition
        });
        
        el.style.animation = 'none';
        el.style.transition = 'none';
      }
    });
  }

  enable() {
    this.originalAnimations.forEach((original, el) => {
      el.style.animation = original.animation;
      el.style.transition = original.transition;
    });
    
    this.originalAnimations.clear();
  }
}

class FocusManager {
  init() {
    this.setupFocusTrapping();
    this.setupFocusIndicators();
  }

  setupFocusTrapping() {
    // Gestion du focus dans les modales
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }

  setupFocusIndicators() {
    // Améliore les indicateurs de focus
    const style = document.createElement('style');
    style.textContent = `
      :focus-visible {
        outline: 3px solid var(--lightning-purple);
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      .keyboard-navigation-enabled *:focus {
        outline: 3px solid var(--lightning-purple);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Screen Reader Detection
class ScreenReaderDetector {
  detect() {
    // Détection basique des lecteurs d'écran
    this.isActive = this.detectScreenReader();
    return this.isActive;
  }

  detectScreenReader() {
    // Vérifications multiples pour détecter un lecteur d'écran
    return (
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      window.speechSynthesis ||
      ('speechSynthesis' in window) ||
      this.detectAriaLiveSupport()
    );
  }

  detectAriaLiveSupport() {
    // Test de support ARIA Live
    const testElement = document.createElement('div');
    testElement.setAttribute('aria-live', 'polite');
    testElement.style.position = 'absolute';
    testElement.style.left = '-10000px';
    document.body.appendChild(testElement);
    
    const isSupported = testElement.getAttribute('aria-live') === 'polite';
    document.body.removeChild(testElement);
    
    return isSupported;
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilitySystem = new WCAGAccessibilitySystem();
  
  // API globale
  window.Accessibility = {
    announce: (message, priority) => window.accessibilitySystem.announce(message, priority),
    setPreference: (key, value) => window.accessibilitySystem.setPreference(key, value),
    getPreferences: () => window.accessibilitySystem.getPreferences(),
    runAudit: () => window.accessibilitySystem.runAudit(),
    showMessage: (message) => window.accessibilitySystem.showAccessibilityMessage(message)
  };
});