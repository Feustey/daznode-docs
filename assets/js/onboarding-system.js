/**
 * Système d'onboarding progressif pour Daznode
 * Guide les utilisateurs selon leur niveau et objectifs
 */

class OnboardingWizard {
  constructor() {
    this.currentStep = 0;
    this.userProfile = {
      level: null,
      goals: [],
      expertise: [],
      hasNode: false,
      preferredLanguage: 'fr'
    };
    this.steps = [
      {
        id: 'welcome',
        title: 'Bienvenue sur Daznode! 👋',
        component: this.renderWelcomeStep.bind(this)
      },
      {
        id: 'experience',
        title: 'Quel est votre niveau d\'expérience?',
        component: this.renderExperienceStep.bind(this)
      },
      {
        id: 'goals',
        title: 'Quels sont vos objectifs?',
        component: this.renderGoalsStep.bind(this)
      },
      {
        id: 'personalization',
        title: 'Personnalisons votre expérience',
        component: this.renderPersonalizationStep.bind(this)
      },
      {
        id: 'complete',
        title: 'C\'est parti! 🚀',
        component: this.renderCompleteStep.bind(this)
      }
    ];
  }

  init() {
    // Vérifier si l'utilisateur a déjà complété l'onboarding
    const hasCompletedOnboarding = localStorage.getItem('daznode_onboarding_complete');
    const skipOnboarding = new URLSearchParams(window.location.search).get('skip_onboarding');
    
    if (!hasCompletedOnboarding && !skipOnboarding) {
      this.show();
    }
  }

