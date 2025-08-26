/**
 * Plateforme Communautaire Lightning Network
 * Forum, mentoring, projets collaboratifs et événements
 */

class CommunityPlatform {
  constructor() {
    this.user = this.getCurrentUser();
    this.forums = new ForumSystem();
    this.mentoring = new MentoringSystem();
    this.projects = new ProjectSystem();
    this.events = new EventSystem();
    this.reputation = new ReputationSystem();
    this.messaging = new MessagingSystem();
    this.init();
  }

  getCurrentUser() {
    // Récupère l'utilisateur actuel depuis le système de gamification
    if (window.gamification) {
      return window.gamification.getUser();
    }
    
    return {
      id: 'guest',
      username: 'Invité',
      level: 1,
      reputation: 0,
      badges: [],
      contributions: 0,
      joinDate: new Date().toISOString()
    };
  }

  init() {
    this.createCommunityInterface();
    this.setupEventListeners();
    this.loadCommunityData();
    this.initializeRealTimeUpdates();
  }

  createCommunityInterface() {
    const communityContainer = document.createElement('div');
    communityContainer.id = 'community-platform';
    communityContainer.className = 'community-platform';
    
    communityContainer.innerHTML = `
      <!-- Community Header -->
      <header class="community-header">
        <div class="community-nav">
          <button class="nav-tab active" data-section="dashboard">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Tableau de Bord
          </button>
          
          <button class="nav-tab" data-section="forum">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            Forum
          </button>
          
          <button class="nav-tab" data-section="mentoring">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h8v-2c0-1.1-.9-2-2-2H8C6.9 8 6 8.9 6 10v8h12v-2H4zM12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Mentoring
          </button>
          
          <button class="nav-tab" data-section="projects">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Projets
          </button>
          
          <button class="nav-tab" data-section="events">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            Événements
          </button>
        </div>
        
        <div class="community-actions">
          <button class="btn-create-post" id="create-post-btn">
            ➕ Nouveau Post
          </button>
          
          <div class="user-menu">
            <button class="user-avatar-btn" id="user-menu-btn">
              <div class="user-avatar">⚡</div>
              <span class="username">${this.user.username}</span>
              <div class="reputation-badge">${this.user.reputation || 0}</div>
            </button>
            
            <div class="user-dropdown" id="user-dropdown">
              <a href="#profile" class="dropdown-item">Mon Profil</a>
              <a href="#contributions" class="dropdown-item">Mes Contributions</a>
              <a href="#settings" class="dropdown-item">Paramètres</a>
              <div class="dropdown-separator"></div>
              <a href="#logout" class="dropdown-item">Déconnexion</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Community Content -->
      <main class="community-content">
        <!-- Dashboard Section -->
        <section class="community-section active" id="dashboard-section">
          <div class="dashboard-grid">
            <div class="dashboard-card welcome-card">
              <h2>Bienvenue dans la Communauté Lightning! ⚡</h2>
              <p>Connectez-vous avec d'autres passionnés, partagez vos connaissances et collaborez sur des projets innovants.</p>
              
              <div class="quick-actions">
                <button class="quick-action-btn" data-action="ask-question">
                  ❓ Poser une Question
                </button>
                <button class="quick-action-btn" data-action="find-mentor">
                  👨‍🏫 Trouver un Mentor
                </button>
                <button class="quick-action-btn" data-action="join-project">
                  🚀 Rejoindre un Projet
                </button>
              </div>
            </div>
            
            <div class="dashboard-card stats-card">
              <h3>Votre Progression Communautaire</h3>
              <div class="community-stats">
                <div class="stat-item">
                  <span class="stat-value" id="user-reputation">${this.user.reputation || 0}</span>
                  <span class="stat-label">Réputation</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value" id="user-contributions">0</span>
                  <span class="stat-label">Contributions</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value" id="user-help-given">0</span>
                  <span class="stat-label">Aide Apportée</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value" id="user-projects">0</span>
                  <span class="stat-label">Projets</span>
                </div>
              </div>
              
              <div class="next-level-progress">
                <h4>Prochain Niveau de Réputation</h4>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 35%"></div>
                </div>
                <span class="progress-text">350/1000 points</span>
              </div>
            </div>
            
            <div class="dashboard-card activity-card">
              <h3>Activité Récente</h3>
              <div class="activity-feed" id="activity-feed">
                <div class="activity-item">
                  <div class="activity-avatar">🚀</div>
                  <div class="activity-content">
                    <p><strong>Marie</strong> a créé un nouveau projet: "Lightning Mobile Wallet"</p>
                    <time>il y a 2 heures</time>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-avatar">💡</div>
                  <div class="activity-content">
                    <p><strong>Jean</strong> a répondu à votre question sur l'optimisation des canaux</p>
                    <time>il y a 4 heures</time>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-avatar">🏆</div>
                  <div class="activity-content">
                    <p><strong>Alex</strong> a atteint 1000 points de réputation!</p>
                    <time>il y a 6 heures</time>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="dashboard-card upcoming-events">
              <h3>Événements à Venir</h3>
              <div class="events-list" id="upcoming-events">
                <div class="event-item">
                  <div class="event-date">
                    <span class="day">15</span>
                    <span class="month">DÉC</span>
                  </div>
                  <div class="event-details">
                    <h4>Webinaire: Lightning Network 2025</h4>
                    <p>Tendances et innovations</p>
                    <time>14h00 - 16h00</time>
                  </div>
                  <button class="btn-join-event">Rejoindre</button>
                </div>
                
                <div class="event-item">
                  <div class="event-date">
                    <span class="day">20</span>
                    <span class="month">DÉC</span>
                  </div>
                  <div class="event-details">
                    <h4>Hackathon Lightning</h4>
                    <p>48h de développement intense</p>
                    <time>Vendredi - Dimanche</time>
                  </div>
                  <button class="btn-join-event">S'inscrire</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Forum Section -->
        <section class="community-section" id="forum-section">
          <div class="forum-container">
            <div class="forum-header">
              <h2>Forum de Discussion</h2>
              <div class="forum-controls">
                <div class="search-container">
                  <input type="text" class="forum-search" placeholder="Rechercher dans le forum..." id="forum-search">
                  <button class="search-btn">🔍</button>
                </div>
                <select class="forum-filter" id="forum-filter">
                  <option value="all">Toutes les catégories</option>
                  <option value="questions">Questions</option>
                  <option value="tutorials">Tutoriels</option>
                  <option value="projects">Projets</option>
                  <option value="news">Actualités</option>
                </select>
              </div>
            </div>
            
            <div class="forum-categories">
              <div class="category-card" data-category="questions">
                <div class="category-icon">❓</div>
                <div class="category-content">
                  <h3>Questions & Réponses</h3>
                  <p>Posez vos questions techniques et obtenez de l'aide</p>
                  <div class="category-stats">
                    <span>142 discussions</span> • <span>1.2k messages</span>
                  </div>
                </div>
                <div class="latest-post">
                  <span class="post-title">Comment optimiser mes frais de routing?</span>
                  <span class="post-author">par <strong>crypto_dev</strong></span>
                  <time>il y a 12 min</time>
                </div>
              </div>
              
              <div class="category-card" data-category="tutorials">
                <div class="category-icon">📚</div>
                <div class="category-content">
                  <h3>Tutoriels & Guides</h3>
                  <p>Partagez vos connaissances et apprenez des autres</p>
                  <div class="category-stats">
                    <span>89 tutoriels</span> • <span>456 vues</span>
                  </div>
                </div>
                <div class="latest-post">
                  <span class="post-title">Guide complet: Setup d'un nœud Lightning</span>
                  <span class="post-author">par <strong>lightning_expert</strong></span>
                  <time>il y a 2h</time>
                </div>
              </div>
              
              <div class="category-card" data-category="projects">
                <div class="category-icon">🚀</div>
                <div class="category-content">
                  <h3>Projets Collaboratifs</h3>
                  <p>Trouvez des collaborateurs et lancez des projets</p>
                  <div class="category-stats">
                    <span>34 projets</span> • <span>156 collaborateurs</span>
                  </div>
                </div>
                <div class="latest-post">
                  <span class="post-title">Recherche développeur React pour wallet Lightning</span>
                  <span class="post-author">par <strong>startup_founder</strong></span>
                  <time>il y a 45 min</time>
                </div>
              </div>
            </div>
            
            <div class="forum-posts" id="forum-posts">
              <!-- Posts dynamiques -->
            </div>
          </div>
        </section>

        <!-- Mentoring Section -->
        <section class="community-section" id="mentoring-section">
          <div class="mentoring-container">
            <div class="mentoring-header">
              <h2>Programme de Mentoring</h2>
              <p>Connectez-vous avec des experts ou partagez votre expertise</p>
            </div>
            
            <div class="mentoring-tabs">
              <button class="mentoring-tab active" data-tab="find-mentor">Trouver un Mentor</button>
              <button class="mentoring-tab" data-tab="become-mentor">Devenir Mentor</button>
              <button class="mentoring-tab" data-tab="my-sessions">Mes Sessions</button>
            </div>
            
            <div class="mentoring-content">
              <div class="mentoring-panel active" id="find-mentor-panel">
                <div class="mentor-filters">
                  <select class="mentor-filter" id="expertise-filter">
                    <option value="all">Toutes les expertises</option>
                    <option value="lightning">Lightning Network</option>
                    <option value="bitcoin">Bitcoin Core</option>
                    <option value="development">Développement</option>
                    <option value="business">Business</option>
                  </select>
                  
                  <select class="mentor-filter" id="availability-filter">
                    <option value="all">Toutes disponibilités</option>
                    <option value="immediate">Disponible maintenant</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>
                
                <div class="mentors-grid" id="mentors-grid">
                  <div class="mentor-card">
                    <div class="mentor-avatar">
                      <img src="/api/placeholder/60/60" alt="Avatar mentor">
                      <div class="mentor-status online"></div>
                    </div>
                    
                    <div class="mentor-info">
                      <h3>Alexandre Dubois</h3>
                      <div class="mentor-title">Expert Lightning Network</div>
                      <div class="mentor-expertise">
                        <span class="expertise-tag">Lightning</span>
                        <span class="expertise-tag">Routing</span>
                        <span class="expertise-tag">Optimisation</span>
                      </div>
                      
                      <div class="mentor-stats">
                        <div class="stat">
                          <span class="value">4.9</span>
                          <span class="label">⭐ Note</span>
                        </div>
                        <div class="stat">
                          <span class="value">127</span>
                          <span class="label">Sessions</span>
                        </div>
                        <div class="stat">
                          <span class="value">5 ans</span>
                          <span class="label">Expérience</span>
                        </div>
                      </div>
                      
                      <p class="mentor-bio">
                        Développeur Bitcoin depuis 2017, j'aide les développeurs et entrepreneurs à maîtriser le Lightning Network.
                      </p>
                      
                      <div class="mentor-availability">
                        <span class="availability-indicator">🟢 Disponible cette semaine</span>
                      </div>
                    </div>
                    
                    <div class="mentor-actions">
                      <button class="btn-contact-mentor">Contacter</button>
                      <button class="btn-book-session">Réserver Session</button>
                    </div>
                  </div>
                  
                  <!-- Plus de mentors... -->
                </div>
              </div>
              
              <div class="mentoring-panel" id="become-mentor-panel">
                <div class="become-mentor-form">
                  <h3>Rejoignez notre réseau de mentors</h3>
                  <p>Partagez votre expertise et aidez la communauté à grandir</p>
                  
                  <form class="mentor-application" id="mentor-application">
                    <div class="form-group">
                      <label for="mentor-expertise">Domaines d'expertise</label>
                      <div class="checkbox-group">
                        <label><input type="checkbox" name="expertise" value="lightning"> Lightning Network</label>
                        <label><input type="checkbox" name="expertise" value="bitcoin"> Bitcoin Core</label>
                        <label><input type="checkbox" name="expertise" value="development"> Développement</label>
                        <label><input type="checkbox" name="expertise" value="business"> Business & Strategy</label>
                        <label><input type="checkbox" name="expertise" value="security"> Sécurité</label>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="mentor-experience">Années d'expérience</label>
                      <select id="mentor-experience" name="experience">
                        <option value="1-2">1-2 ans</option>
                        <option value="3-5">3-5 ans</option>
                        <option value="5+">5+ ans</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="mentor-bio">Présentez-vous</label>
                      <textarea id="mentor-bio" name="bio" rows="4" placeholder="Décrivez votre parcours et ce que vous pouvez apporter à la communauté..."></textarea>
                    </div>
                    
                    <div class="form-group">
                      <label for="mentor-availability">Disponibilité</label>
                      <div class="availability-options">
                        <label><input type="radio" name="availability" value="flexible"> Flexible</label>
                        <label><input type="radio" name="availability" value="weekends"> Week-ends uniquement</label>
                        <label><input type="radio" name="availability" value="evenings"> Soirées uniquement</label>
                      </div>
                    </div>
                    
                    <button type="submit" class="btn-submit-application">Soumettre ma candidature</button>
                  </form>
                </div>
              </div>
              
              <div class="mentoring-panel" id="my-sessions-panel">
                <div class="sessions-list">
                  <h3>Mes Sessions de Mentoring</h3>
                  
                  <div class="session-filters">
                    <button class="filter-btn active" data-filter="upcoming">À venir</button>
                    <button class="filter-btn" data-filter="completed">Terminées</button>
                    <button class="filter-btn" data-filter="cancelled">Annulées</button>
                  </div>
                  
                  <div class="sessions-grid" id="sessions-grid">
                    <!-- Sessions dynamiques -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects Section -->
        <section class="community-section" id="projects-section">
          <div class="projects-container">
            <div class="projects-header">
              <h2>Projets Collaboratifs</h2>
              <button class="btn-create-project" id="create-project-btn">+ Créer un Projet</button>
            </div>
            
            <div class="projects-filters">
              <select class="project-filter" id="project-status-filter">
                <option value="all">Tous les statuts</option>
                <option value="recruiting">Recrute</option>
                <option value="active">En cours</option>
                <option value="completed">Terminés</option>
              </select>
              
              <select class="project-filter" id="project-tech-filter">
                <option value="all">Toutes technologies</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
              </select>
            </div>
            
            <div class="projects-grid" id="projects-grid">
              <div class="project-card featured">
                <div class="project-header">
                  <h3>Lightning Mobile Wallet</h3>
                  <span class="project-status recruiting">Recrute</span>
                </div>
                
                <div class="project-description">
                  <p>Wallet mobile Lightning Network avec interface intuitive et fonctionnalités avancées de gestion de liquidité.</p>
                </div>
                
                <div class="project-tech-stack">
                  <span class="tech-tag">React Native</span>
                  <span class="tech-tag">TypeScript</span>
                  <span class="tech-tag">LND</span>
                </div>
                
                <div class="project-team">
                  <div class="team-avatars">
                    <img src="/api/placeholder/32/32" alt="Marie" class="team-avatar">
                    <img src="/api/placeholder/32/32" alt="Jean" class="team-avatar">
                    <div class="avatar-count">+2</div>
                  </div>
                  <span class="team-size">4/6 membres</span>
                </div>
                
                <div class="project-progress">
                  <div class="progress-header">
                    <span>Progression</span>
                    <span>35%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 35%"></div>
                  </div>
                </div>
                
                <div class="project-actions">
                  <button class="btn-join-project">Rejoindre le Projet</button>
                  <button class="btn-view-details">Voir Détails</button>
                </div>
              </div>
              
              <!-- Plus de projets... -->
            </div>
          </div>
        </section>

        <!-- Events Section -->
        <section class="community-section" id="events-section">
          <div class="events-container">
            <div class="events-header">
              <h2>Événements Communautaires</h2>
              <button class="btn-create-event" id="create-event-btn">+ Organiser un Événement</button>
            </div>
            
            <div class="events-calendar" id="events-calendar">
              <!-- Calendrier interactif -->
            </div>
            
            <div class="events-list" id="events-list">
              <!-- Liste des événements -->
            </div>
          </div>
        </section>
      </main>

      <!-- Notifications Panel -->
      <div class="notifications-panel" id="notifications-panel">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button class="close-notifications">✕</button>
        </div>
        <div class="notifications-list" id="notifications-list">
          <!-- Notifications dynamiques -->
        </div>
      </div>

      <!-- Create Post Modal -->
      <div class="modal" id="create-post-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Créer un nouveau post</h3>
            <button class="modal-close">✕</button>
          </div>
          
          <form class="create-post-form" id="create-post-form">
            <div class="form-group">
              <label for="post-category">Catégorie</label>
              <select id="post-category" name="category" required>
                <option value="">Choisissez une catégorie</option>
                <option value="question">Question</option>
                <option value="tutorial">Tutoriel</option>
                <option value="project">Projet</option>
                <option value="news">Actualité</option>
                <option value="discussion">Discussion</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="post-title">Titre</label>
              <input type="text" id="post-title" name="title" required placeholder="Titre de votre post...">
            </div>
            
            <div class="form-group">
              <label for="post-content">Contenu</label>
              <div class="content-editor" id="post-content-editor">
                <div class="editor-toolbar">
                  <button type="button" class="editor-btn" data-command="bold">B</button>
                  <button type="button" class="editor-btn" data-command="italic">I</button>
                  <button type="button" class="editor-btn" data-command="code">Code</button>
                  <button type="button" class="editor-btn" data-command="link">Link</button>
                </div>
                <textarea id="post-content" name="content" rows="8" placeholder="Écrivez votre message..."></textarea>
              </div>
            </div>
            
            <div class="form-group">
              <label for="post-tags">Tags</label>
              <input type="text" id="post-tags" name="tags" placeholder="lightning, bitcoin, tutoriel...">
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-cancel">Annuler</button>
              <button type="submit" class="btn-publish">Publier</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Trouve le conteneur cible ou crée-en un
    let targetContainer = document.getElementById('community') || document.querySelector('main');
    if (!targetContainer) {
      targetContainer = document.body;
    }
    
    targetContainer.appendChild(communityContainer);
  }

  setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.showSection(section);
      });
    });

    // User menu
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener('click', () => {
        userDropdown.classList.toggle('show');
      });
    }

    // Create post modal
    const createPostBtn = document.getElementById('create-post-btn');
    const createPostModal = document.getElementById('create-post-modal');
    
    if (createPostBtn && createPostModal) {
      createPostBtn.addEventListener('click', () => {
        this.showCreatePostModal();
      });
    }

    // Quick actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleQuickAction(action);
      });
    });

    // Forum categories
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.showForumCategory(category);
      });
    });

    // Mentoring tabs
    document.querySelectorAll('.mentoring-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.showMentoringTab(tabName);
      });
    });
  }

  showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.community-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Hide all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show target section and tab
    document.getElementById(`${sectionName}-section`).classList.add('active');
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Load section data
    this.loadSectionData(sectionName);
  }

  loadSectionData(sectionName) {
    switch (sectionName) {
      case 'forum':
        this.forums.loadPosts();
        break;
      case 'mentoring':
        this.mentoring.loadMentors();
        break;
      case 'projects':
        this.projects.loadProjects();
        break;
      case 'events':
        this.events.loadEvents();
        break;
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case 'ask-question':
        this.showCreatePostModal('question');
        break;
      case 'find-mentor':
        this.showSection('mentoring');
        break;
      case 'join-project':
        this.showSection('projects');
        break;
    }
  }

  showCreatePostModal(defaultCategory = '') {
    const modal = document.getElementById('create-post-modal');
    const categorySelect = document.getElementById('post-category');
    
    if (defaultCategory) {
      categorySelect.value = defaultCategory;
    }
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
    
    // Focus sur le premier champ
    setTimeout(() => {
      document.getElementById('post-title').focus();
    }, 100);
  }

  showForumCategory(category) {
    this.showSection('forum');
    this.forums.filterByCategory(category);
  }

  showMentoringTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.mentoring-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Hide all tabs
    document.querySelectorAll('.mentoring-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show target panel and tab
    document.getElementById(`${tabName}-panel`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  }

  loadCommunityData() {
    // Charge les données de base
    this.loadUserStats();
    this.loadActivityFeed();
    this.loadUpcomingEvents();
  }

  loadUserStats() {
    // Met à jour les statistiques utilisateur
    const stats = {
      reputation: this.user.reputation || 0,
      contributions: this.user.contributions || 0,
      helpGiven: this.user.stats?.helpGiven || 0,
      projects: this.user.projects?.length || 0
    };

    Object.entries(stats).forEach(([key, value]) => {
      const element = document.getElementById(`user-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
      if (element) {
        element.textContent = value;
      }
    });
  }

  loadActivityFeed() {
    // Charge le flux d'activité
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    // Simulation de données - remplacer par vraie API
    const activities = [
      {
        user: 'Marie',
        action: 'a créé un nouveau projet',
        content: 'Lightning Mobile Wallet',
        time: 'il y a 2 heures',
        avatar: '🚀'
      },
      {
        user: 'Jean',
        action: 'a répondu à votre question',
        content: 'sur l\'optimisation des canaux',
        time: 'il y a 4 heures',
        avatar: '💡'
      }
    ];

    feed.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-avatar">${activity.avatar}</div>
        <div class="activity-content">
          <p><strong>${activity.user}</strong> ${activity.action}: "${activity.content}"</p>
          <time>${activity.time}</time>
        </div>
      </div>
    `).join('');
  }

  loadUpcomingEvents() {
    // Charge les événements à venir
    this.events.loadUpcomingEvents();
  }

  initializeRealTimeUpdates() {
    // Simulation de mises à jour en temps réel
    setInterval(() => {
      this.updateActivityFeed();
      this.updateNotifications();
    }, 30000); // Toutes les 30 secondes
  }

  updateActivityFeed() {
    // Met à jour le flux d'activité
    this.loadActivityFeed();
  }

  updateNotifications() {
    // Met à jour les notifications
    this.messaging.checkNewMessages();
  }
}

// Classes système pour chaque fonctionnalité
class ForumSystem {
  constructor() {
    this.posts = [];
    this.categories = ['questions', 'tutorials', 'projects', 'news', 'discussion'];
    this.currentFilter = 'all';
  }

  loadPosts() {
    // Charge les posts du forum
    this.posts = this.getMockPosts();
    this.renderPosts();
  }

  getMockPosts() {
    return [
      {
        id: 1,
        title: 'Comment optimiser mes frais de routing?',
        content: 'Je cherche des conseils pour optimiser les frais de mon nœud Lightning...',
        author: 'crypto_dev',
        category: 'questions',
        replies: 8,
        votes: 12,
        tags: ['routing', 'fees', 'optimization'],
        createdAt: new Date(Date.now() - 12 * 60 * 1000),
        lastActivity: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: 2,
        title: 'Guide complet: Setup d\'un nœud Lightning',
        content: 'Tutorial étape par étape pour configurer votre premier nœud...',
        author: 'lightning_expert',
        category: 'tutorials',
        replies: 23,
        votes: 45,
        tags: ['setup', 'tutorial', 'node'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];
  }

  renderPosts() {
    const container = document.getElementById('forum-posts');
    if (!container) return;

    const filteredPosts = this.currentFilter === 'all' 
      ? this.posts 
      : this.posts.filter(post => post.category === this.currentFilter);

    container.innerHTML = filteredPosts.map(post => `
      <article class="forum-post">
        <div class="post-votes">
          <button class="vote-btn vote-up" data-post="${post.id}">▲</button>
          <span class="vote-count">${post.votes}</span>
          <button class="vote-btn vote-down" data-post="${post.id}">▼</button>
        </div>
        
        <div class="post-content">
          <h3 class="post-title">
            <a href="#post/${post.id}">${post.title}</a>
          </h3>
          
          <div class="post-meta">
            <span class="post-author">par <strong>${post.author}</strong></span>
            <span class="post-category">${post.category}</span>
            <time class="post-time">${this.formatTime(post.createdAt)}</time>
          </div>
          
          <div class="post-excerpt">${post.content.substring(0, 150)}...</div>
          
          <div class="post-tags">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        
        <div class="post-stats">
          <div class="stat">
            <span class="stat-value">${post.replies}</span>
            <span class="stat-label">réponses</span>
          </div>
          <div class="post-activity">
            <span>dernière activité</span>
            <time>${this.formatTime(post.lastActivity)}</time>
          </div>
        </div>
      </article>
    `).join('');
  }

  filterByCategory(category) {
    this.currentFilter = category;
    this.renderPosts();
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'à l\'instant';
    if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`;
    
    return date.toLocaleDateString('fr-FR');
  }
}

