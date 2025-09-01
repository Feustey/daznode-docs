/**
 * Quiz d'Orientation Intelligent - Priorité Critique
 * Personnalise l'expérience selon le profil utilisateur
 */

class OrientationQuiz {
  constructor() {
    this.questions = this.loadQuestions();
    this.answers = this.loadSavedAnswers() || {};
    this.currentQuestionIndex = 0;
    this.results = null;
    this.startTime = Date.now();
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.init();
  }

  loadQuestions() {
    return [
      {
        id: 'bitcoin_level',
        question: '🚀 Quel est votre niveau avec Bitcoin ?',
        description: 'Aidez-nous à adapter le contenu à votre expérience',
        type: 'single',
        options: [
          { id: 'complete_beginner', text: 'Débutant complet - Je découvre Bitcoin', points: { beginner: 3, intermediate: 0, expert: 0 } },
          { id: 'basic_knowledge', text: 'J\'ai des bases - Je connais les concepts généraux', points: { beginner: 1, intermediate: 2, expert: 1 } },
          { id: 'good_knowledge', text: 'Je connais bien Bitcoin - Transactions, wallets, etc.', points: { beginner: 0, intermediate: 2, expert: 2 } },
          { id: 'expert_level', text: 'Expert technique - Développement, protocole, mining', points: { beginner: 0, intermediate: 1, expert: 3 } }
        ]
      },
      {
        id: 'lightning_experience',
        question: '⚡ Votre expérience avec Lightning Network ?',
        description: 'Lightning Network permet des paiements Bitcoin instantanés',
        type: 'single',
        options: [
          { id: 'never_heard', text: 'Jamais entendu parler', points: { beginner: 3, lightning: 0, node: 0 } },
          { id: 'heard_about', text: 'J\'en ai entendu parler mais ne comprends pas', points: { beginner: 2, lightning: 1, node: 0 } },
          { id: 'basic_understanding', text: 'Je comprends le concept de base', points: { beginner: 1, lightning: 2, node: 1 } },
          { id: 'used_lightning', text: 'J\'ai déjà fait des paiements Lightning', points: { beginner: 0, lightning: 3, node: 1 } },
          { id: 'run_node', text: 'J\'opère déjà un nœud Lightning', points: { beginner: 0, lightning: 2, node: 3 } }
        ]
      },
      {
        id: 'main_goal',
        question: '🎯 Votre objectif principal ?',
        description: 'Choisissez ce qui vous motive le plus',
        type: 'single',
        options: [
          { id: 'understand_concepts', text: 'Comprendre Bitcoin et Lightning', points: { learning: 3, business: 0, technical: 1 } },
          { id: 'personal_use', text: 'Utiliser Bitcoin pour mes paiements', points: { learning: 2, business: 1, technical: 1 } },
          { id: 'business_integration', text: 'Intégrer Bitcoin dans mon business', points: { learning: 1, business: 3, technical: 2 } },
          { id: 'earn_money', text: 'Gagner de l\'argent avec un nœud Lightning', points: { learning: 1, business: 2, technical: 2 } },
          { id: 'develop_apps', text: 'Développer des applications Lightning', points: { learning: 1, business: 1, technical: 3 } }
        ]
      },
      {
        id: 'time_availability',
        question: '⏰ Temps disponible par session d\'apprentissage ?',
        type: 'single',
        options: [
          { id: 'short_sessions', text: '10-15 minutes (sessions courtes)', points: { casual: 3, moderate: 1, intensive: 0 } },
          { id: 'medium_sessions', text: '30-45 minutes (sessions normales)', points: { casual: 1, moderate: 3, intensive: 1 } },
          { id: 'long_sessions', text: '1-2 heures (sessions approfondies)', points: { casual: 0, moderate: 1, intensive: 3 } },
          { id: 'flexible', text: 'Variable selon la complexité du sujet', points: { casual: 1, moderate: 2, intensive: 2 } }
        ]
      },
      {
        id: 'learning_style',
        question: '🧠 Comment apprenez-vous le mieux ?',
        type: 'multiple',
        maxSelections: 2,
        options: [
          { id: 'reading', text: 'Lecture d\'articles et guides', points: { visual: 1, textual: 3, practical: 1 } },
          { id: 'videos', text: 'Vidéos et tutoriels visuels', points: { visual: 3, textual: 1, practical: 1 } },
          { id: 'hands_on', text: 'Pratique directe et manipulation', points: { visual: 1, textual: 1, practical: 3 } },
          { id: 'interactive', text: 'Quiz et exercices interactifs', points: { visual: 2, textual: 1, practical: 2 } },
          { id: 'community', text: 'Discussions et échanges communautaires', points: { visual: 1, textual: 2, practical: 1 } }
        ]
      }
    ];
  }

