/**
 * Wizard d'onboarding interactif pour guider les nouveaux utilisateurs
 * Personnalise l'expérience selon le profil utilisateur
 */

class OnboardingWizard {
  constructor() {
    this.steps = [
      {
        id: 'welcome',
        title: 'Bienvenue sur Daznode ! 👋',
        component: 'WelcomeStep'
      },
      {
        id: 'profile',
        title: 'Quel est votre profil ?',
        component: 'ProfileSelector'
      },
      {
        id: 'goals',
        title: 'Que souhaitez-vous faire ?',
        component: 'GoalSelector'
      },
      {
        id: 'experience',
        title: 'Votre niveau d\'expérience',
        component: 'ExperienceSelector'
      },
      {
        id: 'recommendation',
        title: 'Nos recommandations pour vous',
        component: 'RecommendationStep'
      }
    ];
    
    this.currentStep = 0;
    this.userData = {
      profile: null,
      goals: [],
      experience: null,
      preferences: {}
    };
    
    this.modal = null;
    this.focusableElements = [];
    this.previousFocus = null;
    
    this.init();
  }

  init() {
    // Vérifier si le wizard doit être affiché
    if (this.shouldShowWizard()) {
      this.createWizard();
    }
    
    console.log('🧙‍♂️ Wizard d\'onboarding initialisé');
  }

  shouldShowWizard() {
    // Conditions pour afficher le wizard
    const conditions = [
      !localStorage.getItem('onboarding-completed'),
      window.location.pathname === '/' || window.location.pathname === '/index.html',
      !sessionStorage.getItem('wizard-dismissed'),
      !this.isReturningUser()
    ];
    
    return conditions.every(condition => condition);
  }

  isReturningUser() {
    // Vérifier si l'utilisateur est déjà venu (cookies, localStorage, etc.)
    const visits = parseInt(localStorage.getItem('visit-count') || '0');
    return visits > 2;
  }