class MentoringSystem {
  constructor() {
    this.mentors = [];
    this.sessions = [];
  }

  loadMentors() {
    this.mentors = this.getMockMentors();
    this.renderMentors();
  }

  getMockMentors() {
    return [
      {
        id: 1,
        name: 'Alexandre Dubois',
        title: 'Expert Lightning Network',
        expertise: ['Lightning', 'Routing', 'Optimization'],
        rating: 4.9,
        sessions: 127,
        experience: '5 ans',
        bio: 'Développeur Bitcoin depuis 2017, j\'aide les développeurs et entrepreneurs à maîtriser le Lightning Network.',
        availability: 'Cette semaine',
        status: 'online',
        avatar: '/api/placeholder/60/60'
      }
      // Plus de mentors...
    ];
  }

  renderMentors() {
    const container = document.getElementById('mentors-grid');
    if (!container) return;

    container.innerHTML = this.mentors.map(mentor => `
      <div class="mentor-card">
        <div class="mentor-avatar">
          <img src="${mentor.avatar}" alt="Avatar ${mentor.name}">
          <div class="mentor-status ${mentor.status}"></div>
        </div>
        
        <div class="mentor-info">
          <h3>${mentor.name}</h3>
          <div class="mentor-title">${mentor.title}</div>
          <div class="mentor-expertise">
            ${mentor.expertise.map(skill => `<span class="expertise-tag">${skill}</span>`).join('')}
          </div>
          
          <div class="mentor-stats">
            <div class="stat">
              <span class="value">${mentor.rating}</span>
              <span class="label">⭐ Note</span>
            </div>
            <div class="stat">
              <span class="value">${mentor.sessions}</span>
              <span class="label">Sessions</span>
            </div>
            <div class="stat">
              <span class="value">${mentor.experience}</span>
              <span class="label">Expérience</span>
            </div>
          </div>
          
          <p class="mentor-bio">${mentor.bio}</p>
          
          <div class="mentor-availability">
            <span class="availability-indicator">🟢 Disponible ${mentor.availability}</span>
          </div>
        </div>
        
        <div class="mentor-actions">
          <button class="btn-contact-mentor" data-mentor="${mentor.id}">Contacter</button>
          <button class="btn-book-session" data-mentor="${mentor.id}">Réserver Session</button>
        </div>
      </div>
    `).join('');

    this.setupMentorEvents();
  }

