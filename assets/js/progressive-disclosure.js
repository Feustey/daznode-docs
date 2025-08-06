/**
 * Système de Progressive Disclosure pour masquer la complexité
 * et révéler l'information progressivement selon les besoins de l'utilisateur
 */

class ProgressiveDisclosure {
  constructor() {
    this.currentMode = 'simple'; // 'simple' | 'technical'
    this.userProfile = null;
    this.expandedSections = new Set();
    this.init();
  }

  init() {
    console.log('📚 Initialisation du système de Progressive Disclosure...');
    
    // Charger les préférences utilisateur
    this.loadUserPreferences();
    
    // Initialiser les composants
    this.initModeToggle();
    this.initExpandableSections();
    this.initContextualHelp();
    this.initGlossaryTooltips();
    this.initReadingProgress();
    
    // Appliquer le mode initial
    this.applyMode(this.currentMode);
    
    console.log(`✅ Progressive Disclosure initialisé en mode: ${this.currentMode}`);
  }

  loadUserPreferences() {
    // Charger le profil utilisateur depuis le localStorage
    const savedProfile = localStorage.getItem('user-profile');
    if (savedProfile) {
      try {
        this.userProfile = JSON.parse(savedProfile);
        
        // Déterminer le mode initial basé sur le profil
        if (this.userProfile.profile === 'developer' || this.userProfile.experience === 'expert') {
          this.currentMode = 'technical';
        } else if (this.userProfile.experience === 'novice') {
          this.currentMode = 'simple';
        }
      } catch (e) {
        console.warn('Erreur lors du chargement du profil utilisateur:', e);
      }
    }
    
    // Charger le mode préféré
    const savedMode = localStorage.getItem('disclosure-mode');
    if (savedMode && ['simple', 'technical'].includes(savedMode)) {
      this.currentMode = savedMode;
    }
  }

  initModeToggle() {
    // Créer le bouton de toggle de mode
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'mode-toggle-container';
    toggleContainer.innerHTML = `
      <button 
        id="mode-toggle" 
        class="mode-toggle"
        aria-pressed="${this.currentMode === 'technical'}"
        title="Basculer entre mode simple et technique">
        <span class="mode-toggle-icon">${this.currentMode === 'technical' ? '🔧' : '👋'}</span>
        <span class="mode-toggle-text">
          Mode ${this.currentMode === 'technical' ? 'technique' : 'simple'}
        </span>
      </button>
    `;
    
    // Ajouter au contenu principal
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.insertBefore(toggleContainer, contentContainer.firstChild);
    }
    
