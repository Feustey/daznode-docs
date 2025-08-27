/**
 * Système de Sélection de Parcours Intelligent
 * Simplifie l'orientation utilisateur et réduit la charge cognitive
 */

class JourneySelector {
  constructor() {
    this.init();
  }

  init() {
    this.createJourneyStyles();
    this.setupEventListeners();
    this.loadUserPreferences();
  }

  createJourneyStyles() {
    const styles = `
      <style>
      .journey-selector {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-lg);
        margin: var(--space-2xl) 0;
      }

      .journey-card {
        background: var(--bg-surface);
        border: 2px solid var(--border-color);
        border-radius: 16px;
        padding: var(--space-xl);
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-base);
        position: relative;
        overflow: hidden;
      }

      .journey-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--gradient-lightning);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--transition-base);
      }

      .journey-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl);
        border-color: var(--lightning-purple);
      }

      .journey-card:hover::before {
        transform: scaleX(1);
      }

      .journey-card.selected {
        border-color: var(--lightning-yellow);
        background: linear-gradient(135deg, 
          rgba(245, 158, 11, 0.1) 0%, 
          rgba(107, 70, 193, 0.1) 100%);
      }

      .journey-icon {
        font-size: 3rem;
        margin-bottom: var(--space-md);
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      .journey-card h4 {
        color: var(--text-primary);
        margin-bottom: var(--space-sm);
        font-size: 1.5rem;
        font-weight: 700;
      }

      .journey-card p {
        color: var(--text-secondary);
        margin-bottom: var(--space-lg);
        line-height: 1.6;
      }

      .journey-cta {
        display: inline-block;
        background: var(--gradient-lightning);
        color: white;
        padding: var(--space-sm) var(--space-lg);
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all var(--transition-base);
      }

      .journey-cta:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow-glow);
      }

      .community-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-lg);
        margin: var(--space-xl) 0;
      }

      .community-section {
        background: var(--bg-surface);
        border-radius: 12px;
        padding: var(--space-lg);
        border-left: 4px solid var(--lightning-purple);
      }

      .community-section h4 {
        margin-bottom: var(--space-md);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      .community-section ul {
        list-style: none;
        padding: 0;
      }

      .community-section li {
        margin-bottom: var(--space-sm);
      }

      .community-section a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color var(--transition-fast);
        display: flex;
        align-items: center;
        gap: var(--space-xs);
      }

      .community-section a:hover {
        color: var(--lightning-purple);
      }

      .badge {
        background: var(--lightning-yellow);
        color: var(--dark-bg);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .journey-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
      }

      .journey-popup.show {
        opacity: 1;
        visibility: visible;
      }

      .journey-popup-content {
        background: var(--bg-surface);
        border-radius: 16px;
        padding: var(--space-2xl);
        max-width: 600px;
        width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      }

      .popup-close {
        position: absolute;
        top: var(--space-md);
        right: var(--space-md);
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
      }

      .journey-roadmap {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
        margin: var(--space-xl) 0;
      }

      .roadmap-step {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-md);
        background: var(--bg-primary);
        border-radius: 8px;
        border-left: 4px solid var(--lightning-blue);
      }

      .step-number {
        width: 32px;
        height: 32px;
        background: var(--lightning-blue);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.875rem;
      }

      .step-content h5 {
        margin: 0 0 var(--space-xs) 0;
        color: var(--text-primary);
      }

      .step-content p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      .journey-actions {
        display: flex;
        gap: var(--space-md);
        justify-content: center;
        margin-top: var(--space-xl);
      }

      @media (max-width: 768px) {
        .journey-selector {
          grid-template-columns: 1fr;
        }
        
        .community-grid {
          grid-template-columns: 1fr;
        }
        
        .journey-popup-content {
          padding: var(--space-lg);
          margin: var(--space-md);
        }
      }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }

  setupEventListeners() {
    // Global function pour les onclick dans le HTML
    window.showJourney = (journeyType) => {
      this.showJourneyPopup(journeyType);
    };

    // Fermeture popup
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('journey-popup') || e.target.classList.contains('popup-close')) {
        this.hideJourneyPopup();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideJourneyPopup();
      }
    });
  }

  showJourneyPopup(journeyType) {
    const journeyData = this.getJourneyData(journeyType);
    const popup = this.createJourneyPopup(journeyData);
    
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 100);
    
    // Analytics
    this.trackJourneySelection(journeyType);
  }

  getJourneyData(type) {
    const journeys = {
      beginner: {
        title: '🚀 Parcours Débutant Bitcoin',
        subtitle: 'De zéro à héros Bitcoin en quelques semaines',
        description: 'Un parcours complet et progressif pour maîtriser Bitcoin et Lightning Network sans prérequis technique.',
        roadmap: [
          {
            title: 'Bitcoin Fondamentaux',
            description: 'Comprendre la blockchain, les wallets, les transactions'
          },
          {
            title: 'Lightning Network',
            description: 'Découvrir les paiements instantanés et peu coûteux'
          },
          {
            title: 'Pratique Guidée',
            description: 'Première transaction Lightning avec accompagnement'
          },
          {
            title: 'Sécurité & Bonnes Pratiques',
            description: 'Protéger vos bitcoins et utiliser Lightning en sécurité'
          }
        ],
        duration: '2-3 semaines',
        level: 'Débutant',
        startUrl: '/getting-started/',
        color: 'var(--lightning-blue)'
      },
      developer: {
        title: '⚡ Parcours Développeur',
        subtitle: 'Intégrez Lightning Network dans vos applications',
        description: 'Ressources techniques complètes pour intégrer les paiements Lightning dans vos projets.',
        roadmap: [
          {
            title: 'APIs Lightning',
            description: 'Documentation complète des APIs Daznode'
          },
          {
            title: 'SDK & Librairies',
            description: 'Outils de développement ready-to-use'
          },
          {
            title: 'Exemples Pratiques',
            description: 'Code samples et tutoriels step-by-step'
          },
          {
            title: 'Testing & Deployment',
            description: 'Testnet, monitoring et mise en production'
          }
        ],
        duration: '1-2 semaines',
        level: 'Intermédiaire',
        startUrl: '/devs/',
        color: 'var(--lightning-purple)'
      },
      operator: {
        title: '🖥️ Parcours Opérateur',
        subtitle: 'Optimisez le ROI de votre nœud Lightning',
        description: 'Maximisez les revenus de votre infrastructure Lightning avec DazBox et l\'IA.',
        roadmap: [
          {
            title: 'DazBox Setup',
            description: 'Installation et configuration de votre nœud optimisé'
          },
          {
            title: 'DazIA Integration',
            description: 'IA pour optimisation automatique des canaux'
          },
          {
            title: 'Monitoring & Analytics',
            description: 'Dashboards de performance et alertes intelligentes'
          },
          {
            title: 'ROI Optimization',
            description: 'Stratégies avancées pour maximiser les revenus'
          }
        ],
        duration: '3-4 semaines',
        level: 'Avancé',
        startUrl: '/solutions/dazbox/',
        color: 'var(--lightning-yellow)'
      }
    };

    return journeys[type];
  }

  createJourneyPopup(journeyData) {
    const popup = document.createElement('div');
    popup.className = 'journey-popup';
    
    popup.innerHTML = `
      <div class="journey-popup-content">
        <button class="popup-close" aria-label="Fermer">&times;</button>
        
        <div class="journey-header" style="border-left: 4px solid ${journeyData.color}; padding-left: var(--space-md);">
          <h2>${journeyData.title}</h2>
          <p class="journey-subtitle">${journeyData.subtitle}</p>
          <p>${journeyData.description}</p>
          
          <div class="journey-meta" style="display: flex; gap: var(--space-lg); margin: var(--space-md) 0;">
            <span><strong>Durée:</strong> ${journeyData.duration}</span>
            <span><strong>Niveau:</strong> ${journeyData.level}</span>
          </div>
        </div>

        <div class="journey-roadmap">
          ${journeyData.roadmap.map((step, index) => `
            <div class="roadmap-step">
              <div class="step-number">${index + 1}</div>
              <div class="step-content">
                <h5>${step.title}</h5>
                <p>${step.description}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="journey-actions">
          <button class="btn-lightning-primary" onclick="window.location.href='${journeyData.startUrl}'">
            Commencer ce parcours
          </button>
          <button class="btn-lightning-secondary" onclick="window.journeySelector.showAllPaths()">
            Voir tous les parcours
          </button>
        </div>
      </div>
    `;

    return popup;
  }

  hideJourneyPopup() {
    const popup = document.querySelector('.journey-popup');
    if (popup) {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 300);
    }
  }

  showAllPaths() {
    this.hideJourneyPopup();
    // Scroll vers la section des parcours ou redirection
    document.querySelector('.journey-selector')?.scrollIntoView({ behavior: 'smooth' });
  }

  loadUserPreferences() {
    const savedJourney = localStorage.getItem('preferredJourney');
    if (savedJourney) {
      const card = document.querySelector(`[onclick="showJourney('${savedJourney}')"]`);
      if (card) {
        card.classList.add('selected');
      }
    }
  }

  trackJourneySelection(journeyType) {
    // Sauvegarde de la préférence
    localStorage.setItem('preferredJourney', journeyType);
    
    // Analytics (si disponible)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'journey_selected', {
        'journey_type': journeyType,
        'event_category': 'engagement'
      });
    }
    
    // Gamification integration
    if (window.gamification) {
      window.gamification.addXP(10, `Parcours ${journeyType} sélectionné`);
    }
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.journeySelector = new JourneySelector();
});