  setupMentorEvents() {
    document.querySelectorAll('.btn-contact-mentor').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mentorId = e.currentTarget.dataset.mentor;
        this.contactMentor(mentorId);
      });
    });

    document.querySelectorAll('.btn-book-session').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mentorId = e.currentTarget.dataset.mentor;
        this.bookSession(mentorId);
      });
    });
  }

  contactMentor(mentorId) {
    // Ouvre la conversation avec le mentor
    if (window.messaging) {
      window.messaging.startConversation(mentorId);
    }
  }

  bookSession(mentorId) {
    // Ouvre le calendrier de réservation
    this.showBookingCalendar(mentorId);
  }

  showBookingCalendar(mentorId) {
    // Affiche le calendrier de réservation
    console.log('Booking session with mentor:', mentorId);
  }
}

class ProjectSystem {
  constructor() {
    this.projects = [];
  }

  loadProjects() {
    this.projects = this.getMockProjects();
    this.renderProjects();
  }

  getMockProjects() {
    return [
      {
        id: 1,
        title: 'Lightning Mobile Wallet',
        description: 'Wallet mobile Lightning Network avec interface intuitive et fonctionnalités avancées de gestion de liquidité.',
        status: 'recruiting',
        techStack: ['React Native', 'TypeScript', 'LND'],
        team: [
          { name: 'Marie', avatar: '/api/placeholder/32/32' },
          { name: 'Jean', avatar: '/api/placeholder/32/32' }
        ],
        teamSize: { current: 4, max: 6 },
        progress: 35,
        featured: true
      }
    ];
  }

  renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = this.projects.map(project => `
      <div class="project-card ${project.featured ? 'featured' : ''}">
        <div class="project-header">
          <h3>${project.title}</h3>
          <span class="project-status ${project.status}">${this.getStatusLabel(project.status)}</span>
        </div>
        
        <div class="project-description">
          <p>${project.description}</p>
        </div>
        
        <div class="project-tech-stack">
          ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <div class="project-team">
          <div class="team-avatars">
            ${project.team.map(member => `<img src="${member.avatar}" alt="${member.name}" class="team-avatar">`).join('')}
            ${project.teamSize.current > 2 ? `<div class="avatar-count">+${project.teamSize.current - 2}</div>` : ''}
          </div>
          <span class="team-size">${project.teamSize.current}/${project.teamSize.max} membres</span>
        </div>
        
        <div class="project-progress">
          <div class="progress-header">
            <span>Progression</span>
            <span>${project.progress}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${project.progress}%"></div>
          </div>
        </div>
        
        <div class="project-actions">
          <button class="btn-join-project" data-project="${project.id}">Rejoindre le Projet</button>
          <button class="btn-view-details" data-project="${project.id}">Voir Détails</button>
        </div>
      </div>
    `).join('');

    this.setupProjectEvents();
  }

  getStatusLabel(status) {
    const labels = {
      recruiting: 'Recrute',
      active: 'En cours',
      completed: 'Terminé'
    };
    return labels[status] || status;
  }

  setupProjectEvents() {
    document.querySelectorAll('.btn-join-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.currentTarget.dataset.project;
        this.joinProject(projectId);
      });
    });

    document.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.currentTarget.dataset.project;
        this.showProjectDetails(projectId);
      });
    });
  }

  joinProject(projectId) {
    console.log('Joining project:', projectId);
    // Logique pour rejoindre un projet
  }

  showProjectDetails(projectId) {
    console.log('Showing project details:', projectId);
    // Affiche les détails du projet
  }
}