    // Event listener
    const toggleButton = document.getElementById('mode-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleMode();
      });
    }
  }

  toggleMode() {
    const newMode = this.currentMode === 'simple' ? 'technical' : 'simple';
    this.setMode(newMode);
    
    // Analytics
    this.trackEvent('mode_toggle', { 
      from: this.currentMode, 
      to: newMode 
    });
  }

  setMode(mode) {
    if (!['simple', 'technical'].includes(mode)) return;
    
    this.currentMode = mode;
    this.applyMode(mode);
    
    // Sauvegarder la préférence
    localStorage.setItem('disclosure-mode', mode);
    
    // Mettre à jour le bouton
    this.updateModeToggle();
    
    console.log(`🔄 Mode changé vers: ${mode}`);
  }

  applyMode(mode) {
    document.body.classList.remove('mode-simple', 'mode-technical');
    document.body.classList.add(`mode-${mode}`);
    
    // Émettre un événement personnalisé
    document.dispatchEvent(new CustomEvent('modeChange', {
      detail: { mode, previousMode: this.currentMode }
    }));
  }

  updateModeToggle() {
    const toggleButton = document.getElementById('mode-toggle');
    if (!toggleButton) return;
    
    const icon = toggleButton.querySelector('.mode-toggle-icon');
    const text = toggleButton.querySelector('.mode-toggle-text');
    
    if (icon) {
      icon.textContent = this.currentMode === 'technical' ? '🔧' : '👋';
    }
    
    if (text) {
      text.textContent = `Mode ${this.currentMode === 'technical' ? 'technique' : 'simple'}`;
    }
    
    toggleButton.setAttribute('aria-pressed', this.currentMode === 'technical');
    toggleButton.title = `Basculer vers le mode ${this.currentMode === 'technical' ? 'simple' : 'technique'}`;
  }

  initExpandableSections() {
    // Trouver et initialiser toutes les sections expandables
    document.querySelectorAll('[data-expandable]').forEach(element => {
      this.setupExpandableSection(element);
    });
    
    // Observer les nouvelles sections ajoutées dynamiquement
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const expandables = node.querySelectorAll ? 
              node.querySelectorAll('[data-expandable]') : [];
            expandables.forEach(el => this.setupExpandableSection(el));
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setupExpandableSection(element) {
    const sectionId = element.dataset.expandable;
    const trigger = element.querySelector('[data-expand-trigger]') || this.createTrigger(element);
    const content = element.querySelector('[data-expand-content]');
    
    if (!trigger || !content) return;
    
    // État initial
    const isExpanded = this.expandedSections.has(sectionId) || 
                      element.hasAttribute('data-expanded-default');
    
    this.setExpanded(element, isExpanded);
    
    // Event listener
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleSection(element);
    });
    
    // Accessibilité
    trigger.setAttribute('aria-expanded', isExpanded);
    trigger.setAttribute('aria-controls', sectionId + '-content');
    content.setAttribute('id', sectionId + '-content');
    
    // Raccourci clavier
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleSection(element);
      }
    });
  }

  createTrigger(element) {
    const title = element.dataset.expandableTitle || 'En savoir plus';
    const level = element.dataset.expandableLevel || '3';
    
    const trigger = document.createElement('button');
    trigger.className = 'expand-trigger';
    trigger.setAttribute('data-expand-trigger', '');
    trigger.innerHTML = `
      <h${level} class="expand-title">
        ${title}
        <svg class="expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </h${level}>
    `;
    
    element.insertBefore(trigger, element.firstChild);
    return trigger;
  }

  toggleSection(element) {
    const sectionId = element.dataset.expandable;
    const isExpanded = element.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    this.setExpanded(element, newState);
    
    // Mettre à jour le state
    if (newState) {
      this.expandedSections.add(sectionId);
    } else {
      this.expandedSections.delete(sectionId);
    }
    
    // Analytics
    this.trackEvent('section_toggle', {
      section: sectionId,
      expanded: newState,
      mode: this.currentMode
    });
  }

  setExpanded(element, expanded) {
    const trigger = element.querySelector('[data-expand-trigger]');
    const content = element.querySelector('[data-expand-content]');
    const icon = element.querySelector('.expand-icon');
    
    element.setAttribute('aria-expanded', expanded);
    
    if (trigger) {
      trigger.setAttribute('aria-expanded', expanded);
    }
    
    if (content) {
      content.style.display = expanded ? 'block' : 'none';
      content.setAttribute('aria-hidden', !expanded);
    }
    
    if (icon) {
      icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    
    element.classList.toggle('expanded', expanded);
  }

  initContextualHelp() {
    // Ajouter des boutons d'aide contextuelle
    document.querySelectorAll('[data-help]').forEach(element => {
      const helpText = element.dataset.help;
      const helpId = 'help-' + Math.random().toString(36).substr(2, 9);
      
      // Créer le bouton d'aide
      const helpButton = document.createElement('button');
      helpButton.className = 'contextual-help';
      helpButton.innerHTML = '?';
      helpButton.setAttribute('aria-describedby', helpId);
      helpButton.setAttribute('title', 'Afficher l\'aide');
      
      // Créer le contenu d'aide
      const helpContent = document.createElement('div');
      helpContent.className = 'help-tooltip';
      helpContent.id = helpId;
      helpContent.innerHTML = helpText;
      helpContent.setAttribute('role', 'tooltip');
      helpContent.style.display = 'none';
      
      // Ajouter à l'élément
      element.style.position = 'relative';
      element.appendChild(helpButton);
      element.appendChild(helpContent);
      
      // Événements
      helpButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleHelp(helpContent);
      });
      
      // Fermer en cliquant ailleurs
      document.addEventListener('click', () => {
        this.hideHelp(helpContent);
      });
    });
  }

  toggleHelp(helpElement) {
    const isVisible = helpElement.style.display !== 'none';
    
    // Fermer toutes les autres tooltips
    document.querySelectorAll('.help-tooltip').forEach(tooltip => {
      if (tooltip !== helpElement) {
        this.hideHelp(tooltip);
      }
    });
    
    if (isVisible) {
      this.hideHelp(helpElement);
    } else {
      this.showHelp(helpElement);
    }
  }

  showHelp(helpElement) {
    helpElement.style.display = 'block';
    helpElement.setAttribute('aria-hidden', 'false');
    
    // Position optimale
    this.positionTooltip(helpElement);
  }

  hideHelp(helpElement) {
    helpElement.style.display = 'none';
    helpElement.setAttribute('aria-hidden', 'true');
  }

  positionTooltip(tooltip) {
    const rect = tooltip.parentElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Position par défaut : en dessous à droite
    let top = rect.bottom + 8;
    let left = rect.right - tooltipRect.width;
    
    // Ajustements si sort de l'écran
    if (left < 8) {
      left = 8;
    }
    
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    
    if (top + tooltipRect.height > window.innerHeight - 8) {
      top = rect.top - tooltipRect.height - 8;
    }
    
    tooltip.style.position = 'fixed';
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.zIndex = '10000';
  }

  initGlossaryTooltips() {
    // Chercher tous les termes du glossaire dans le contenu
    const glossaryTerms = this.loadGlossaryTerms();
    
    if (glossaryTerms.length === 0) return;
    
    // Créer un regex pour tous les termes
    const termsRegex = new RegExp(`\\b(${glossaryTerms.map(term => 
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).join('|')})\\b`, 'gi');
    
    // Parcourir les éléments de contenu
    document.querySelectorAll('.content-container p, .content-container li').forEach(element => {
      if (element.querySelector('.glossary-term')) return; // Déjà traité
      
      const html = element.innerHTML;
      const newHtml = html.replace(termsRegex, (match) => {
        return `<span class="glossary-term" data-term="${match.toLowerCase()}" tabindex="0">${match}</span>`;
      });
      
      if (newHtml !== html) {
        element.innerHTML = newHtml;
        
        // Ajouter les événements aux nouveaux termes
        element.querySelectorAll('.glossary-term').forEach(term => {
          this.setupGlossaryTerm(term);
        });
      }
    });
  }

  loadGlossaryTerms() {
    // Cette liste devrait être chargée depuis un fichier JSON en production
    return [
      'Bitcoin', 'Lightning Network', 'blockchain', 'satoshi', 'wallet', 
      'nœud', 'canal', 'transaction', 'clé privée', 'clé publique',
      'hash', 'proof of work', 'minage', 'block', 'confirmation'
    ];
  }

  setupGlossaryTerm(termElement) {
    const term = termElement.dataset.term;
    
    // Événements hover et focus
    termElement.addEventListener('mouseenter', () => this.showGlossaryTooltip(termElement, term));
    termElement.addEventListener('mouseleave', () => this.hideGlossaryTooltip(termElement));
    termElement.addEventListener('focus', () => this.showGlossaryTooltip(termElement, term));
    termElement.addEventListener('blur', () => this.hideGlossaryTooltip(termElement));
    
    // Clic pour aller au glossaire complet
    termElement.addEventListener('click', () => {
      window.open(`/glossaire/#${term}`, '_blank');
    });
    
    // Accessibilité
    termElement.setAttribute('role', 'button');
    termElement.setAttribute('aria-describedby', `glossary-${term}`);
    termElement.setAttribute('title', `Définition de ${term} (cliquer pour plus d'infos)`);
  }

  showGlossaryTooltip(termElement, term) {
    // Créer ou récupérer la tooltip
    let tooltip = document.getElementById(`glossary-${term}`);
    
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = `glossary-${term}`;
      tooltip.className = 'glossary-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.innerHTML = this.getGlossaryDefinition(term);
      document.body.appendChild(tooltip);
    }
    
    // Positionner et afficher
    this.positionGlossaryTooltip(tooltip, termElement);
    tooltip.style.display = 'block';
    tooltip.setAttribute('aria-hidden', 'false');
  }

  hideGlossaryTooltip(termElement) {
    const term = termElement.dataset.term;
    const tooltip = document.getElementById(`glossary-${term}`);
    
    if (tooltip) {
      setTimeout(() => {
        tooltip.style.display = 'none';
        tooltip.setAttribute('aria-hidden', 'true');
      }, 100); // Petit délai pour permettre le hover sur la tooltip
    }
  }

  positionGlossaryTooltip(tooltip, termElement) {
    const rect = termElement.getBoundingClientRect();
    
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.bottom + 8) + 'px';
    tooltip.style.left = rect.left + 'px';
    tooltip.style.zIndex = '10001';
    
    // Ajustement si sort de l'écran
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth - 8) {
      tooltip.style.left = (window.innerWidth - tooltipRect.width - 8) + 'px';
    }
  }

  getGlossaryDefinition(term) {
    // Définitions basiques - devrait être chargé depuis une API/JSON
    const definitions = {
      'bitcoin': 'Première cryptomonnaie décentralisée, créée en 2009 par Satoshi Nakamoto.',
      'lightning network': 'Réseau de seconde couche permettant des paiements Bitcoin instantanés.',
      'blockchain': 'Technologie de stockage et transmission d\'informations, transparente et sécurisée.',
      'satoshi': 'Plus petite unité de Bitcoin (0.00000001 BTC).',
      'wallet': 'Portefeuille numérique pour stocker et gérer les cryptomonnaies.',
      'nœud': 'Ordinateur qui maintient une copie de la blockchain Bitcoin.',
      'canal': 'Connexion directe entre deux nœuds Lightning pour les paiements.',
      'transaction': 'Transfert de valeur enregistré sur la blockchain.',
      'clé privée': 'Code secret permettant de contrôler ses bitcoins.',
      'clé publique': 'Adresse publique pour recevoir des bitcoins.'
    };
    
    const definition = definitions[term.toLowerCase()] || 'Définition non disponible.';
    
    return `
      <div class="glossary-definition">
        <strong>${term}</strong>
        <p>${definition}</p>
        <a href="/glossaire/#${term}" target="_blank" class="glossary-link">
          Voir la définition complète →
        </a>
      </div>
    `;
  }

  initReadingProgress() {
    // Barre de progression de lecture
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    // Calculer et mettre à jour la progression
    const updateProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      const bar = document.querySelector('.reading-progress-bar');
      if (bar) {
        bar.style.width = scrolled + '%';
      }
    };
    
    // Event listeners
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    // Mise à jour initiale
    updateProgress();
  }

  // Méthodes utilitaires
  trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'progressive_disclosure',
        ...data
      });
    }

    console.log(`📊 Event tracked: ${eventName}`, data);
  }

  // API publique
  expandAll() {
    document.querySelectorAll('[data-expandable]').forEach(element => {
      this.setExpanded(element, true);
      this.expandedSections.add(element.dataset.expandable);
    });
  }

  collapseAll() {
    document.querySelectorAll('[data-expandable]').forEach(element => {
      this.setExpanded(element, false);
      this.expandedSections.delete(element.dataset.expandable);
    });
  }

  setUserProfile(profile) {
    this.userProfile = profile;
    localStorage.setItem('user-profile', JSON.stringify(profile));
    
    // Ajuster le mode selon le profil
    if (profile.profile === 'developer' || profile.experience === 'expert') {
      this.setMode('technical');
    } else if (profile.experience === 'novice') {
      this.setMode('simple');
    }
  }

  getCurrentMode() {
    return this.currentMode;
  }

  getExpandedSections() {
    return Array.from(this.expandedSections);
  }

  // Cleanup
  destroy() {
    document.removeEventListener('modeChange', this.handleModeChange);
    
    // Supprimer les éléments créés
    document.querySelectorAll('.mode-toggle-container, .reading-progress, .glossary-tooltip, .help-tooltip').forEach(el => {
      el.remove();
    });
    
    document.body.classList.remove('mode-simple', 'mode-technical');
  }
}