  show() {
    this.createModal();
    this.render();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'onboarding-modal';
    modal.className = 'onboarding-modal';
    modal.innerHTML = `
      <div class="onboarding-container">
        <div class="onboarding-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <button class="skip-button" onclick="onboarding.skip()">Passer</button>
        </div>
        <div class="onboarding-content">
          <!-- Le contenu sera injecté ici -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  render() {
    const step = this.steps[this.currentStep];
    const content = document.querySelector('.onboarding-content');
    const progressBar = document.querySelector('.progress-fill');
    
    // Mise à jour de la barre de progression
    const progress = ((this.currentStep + 1) / this.steps.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Rendu du contenu de l'étape
    content.innerHTML = step.component();
    
    // Animation d'entrée
    content.classList.remove('fade-in');
    void content.offsetWidth; // Force reflow
    content.classList.add('fade-in');
  }

  renderWelcomeStep() {
    return `
      <div class="step-welcome">
        <div class="welcome-icon">🎉</div>
        <h2>Bienvenue sur Daznode!</h2>
        <p>La plateforme collaborative pour maîtriser le Lightning Network</p>
        <div class="features-preview">
          <div class="feature">
            <span class="feature-icon">📚</span>
            <span>Apprenez à votre rythme</span>
          </div>
          <div class="feature">
            <span class="feature-icon">💰</span>
            <span>Gagnez des tokens T4G</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🤝</span>
            <span>Rejoignez la communauté</span>
          </div>
        </div>
        <button class="btn-primary" onclick="onboarding.nextStep()">
          Commencer →
        </button>
      </div>
    `;
  }

  renderExperienceStep() {
    return `
      <div class="step-experience">
        <h2>Quel est votre niveau d'expérience?</h2>
        <p>Nous personnaliserons votre parcours en fonction</p>
        <div class="experience-options">
          <button class="experience-card" onclick="onboarding.setLevel('beginner')">
            <div class="card-icon">🌱</div>
            <h3>Débutant</h3>
            <p>Je découvre Bitcoin et Lightning</p>
            <div class="reward-preview">+50 T4G</div>
          </button>
          <button class="experience-card" onclick="onboarding.setLevel('intermediate')">
            <div class="card-icon">⚡</div>
            <h3>Intermédiaire</h3>
            <p>J'ai déjà utilisé Lightning</p>
            <div class="reward-preview">+75 T4G</div>
          </button>
          <button class="experience-card" onclick="onboarding.setLevel('expert')">
            <div class="card-icon">🚀</div>
            <h3>Expert</h3>
            <p>J'opère un nœud Lightning</p>
            <div class="reward-preview">+100 T4G</div>
          </button>
        </div>
      </div>
    `;
  }

  renderGoalsStep() {
    const goals = [
      { id: 'learn', icon: '📚', title: 'Apprendre Lightning', reward: 20 },
      { id: 'earn', icon: '💰', title: 'Gagner des T4G', reward: 30 },
      { id: 'contribute', icon: '✍️', title: 'Contribuer du contenu', reward: 50 },
      { id: 'optimize', icon: '📈', title: 'Optimiser mon nœud', reward: 40 },
      { id: 'connect', icon: '🤝', title: 'Rejoindre la communauté', reward: 25 },
      { id: 'business', icon: '💼', title: 'Intégrer Lightning à mon business', reward: 60 }
    ];

    return `
      <div class="step-goals">
        <h2>Quels sont vos objectifs?</h2>
        <p>Sélectionnez tout ce qui vous intéresse (plusieurs choix possibles)</p>
        <div class="goals-grid">
          ${goals.map(goal => `
            <label class="goal-card">
              <input type="checkbox" value="${goal.id}" onchange="onboarding.toggleGoal('${goal.id}')">
              <div class="goal-content">
                <span class="goal-icon">${goal.icon}</span>
                <span class="goal-title">${goal.title}</span>
                <span class="goal-reward">+${goal.reward} T4G</span>
              </div>
            </label>
          `).join('')}
        </div>
        <button class="btn-primary" onclick="onboarding.nextStep()" 
                ${this.userProfile.goals.length === 0 ? 'disabled' : ''}>
          Continuer →
        </button>
      </div>
    `;
  }

  renderPersonalizationStep() {
    const expertiseDomains = [
      { id: 'lightning', name: 'Lightning Network', icon: '⚡' },
      { id: 'hardware', name: 'Hardware/DazBox', icon: '🔧' },
      { id: 'security', name: 'Sécurité', icon: '🛡️' },
      { id: 'economics', name: 'Économie', icon: '💰' },
      { id: 'development', name: 'Développement', icon: '💻' }
    ];

    return `
      <div class="step-personalization">
        <h2>Personnalisons votre expérience</h2>
        
        <div class="personalization-section">
          <h3>Avez-vous déjà un nœud Lightning?</h3>
          <div class="toggle-group">
            <button class="toggle-btn ${this.userProfile.hasNode ? 'active' : ''}" 
                    onclick="onboarding.setHasNode(true)">
              Oui
            </button>
            <button class="toggle-btn ${!this.userProfile.hasNode ? 'active' : ''}" 
                    onclick="onboarding.setHasNode(false)">
              Non
            </button>
          </div>
        </div>

        <div class="personalization-section">
          <h3>Domaines d'intérêt</h3>
          <div class="expertise-chips">
            ${expertiseDomains.map(domain => `
              <button class="chip ${this.userProfile.expertise.includes(domain.id) ? 'active' : ''}"
                      onclick="onboarding.toggleExpertise('${domain.id}')">
                ${domain.icon} ${domain.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="personalization-section">
          <h3>Notifications</h3>
          <label class="switch-container">
            <input type="checkbox" checked>
            <span class="switch"></span>
            <span>Recevoir des conseils personnalisés</span>
          </label>
        </div>

        <button class="btn-primary" onclick="onboarding.complete()">
          Terminer →
        </button>
      </div>
    `;
  }

  renderCompleteStep() {
    const totalRewards = this.calculateRewards();
    const recommendedPath = this.getRecommendedPath();

    return `
      <div class="step-complete">
        <div class="completion-animation">
          <div class="confetti"></div>
          <div class="check-icon">✓</div>
        </div>
        
        <h2>Bienvenue dans la communauté Daznode!</h2>
        
        <div class="reward-summary">
          <h3>Vos premiers tokens T4G 🎉</h3>
          <div class="reward-total">${totalRewards} T4G</div>
          <p>Pour avoir complété votre profil</p>
        </div>

        <div class="next-steps">
          <h3>Prochaines étapes recommandées</h3>
          ${recommendedPath.map(step => `
            <a href="${step.url}" class="next-step-card">
              <span class="step-icon">${step.icon}</span>
              <div class="step-info">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
              </div>
              <span class="step-reward">+${step.reward} T4G</span>
            </a>
          `).join('')}
        </div>

        <div class="action-buttons">
          <button class="btn-primary" onclick="onboarding.goToDashboard()">
            Accéder au Dashboard
          </button>
          <button class="btn-secondary" onclick="onboarding.exploreCommunity()">
            Explorer la Communauté
          </button>
        </div>
      </div>
    `;
  }

  setLevel(level) {
    this.userProfile.level = level;
    this.nextStep();
  }

  toggleGoal(goalId) {
    const index = this.userProfile.goals.indexOf(goalId);
    if (index > -1) {
      this.userProfile.goals.splice(index, 1);
    } else {
      this.userProfile.goals.push(goalId);
    }
    this.render(); // Re-render pour activer/désactiver le bouton
  }

  setHasNode(hasNode) {
    this.userProfile.hasNode = hasNode;
    this.render();
  }

  toggleExpertise(expertiseId) {
    const index = this.userProfile.expertise.indexOf(expertiseId);
    if (index > -1) {
      this.userProfile.expertise.splice(index, 1);
    } else {
      this.userProfile.expertise.push(expertiseId);
    }
    this.render();
  }

  calculateRewards() {
    let total = 0;
    
    // Récompense selon le niveau
    const levelRewards = {
      beginner: 50,
      intermediate: 75,
      expert: 100
    };
    total += levelRewards[this.userProfile.level] || 0;
    
    // Récompenses pour les objectifs
    const goalRewards = {
      learn: 20,
      earn: 30,
      contribute: 50,
      optimize: 40,
      connect: 25,
      business: 60
    };
    this.userProfile.goals.forEach(goal => {
      total += goalRewards[goal] || 0;
    });
    
    // Bonus de complétion
    total += 50;
    
    return total;
  }

  getRecommendedPath() {
    const paths = [];
    
    if (this.userProfile.level === 'beginner') {
      paths.push({
        icon: '📚',
        title: 'Cours Bitcoin Fondamentaux',
        description: 'Commencez par les bases',
        url: '/learn/fundamentals/bitcoin-basics/',
        reward: 40
      });
    }
    
    if (this.userProfile.goals.includes('earn')) {
      paths.push({
        icon: '✍️',
        title: 'Première Contribution',
        description: 'Créez votre premier guide',
        url: '/community/contribute/',
        reward: 100
      });
    }
    
    if (this.userProfile.hasNode) {
      paths.push({
        icon: '📊',
        title: 'Analyser vos Performances',
        description: 'Optimisez votre nœud',
        url: '/technical/tools/node-analyzer/',
        reward: 60
      });
    }
    
    return paths.slice(0, 3); // Maximum 3 recommandations
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    }
  }

  skip() {
    if (confirm('Êtes-vous sûr de vouloir passer l\'onboarding? Vous pourrez le relancer depuis votre profil.')) {
      this.close();
    }
  }

  complete() {
    // Sauvegarder le profil utilisateur
    localStorage.setItem('daznode_user_profile', JSON.stringify(this.userProfile));
    localStorage.setItem('daznode_onboarding_complete', 'true');
    
    // Distribuer les récompenses (appel API)
    this.distributeRewards();
    
    // Afficher l'écran de fin
    this.currentStep = this.steps.length - 1;
    this.render();
  }

  distributeRewards() {
    const rewards = this.calculateRewards();
    // Appel API pour créditer les T4G
    fetch('/api/t4g/onboarding-reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: rewards,
        profile: this.userProfile
      })
    });
  }

  goToDashboard() {
    window.location.href = '/dashboard/';
  }

  exploreCommunity() {
    window.location.href = '/community/';
  }

  close() {
    const modal = document.getElementById('onboarding-modal');
    modal.classList.add('fade-out');
    setTimeout(() => modal.remove(), 300);
  }
}

// Initialisation
const onboarding = new OnboardingWizard();
document.addEventListener('DOMContentLoaded', () => onboarding.init());