class EventSystem {
  constructor() {
    this.events = [];
  }

  loadEvents() {
    this.events = this.getMockEvents();
    this.renderEvents();
  }

  loadUpcomingEvents() {
    const upcomingEvents = this.events.filter(event => 
      new Date(event.date) > new Date()
    ).slice(0, 3);

    const container = document.getElementById('upcoming-events');
    if (!container) return;

    container.innerHTML = upcomingEvents.map(event => `
      <div class="event-item">
        <div class="event-date">
          <span class="day">${new Date(event.date).getDate()}</span>
          <span class="month">${new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
        </div>
        <div class="event-details">
          <h4>${event.title}</h4>
          <p>${event.description}</p>
          <time>${event.time}</time>
        </div>
        <button class="btn-join-event" data-event="${event.id}">
          ${event.type === 'webinar' ? 'Rejoindre' : 'S\'inscrire'}
        </button>
      </div>
    `).join('');

    this.setupEventButtons();
  }

  getMockEvents() {
    return [
      {
        id: 1,
        title: 'Webinaire: Lightning Network 2025',
        description: 'Tendances et innovations',
        date: '2024-12-15',
        time: '14h00 - 16h00',
        type: 'webinar'
      },
      {
        id: 2,
        title: 'Hackathon Lightning',
        description: '48h de développement intense',
        date: '2024-12-20',
        time: 'Vendredi - Dimanche',
        type: 'hackathon'
      }
    ];
  }