// Styles CSS
const progressiveDisclosureStyles = `
<style>
/* Mode Toggle */
.mode-toggle-container {
  position: sticky;
  top: 80px;
  z-index: 100;
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
}

.mode-toggle {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.mode-toggle:hover {
  border-color: var(--color-primary);
  background: rgba(0, 177, 255, 0.05);
}

.mode-toggle[aria-pressed="true"] {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.mode-toggle-icon {
  font-size: 16px;
}

/* Modes de contenu */
.mode-simple .technical-content {
  display: none;
}

.mode-technical .simple-content {
  display: none;
}

/* Sections expandables */
[data-expandable] {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.expand-trigger {
  width: 100%;
  background: var(--color-surface);
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.expand-trigger:hover {
  background: rgba(0, 177, 255, 0.05);
}

.expand-title {
  padding: 1rem 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.expand-icon {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

[data-expand-content] {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

/* Aide contextuelle */
.contextual-help {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.contextual-help:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 177, 255, 0.3);
}

.help-tooltip {
  position: absolute;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  max-width: 250px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10000;
}

/* Termes du glossaire */
.glossary-term {
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  padding: 1px 2px;
  border-radius: 2px;
  transition: all 0.2s;
}

.glossary-term:hover,
.glossary-term:focus {
  background: rgba(0, 177, 255, 0.1);
  text-decoration-style: solid;
  outline: none;
}

.glossary-tooltip {
  position: fixed;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10001;
}

.glossary-definition strong {
  color: var(--color-primary);
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
}

.glossary-definition p {
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.glossary-link {
  color: var(--color-primary);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
}

.glossary-link:hover {
  text-decoration: underline;
}

/* Barre de progression de lecture */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(0, 177, 255, 0.1);
  z-index: 9999;
}

.reading-progress-bar {
  height: 100%;
  background: linear-gradient(45deg, var(--color-primary), #4dccff);
  width: 0%;
  transition: width 0.1s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .mode-toggle-container {
    position: static;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .mode-toggle {
    font-size: 13px;
    padding: 6px 12px;
  }
  
  .expand-title {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  
  [data-expand-content] {
    padding: 0 1rem 1rem;
  }
  
  .help-tooltip,
  .glossary-tooltip {
    max-width: 90vw;
    left: 5vw !important;
    right: 5vw !important;
    width: auto;
  }
}

/* Animations */
@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-tooltip,
.glossary-tooltip {
  animation: tooltip-fade-in 0.2s ease-out;
}

/* Mode sombre */
.theme-dark .expand-trigger:hover {
  background: rgba(255, 255, 255, 0.05);
}

.theme-dark .help-tooltip,
.theme-dark .glossary-tooltip {
  background: #2d3748;
  border-color: #4a5568;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Focus visible amélioré */
.expand-trigger:focus-visible,
.contextual-help:focus-visible,
.glossary-term:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', progressiveDisclosureStyles);

// Initialisation
let progressiveDisclosure = null;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    progressiveDisclosure = new ProgressiveDisclosure();
    
    // Exposer pour le debug
    window.progressiveDisclosure = progressiveDisclosure;
  }, 500);
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressiveDisclosure;
}