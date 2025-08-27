/**
 * T4G Quiz Integration System
 * Intègre les quiz d'apprentissage avec le système de récompenses T4G
 */

class T4GQuizIntegration {
  constructor() {
    this.quizzes = new Map();
    this.currentQuiz = null;
    this.userAnswers = [];
    this.startTime = null;
    this.init();
  }

  init() {
    this.initializeQuizzes();
    this.setupEventListeners();
  }

  initializeQuizzes() {
    // Quiz Bitcoin Basics
    this.quizzes.set('bitcoin-basics', {
      id: 'bitcoin-basics',
      title: 'Bitcoin Fundamentals',
      difficulty: 'beginner',
      category: 'bitcoin',
      t4gReward: 10,
      perfectBonus: 5,
      questions: [
        {
          id: 'q1',
          question: "Qu'est-ce que Bitcoin ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Une cryptomonnaie décentralisée', correct: true },
            { id: 'b', text: 'Une entreprise technologique', correct: false },
            { id: 'c', text: 'Un système bancaire traditionnel', correct: false },
            { id: 'd', text: 'Une application mobile', correct: false }
          ],
          explanation: "Bitcoin est effectivement une cryptomonnaie décentralisée, fonctionnant sans autorité centrale."
        },
        {
          id: 'q2',
          question: "Combien de bitcoins peuvent être créés au maximum ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '21 millions', correct: true },
            { id: 'b', text: '100 millions', correct: false },
            { id: 'c', text: 'Infini', correct: false },
            { id: 'd', text: '1 milliard', correct: false }
          ],
          explanation: "Le protocole Bitcoin limite l'offre totale à 21 millions de bitcoins."
        },
        {
          id: 'q3',
          question: "Qu'est-ce qui sécurise le réseau Bitcoin ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Le minage et la preuve de travail', correct: true },
            { id: 'b', text: 'Les banques centrales', correct: false },
            { id: 'c', text: 'Le gouvernement', correct: false },
            { id: 'd', text: 'Les développeurs uniquement', correct: false }
          ],
          explanation: "Le réseau Bitcoin est sécurisé par le minage et le mécanisme de preuve de travail (Proof of Work)."
        }
      ]
    });

    // Quiz Lightning Network
    this.quizzes.set('lightning-basics', {
      id: 'lightning-basics',
      title: 'Lightning Network Basics',
      difficulty: 'intermediate',
      category: 'lightning',
      t4gReward: 15,
      perfectBonus: 10,
      questions: [
        {
          id: 'q1',
          question: "Quel est le principal avantage du Lightning Network ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Paiements instantanés et frais réduits', correct: true },
            { id: 'b', text: 'Création de nouveaux bitcoins', correct: false },
            { id: 'c', text: 'Remplacement complet de Bitcoin', correct: false },
            { id: 'd', text: 'Suppression de la blockchain', correct: false }
          ],
          explanation: "Lightning Network permet des paiements Bitcoin instantanés avec des frais très réduits."
        },
        {
          id: 'q2',
          question: "Comment fonctionne un canal Lightning ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Ouverture avec transaction on-chain, échanges off-chain', correct: true },
            { id: 'b', text: 'Toutes les transactions sont on-chain', correct: false },
            { id: 'c', text: 'Aucune transaction blockchain requise', correct: false },
            { id: 'd', text: 'Utilise une blockchain séparée', correct: false }
          ],
          explanation: "Un canal s'ouvre avec une transaction on-chain, puis permet des échanges off-chain quasi-instantanés."
        }
      ]
    });

    // Quiz Node Management
    this.quizzes.set('node-management', {
      id: 'node-management',
      title: 'Lightning Node Management',
      difficulty: 'advanced',
      category: 'node',
      t4gReward: 25,
      perfectBonus: 15,
      questions: [
        {
          id: 'q1',
          question: "Qu'est-ce que la liquidité dans Lightning Network ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'La capacité de bitcoins dans les canaux pour envoyer/recevoir', correct: true },
            { id: 'b', text: 'Le nombre de connexions du nœud', correct: false },
            { id: 'c', text: 'La vitesse de synchronisation', correct: false },
            { id: 'd', text: 'Le nombre de transactions par seconde', correct: false }
          ],
          explanation: "La liquidité représente la capacité de bitcoins disponible dans vos canaux pour envoyer ou recevoir des paiements."
        },
        {
          id: 'q2',
          question: "Comment optimiser les frais de routage ?",
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Équilibrer les frais entre compétitivité et rentabilité', correct: true },
            { id: 'b', text: 'Toujours fixer les frais au maximum', correct: false },
            { id: 'c', text: 'Ne jamais prendre de frais', correct: false },
            { id: 'd', text: 'Copier les frais des autres nœuds', correct: false }
          ],
          explanation: "L'optimisation des frais nécessite de trouver un équilibre entre rester compétitif et maintenir la rentabilité."
        }
      ]
    });
  }

  setupEventListeners() {
    // Écoute les clics sur les boutons de quiz
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('start-quiz-btn')) {
        const quizId = e.target.dataset.quizId;
        this.startQuiz(quizId);
      }
      
      if (e.target.classList.contains('quiz-option')) {
        this.selectOption(e.target);
      }
      
      if (e.target.classList.contains('next-question-btn')) {
        this.nextQuestion();
      }
      
      if (e.target.classList.contains('finish-quiz-btn')) {
        this.finishQuiz();
      }
      
      if (e.target.classList.contains('retry-quiz-btn')) {
        this.retryQuiz();
      }
    });
  }

  startQuiz(quizId) {
    const quiz = this.quizzes.get(quizId);
    if (!quiz) {
      console.error('Quiz not found:', quizId);
      return;
    }

    this.currentQuiz = { ...quiz };
    this.userAnswers = [];
    this.currentQuestionIndex = 0;
    this.startTime = Date.now();
    
    // Afficher le quiz
    this.renderQuiz();
    
    // Event T4G pour tracking
    if (window.t4gAPI) {
      window.t4gAPI.dispatchT4GEvent('quiz-started', {
        quizId: quizId,
        difficulty: quiz.difficulty
      });
    }
  }

  renderQuiz() {
    const quizContainer = document.getElementById('quiz-container') || this.createQuizContainer();
    const quiz = this.currentQuiz;
    const question = quiz.questions[this.currentQuestionIndex];
    
    quizContainer.innerHTML = `
      <div class="t4g-quiz-modal">
        <div class="quiz-header">
          <div class="quiz-title">
            <h3>${quiz.title}</h3>
            <div class="quiz-meta">
              <span class="difficulty ${quiz.difficulty}">${this.getDifficultyLabel(quiz.difficulty)}</span>
              <span class="reward">💎 ${quiz.t4gReward} T4G</span>
              <span class="perfect-bonus">+${quiz.perfectBonus} T4G si parfait</span>
            </div>
          </div>
          <div class="quiz-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((this.currentQuestionIndex + 1) / quiz.questions.length) * 100}%"></div>
            </div>
            <span class="progress-text">${this.currentQuestionIndex + 1} / ${quiz.questions.length}</span>
          </div>
        </div>

        <div class="quiz-content">
          <div class="question">
            <h4>Question ${this.currentQuestionIndex + 1}</h4>
            <p class="question-text">${question.question}</p>
          </div>

          <div class="quiz-options">
            ${question.options.map(option => `
              <div class="quiz-option" data-option-id="${option.id}" data-correct="${option.correct}">
                <span class="option-letter">${option.id.toUpperCase()}</span>
                <span class="option-text">${option.text}</span>
              </div>
            `).join('')}
          </div>

          <div class="quiz-explanation" id="quiz-explanation" style="display: none;">
            <div class="explanation-content">
              <h5>Explication :</h5>
              <p>${question.explanation}</p>
            </div>
          </div>

          <div class="quiz-actions">
            <button class="next-question-btn t4g-btn primary" style="display: none;">
              Question suivante
            </button>
            <button class="finish-quiz-btn t4g-btn primary" style="display: none;">
              Terminer le quiz
            </button>
          </div>
        </div>
      </div>
    `;
    
    quizContainer.classList.add('show');
  }

  createQuizContainer() {
    const container = document.createElement('div');
    container.id = 'quiz-container';
    container.className = 'quiz-overlay';
    document.body.appendChild(container);
    return container;
  }

  getDifficultyLabel(difficulty) {
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé',
      'expert': 'Expert'
    };
    return labels[difficulty] || difficulty;
  }

  selectOption(optionElement) {
    // Désactiver toutes les options
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
      opt.classList.remove('selected');
      opt.style.pointerEvents = 'none';
    });

    // Marquer l'option sélectionnée
    optionElement.classList.add('selected');

    const isCorrect = optionElement.dataset.correct === 'true';
    const optionId = optionElement.dataset.optionId;

    // Stocker la réponse
    this.userAnswers.push({
      questionIndex: this.currentQuestionIndex,
      selectedOption: optionId,
      isCorrect: isCorrect,
      timestamp: Date.now()
    });

    // Afficher le feedback visuel
    setTimeout(() => {
      allOptions.forEach(opt => {
        if (opt.dataset.correct === 'true') {
          opt.classList.add('correct');
        } else {
          opt.classList.add('incorrect');
        }
      });

      // Afficher l'explication
      document.getElementById('quiz-explanation').style.display = 'block';

      // Afficher le bouton suivant
      const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
      if (isLastQuestion) {
        document.querySelector('.finish-quiz-btn').style.display = 'inline-block';
      } else {
        document.querySelector('.next-question-btn').style.display = 'inline-block';
      }
    }, 500);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.renderQuiz();
  }

  finishQuiz() {
    const results = this.calculateResults();
    this.showResults(results);
    this.awardT4GRewards(results);
  }

  calculateResults() {
    const totalQuestions = this.currentQuiz.questions.length;
    const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPerfect = score === 100;
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);

    return {
      quizId: this.currentQuiz.id,
      totalQuestions,
      correctAnswers,
      score,
      isPerfect,
      timeSpent,
      difficulty: this.currentQuiz.difficulty,
      category: this.currentQuiz.category
    };
  }

  showResults(results) {
    const quizContainer = document.getElementById('quiz-container');
    const { score, correctAnswers, totalQuestions, isPerfect, timeSpent } = results;
    
    // Calcul des récompenses
    const baseReward = this.currentQuiz.t4gReward;
    const perfectBonus = isPerfect ? this.currentQuiz.perfectBonus : 0;
    const totalReward = baseReward + perfectBonus;

    quizContainer.innerHTML = `
      <div class="t4g-quiz-results">
        <div class="results-header">
          <div class="score-display ${isPerfect ? 'perfect' : score >= 70 ? 'good' : 'needs-improvement'}">
            <div class="score-number">${score}%</div>
            <div class="score-label">${this.getScoreLabel(score)}</div>
          </div>
        </div>

        <div class="results-stats">
          <div class="stat-item">
            <div class="stat-number">${correctAnswers}/${totalQuestions}</div>
            <div class="stat-label">Bonnes réponses</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${timeSpent}s</div>
            <div class="stat-label">Temps écoulé</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">💎 ${totalReward}</div>
            <div class="stat-label">T4G gagnés</div>
          </div>
        </div>

        ${isPerfect ? `
          <div class="perfect-bonus-display">
            <div class="perfect-icon">🎉</div>
            <h4>Quiz Parfait !</h4>
            <p>Bonus de ${perfectBonus} T4G pour 100% de réussite</p>
          </div>
        ` : ''}

        <div class="results-actions">
          <button class="retry-quiz-btn t4g-btn secondary">
            🔄 Recommencer
          </button>
          <button class="continue-learning-btn t4g-btn primary" onclick="closeQuiz()">
            ✨ Continuer l'apprentissage
          </button>
        </div>

        <div class="learning-recommendations">
          <h5>📚 Prochaines étapes recommandées :</h5>
          ${this.getRecommendations(results)}
        </div>
      </div>
    `;
  }

  getScoreLabel(score) {
    if (score === 100) return 'Parfait !';
    if (score >= 80) return 'Excellent !';
    if (score >= 70) return 'Bien !';
    if (score >= 50) return 'À améliorer';
    return 'Recommencez';
  }

  getRecommendations(results) {
    const recommendations = [];
    
    if (results.score < 70) {
      recommendations.push('• Revoir les concepts de base');
      recommendations.push('• Consulter la documentation détaillée');
    }
    
    if (results.category === 'bitcoin' && results.score >= 70) {
      recommendations.push('• Passer au quiz Lightning Network');
      recommendations.push('• Explorer les cas d\'usage avancés');
    }
    
    if (results.category === 'lightning' && results.score >= 70) {
      recommendations.push('• Quiz gestion de nœuds Lightning');
      recommendations.push('• Optimisation ROI calculateur');
    }

    return recommendations.map(rec => `<div class="recommendation-item">${rec}</div>`).join('');
  }

  async awardT4GRewards(results) {
    if (!window.t4gAPI || !window.gamification) return;

    try {
      const baseReward = this.currentQuiz.t4gReward;
      const perfectBonus = results.isPerfect ? this.currentQuiz.perfectBonus : 0;
      
      // Award via gamification system (qui appellera T4G API)
      await window.gamification.completeQuiz(results.quizId, results.score);
      
      // Event custom pour analytics
      window.t4gAPI.dispatchT4GEvent('quiz-completed', {
        quizId: results.quizId,
        score: results.score,
        isPerfect: results.isPerfect,
        timeSpent: results.timeSpent,
        t4gEarned: baseReward + perfectBonus
      });

      // Mettre à jour les stats utilisateur
      this.updateUserStats(results);
      
    } catch (error) {
      console.error('Error awarding T4G rewards:', error);
    }
  }

  updateUserStats(results) {
    if (!window.gamification) return;

    const user = window.gamification.getUser();
    
    // Mettre à jour les statistiques quiz
    if (results.isPerfect) {
      user.stats.perfectQuizzes = (user.stats.perfectQuizzes || 0) + 1;
    }
    
    // Tracking par catégorie pour achievements
    if (!user.statsByCategory) user.statsByCategory = {};
    if (!user.statsByCategory[results.category]) user.statsByCategory[results.category] = 0;
    user.statsByCategory[results.category]++;
    
    // Sauvegarder
    window.gamification.saveUserData();
  }

  retryQuiz() {
    this.startQuiz(this.currentQuiz.id);
  }

  closeQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
      quizContainer.classList.remove('show');
      setTimeout(() => {
        quizContainer.remove();
      }, 300);
    }
  }

  // API publique pour déclencher des quiz
  static startQuiz(quizId) {
    if (!window.t4gQuizIntegration) {
      window.t4gQuizIntegration = new T4GQuizIntegration();
    }
    window.t4gQuizIntegration.startQuiz(quizId);
  }
}

// Fonction globale pour fermer le quiz
window.closeQuiz = () => {
  if (window.t4gQuizIntegration) {
    window.t4gQuizIntegration.closeQuiz();
  }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.t4gQuizIntegration = new T4GQuizIntegration();
  
  // API globale
  window.T4GQuiz = {
    start: T4GQuizIntegration.startQuiz
  };
});