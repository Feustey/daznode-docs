/**
 * Système de Certification et Progression Professionnelle
 * Certifications blockchain-verified, portfolio et parcours carrière
 */

class CertificationSystem {
  constructor() {
    this.user = this.getCurrentUser();
    this.certifications = this.loadCertifications();
    this.assessments = new AssessmentEngine();
    this.blockchain = new BlockchainVerification();
    this.portfolio = new PortfolioManager();
    this.career = new CareerPathManager();
    this.skills = new SkillsTracker();
    this.init();
  }

  getCurrentUser() {
    return window.gamification?.getUser() || {
      id: 'guest',
      username: 'User',
      level: 1,
      completedModules: [],
      achievements: [],
      certifications: [],
      skills: {},
      portfolio: { projects: [], achievements: [] }
    };
  }

  loadCertifications() {
    return {
      'bitcoin-fundamentals': {
        id: 'bitcoin-fundamentals',
        title: 'Bitcoin Fundamentals Certified',
        level: 'foundation',
        icon: '₿',
        description: 'Maîtrise des concepts fondamentaux de Bitcoin',
        requirements: {
          modules: ['btc_101', 'wallets_basics', 'first_transaction', 'security_basics'],
          quizScore: 80,
          practicalTasks: ['wallet_setup', 'transaction_send', 'backup_recovery'],
          timeRequired: 10 // heures
        },
        benefits: [
          'Certificat vérifiable sur blockchain',
          'Badge professionnel LinkedIn',
          'Accès aux opportunités emploi niveau junior',
          '100 XP bonus'
        ],
        verificationMethod: 'blockchain',
        validityPeriod: null, // permanent
        price: 0 // gratuit
      },
      'lightning-specialist': {
        id: 'lightning-specialist',
        title: 'Lightning Network Specialist',
        level: 'professional',
        icon: '⚡',
        description: 'Expertise avancée en Lightning Network',
        requirements: {
          modules: ['ln_intro', 'channels_deep', 'routing_mastery', 'liquidity_mgmt', 'troubleshooting'],
          quizScore: 85,
          practicalTasks: ['channel_management', 'payment_routing', 'rebalancing'],
          projects: ['lightning_implementation'],
          timeRequired: 25
        },
        benefits: [
          'Certificat professionnel reconnu industrie',
          'Accès réseau d\'experts Lightning',
          'Opportunités consulting',
          '500 XP bonus',
          'Badge "Lightning Expert"'
        ],
        verificationMethod: 'blockchain',
        validityPeriod: 24, // mois
        price: 99 // euros
      },
      'node-operator-certified': {
        id: 'node-operator-certified',
        title: 'Certified Lightning Node Operator',
        level: 'expert',
        icon: '🖥️',
        description: 'Certification professionnelle d\'opérateur de nœud',
        requirements: {
          modules: ['node_setup', 'channel_strategy', 'roi_optimization', 'monitoring_tools', 'security_advanced'],
          quizScore: 90,
          practicalTasks: ['node_deployment', 'channel_optimization', 'incident_response'],
          projects: ['profitable_node'],
          experience: 6, // mois d'expérience requis
          timeRequired: 40
        },
        benefits: [
          'Certification professionnelle niveau expert',
          'Partenariat avec exchanges et services Lightning',
          'Accès aux offres d\'emploi premium',
          'Mentoring et formations avancées',
          '1000 XP bonus'
        ],
        verificationMethod: 'proctored',
        validityPeriod: 12,
        price: 299
      },
      'lightning-developer': {
        id: 'lightning-developer',
        title: 'Lightning Network Developer',
        level: 'expert',
        icon: '👨‍💻',
        description: 'Développeur expert Lightning Network',
        requirements: {
          modules: ['ln_dev_basics', 'lnd_api', 'cln_integration', 'payment_flows', 'security_dev'],
          quizScore: 85,
          practicalTasks: ['api_integration', 'payment_app', 'webhook_handling'],
          projects: ['lightning_app', 'integration_project'],
          codeReview: true,
          timeRequired: 50
        },
        benefits: [
          'Certification développeur reconnue',
          'Accès aux opportunités développement blockchain',
          'Réseau développeurs Lightning',
          'Code review par experts',
          '750 XP bonus'
        ],
        verificationMethod: 'peer-review',
        validityPeriod: 24,
        price: 199
      },
      'lightning-business': {
        id: 'lightning-business',
        title: 'Lightning Business Strategist',
        level: 'professional',
        icon: '💼',
        description: 'Stratégie business et adoption Lightning',
        requirements: {
          modules: ['business_cases', 'adoption_strategy', 'regulatory_compliance', 'roi_analysis'],
          quizScore: 80,
          practicalTasks: ['business_plan', 'roi_calculation', 'compliance_audit'],
          projects: ['business_integration'],
          timeRequired: 30
        },
        benefits: [
          'Certification business Lightning',
          'Accès réseau entrepreneurs blockchain',
          'Opportunités consulting business',
          'Partenariats entreprises',
          '600 XP bonus'
        ],
        verificationMethod: 'case-study',
        validityPeriod: 36,
        price: 249
      }
    };
  }

  init() {
    this.createCertificationInterface();
    this.setupEventListeners();
    this.loadUserProgress();
    this.initializeBlockchainIntegration();
  }