  createWizard() {
    // Créer le modal
    this.modal = document.createElement('div');
    this.modal.className = 'wizard-modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'wizard-title');
    this.modal.innerHTML = this.getWizardHTML();
    
    // Ajouter à la page
    document.body.appendChild(this.modal);
    document.body.classList.add('wizard-active');
    
    // Gérer le focus
    this.previousFocus = document.activeElement;
    this.trapFocus();
    
    // Événements
    this.attachEvents();
    
    // Focus initial
    setTimeout(() => {
      const firstFocusable = this.modal.querySelector('.wizard-close, .profile-card, .btn-primary');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);
    
    // Analytics
    this.trackEvent('wizard_opened');
  }

  getWizardHTML() {
    const step = this.steps[this.currentStep];
    const progress = ((this.currentStep + 1) / this.steps.length) * 100;
    
    return `
      <div class="wizard-overlay" aria-hidden="true"></div>
      <div class="wizard-content">
        <div class="wizard-header">
          <div class="wizard-progress">
            <div class="wizard-progress-bar" style="width: ${progress}%" role="progressbar" 
                 aria-valuenow="${this.currentStep + 1}" aria-valuemin="1" aria-valuemax="${this.steps.length}"
                 aria-label="Progression du guide: étape ${this.currentStep + 1} sur ${this.steps.length}"></div>
          </div>
          <button class="wizard-close" aria-label="Fermer le guide" title="Fermer le guide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="wizard-body">
          <h2 id="wizard-title" class="wizard-title">${step.title}</h2>
          
          <div class="wizard-step" data-step="${step.id}">
            ${this.getStepContent(step)}
          </div>
        </div>
        
        <div class="wizard-footer">
          ${this.getFooterButtons()}
        </div>
      </div>
    `;
  }

  getStepContent(step) {
    return this.components[step.component]();
  }

  getFooterButtons() {
    const buttons = [];
    
    if (this.currentStep > 0) {
      buttons.push('<button class="btn-secondary wizard-prev" type="button">← Précédent</button>');
    }
    
    if (this.currentStep < this.steps.length - 1) {
      const nextEnabled = this.isStepValid();
      buttons.push(`<button class="btn-primary wizard-next" type="button" ${!nextEnabled ? 'disabled' : ''}>Suivant →</button>`);
    } else {
      buttons.push('<button class="btn-primary wizard-finish" type="button">Commencer ! 🚀</button>');
    }
    
    return buttons.join('');
  }

  // Composants du wizard
  get components() {
    return {
      WelcomeStep: () => `
        <div class="welcome-content">
          <div class="welcome-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#00b1ff" opacity="0.1"/>
              <path d="M60 30L75 45H65V75H55V45H45L60 30Z" fill="#00b1ff"/>
              <circle cx="60" cy="85" r="5" fill="#00b1ff"/>
            </svg>
          </div>
          <p class="welcome-description">
            Nous allons vous aider à trouver la solution Daznode qui correspond parfaitement à vos besoins.
          </p>
          <p class="welcome-time">
            <strong>⏱️ 2 minutes seulement</strong> pour une expérience personnalisée
          </p>
        </div>
      `,

      ProfileSelector: () => `
        <div class="profile-grid">
          <button class="profile-card" data-profile="beginner" type="button">
            <div class="profile-icon">🌱</div>
            <h3>Débutant</h3>
            <p>Je découvre Bitcoin et Lightning Network</p>
            <div class="profile-features">
              <span>• Guides pas à pas</span>
              <span>• Support prioritaire</span>
              <span>• Interface simplifiée</span>
            </div>
          </button>
          
          <button class="profile-card" data-profile="merchant" type="button">
            <div class="profile-icon">🏪</div>
            <h3>Commerçant</h3>
            <p>Je veux accepter les paiements Bitcoin</p>
            <div class="profile-features">
              <span>• Terminal de paiement</span>
              <span>• Conversion automatique</span>
              <span>• Intégration e-commerce</span>
            </div>
          </button>
          
          <button class="profile-card" data-profile="developer" type="button">
            <div class="profile-icon">👨‍💻</div>
            <h3>Développeur</h3>
            <p>Je veux intégrer Lightning Network</p>
            <div class="profile-features">
              <span>• API complète</span>
              <span>• SDK et outils</span>
              <span>• Documentation technique</span>
            </div>
          </button>
          
          <button class="profile-card" data-profile="investor" type="button">
            <div class="profile-icon">📈</div>
            <h3>Investisseur</h3>
            <p>Je veux optimiser mes revenus Lightning</p>
            <div class="profile-features">
              <span>• IA d'optimisation</span>
              <span>• Rapports détaillés</span>
              <span>• ROI maximisé</span>
            </div>
          </button>
        </div>
      `,

      GoalSelector: () => `
        <div class="goals-container">
          <p class="goals-instruction">Sélectionnez tout ce qui vous intéresse (plusieurs choix possibles) :</p>
          
          <div class="goals-grid">
            <label class="goal-option">
              <input type="checkbox" name="goals" value="payments" id="goal-payments">
              <div class="goal-card">
                <div class="goal-icon">💳</div>
                <h4>Accepter des paiements</h4>
                <p>Recevoir des paiements Bitcoin instantanés</p>
              </div>
            </label>
            
            <label class="goal-option">
              <input type="checkbox" name="goals" value="node" id="goal-node">
              <div class="goal-card">
                <div class="goal-icon">⚡</div>
                <h4>Faire tourner un nœud</h4>
                <p>Participer au réseau Lightning</p>
              </div>
            </label>
            
            <label class="goal-option">
              <input type="checkbox" name="goals" value="learn" id="goal-learn">
              <div class="goal-card">
                <div class="goal-icon">📚</div>
                <h4>Apprendre</h4>
                <p>Comprendre Bitcoin et Lightning</p>
              </div>
            </label>
            
            <label class="goal-option">
              <input type="checkbox" name="goals" value="invest" id="goal-invest">
              <div class="goal-card">
                <div class="goal-icon">💰</div>
                <h4>Investir et gagner</h4>
                <p>Générer des revenus passifs</p>
              </div>
            </label>
            
            <label class="goal-option">
              <input type="checkbox" name="goals" value="integrate" id="goal-integrate">
              <div class="goal-card">
                <div class="goal-icon">🔧</div>
                <h4>Intégrer à mon app</h4>
                <p>Ajouter Lightning à mon service</p>
              </div>
            </label>
            
            <label class="goal-option">
              <input type="checkbox" name="goals" value="community" id="goal-community">
              <div class="goal-card">
                <div class="goal-icon">🤝</div>
                <h4>Rejoindre la communauté</h4>
                <p>Échanger avec d'autres utilisateurs</p>
              </div>
            </label>
          </div>
        </div>
      `,

      ExperienceSelector: () => `
        <div class="experience-selector">
          <p class="experience-instruction">Quel est votre niveau d'expérience avec Bitcoin ?</p>
          
          <div class="experience-options">
            <label class="experience-option">
              <input type="radio" name="experience" value="novice" id="exp-novice">
              <div class="experience-card">
                <div class="experience-level">🐣</div>
                <h4>Novice</h4>
                <p>Je débute complètement avec Bitcoin</p>
                <div class="experience-desc">
                  Nous vous recommanderons des ressources d'apprentissage et des solutions très simples.
                </div>
              </div>
            </label>
            
            <label class="experience-option">
              <input type="radio" name="experience" value="beginner" id="exp-beginner">
              <div class="experience-card">
                <div class="experience-level">🌱</div>
                <h4>Débutant</h4>
                <p>J'ai quelques connaissances de base</p>
                <div class="experience-desc">
                  Parfait ! Nous pouvons vous proposer des solutions un peu plus avancées.
                </div>
              </div>
            </label>
            
            <label class="experience-option">
              <input type="radio" name="experience" value="intermediate" id="exp-intermediate">
              <div class="experience-card">
                <div class="experience-level">⚡</div>
                <h4>Intermédiaire</h4>
                <p>Je connais bien Bitcoin et Lightning</p>
                <div class="experience-desc">
                  Excellent ! Vous pouvez profiter de toutes nos fonctionnalités avancées.
                </div>
              </div>
            </label>
            
            <label class="experience-option">
              <input type="radio" name="experience" value="expert" id="exp-expert">
              <div class="experience-card">
                <div class="experience-level">🚀</div>
                <h4>Expert</h4>
                <p>Je maîtrise parfaitement l'écosystème</p>
                <div class="experience-desc">
                  Génial ! Nos outils de développement et d'optimisation sont faits pour vous.
                </div>
              </div>
            </label>
          </div>
        </div>
      `,

      RecommendationStep: () => {
        const recommendations = this.generateRecommendations();
        return `
          <div class="recommendations">
            <div class="recommendations-summary">
              <h3>Voici ce que nous recommandons pour vous :</h3>
              <div class="user-summary">
                <span class="user-profile">${this.getUserProfileLabel()}</span>
                <span class="user-experience">${this.getUserExperienceLabel()}</span>
                <span class="user-goals">${this.userData.goals.length} objectif${this.userData.goals.length > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div class="recommendations-content">
              ${recommendations.map(rec => `
                <div class="recommendation-card ${rec.featured ? 'featured' : ''}">
                  ${rec.featured ? '<div class="recommendation-badge">Recommandé</div>' : ''}
                  <div class="recommendation-header">
                    <div class="recommendation-icon">${rec.icon}</div>
                    <h4>${rec.title}</h4>
                  </div>
                  <p class="recommendation-description">${rec.description}</p>
                  <div class="recommendation-benefits">
                    ${rec.benefits.map(benefit => `<span class="benefit">✓ ${benefit}</span>`).join('')}
                  </div>
                  <div class="recommendation-actions">
                    <a href="${rec.primaryAction.url}" class="btn-primary">${rec.primaryAction.text}</a>
                    ${rec.secondaryAction ? `<a href="${rec.secondaryAction.url}" class="btn-secondary">${rec.secondaryAction.text}</a>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="recommendations-footer">
              <p>💡 <strong>Conseil :</strong> Vous pouvez toujours changer d'avis plus tard. Commencez par ce qui vous intéresse le plus !</p>
            </div>
          </div>
        `;
      }
    };
  }

  generateRecommendations() {
    const { profile, goals, experience } = this.userData;
    const recommendations = [];

    // Logique de recommandation basée sur le profil
    if (profile === 'beginner' || experience === 'novice') {
      recommendations.push({
        title: 'Guide des Premiers Pas',
        icon: '📚',
        description: 'Commencez par comprendre les bases de Bitcoin et Lightning Network',
        benefits: ['Explications simples', 'Exemples concrets', 'Pas de prérequis'],
        primaryAction: { text: 'Commencer le guide', url: '/premiers-pas/' },
        secondaryAction: { text: 'Voir la FAQ', url: '/support/faq/' },
        featured: true
      });
    }

    if (profile === 'merchant' || goals.includes('payments')) {
      recommendations.push({
        title: 'DazPay - Solution de Paiement',
        icon: '🏪',
        description: 'Acceptez les paiements Bitcoin instantanément dans votre commerce',
        benefits: ['Intégration simple', 'Conversion automatique', 'Frais réduits'],
        primaryAction: { text: 'Découvrir DazPay', url: '/dazpay/' },
        secondaryAction: { text: 'Voir une démo', url: '/dazpay/demo/' },
        featured: profile === 'merchant'
      });
    }

    if (goals.includes('node') || profile === 'investor') {
      recommendations.push({
        title: 'DazBox - Nœud Lightning Clé en Main',
        icon: '⚡',
        description: 'Votre propre nœud Lightning Network optimisé par IA',
        benefits: ['Installation en 5 min', 'Gestion automatique', 'Revenus optimisés'],
        primaryAction: { text: 'Découvrir DazBox', url: '/dazbox/' },
        secondaryAction: { text: 'Voir les performances', url: '/dazbox/performance/' },
        featured: profile === 'investor'
      });
    }

    if (profile === 'developer' || goals.includes('integrate')) {
      recommendations.push({
        title: 'API et Outils Développeur',
        icon: '👨‍💻',
        description: 'Intégrez Lightning Network dans vos applications',
        benefits: ['API REST complète', 'SDK JavaScript', 'Documentation détaillée'],
        primaryAction: { text: 'Documentation API', url: '/guides/developpeurs/api/' },
        secondaryAction: { text: 'Exemples de code', url: '/guides/developpeurs/exemples/' },
        featured: profile === 'developer'
      });
    }

    if (goals.includes('community')) {
      recommendations.push({
        title: 'Communauté Daznode',
        icon: '🤝',
        description: 'Rejoignez notre communauté d\'utilisateurs passionnés',
        benefits: ['Support communautaire', 'Échanges d\'expérience', 'Actualités exclusives'],
        primaryAction: { text: 'Rejoindre Telegram', url: 'https://t.me/+_tiT3od1q_Q0MjI0' },
        featured: false
      });
    }

    return recommendations.slice(0, 3); // Limiter à 3 recommandations
  }

  getUserProfileLabel() {
    const labels = {
      beginner: '🌱 Débutant',
      merchant: '🏪 Commerçant',
      developer: '👨‍💻 Développeur',
      investor: '📈 Investisseur'
    };
    return labels[this.userData.profile] || 'Utilisateur';
  }

  getUserExperienceLabel() {
    const labels = {
      novice: '🐣 Novice',
      beginner: '🌱 Débutant',
      intermediate: '⚡ Intermédiaire',
      expert: '🚀 Expert'
    };
    return labels[this.userData.experience] || '';
  }

  attachEvents() {
    if (!this.modal) return;

    // Fermeture
    const closeBtn = this.modal.querySelector('.wizard-close');
    const overlay = this.modal.querySelector('.wizard-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }

    // Navigation
    const nextBtn = this.modal.querySelector('.wizard-next');
    const prevBtn = this.modal.querySelector('.wizard-prev');
    const finishBtn = this.modal.querySelector('.wizard-finish');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }
    
    if (finishBtn) {
      finishBtn.addEventListener('click', () => this.finish());
    }

    // Sélection de profil
    this.modal.querySelectorAll('.profile-card').forEach(card => {
      card.addEventListener('click', () => {
        this.modal.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.userData.profile = card.dataset.profile;
        this.updateNextButton();
        this.trackEvent('profile_selected', { profile: this.userData.profile });
      });
    });

    // Sélection des objectifs
    this.modal.querySelectorAll('input[name="goals"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.userData.goals = Array.from(this.modal.querySelectorAll('input[name="goals"]:checked'))
          .map(cb => cb.value);
        this.updateNextButton();
        this.trackEvent('goals_updated', { goals: this.userData.goals });
      });
    });