  init() {
    this.checkIfShouldShow();
  }

  checkIfShouldShow() {
    const hasCompletedQuiz = localStorage.getItem('dazno_quiz_completed');
    const hasProgress = localStorage.getItem('dazno_progress');
    
    // Show quiz if: new user OR user hasn't completed quiz OR they request it
    if (!hasCompletedQuiz || (!hasProgress && !hasCompletedQuiz)) {
      // Delay showing quiz to let page load
      setTimeout(() => this.showQuiz(), 30000);
    }
  }

  showQuiz() {
    this.createQuizModal();
    this.displayCurrentQuestion();
    this.addKeyboardNavigation();
    this.trackQuizStart();
  }

  createQuizModal() {
    const modal = document.createElement('div');
    modal.id = 'orientation-quiz-modal';
    modal.className = 'quiz-modal';
    modal.innerHTML = `
      <div class="quiz-modal-content">
        <div class="quiz-header">
          <h2>🎯 Découvrez votre parcours idéal</h2>
          <p>Passez notre quiz rapide pour une expérience personnalisée</p>
          <div class="quiz-benefits">
            <span class="benefit-item">⚡ Contenu adapté</span>
            <span class="benefit-item">🎁 Recommandations personnalisées</span>
            <span class="benefit-item">⏱️ ~2 minutes</span>
          </div>
          <div class="quiz-progress">
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
            </div>
            <span class="quiz-progress-text">Question <span id="current-q">1</span> sur ${this.questions.length}</span>
          </div>
          <button class="quiz-close" onclick="window.orientationQuiz.closeQuiz()" aria-label="Fermer le quiz">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="quiz-content" id="quiz-content">
          <!-- Questions will be loaded here -->
        </div>
        
        <div class="quiz-footer">
          <button class="btn-quiz-prev" id="quiz-prev" onclick="window.orientationQuiz.previousQuestion()" disabled>
            ← Précédent
          </button>
          <button class="btn-quiz-next" id="quiz-next" onclick="window.orientationQuiz.nextQuestion()" disabled>
            Suivant →
          </button>
          <button class="btn-quiz-results" id="quiz-results" onclick="window.orientationQuiz.calculateResults()" style="display: none;">
            Voir mes recommandations 🎉
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation d'entrée progressive
    requestAnimationFrame(() => {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.9)';
      modal.classList.add('show');
      
      setTimeout(() => {
        modal.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      }, 50);
    });
  }

  displayCurrentQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    const content = document.getElementById('quiz-content');
    const isMultiple = question.type === 'multiple';
    
    // Animation de sortie pour l'ancien contenu
    content.style.opacity = '0';
    content.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
    
    content.innerHTML = `
      <div class="question-container" data-question-id="${question.id}">
        <h3 class="question-title">${question.question}</h3>
        ${question.description ? `<p class="question-description">${question.description}</p>` : ''}
        ${question.maxSelections ? `<p class="question-hint">Sélectionnez jusqu'à ${question.maxSelections} réponses</p>` : ''}
        <div class="recommendation-preview"></div>
        
        <div class="question-options">
          ${question.options.map(option => `
            <label class="option-label ${isMultiple ? 'checkbox' : 'radio'}" data-option-id="${option.id}" tabindex="0" role="${isMultiple ? 'checkbox' : 'radio'}" aria-describedby="option-${option.id}-desc">
              <input type="${isMultiple ? 'checkbox' : 'radio'}" 
                     name="question_${question.id}" 
                     value="${option.id}"
                     id="option-${option.id}"
                     aria-describedby="option-${option.id}-desc"
                     onchange="window.orientationQuiz.handleAnswerChange()">
              <span class="option-text">${option.text}</span>
              <span class="option-checkmark"></span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
    
    // Update progress avec animation
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    const progressBar = document.getElementById('quiz-progress-fill');
    progressBar.style.transition = 'width 0.5s ease';
    progressBar.style.width = `${progress}%`;
    document.getElementById('current-q').textContent = this.currentQuestionIndex + 1;
    
    // Update buttons
    document.getElementById('quiz-prev').disabled = this.currentQuestionIndex === 0;
    
    // Restore previous answers if any
    this.restoreAnswers(question.id);
    
    // Animation d'entrée pour le nouveau contenu
    setTimeout(() => {
      content.style.transition = 'all 0.3s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateX(0)';
    }, 50);
    
    // Ajouter support tactile
    this.addTouchSupport();
    
    }, 150);
  }

  handleAnswerChange() {
    const question = this.questions[this.currentQuestionIndex];
    const questionContainer = document.querySelector(`[data-question-id="${question.id}"]`);
    const inputs = questionContainer.querySelectorAll('input:checked');
    
    // Store answers
    this.answers[question.id] = Array.from(inputs).map(input => input.value);
    
    // Sauvegarde automatique
    this.autoSaveAnswers();
    
    // Mini-célébration lors de la sélection
    this.celebrateSelection(inputs);
    
    // Check limits for multiple choice
    if (question.type === 'multiple' && question.maxSelections) {
      const checkboxes = questionContainer.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        if (!cb.checked && inputs.length >= question.maxSelections) {
          cb.disabled = true;
          cb.parentElement.classList.add('disabled');
        } else {
          cb.disabled = false;
          cb.parentElement.classList.remove('disabled');
        }
      });
    }
    
    // Enable next button if answered
    const hasAnswers = inputs.length > 0;
    const nextBtn = document.getElementById('quiz-next');
    const resultsBtn = document.getElementById('quiz-results');
    
    if (this.currentQuestionIndex === this.questions.length - 1) {
      nextBtn.style.display = hasAnswers ? 'none' : 'block';
      resultsBtn.style.display = hasAnswers ? 'block' : 'none';
      resultsBtn.disabled = !hasAnswers;
    } else {
      nextBtn.disabled = !hasAnswers;
    }
    
    // Track answer
    this.trackAnswer(question.id, this.answers[question.id]);
    
    // Afficher preview des recommandations
    this.showPreviewRecommendations();
  }

  restoreAnswers(questionId) {
    if (this.answers[questionId]) {
      this.answers[questionId].forEach(answerId => {
        const input = document.querySelector(`input[value="${answerId}"]`);
        if (input) input.checked = true;
      });
      this.handleAnswerChange();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.displayCurrentQuestion();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.displayCurrentQuestion();
    }
  }

  calculateResults() {
    this.results = this.analyzeAnswers();
    this.showResults();
    this.saveQuizResults();
    this.trackQuizCompletion();
  }

  analyzeAnswers() {
    const scores = {};
    
    // Process each answer
    Object.entries(this.answers).forEach(([questionId, answerIds]) => {
      const question = this.questions.find(q => q.id === questionId);
      answerIds.forEach(answerId => {
        const option = question.options.find(o => o.id === answerId);
        if (option && option.points) {
          Object.entries(option.points).forEach(([category, points]) => {
            scores[category] = (scores[category] || 0) + points;
          });
        }
      });
    });

    // Determine user profile
    const profile = this.determineProfile(scores);
    const recommendations = this.generateRecommendations(profile, scores);
    
    return {
      scores,
      profile,
      recommendations,
      completedAt: new Date().toISOString()
    };
  }

  determineProfile(scores) {
    const levelMapping = {
      beginner: scores.beginner || 0,
      intermediate: scores.intermediate || 0,
      expert: scores.expert || 0
    };

    const focusMapping = {
      learning: scores.learning || 0,
      business: scores.business || 0,
      technical: scores.technical || 0
    };

    const paceMapping = {
      casual: scores.casual || 0,
      moderate: scores.moderate || 0,
      intensive: scores.intensive || 0
    };

    return {
      level: this.getHighestScore(levelMapping),
      focus: this.getHighestScore(focusMapping),
      pace: this.getHighestScore(paceMapping),
      learningStyle: this.determineLearningStyle(scores)
    };
  }

  getHighestScore(mapping) {
    return Object.entries(mapping)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  determineLearningStyle(scores) {
    const styles = ['visual', 'textual', 'practical'];
    const styleScores = styles.map(style => ({
      style,
      score: scores[style] || 0
    }));
    
    return styleScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(s => s.style);
  }

  generateRecommendations(profile, scores) {
    const pathRecommendations = {
      'beginner-learning': {
        primary: 'bitcoin-basics',
        title: '🚀 Parcours Débutant Bitcoin',
        description: 'Commencez par les fondamentaux de Bitcoin avant d\'explorer Lightning Network',
        modules: ['bitcoin-basics-intro', 'bitcoin-fundamentals', 'lightning-basics'],
        estimatedTime: '3-4 semaines'
      },
      'intermediate-learning': {
        primary: 'lightning-network',
        title: '⚡ Parcours Lightning Network',
        description: 'Plongez directement dans Lightning Network et ses applications',
        modules: ['lightning-basics', 'lightning-concepts', 'channels-management'],
        estimatedTime: '2-3 semaines'
      },
      'beginner-business': {
        primary: 'business-bitcoin',
        title: '💼 Bitcoin pour Business',
        description: 'Découvrez comment intégrer Bitcoin dans votre activité',
        modules: ['bitcoin-fundamentals', 'lightning-basics', 'business-integration'],
        estimatedTime: '4-5 semaines'
      },
      'intermediate-business': {
        primary: 'node-operation',
        title: '🖥️ Opérateur de Nœud Pro',
        description: 'Monétisez votre infrastructure Lightning Network',
        modules: ['dazbox-setup', 'dazia-optimization', 'roi-strategies'],
        estimatedTime: '3-4 semaines'
      },
      'expert-technical': {
        primary: 'development',
        title: '👩‍💻 Développement Lightning',
        description: 'Développez des applications sur Lightning Network',
        modules: ['development-basics', 'api-integration', 'advanced-development'],
        estimatedTime: '4-6 semaines'
      }
    };

    const key = `${profile.level}-${profile.focus}`;
    const recommendation = pathRecommendations[key] || pathRecommendations['beginner-learning'];

    return {
      ...recommendation,
      learningStyle: profile.learningStyle,
      pace: profile.pace,
      customizations: this.generateCustomizations(profile, scores)
    };
  }

  generateCustomizations(profile, scores) {
    const customizations = [];

    if (profile.learningStyle.includes('visual')) {
      customizations.push('Priorité aux vidéos et diagrammes');
    }
    if (profile.learningStyle.includes('practical')) {
      customizations.push('Plus d\'exercices pratiques');
    }
    if (profile.pace === 'casual') {
      customizations.push('Sessions courtes (10-15min)');
    }
    if (profile.pace === 'intensive') {
      customizations.push('Contenu technique approfondi');
    }
    if (scores.node >= 2) {
      customizations.push('Focus sur l\'optimisation des nœuds');
    }

    return customizations;
  }

  showResults() {
    const modal = document.getElementById('orientation-quiz-modal');
    const content = modal.querySelector('.quiz-modal-content');
    
    content.innerHTML = `
      <div class="quiz-results">
        <div class="results-header">
          <h2>🎉 Votre Parcours Personnalisé</h2>
          <p>Basé sur vos réponses, voici notre recommandation :</p>
        </div>

        <div class="recommended-path">
          <div class="path-card featured">
            <div class="path-header">
              <h3>${this.results.recommendations.title}</h3>
              <span class="path-duration">${this.results.recommendations.estimatedTime}</span>
            </div>
            <p class="path-description">${this.results.recommendations.description}</p>
            
            <div class="path-modules">
              <h4>Modules recommandés :</h4>
              <ul>
                ${this.results.recommendations.modules.map(module => 
                  `<li>${this.getModuleName(module)}</li>`
                ).join('')}
              </ul>
            </div>

            <div class="path-customizations">
              <h4>Personnalisation :</h4>
              <ul>
                ${this.results.recommendations.customizations.map(custom => 
                  `<li>✓ ${custom}</li>`
                ).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="profile-summary">
          <h4>Votre profil d'apprenant :</h4>
          <div class="profile-tags">
            <span class="profile-tag level">${this.getProfileLabel('level', this.results.profile.level)}</span>
            <span class="profile-tag focus">${this.getProfileLabel('focus', this.results.profile.focus)}</span>
            <span class="profile-tag pace">${this.getProfileLabel('pace', this.results.profile.pace)}</span>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn-quiz-primary" onclick="window.orientationQuiz.startRecommendedPath()">
            🚀 Commencer ce parcours
          </button>
          <button class="btn-quiz-secondary" onclick="window.orientationQuiz.exploreAlternatives()">
            Voir d'autres options
          </button>
          <button class="btn-quiz-text" onclick="window.orientationQuiz.retakeQuiz()">
            Refaire le quiz
          </button>
        </div>

        <div class="quiz-completion-note">
          <p>💡 Vous pouvez toujours modifier vos préférences dans les paramètres</p>
        </div>
      </div>
    `;
  }

  getModuleName(moduleId) {
    const moduleNames = {
      'bitcoin-basics-intro': 'Introduction Bitcoin',
      'bitcoin-fundamentals': 'Fondamentaux Bitcoin', 
      'lightning-basics': 'Bases Lightning Network',
      'lightning-concepts': 'Concepts Lightning',
      'channels-management': 'Gestion des Canaux',
      'dazbox-setup': 'Installation DazBox',
      'dazia-optimization': 'Optimisation DazIA',
      'development-basics': 'Bases Développement',
      'api-integration': 'Intégration APIs',
      'business-integration': 'Intégration Business',
      'roi-strategies': 'Stratégies ROI',
      'advanced-development': 'Développement Avancé'
    };
    return moduleNames[moduleId] || moduleId;
  }

  getProfileLabel(category, value) {
    const labels = {
      level: {
        beginner: 'Débutant',
        intermediate: 'Intermédiaire', 
        expert: 'Expert'
      },
      focus: {
        learning: 'Apprentissage',
        business: 'Business',
        technical: 'Technique'
      },
      pace: {
        casual: 'Tranquille',
        moderate: 'Modéré',
        intensive: 'Intensif'
      }
    };
    return labels[category][value] || value;
  }

  startRecommendedPath() {
    // Save user preferences
    if (window.progressTracker) {
      const progress = window.progressTracker.getUserProgress();
      progress.profile.preferredPath = this.results.recommendations.primary;
      progress.profile.level = this.results.profile.level;
      progress.profile.learningStyle = this.results.recommendations.learningStyle;
      window.progressTracker.saveProgress();
    }

    // Redirect to recommended starting point
    const startUrls = {
      'bitcoin-basics': '/getting-started/',
      'lightning-network': '/lightning-network/basics/',
      'node-operation': '/solutions/dazbox/',
      'development': '/devs/',
      'business-bitcoin': '/bitcoin/cas-usage/'
    };

    const startUrl = startUrls[this.results.recommendations.primary] || '/getting-started/';
    
    this.closeQuiz();
    
    // Small delay to let modal close
    setTimeout(() => {
      window.location.href = startUrl;
    }, 500);
  }

  exploreAlternatives() {
    this.closeQuiz();
    // Scroll to journey selector
    setTimeout(() => {
      const journeySelector = document.querySelector('.journey-selector');
      if (journeySelector) {
        journeySelector.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }

  retakeQuiz() {
    this.answers = {};
    this.currentQuestionIndex = 0;
    this.results = null;
    this.createQuizModal();
    this.displayCurrentQuestion();
  }

  skipQuiz() {
    this.closeQuiz();
    localStorage.setItem('dazno_quiz_skipped', 'true');
    
    // Track skip
    if (typeof umami !== 'undefined') {
      umami.track('quiz-skipped');
    }
  }
  
  // === NOUVELLES MÉTHODES D'AMÉLIORATION ===
  
  loadSavedAnswers() {
    const saved = localStorage.getItem('dazno_quiz_temp_answers');
    return saved ? JSON.parse(saved) : null;
  }
  
  autoSaveAnswers() {
    localStorage.setItem('dazno_quiz_temp_answers', JSON.stringify(this.answers));
  }
  
  celebrateSelection(inputs) {
    inputs.forEach(input => {
      const label = input.closest('.option-label');
      label.classList.add('selected-celebration');
      
      // Effet de particules
      this.createParticleEffect(label);
      
      setTimeout(() => {
        label.classList.remove('selected-celebration');
      }, 600);
    });
  }
  
  createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = 3;
    
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'quiz-particle';
      particle.style.left = rect.left + (rect.width * Math.random()) + 'px';
      particle.style.top = rect.top + (rect.height * Math.random()) + 'px';
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }
  
  showPreviewRecommendations() {
    if (Object.keys(this.answers).length >= 2) {
      const tempResults = this.analyzeAnswers();
      const preview = document.querySelector('.recommendation-preview');
      
      if (preview) {
        preview.innerHTML = `
          <div class="preview-content">
            🚀 <strong>Votre parcours se dessine...</strong><br>
            <small>Niveau: ${this.getProfileLabel('level', tempResults.profile.level)}</small>
          </div>
        `;
        preview.classList.add('show');
      } else {
        const quizContent = document.getElementById('quiz-content');
        const previewEl = document.createElement('div');
        previewEl.className = 'recommendation-preview show';
        previewEl.innerHTML = `
          <div class="preview-content">
            🚀 <strong>Votre parcours se dessine...</strong><br>
            <small>Niveau: ${this.getProfileLabel('level', tempResults.profile.level)}</small>
          </div>
        `;
        quizContent.appendChild(previewEl);
      }
    }
  }
  
  addTouchSupport() {
    const modal = document.getElementById('orientation-quiz-modal');
    if (!modal) return;
    
    modal.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    modal.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = this.touchStartX - touchEndX;
      const deltaY = Math.abs(this.touchStartY - touchEndY);
      
      // Swipe horizontal significatif
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          // Swipe gauche = suivant
          if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextQuestion();
          }
        } else {
          // Swipe droite = précédent
          if (this.currentQuestionIndex > 0) {
            this.previousQuestion();
          }
        }
      }
    }, { passive: true });
  }
  
  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('orientation-quiz-modal')) return;
      
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextQuestion();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (this.currentQuestionIndex > 0) {
            this.previousQuestion();
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          const focusedOption = document.activeElement.closest('.option-label');
          if (focusedOption) {
            const input = focusedOption.querySelector('input');
            input.click();
          }
          break;
      }
    });
  }

  closeQuiz() {
    const modal = document.getElementById('orientation-quiz-modal');
    if (modal) {
      // Animation de fermeture
      modal.style.transition = 'all 0.3s ease';
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        modal.remove();
        // Nettoyer la sauvegarde temporaire
        localStorage.removeItem('dazno_quiz_temp_answers');
      }, 300);
    }
  }

  saveQuizResults() {
    localStorage.setItem('dazno_quiz_completed', 'true');
    localStorage.setItem('dazno_quiz_results', JSON.stringify(this.results));
    
    // Update user progress if available
    if (window.progressTracker) {
      const userProgress = window.progressTracker.getUserProgress();
      userProgress.profile.preferredPath = this.results.recommendations.primary;
      userProgress.profile.level = this.results.profile.level;
      userProgress.quiz = {
        completed: true,
        results: this.results,
        completedAt: new Date().toISOString()
      };
      window.progressTracker.saveProgress();
    }
  }

  // === TRACKING METHODS ===
  trackQuizStart() {
    if (typeof umami !== 'undefined') {
      umami.track('quiz-started');
    }
  }

  trackAnswer(questionId, answers) {
    if (typeof umami !== 'undefined') {
      umami.track('quiz-answer', { 
        question: questionId, 
        answers: answers.join(',') 
      });
    }
  }

  trackQuizCompletion() {
    if (typeof umami !== 'undefined') {
      umami.track('quiz-completed', {
        profile_level: this.results.profile.level,
        profile_focus: this.results.profile.focus,
        recommended_path: this.results.recommendations.primary
      });
    }
  }

  // === PUBLIC API ===
  showQuizManually() {
    this.showQuiz();
  }

  getQuizResults() {
    return this.results;
  }

  hasCompletedQuiz() {
    return localStorage.getItem('dazno_quiz_completed') === 'true';
  }
}

// Styles CSS pour le quiz
const quizStyles = `
<style>
.quiz-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

/* Support mode sombre/clair */
@media (prefers-color-scheme: dark) {
  .quiz-modal {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .quiz-modal-content {
    background: var(--bg-surface, #1a1a1a);
    color: var(--text-primary, #ffffff);
  }
}

.quiz-modal.show {
  opacity: 1;
  visibility: visible;
}

.quiz-modal-content {
  background: var(--bg-surface);
  border-radius: 16px;
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.quiz-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  position: relative;
}

.quiz-benefits {
  display: flex;
  justify-content: center;
  gap: var(--space-md, 16px);
  margin-top: var(--space-md, 16px);
  flex-wrap: wrap;
}

.benefit-item {
  background: rgba(107, 70, 193, 0.1);
  color: var(--lightning-purple, #6b46c1);
  padding: var(--space-xs, 8px) var(--space-sm, 12px);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(107, 70, 193, 0.2);
  animation: benefit-fade-in 0.5s ease forwards;
}

@keyframes benefit-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quiz-header h2 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.quiz-header p {
  margin: 0 0 var(--space-lg) 0;
  color: var(--text-secondary);
}

.quiz-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: rgba(0, 0, 0, 0.1);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quiz-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
}

.quiz-progress {
  margin-bottom: var(--space-lg);
}

.quiz-progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.quiz-progress-fill {
  height: 100%;
  background: var(--gradient-lightning);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.quiz-progress-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.quiz-content {
  padding: var(--space-xl);
  min-height: 300px;
}

.question-title {
  font-size: 1.25rem;
  margin: 0 0 var(--space-md) 0;
  color: var(--text-primary);
  font-weight: 600;
}

.question-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-lg) 0;
  font-style: italic;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.option-label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg, 20px);
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 44px;
  outline: none;
}

.option-label:focus {
  border-color: var(--lightning-purple);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
  outline: 2px solid var(--lightning-purple);
  outline-offset: 2px;
}

.option-label.selected-celebration {
  animation: celebration-bounce 0.6s ease;
  border-color: var(--lightning-purple);
  background: rgba(107, 70, 193, 0.1);
}

.quiz-particle {
  position: fixed;
  width: 6px;
  height: 6px;
  background: var(--lightning-purple);
  border-radius: 50%;
  pointer-events: none;
  animation: particle-float 1s ease-out forwards;
  z-index: 10001;
}

@keyframes celebration-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes particle-float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(0.5);
  }
}

.option-label:hover {
  border-color: var(--lightning-purple);
  transform: translateX(4px);
}

.option-label.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-label input {
  margin: 0;
  width: 20px;
  height: 20px;
}

.option-text {
  flex: 1;
  font-size: 1rem;
  color: var(--text-primary);
}

.option-label input:checked + .option-text {
  font-weight: 600;
  color: var(--lightning-purple);
}

.quiz-footer {
  padding: var(--space-xl);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
}

.btn-quiz-prev, .btn-quiz-next {
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid var(--lightning-purple);
  background: transparent;
  color: var(--lightning-purple);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-quiz-prev:disabled, .btn-quiz-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-quiz-next:not(:disabled):hover {
  background: var(--lightning-purple);
  color: white;
}

.btn-quiz-results {
  padding: var(--space-sm) var(--space-lg);
  background: var(--gradient-lightning);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-quiz-results:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

/* Results Styles */
.quiz-results {
  padding: var(--space-xl);
}

.results-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.results-header h2 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-size: 1.75rem;
}

.recommended-path {
  margin-bottom: var(--space-xl);
}

.path-card.featured {
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(245, 158, 11, 0.1));
  border: 2px solid var(--lightning-purple);
  border-radius: 12px;
  padding: var(--space-xl);
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.path-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.path-duration {
  background: var(--lightning-yellow);
  color: var(--dark-bg);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.path-description {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.path-modules h4, .path-customizations h4 {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.path-modules ul, .path-customizations ul {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-md) 0;
}

.path-modules li {
  padding: var(--space-xs) 0;
  color: var(--text-secondary);
}

.path-customizations li {
  padding: var(--space-xs) 0;
  color: var(--lightning-purple);
  font-weight: 500;
}

.profile-summary {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.profile-summary h4 {
  margin: 0 0 var(--space-md) 0;
  color: var(--text-primary);
}

.profile-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.profile-tag {
  padding: var(--space-xs) var(--space-sm);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.profile-tag.level {
  background: var(--lightning-blue);
  color: white;
}

.profile-tag.focus {
  background: var(--lightning-purple);
  color: white;
}

.profile-tag.pace {
  background: var(--lightning-yellow);
  color: var(--dark-bg);
}

.results-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.btn-quiz-primary {
  padding: var(--space-md) var(--space-xl);
  background: var(--gradient-lightning);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.btn-quiz-primary:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
}

.btn-quiz-secondary {
  padding: var(--space-sm) var(--space-lg);
  background: transparent;
  border: 2px solid var(--lightning-purple);
  color: var(--lightning-purple);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-quiz-secondary:hover {
  background: var(--lightning-purple);
  color: white;
}

.btn-quiz-text {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-sm);
  font-size: 0.875rem;
}

.btn-quiz-text:hover {
  color: var(--text-primary);
}

/* Améliorations d'accessibilité et d'engagement */
.quiz-modal-content {
  animation: modal-entrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-entrance {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.question-container {
  animation: question-slide-in 0.3s ease-out;
}

@keyframes question-slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Focus amélioré pour navigation clavier */
.option-label:focus-within {
  border-color: var(--lightning-purple);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
  outline: 2px solid var(--lightning-purple);
  outline-offset: 2px;
  transform: translateX(4px);
}

.quiz-close:focus {
  outline: 2px solid var(--lightning-purple);
  outline-offset: 2px;
  background: rgba(107, 70, 193, 0.1);
}

/* Indicateurs visuels d'interaction */
.option-label::before {
  content: '';
  position: absolute;
  left: -2px;
  top: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--lightning-purple), var(--lightning-blue));
  border-radius: 12px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.2s ease;
}

.option-label:hover::before,
.option-label:focus::before {
  opacity: 0.1;
}

.option-label input:checked + .option-text {
  position: relative;
}

.option-label input:checked + .option-text::after {
  content: '✓';
  position: absolute;
  right: -24px;
  color: var(--lightning-purple);
  font-weight: bold;
  animation: checkmark-appear 0.3s ease;
}

@keyframes checkmark-appear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.quiz-completion-note {
  text-align: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-color);
}

.quiz-completion-note p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.question-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0 0 var(--space-md) 0;
  font-style: italic;
  text-align: center;
}

.recommendation-preview {
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(245, 158, 11, 0.1));
  border: 1px solid rgba(107, 70, 193, 0.2);
  border-radius: 8px;
  padding: var(--space-md);
  margin-top: var(--space-lg);
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.recommendation-preview.show {
  opacity: 1;
  transform: translateY(0);
}

.preview-content {
  font-size: 0.9rem;
  color: var(--lightning-purple);
}

.preview-content small {
  color: var(--text-secondary);
  font-weight: normal;
}

@media (max-width: 768px) {
  .quiz-modal-content {
    width: 95vw;
    margin: var(--space-md);
  }
  
  .quiz-header, .quiz-content, .quiz-footer, .quiz-results {
    padding: var(--space-lg);
  }
  
  .quiz-footer {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .path-header {
    flex-direction: column;
    gap: var(--space-sm);
    align-items: flex-start;
  }
  
  .profile-tags {
    justify-content: center;
  }
  
  /* Boutons plus grands pour mobile */
  .option-label {
    min-height: 60px;
    padding: var(--space-xl, 24px);
    margin-bottom: var(--space-sm);
  }
  
  .btn-quiz-prev, .btn-quiz-next, .btn-quiz-results {
    min-height: 48px;
    padding: var(--space-md, 16px) var(--space-xl, 24px);
    font-size: 1.1rem;
  }
  
  .quiz-close {
    width: 48px;
    height: 48px;
    top: var(--space-sm);
    right: var(--space-sm);
  }
  
  .benefit-item {
    font-size: 0.8rem;
    padding: var(--space-xs, 6px) var(--space-sm, 10px);
  }
  
  /* Gestures tactiles - indicateurs visuels */
  .quiz-content::after {
    content: '👈 Balayez pour naviguer 👉';
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--text-secondary);
    font-size: 0.8rem;
    opacity: 0.7;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', quizStyles);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.orientationQuiz = new OrientationQuiz();
});