  renderEvents() {
    // Render events in the main events section
  }

  setupEventButtons() {
    document.querySelectorAll('.btn-join-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eventId = e.currentTarget.dataset.event;
        this.joinEvent(eventId);
      });
    });
  }

  joinEvent(eventId) {
    console.log('Joining event:', eventId);
    // Logique pour rejoindre un événement
  }
}

class ReputationSystem {
  constructor() {
    this.userReputation = 0;
  }

  calculateReputation(user) {
    let reputation = 0;
    
    // Points pour contributions
    reputation += (user.stats?.modulesCompleted || 0) * 10;
    reputation += (user.stats?.helpGiven || 0) * 50;
    reputation += (user.projects?.length || 0) * 100;
    
    return reputation;
  }

  updateReputation(userId, points, reason) {
    // Met à jour la réputation d'un utilisateur
    console.log(`User ${userId} gained ${points} reputation for: ${reason}`);
  }
}

class MessagingSystem {
  constructor() {
    this.conversations = [];
    this.unreadCount = 0;
  }

  checkNewMessages() {
    // Vérifie les nouveaux messages
  }

  startConversation(userId) {
    // Démarre une conversation
    console.log('Starting conversation with user:', userId);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Vérifie si nous sommes sur une page communautaire
  if (window.location.pathname.includes('/community') || 
      document.getElementById('community') || 
      document.querySelector('[data-page="community"]')) {
    
    window.communityPlatform = new CommunityPlatform();
    
    // API globale
    window.Community = {
      showSection: (section) => window.communityPlatform.showSection(section),
      createPost: () => window.communityPlatform.showCreatePostModal(),
      joinProject: (projectId) => window.communityPlatform.projects.joinProject(projectId),
      findMentor: (expertise) => window.communityPlatform.mentoring.filterByExpertise(expertise)
    };
  }
});