    // Sélection de l'expérience
    this.modal.querySelectorAll('input[name="experience"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.userData.experience = radio.value;
          this.updateNextButton();
          this.trackEvent('experience_selected', { experience: this.userData.experience });
        }
      });
    });

    // Gestion clavier
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  updateNextButton() {
    const nextBtn = this.modal.querySelector('.wizard-next');
    if (nextBtn) {
      nextBtn.disabled = !this.isStepValid();
    }
  }

  isStepValid() {
    const step = this.steps[this.currentStep];
    
    switch (step.id) {
      case 'welcome':
        return true;
      case 'profile':
        return this.userData.profile !== null;
      case 'goals':
        return this.userData.goals.length > 0;
      case 'experience':
        return this.userData.experience !== null;
      case 'recommendation':
        return true;
      default:
        return true;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1 && this.isStepValid()) {
      this.currentStep++;
      this.updateWizard();
      this.trackEvent('wizard_step', { step: this.currentStep + 1 });
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateWizard();
    }
  }

  updateWizard() {
    if (this.modal) {
      this.modal.innerHTML = this.getWizardHTML();
      this.attachEvents();
      
      // Focus sur le premier élément interactif
      setTimeout(() => {
        const firstFocusable = this.modal.querySelector('.profile-card, input, .btn-primary');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);
    }
  }

  finish() {
    // Sauvegarder les préférences
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('user-profile', JSON.stringify(this.userData));
    
    // Incrémenter le compteur de visites
    const visits = parseInt(localStorage.getItem('visit-count') || '0') + 1;
    localStorage.setItem('visit-count', visits.toString());
    
    // Analytics
    this.trackEvent('onboarding_completed', this.userData);
    
    // Fermer le wizard
    this.close();
    
    // Message de confirmation
    this.showCompletionMessage();
  }

  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
      <div class="completion-content">
        <div class="completion-icon">🎉</div>
        <h3>Parfait ! Votre expérience est maintenant personnalisée</h3>
        <p>Nous avons adapté la documentation selon vos préférences.</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  close() {
    if (this.modal) {
      // Marquer comme dismissé pour cette session
      sessionStorage.setItem('wizard-dismissed', 'true');
      
      // Restaurer le focus
      if (this.previousFocus) {
        this.previousFocus.focus();
      }
      
      // Supprimer le modal
      document.body.classList.remove('wizard-active');
      this.modal.remove();
      this.modal = null;
      
      // Analytics
      this.trackEvent('wizard_closed', { step: this.currentStep + 1 });
    }
  }

  trapFocus() {
    if (!this.modal) return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    const handleFocus = (e) => {
      this.focusableElements = Array.from(this.modal.querySelectorAll(focusableSelector))
        .filter(el => !el.disabled && getComputedStyle(el).display !== 'none');
      
      if (this.focusableElements.length === 0) return;
      
      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleFocus);
    
    // Cleanup
    this.cleanupFocus = () => {
      document.removeEventListener('keydown', handleFocus);
    };
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'onboarding',
        ...data
      });
    }

    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
      plausible(eventName, { props: data });
    }

    console.log(`📊 Event tracked: ${eventName}`, data);
  }

  // API publique
  show() {
    if (!this.modal) {
      this.createWizard();
    }
  }

  hide() {
    this.close();
  }

  reset() {
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('user-profile');
    sessionStorage.removeItem('wizard-dismissed');
    this.currentStep = 0;
    this.userData = { profile: null, goals: [], experience: null, preferences: {} };
  }

  // Cleanup
  destroy() {
    if (this.cleanupFocus) {
      this.cleanupFocus();
    }
    
    if (this.modal) {
      this.modal.remove();
    }
    
    document.body.classList.remove('wizard-active');
  }
}