  createCertificationInterface() {
    const certificationContainer = document.createElement('div');
    certificationContainer.id = 'certification-system';
    certificationContainer.className = 'certification-system';
    
    certificationContainer.innerHTML = `
      <!-- Certification Header -->
      <header class="certification-header">
        <div class="header-content">
          <h1>🏆 Certifications Professionnelles</h1>
          <p>Validez vos compétences avec des certifications reconnues par l'industrie</p>
        </div>
        
        <div class="certification-stats">
          <div class="stat-card">
            <span class="stat-value" id="earned-certifications">0</span>
            <span class="stat-label">Certifications Obtenues</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="in-progress-certifications">0</span>
            <span class="stat-label">En Cours</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="professional-score">0</span>
            <span class="stat-label">Score Professionnel</span>
          </div>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="certification-nav">
        <button class="cert-tab active" data-tab="overview">Vue d'ensemble</button>
        <button class="cert-tab" data-tab="certifications">Certifications</button>
        <button class="cert-tab" data-tab="assessments">Évaluations</button>
        <button class="cert-tab" data-tab="portfolio">Portfolio</button>
        <button class="cert-tab" data-tab="career">Parcours Carrière</button>
        <button class="cert-tab" data-tab="blockchain">Vérifications</button>
      </nav>

      <!-- Content Sections -->
      <main class="certification-content">
        <!-- Overview Tab -->
        <section class="cert-section active" id="overview-section">
          <div class="overview-grid">
            <div class="progress-card">
              <h2>Votre Progression</h2>
              <div class="skill-radar" id="skill-radar">
                <!-- Graphique radar des compétences -->
              </div>
              <div class="skill-breakdown" id="skill-breakdown">
                <div class="skill-item">
                  <span class="skill-name">Bitcoin Fundamentals</span>
                  <div class="skill-progress">
                    <div class="progress-bar" style="width: 85%"></div>
                  </div>
                  <span class="skill-level">85%</span>
                </div>
                <div class="skill-item">
                  <span class="skill-name">Lightning Network</span>
                  <div class="skill-progress">
                    <div class="progress-bar" style="width: 65%"></div>
                  </div>
                  <span class="skill-level">65%</span>
                </div>
                <div class="skill-item">
                  <span class="skill-name">Node Operation</span>
                  <div class="skill-progress">
                    <div class="progress-bar" style="width: 45%"></div>
                  </div>
                  <span class="skill-level">45%</span>
                </div>
              </div>
            </div>
            
            <div class="recommendations-card">
              <h2>Recommandations Personnalisées</h2>
              <div class="recommendations-list" id="recommendations-list">
                <div class="recommendation-item">
                  <div class="rec-icon">🎯</div>
                  <div class="rec-content">
                    <h3>Bitcoin Fundamentals</h3>
                    <p>Commencez par cette certification de base</p>
                    <div class="rec-progress">2/5 modules complétés</div>
                  </div>
                  <button class="btn-start-cert" data-cert="bitcoin-fundamentals">Continuer</button>
                </div>
                
                <div class="recommendation-item">
                  <div class="rec-icon">⚡</div>
                  <div class="rec-content">
                    <h3>Lightning Specialist</h3>
                    <p>Prêt pour le niveau professionnel</p>
                    <div class="rec-progress">Prérequis: Bitcoin Fundamentals</div>
                  </div>
                  <button class="btn-start-cert" data-cert="lightning-specialist" disabled>Débloquer</button>
                </div>
              </div>
            </div>
            
            <div class="achievements-showcase">
              <h2>Réussites Récentes</h2>
              <div class="achievements-timeline" id="achievements-timeline">
                <div class="timeline-item">
                  <div class="timeline-date">Aujourd'hui</div>
                  <div class="timeline-content">
                    <h4>Module "Bitcoin Wallets" Complété</h4>
                    <p>Score: 92% • +50 XP</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-date">Hier</div>
                  <div class="timeline-content">
                    <h4>Badge "Quick Learner" Débloqué</h4>
                    <p>5 modules complétés en 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Certifications Tab -->
        <section class="cert-section" id="certifications-section">
          <div class="certifications-header">
            <div class="filter-controls">
              <select id="level-filter" class="cert-filter">
                <option value="all">Tous les niveaux</option>
                <option value="foundation">Fondation</option>
                <option value="professional">Professionnel</option>
                <option value="expert">Expert</option>
              </select>
              
              <select id="status-filter" class="cert-filter">
                <option value="all">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Complété</option>
                <option value="expired">Expiré</option>
              </select>
            </div>
            
            <div class="search-container">
              <input type="text" id="cert-search" placeholder="Rechercher une certification..." class="search-input">
            </div>
          </div>
          
          <div class="certifications-grid" id="certifications-grid">
            ${Object.values(this.certifications).map(cert => this.renderCertificationCard(cert)).join('')}
          </div>
        </section>

        <!-- Assessments Tab -->
        <section class="cert-section" id="assessments-section">
          <div class="assessments-container">
            <h2>Centre d'Évaluation</h2>
            
            <div class="assessment-types">
              <div class="assessment-type-card" data-type="quiz">
                <div class="type-icon">📝</div>
                <h3>Quiz Techniques</h3>
                <p>Évaluations rapides de connaissances</p>
                <button class="btn-start-assessment">Commencer</button>
              </div>
              
              <div class="assessment-type-card" data-type="practical">
                <div class="type-icon">⚙️</div>
                <h3>Exercices Pratiques</h3>
                <p>Tâches hands-on et simulations</p>
                <button class="btn-start-assessment">Commencer</button>
              </div>
              
              <div class="assessment-type-card" data-type="project">
                <div class="type-icon">🚀</div>
                <h3>Projets Portfolio</h3>
                <p>Projets complets évalués par pairs</p>
                <button class="btn-start-assessment">Commencer</button>
              </div>
              
              <div class="assessment-type-card" data-type="proctored">
                <div class="type-icon">🎥</div>
                <h3>Examens Surveillés</h3>
                <p>Évaluations certifiantes en direct</p>
                <button class="btn-start-assessment">Programmer</button>
              </div>
            </div>
            
            <div class="assessment-history">
              <h3>Historique des Évaluations</h3>
              <div class="history-list" id="assessment-history">
                <div class="history-item">
                  <div class="assessment-info">
                    <h4>Bitcoin Fundamentals Quiz</h4>
                    <span class="assessment-date">15 Déc 2024</span>
                  </div>
                  <div class="assessment-score">92%</div>
                  <div class="assessment-status passed">Réussi</div>
                </div>
                
                <div class="history-item">
                  <div class="assessment-info">
                    <h4>Lightning Channel Management</h4>
                    <span class="assessment-date">12 Déc 2024</span>
                  </div>
                  <div class="assessment-score">78%</div>
                  <div class="assessment-status needs-improvement">À améliorer</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Portfolio Tab -->
        <section class="cert-section" id="portfolio-section">
          <div class="portfolio-container">
            <div class="portfolio-header">
              <h2>Portfolio Professionnel</h2>
              <button class="btn-export-portfolio" id="export-portfolio">Exporter Portfolio</button>
            </div>
            
            <div class="portfolio-content">
              <div class="portfolio-sidebar">
                <div class="profile-card">
                  <div class="profile-avatar">⚡</div>
                  <h3>${this.user.username}</h3>
                  <p class="profile-title">Lightning Network Enthusiast</p>
                  
                  <div class="profile-stats">
                    <div class="stat">
                      <span class="value">5</span>
                      <span class="label">Certifications</span>
                    </div>
                    <div class="stat">
                      <span class="value">23</span>
                      <span class="label">Projets</span>
                    </div>
                    <div class="stat">
                      <span class="value">4.8</span>
                      <span class="label">Note Moyenne</span>
                    </div>
                  </div>
                  
                  <div class="contact-info">
                    <button class="btn-share-profile">Partager Profil</button>
                    <button class="btn-generate-cv">Générer CV</button>
                  </div>
                </div>
                
                <div class="skills-chart">
                  <h4>Compétences Techniques</h4>
                  <div class="skills-list" id="portfolio-skills">
                    <div class="skill-tag expert">Lightning Network</div>
                    <div class="skill-tag advanced">Bitcoin Core</div>
                    <div class="skill-tag intermediate">Node Operation</div>
                    <div class="skill-tag beginner">Development</div>
                  </div>
                </div>
              </div>
              
              <div class="portfolio-main">
                <div class="portfolio-section">
                  <h3>📜 Certifications</h3>
                  <div class="certifications-showcase" id="portfolio-certifications">
                    <div class="cert-badge earned">
                      <div class="cert-icon">₿</div>
                      <div class="cert-info">
                        <h4>Bitcoin Fundamentals</h4>
                        <p>Obtenu le 10 Déc 2024</p>
                        <span class="cert-id">Cert #BTC-001-2024</span>
                      </div>
                      <button class="btn-verify-cert">Vérifier</button>
                    </div>
                  </div>
                </div>
                
                <div class="portfolio-section">
                  <h3>🚀 Projets Réalisés</h3>
                  <div class="projects-showcase" id="portfolio-projects">
                    <div class="project-item">
                      <div class="project-image">
                        <img src="/api/placeholder/200/120" alt="Lightning Wallet">
                      </div>
                      <div class="project-content">
                        <h4>Lightning Mobile Wallet</h4>
                        <p>Application mobile pour paiements Lightning avec interface intuitive</p>
                        <div class="project-tech">
                          <span class="tech-tag">React Native</span>
                          <span class="tech-tag">LND</span>
                        </div>
                        <div class="project-links">
                          <a href="#" class="project-link">Voir Démo</a>
                          <a href="#" class="project-link">Code Source</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="portfolio-section">
                  <h3>🏆 Récompenses & Reconnaissances</h3>
                  <div class="awards-list" id="portfolio-awards">
                    <div class="award-item">
                      <div class="award-icon">🥇</div>
                      <div class="award-content">
                        <h4>Hackathon Lightning Winner</h4>
                        <p>1ère place - Catégorie Innovation</p>
                        <span class="award-date">Novembre 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Career Tab -->
        <section class="cert-section" id="career-section">
          <div class="career-container">
            <h2>Parcours Carrière</h2>
            
            <div class="career-paths">
              <div class="career-path-card" data-path="developer">
                <div class="path-icon">👨‍💻</div>
                <h3>Développeur Lightning</h3>
                <p>Créez des applications Lightning Network</p>
                <div class="path-progress">
                  <div class="progress-steps">
                    <div class="step completed">Fondations</div>
                    <div class="step current">Développement</div>
                    <div class="step">Expert</div>
                  </div>
                </div>
                <button class="btn-view-path">Voir le Parcours</button>
              </div>
              
              <div class="career-path-card" data-path="operator">
                <div class="path-icon">🖥️</div>
                <h3>Opérateur de Nœud</h3>
                <p>Gérez des nœuds Lightning professionnels</p>
                <div class="path-progress">
                  <div class="progress-steps">
                    <div class="step completed">Fondations</div>
                    <div class="step">Opération</div>
                    <div class="step">Expert</div>
                  </div>
                </div>
                <button class="btn-view-path">Voir le Parcours</button>
              </div>
              
              <div class="career-path-card" data-path="business">
                <div class="path-icon">💼</div>
                <h3>Consultant Business</h3>
                <p>Conseillez les entreprises sur Lightning</p>
                <div class="path-progress">
                  <div class="progress-steps">
                    <div class="step">Fondations</div>
                    <div class="step">Business</div>
                    <div class="step">Expert</div>
                  </div>
                </div>
                <button class="btn-view-path">Voir le Parcours</button>
              </div>
            </div>
            
            <div class="job-opportunities">
              <h3>Opportunités d'Emploi</h3>
              <div class="jobs-list" id="job-opportunities">
                <div class="job-item">
                  <div class="job-company">Lightning Labs</div>
                  <h4>Senior Lightning Developer</h4>
                  <p>Développement de solutions Lightning pour entreprises</p>
                  <div class="job-requirements">
                    <span class="req-tag">Lightning Specialist</span>
                    <span class="req-tag">5+ ans exp.</span>
                  </div>
                  <div class="job-salary">€80k - €120k</div>
                  <button class="btn-apply-job">Postuler</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Blockchain Tab -->
        <section class="cert-section" id="blockchain-section">
          <div class="blockchain-container">
            <h2>Vérifications Blockchain</h2>
            
            <div class="verification-info">
              <div class="info-card">
                <h3>🔒 Sécurité Blockchain</h3>
                <p>Toutes nos certifications sont vérifiables sur Bitcoin blockchain pour garantir leur authenticité et empêcher la fraude.</p>
              </div>
              
              <div class="info-card">
                <h3>🌍 Reconnaissance Mondiale</h3>
                <p>Vos certifications sont reconnues internationalement et vérifiables par tout employeur ou partenaire.</p>
              </div>
            </div>
            
            <div class="verified-credentials" id="verified-credentials">
              <h3>Vos Credentials Vérifiés</h3>
              
              <div class="credential-item">
                <div class="credential-info">
                  <h4>Bitcoin Fundamentals Certified</h4>
                  <p>ID: BTC-FUND-2024-001234</p>
                  <p>Hash: 3a7f8b2e9c1d...</p>
                </div>
                <div class="verification-status verified">✅ Vérifié</div>
                <button class="btn-view-blockchain">Voir sur Blockchain</button>
              </div>
            </div>
            
            <div class="verification-tools">
              <h3>Outils de Vérification</h3>
              
              <div class="verification-form">
                <h4>Vérifier une Certification</h4>
                <input type="text" placeholder="Entrez l'ID de certification..." class="verification-input">
                <button class="btn-verify">Vérifier</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;

    // Trouve le conteneur cible
    const targetContainer = document.getElementById('certifications') || 
                           document.querySelector('main') || 
                           document.body;
    
    targetContainer.appendChild(certificationContainer);
  }

  renderCertificationCard(certification) {
    const userProgress = this.getUserCertificationProgress(certification.id);
    const isUnlocked = this.isCertificationUnlocked(certification.id);
    const isCompleted = this.user.certifications.includes(certification.id);
    
    return `
      <div class="certification-card ${certification.level} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}">
        <div class="cert-header">
          <div class="cert-icon">${certification.icon}</div>
          <div class="cert-level">${this.getLevelLabel(certification.level)}</div>
          ${certification.price > 0 ? `<div class="cert-price">€${certification.price}</div>` : '<div class="cert-free">Gratuit</div>'}
        </div>
        
        <div class="cert-content">
          <h3>${certification.title}</h3>
          <p>${certification.description}</p>
          
          <div class="cert-requirements">
            <h4>Prérequis:</h4>
            <ul>
              <li>${certification.requirements.modules.length} modules à compléter</li>
              <li>Score minimum: ${certification.requirements.quizScore}%</li>
              <li>${certification.requirements.practicalTasks.length} exercices pratiques</li>
              ${certification.requirements.projects ? `<li>${certification.requirements.projects.length} projet(s)</li>` : ''}
            </ul>
          </div>
          
          <div class="cert-benefits">
            <h4>Bénéfices:</h4>
            <ul>
              ${certification.benefits.slice(0, 3).map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
          
          <div class="cert-progress">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${userProgress}%"></div>
            </div>
            <span class="progress-text">${userProgress}% complété</span>
          </div>
        </div>
        
        <div class="cert-actions">
          ${isCompleted ? 
            `<button class="btn-view-certificate" data-cert="${certification.id}">Voir Certificat</button>` :
            isUnlocked ? 
              `<button class="btn-start-certification" data-cert="${certification.id}">
                ${userProgress > 0 ? 'Continuer' : 'Commencer'}
              </button>` :
              `<button class="btn-unlock-certification" data-cert="${certification.id}" disabled>Débloquer</button>`
          }
          
          <button class="btn-cert-details" data-cert="${certification.id}">Détails</button>
        </div>
      </div>
    `;
  }

  getUserCertificationProgress(certId) {
    const cert = this.certifications[certId];
    if (!cert) return 0;
    
    const completedModules = cert.requirements.modules.filter(module =>
      this.user.completedModules.includes(module)
    ).length;
    
    const moduleProgress = (completedModules / cert.requirements.modules.length) * 70;
    
    // Ajouter d'autres facteurs de progression (quiz, projets, etc.)
    
    return Math.round(moduleProgress);
  }

  isCertificationUnlocked(certId) {
    const cert = this.certifications[certId];
    if (!cert) return false;
    
    // Certification de base toujours débloquée
    if (cert.level === 'foundation') return true;
    
    // Vérifier les prérequis
    const hasPrereqs = this.checkPrerequisites(certId);
    
    return hasPrereqs;
  }

  checkPrerequisites(certId) {
    // Logique pour vérifier les prérequis
    // Par exemple, Bitcoin Fundamentals requis pour Lightning Specialist
    const prereqMap = {
      'lightning-specialist': ['bitcoin-fundamentals'],
      'node-operator-certified': ['lightning-specialist'],
      'lightning-developer': ['lightning-specialist'],
      'lightning-business': ['bitcoin-fundamentals']
    };
    
    const requiredCerts = prereqMap[certId] || [];
    return requiredCerts.every(reqCert => 
      this.user.certifications.includes(reqCert)
    );
  }

  getLevelLabel(level) {
    const labels = {
      foundation: 'Fondation',
      professional: 'Professionnel',
      expert: 'Expert'
    };
    return labels[level] || level;
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.cert-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.showTab(tabName);
      });
    });

    // Certification actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-start-certification')) {
        const certId = e.target.dataset.cert;
        this.startCertification(certId);
      }
      
      if (e.target.matches('.btn-cert-details')) {
        const certId = e.target.dataset.cert;
        this.showCertificationDetails(certId);
      }
      
      if (e.target.matches('.btn-view-certificate')) {
        const certId = e.target.dataset.cert;
        this.viewCertificate(certId);
      }
      
      if (e.target.matches('.btn-start-assessment')) {
        const type = e.target.closest('.assessment-type-card').dataset.type;
        this.startAssessment(type);
      }
    });

    // Portfolio actions
    document.getElementById('export-portfolio')?.addEventListener('click', () => {
      this.exportPortfolio();
    });

    document.querySelector('.btn-generate-cv')?.addEventListener('click', () => {
      this.generateCV();
    });
  }

  showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.cert-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Hide all tabs
    document.querySelectorAll('.cert-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show target section and tab
    document.getElementById(`${tabName}-section`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load section data
    this.loadTabData(tabName);
  }

  loadTabData(tabName) {
    switch (tabName) {
      case 'overview':
        this.loadOverviewData();
        break;
      case 'certifications':
        this.loadCertificationsData();
        break;
      case 'assessments':
        this.loadAssessmentsData();
        break;
      case 'portfolio':
        this.loadPortfolioData();
        break;
      case 'career':
        this.loadCareerData();
        break;
      case 'blockchain':
        this.loadBlockchainData();
        break;
    }
  }

  startCertification(certId) {
    const certification = this.certifications[certId];
    if (!certification) return;
    
    // Créer un plan de certification personnalisé
    const plan = this.createCertificationPlan(certification);
    
    // Afficher le plan à l'utilisateur
    this.showCertificationPlan(plan);
    
    // Commencer le premier module
    this.startFirstModule(plan);
  }

  createCertificationPlan(certification) {
    return {
      id: certification.id,
      title: certification.title,
      estimatedTime: certification.requirements.timeRequired,
      modules: certification.requirements.modules.map(moduleId => ({
        id: moduleId,
        completed: this.user.completedModules.includes(moduleId),
        estimated: '2h'
      })),
      practicalTasks: certification.requirements.practicalTasks,
      projects: certification.requirements.projects || [],
      finalAssessment: true
    };
  }

  showCertificationPlan(plan) {
    // Affiche le plan de certification dans une modal
    const modal = document.createElement('div');
    modal.className = 'certification-plan-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Plan de Certification: ${plan.title}</h2>
          <button class="modal-close">✕</button>
        </div>
        
        <div class="plan-overview">
          <div class="plan-stat">
            <span class="stat-value">${plan.estimatedTime}h</span>
            <span class="stat-label">Temps estimé</span>
          </div>
          <div class="plan-stat">
            <span class="stat-value">${plan.modules.length}</span>
            <span class="stat-label">Modules</span>
          </div>
          <div class="plan-stat">
            <span class="stat-value">${plan.practicalTasks.length}</span>
            <span class="stat-label">Exercices</span>
          </div>
        </div>
        
        <div class="plan-timeline">
          <h3>Parcours d'Apprentissage</h3>
          <div class="timeline">
            ${plan.modules.map((module, index) => `
              <div class="timeline-item ${module.completed ? 'completed' : ''}">
                <div class="timeline-marker">${index + 1}</div>
                <div class="timeline-content">
                  <h4>Module ${module.id}</h4>
                  <span class="timeline-duration">${module.estimated}</span>
                </div>
              </div>
            `).join('')}
            
            <div class="timeline-item">
              <div class="timeline-marker">🏆</div>
              <div class="timeline-content">
                <h4>Certification Finale</h4>
                <span class="timeline-duration">2h</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="plan-actions">
          <button class="btn-start-plan">Commencer le Plan</button>
          <button class="btn-save-plan">Sauvegarder pour plus tard</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.btn-start-plan').addEventListener('click', () => {
      this.startFirstModule(plan);
      modal.remove();
    });
  }

  startFirstModule(plan) {
    const firstIncompleteModule = plan.modules.find(m => !m.completed);
    if (firstIncompleteModule) {
      // Rediriger vers le module
      window.location.href = `/learn/module/${firstIncompleteModule.id}`;
    }
  }

  startAssessment(type) {
    this.assessments.startAssessment(type);
  }

  showCertificationDetails(certId) {
    const certification = this.certifications[certId];
    // Afficher les détails complets dans une modal
  }

  viewCertificate(certId) {
    // Générer et afficher le certificat
    this.generateCertificate(certId);
  }

  generateCertificate(certId) {
    const certification = this.certifications[certId];
    const certificateData = {
      id: `CERT-${certId.toUpperCase()}-${Date.now()}`,
      title: certification.title,
      recipientName: this.user.username,
      issueDate: new Date().toLocaleDateString('fr-FR'),
      verificationHash: this.blockchain.generateHash({
        certId,
        userId: this.user.id,
        timestamp: Date.now()
      })
    };
    
    // Créer le certificat PDF
    this.createCertificatePDF(certificateData);
    
    // Enregistrer sur blockchain
    this.blockchain.registerCertificate(certificateData);
  }

  createCertificatePDF(data) {
    // Génération du certificat PDF
    const certificate = document.createElement('div');
    certificate.className = 'certificate-template';
    certificate.innerHTML = `
      <div class="certificate-container">
        <div class="certificate-header">
          <div class="logo">⚡ DAZNO</div>
          <h1>Certificat de Réussite</h1>
        </div>
        
        <div class="certificate-content">
          <p class="certificate-text">
            Nous certifions que
          </p>
          <h2 class="recipient-name">${data.recipientName}</h2>
          <p class="certificate-text">
            a réussi avec succès la formation
          </p>
          <h3 class="certification-title">${data.title}</h3>
          
          <div class="certificate-details">
            <div class="detail-item">
              <span class="label">Date d'obtention:</span>
              <span class="value">${data.issueDate}</span>
            </div>
            <div class="detail-item">
              <span class="label">ID de certification:</span>
              <span class="value">${data.id}</span>
            </div>
            <div class="detail-item">
              <span class="label">Hash de vérification:</span>
              <span class="value">${data.verificationHash.substring(0, 16)}...</span>
            </div>
          </div>
        </div>
        
        <div class="certificate-footer">
          <div class="signature">
            <div class="signature-line"></div>
            <p>Directeur Pédagogique</p>
          </div>
          
          <div class="qr-code">
            <div class="qr-placeholder">QR Code</div>
            <p>Vérification blockchain</p>
          </div>
        </div>
      </div>
    `;
    
    // Afficher dans une modal pour téléchargement
    this.showCertificateModal(certificate);
  }

  showCertificateModal(certificate) {
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
      <div class="modal-content certificate-modal-content">
        <div class="modal-header">
          <h2>Votre Certificat</h2>
          <button class="modal-close">✕</button>
        </div>
        
        <div class="certificate-preview">
          ${certificate.innerHTML}
        </div>
        
        <div class="certificate-actions">
          <button class="btn-download-pdf">📄 Télécharger PDF</button>
          <button class="btn-share-linkedin">💼 Partager sur LinkedIn</button>
          <button class="btn-verify-blockchain">🔗 Vérifier sur Blockchain</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.btn-download-pdf').addEventListener('click', () => {
      this.downloadCertificatePDF(certificate);
    });
  }

  downloadCertificatePDF(certificate) {
    // Utiliser html2pdf ou jsPDF pour générer le PDF
    console.log('Generating PDF certificate...');
    
    // Simulation du téléchargement
    const blob = new Blob(['Certificate PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${Date.now()}.pdf`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  exportPortfolio() {
    const portfolioData = {
      user: this.user,
      certifications: this.user.certifications.map(certId => this.certifications[certId]),
      projects: this.portfolio.getProjects(),
      skills: this.skills.getSkills(),
      achievements: this.user.achievements
    };
    
    // Générer un portfolio JSON
    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${this.user.username}-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  generateCV() {
    // Génère un CV professionnel basé sur le portfolio
    const cv = this.portfolio.generateCV();
    this.downloadCVPDF(cv);
  }

  downloadCVPDF(cv) {
    console.log('Generating CV PDF...');
    // Implémentation de génération de CV
  }

  loadUserProgress() {
    // Charge la progression utilisateur
    this.updateStats();
    this.updateSkillsDisplay();
    this.updateRecommendations();
  }

  updateStats() {
    const earnedCount = this.user.certifications.length;
    const inProgressCount = Object.keys(this.certifications).filter(certId =>
      this.getUserCertificationProgress(certId) > 0 && 
      !this.user.certifications.includes(certId)
    ).length;
    
    const professionalScore = this.calculateProfessionalScore();
    
    document.getElementById('earned-certifications').textContent = earnedCount;
    document.getElementById('in-progress-certifications').textContent = inProgressCount;
    document.getElementById('professional-score').textContent = professionalScore;
  }

  calculateProfessionalScore() {
    let score = 0;
    
    // Points pour certifications
    score += this.user.certifications.length * 100;
    
    // Points pour modules complétés
    score += this.user.completedModules.length * 10;
    
    // Points pour achievements
    score += this.user.achievements.length * 25;
    
    // Points pour projets
    score += (this.user.portfolio?.projects?.length || 0) * 50;
    
    return score;
  }

  updateSkillsDisplay() {
    // Met à jour l'affichage des compétences
    this.skills.updateDisplay();
  }

  updateRecommendations() {
    // Met à jour les recommandations personnalisées
    const recommendations = this.generateRecommendations();
    this.displayRecommendations(recommendations);
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Recommander les certifications débloquées
    Object.values(this.certifications).forEach(cert => {
      if (this.isCertificationUnlocked(cert.id) && 
          !this.user.certifications.includes(cert.id)) {
        
        const progress = this.getUserCertificationProgress(cert.id);
        recommendations.push({
          type: 'certification',
          certification: cert,
          progress: progress,
          priority: progress > 0 ? 'high' : 'medium'
        });
      }
    });
    
    return recommendations.sort((a, b) => b.progress - a.progress);
  }

  displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-list');
    if (!container) return;
    
    container.innerHTML = recommendations.slice(0, 3).map(rec => `
      <div class="recommendation-item">
        <div class="rec-icon">${rec.certification.icon}</div>
        <div class="rec-content">
          <h3>${rec.certification.title}</h3>
          <p>${rec.certification.description}</p>
          <div class="rec-progress">
            ${rec.progress > 0 ? 
              `${Math.round(rec.progress)}% complété` : 
              'Prêt à commencer'
            }
          </div>
        </div>
        <button class="btn-start-cert" data-cert="${rec.certification.id}">
          ${rec.progress > 0 ? 'Continuer' : 'Commencer'}
        </button>
      </div>
    `).join('');
  }

  initializeBlockchainIntegration() {
    this.blockchain.init();
  }

  loadOverviewData() {
    this.updateSkillsRadar();
    this.updateAchievementsTimeline();
  }

  updateSkillsRadar() {
    // Crée un graphique radar des compétences
    const skills = this.skills.getSkillLevels();
    this.renderSkillsRadar(skills);
  }

  renderSkillsRadar(skills) {
    // Implémentation du graphique radar
    console.log('Rendering skills radar:', skills);
  }

  updateAchievementsTimeline() {
    // Met à jour la timeline des achievements
    const timeline = document.getElementById('achievements-timeline');
    if (!timeline) return;
    
    const recentAchievements = this.getRecentAchievements();
    
    timeline.innerHTML = recentAchievements.map(achievement => `
      <div class="timeline-item">
        <div class="timeline-date">${achievement.date}</div>
        <div class="timeline-content">
          <h4>${achievement.title}</h4>
          <p>${achievement.description}</p>
        </div>
      </div>
    `).join('');
  }

  getRecentAchievements() {
    // Retourne les achievements récents
    return [
      {
        date: 'Aujourd\'hui',
        title: 'Module "Bitcoin Wallets" Complété',
        description: 'Score: 92% • +50 XP'
      },
      {
        date: 'Hier',
        title: 'Badge "Quick Learner" Débloqué',
        description: '5 modules complétés en 24h'
      }
    ];
  }

  // Méthodes de chargement des autres tabs
  loadCertificationsData() {
    // Déjà implémenté dans renderCertificationCard
  }

  loadAssessmentsData() {
    this.loadAssessmentHistory();
  }

  loadAssessmentHistory() {
    // Charge l'historique des évaluations
    const history = this.assessments.getHistory();
    this.displayAssessmentHistory(history);
  }

  displayAssessmentHistory(history) {
    const container = document.getElementById('assessment-history');
    if (!container) return;
    
    container.innerHTML = history.map(assessment => `
      <div class="history-item">
        <div class="assessment-info">
          <h4>${assessment.title}</h4>
          <span class="assessment-date">${assessment.date}</span>
        </div>
        <div class="assessment-score">${assessment.score}%</div>
        <div class="assessment-status ${assessment.status}">${this.getStatusLabel(assessment.status)}</div>
      </div>
    `).join('');
  }

  getStatusLabel(status) {
    const labels = {
      'passed': 'Réussi',
      'failed': 'Échoué',
      'needs-improvement': 'À améliorer',
      'in-progress': 'En cours'
    };
    return labels[status] || status;
  }

  loadPortfolioData() {
    this.portfolio.loadData();
  }

  loadCareerData() {
    this.career.loadPaths();
    this.loadJobOpportunities();
  }

  loadJobOpportunities() {
    // Charge les opportunités d'emploi
    const jobs = this.getJobOpportunities();
    this.displayJobOpportunities(jobs);
  }

  getJobOpportunities() {
    // Simulation d'opportunités d'emploi
    return [
      {
        company: 'Lightning Labs',
        title: 'Senior Lightning Developer',
        description: 'Développement de solutions Lightning pour entreprises',
        requirements: ['Lightning Specialist', '5+ ans exp.'],
        salary: '€80k - €120k',
        id: 'job-1'
      }
    ];
  }

  displayJobOpportunities(jobs) {
    const container = document.getElementById('job-opportunities');
    if (!container) return;
    
    container.innerHTML = jobs.map(job => `
      <div class="job-item">
        <div class="job-company">${job.company}</div>
        <h4>${job.title}</h4>
        <p>${job.description}</p>
        <div class="job-requirements">
          ${job.requirements.map(req => `<span class="req-tag">${req}</span>`).join('')}
        </div>
        <div class="job-salary">${job.salary}</div>
        <button class="btn-apply-job" data-job="${job.id}">Postuler</button>
      </div>
    `).join('');
  }

  loadBlockchainData() {
    this.loadVerifiedCredentials();
  }

  loadVerifiedCredentials() {
    const credentials = this.blockchain.getVerifiedCredentials();
    this.displayVerifiedCredentials(credentials);
  }

  displayVerifiedCredentials(credentials) {
    const container = document.getElementById('verified-credentials');
    if (!container) return;
    
    // Implémentation affichage credentials vérifiés
  }
}

// Classes système auxiliaires
class AssessmentEngine {
  constructor() {
    this.assessments = [];
    this.history = [];
  }

  startAssessment(type) {
    console.log('Starting assessment:', type);
    // Logique de démarrage d'évaluation
  }

  getHistory() {
    return [
      {
        title: 'Bitcoin Fundamentals Quiz',
        date: '15 Déc 2024',
        score: 92,
        status: 'passed'
      },
      {
        title: 'Lightning Channel Management',
        date: '12 Déc 2024',
        score: 78,
        status: 'needs-improvement'
      }
    ];
  }
}

class BlockchainVerification {
  constructor() {
    this.certificates = [];
  }

  init() {
    console.log('Blockchain verification system initialized');
  }

  generateHash(data) {
    // Génère un hash pour la vérification blockchain
    return 'hash_' + btoa(JSON.stringify(data)).substring(0, 16);
  }

  registerCertificate(certificateData) {
    // Enregistre le certificat sur blockchain
    console.log('Registering certificate on blockchain:', certificateData);
    this.certificates.push(certificateData);
  }

  getVerifiedCredentials() {
    return this.certificates;
  }
}

class PortfolioManager {
  constructor() {
    this.projects = [];
    this.achievements = [];
  }

  loadData() {
    // Charge les données du portfolio
  }

  getProjects() {
    return this.projects;
  }

  generateCV() {
    // Génère un CV basé sur le portfolio
    return {
      personalInfo: {},
      certifications: [],
      projects: this.projects,
      skills: []
    };
  }
}

class CareerPathManager {
  constructor() {
    this.paths = {};
  }

  loadPaths() {
    this.paths = {
      developer: {
        name: 'Développeur Lightning',
        stages: ['Fondations', 'Développement', 'Expert'],
        certifications: ['bitcoin-fundamentals', 'lightning-developer'],
        skills: ['JavaScript', 'Lightning API', 'Blockchain']
      },
      operator: {
        name: 'Opérateur de Nœud',
        stages: ['Fondations', 'Opération', 'Expert'],
        certifications: ['bitcoin-fundamentals', 'node-operator-certified'],
        skills: ['Linux', 'Node Management', 'Monitoring']
      },
      business: {
        name: 'Consultant Business',
        stages: ['Fondations', 'Business', 'Expert'],
        certifications: ['bitcoin-fundamentals', 'lightning-business'],
        skills: ['Strategy', 'Consulting', 'ROI Analysis']
      }
    };
  }
}

class SkillsTracker {
  constructor() {
    this.skills = {};
  }

  getSkills() {
    return this.skills;
  }

  getSkillLevels() {
    return {
      'Bitcoin': 85,
      'Lightning': 65,
      'Node Operation': 45,
      'Development': 30,
      'Business': 20
    };
  }

  updateDisplay() {
    // Met à jour l'affichage des compétences
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Vérifie si nous sommes sur une page de certification
  if (window.location.pathname.includes('/certifications') || 
      document.getElementById('certifications') ||
      document.querySelector('[data-page="certifications"]')) {
    
    window.certificationSystem = new CertificationSystem();
    
    // API globale
    window.Certifications = {
      startCertification: (certId) => window.certificationSystem.startCertification(certId),
      viewCertificate: (certId) => window.certificationSystem.viewCertificate(certId),
      exportPortfolio: () => window.certificationSystem.exportPortfolio(),
      generateCV: () => window.certificationSystem.generateCV()
    };
  }
});