// Styles CSS intégrés
const wizardStyles = `
<style>
.wizard-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: wizard-fade-in 0.3s ease-out;
}

.wizard-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.wizard-content {
  position: relative;
  background: var(--color-background);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.wizard-header {
  position: relative;
  padding: 20px 20px 0;
}

.wizard-progress {
  height: 4px;
  background: rgba(0, 177, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
}

.wizard-progress-bar {
  height: 100%;
  background: linear-gradient(45deg, var(--color-primary), #4dccff);
  transition: width 0.3s ease;
}

.wizard-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.wizard-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--color-text);
}

.wizard-body {
  padding: 0 20px 20px;
  overflow-y: auto;
  flex: 1;
}

.wizard-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 24px;
  text-align: center;
}

.wizard-footer {
  padding: 20px;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.wizard-footer .btn-secondary {
  margin-right: auto;
}

/* Welcome Step */
.welcome-content {
  text-align: center;
}

.welcome-illustration {
  margin: 20px 0;
}

.welcome-description {
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 16px;
}

.welcome-time {
  color: var(--color-primary);
  font-size: 16px;
}

/* Profile Selector */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.profile-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 177, 255, 0.1);
}

.profile-card.selected {
  border-color: var(--color-primary);
  background: rgba(0, 177, 255, 0.05);
}

.profile-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.profile-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--color-heading);
}

.profile-card p {
  color: var(--color-text-muted);
  margin: 0;
}

.profile-features {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: var(--color-text);
}

/* Goals Selector */
.goals-instruction {
  text-align: center;
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 24px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.goal-option {
  cursor: pointer;
}

.goal-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.goal-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.2s;
}

.goal-option input:checked + .goal-card {
  border-color: var(--color-primary);
  background: rgba(0, 177, 255, 0.05);
}

.goal-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.goal-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-heading);
}

.goal-card p {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

/* Experience Selector */
.experience-instruction {
  text-align: center;
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 24px;
}

.experience-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.experience-option {
  cursor: pointer;
}

.experience-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.experience-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.experience-option input:checked + .experience-card {
  border-color: var(--color-primary);
  background: rgba(0, 177, 255, 0.05);
}

.experience-level {
  font-size: 32px;
}

.experience-card h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-heading);
}

.experience-card p {
  color: var(--color-text-muted);
  margin: 0;
}

.experience-desc {
  font-size: 14px;
  color: var(--color-text);
  margin-top: 8px;
}

/* Recommendations */
.recommendations-summary {
  text-align: center;
  margin-bottom: 32px;
}

.recommendations-summary h3 {
  font-size: 20px;
  color: var(--color-heading);
  margin: 0 0 16px;
}

.user-summary {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.user-summary span {
  background: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.recommendations-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.recommendation-card.featured {
  border-color: var(--color-primary);
  background: rgba(0, 177, 255, 0.05);
}

.recommendation-badge {
  position: absolute;
  top: -8px;
  right: 16px;
  background: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.recommendation-icon {
  font-size: 24px;
}

.recommendation-card h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--color-heading);
}

.recommendation-description {
  color: var(--color-text);
  margin: 0 0 16px;
}

.recommendation-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.benefit {
  font-size: 14px;
  color: var(--color-success);
  background: rgba(56, 161, 105, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.recommendation-actions {
  display: flex;
  gap: 12px;
}

.recommendations-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.recommendations-footer p {
  color: var(--color-text-muted);
  margin: 0;
}

/* Completion Message */
.completion-message {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10001;
  background: var(--color-primary);
  color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: slide-in-right 0.3s ease-out;
  max-width: 320px;
}

.completion-content {
  text-align: center;
}

.completion-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.completion-message h3 {
  font-size: 16px;
  margin: 0 0 8px;
}

.completion-message p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.completion-message.fade-out {
  animation: fade-out 0.3s ease-out forwards;
}

/* Animations */
@keyframes wizard-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .wizard-modal {
    padding: 10px;
  }
  
  .wizard-content {
    max-height: 95vh;
  }
  
  .profile-grid {
    grid-template-columns: 1fr;
  }
  
  .goals-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .recommendation-actions {
    flex-direction: column;
  }
  
  .wizard-footer {
    flex-direction: column;
  }
  
  .wizard-footer .btn-secondary {
    margin-right: 0;
    order: 2;
  }
}

/* Dark theme adjustments */
.theme-dark .wizard-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Body lock when wizard is active */
body.wizard-active {
  overflow: hidden;
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', wizardStyles);

// Initialisation
let onboardingWizard = null;

document.addEventListener('DOMContentLoaded', () => {
  // Attendre un peu pour ne pas bloquer le rendu initial
  setTimeout(() => {
    onboardingWizard = new OnboardingWizard();
    
    // Exposer pour le debug
    window.onboardingWizard = onboardingWizard;
  }, 1000);
});

// API publique
window.showOnboarding = () => {
  if (onboardingWizard) {
    onboardingWizard.show();
  }
};

window.resetOnboarding = () => {
  if (onboardingWizard) {
    onboardingWizard.reset();
  }
};

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OnboardingWizard;
}