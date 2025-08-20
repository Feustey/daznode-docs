/**
 * Related Content Engine - Système de recommandation intelligent
 * Suggère du contenu pertinent et des solutions commerciales basé sur le contenu actuel et le comportement utilisateur
 */

class RelatedContentEngine {
  constructor() {
    this.currentPage = window.location.pathname;
    this.currentTopic = this.extractTopic();
    this.userBehavior = this.loadUserBehavior();
    this.contentDatabase = this.initContentDatabase();
    this.init();
  }

  init() {
    this.loadRelatedContent();
    this.trackUserInteractions();
    this.setupScrollBasedRecommendations();
  }

  /**
   * Extraction du topic depuis l'URL et les métadonnées
   */
  extractTopic() {
    const path = this.currentPage;
    
    // Topic mapping basé sur l'URL
    const topicMap = {
      '/lightning-network/': 'lightning',
      '/bitcoin/': 'bitcoin', 
      '/dazbox/': 'hardware',
      '/devs/': 'development',
      '/rag/': 'ai',
      '/token4good/': 'community'
    };

    // Cherche le topic dans l'URL
    for (const [urlPattern, topic] of Object.entries(topicMap)) {
      if (path.includes(urlPattern.slice(1, -1))) {
        return topic;
      }
    }

    // Fallback : métadonnée de page
    const metaTopic = document.querySelector('meta[name="topic"]')?.content;
    return metaTopic ? metaTopic.toLowerCase().replace(/\s+/g, '-') : 'general';
  }

  /**
   * Base de données de contenu avec relations et scores
   */
  initContentDatabase() {
    return {
      // Contenu documentation
      docs: [
        {
          id: 'lightning-optimization',
          title: 'Optimisation Lightning Network',
          url: '/lightning-network/optimization/',
          topic: 'lightning',
          difficulty: 'advanced',
          readTime: 15,
          tags: ['force-close', 'liquidité', 'IA'],
          commercialSolutions: ['dazia-force-close', 'dazbox-lightning']
        },
        {
          id: 'bitcoin-node-management',
          title: 'Gestion de Nœud Bitcoin',
          url: '/bitcoin/node-management/',
          topic: 'bitcoin',
          difficulty: 'intermediate',
          readTime: 20,
          tags: ['monitoring', 'sécurité', 'performance'],
          commercialSolutions: ['dazbox-bitcoin', 'dazia-monitoring']
        },
        {
          id: 'rag-introduction',
          title: 'Introduction au RAG',
          url: '/rag/introduction/',
          topic: 'ai',
          difficulty: 'intermediate',
          readTime: 8,
          tags: ['IA', 'RAG', 'machine-learning'],
          commercialSolutions: ['dazia-rag', 'api-enterprise']
        },
        {
          id: 'developer-api',
          title: 'Documentation API',
          url: '/devs/api/',
          topic: 'development',
          difficulty: 'intermediate',
          readTime: 10,
          tags: ['API', 'intégration', 'SDK'],
          commercialSolutions: ['api-enterprise', 'dazpay-integration']
        }
      ],

      // Solutions commerciales
      solutions: [
        {
          id: 'dazia-force-close',
          name: 'DazIA Force-Close Prevention',
          url: 'https://dazno.de/dazia/force-close-prevention',
          description: 'IA prédictive pour éviter les force-close avec 89% de réussite',
          topics: ['lightning'],
          tags: ['IA', 'prédiction', 'force-close'],
          pricing: 'premium',
          conversionPriority: 'high'
        },
        {
          id: 'dazbox-lightning',
          name: 'DazBox Lightning Node',
          url: 'https://dazno.de/dazbox/lightning-optimized',
          description: 'Nœud Lightning pré-configuré avec optimisations avancées',
          topics: ['lightning', 'bitcoin'],
          tags: ['hardware', 'plug-and-play', 'optimisation'],
          pricing: 'hardware',
          conversionPriority: 'high'
        },
        {
          id: 'dazia-rag',
          name: 'DazIA RAG Engine',
          url: 'https://dazno.de/dazia/rag-engine',
          description: 'Architecture RAG avancée pour vos applications Bitcoin',
          topics: ['ai', 'development'],
          tags: ['RAG', 'IA', 'API'],
          pricing: 'enterprise',
          conversionPriority: 'medium'
        },
        {
          id: 'api-enterprise',
          name: 'API Enterprise',
          url: 'https://dazno.de/api/enterprise',
          description: 'API complète avec support 24/7 pour développeurs',
          topics: ['development'],
          tags: ['API', 'enterprise', 'support'],
          pricing: 'subscription',
          conversionPriority: 'medium'
        }
      ],

      // Relations entre contenus
      relationships: {
        'lightning-optimization': ['bitcoin-node-management', 'rag-introduction'],
        'bitcoin-node-management': ['lightning-optimization', 'developer-api'],
        'rag-introduction': ['lightning-optimization', 'developer-api'],
        'developer-api': ['rag-introduction', 'bitcoin-node-management']
      }
    };
  }

  /**
   * Chargement et affichage du contenu lié
   */
  async loadRelatedContent() {
    const recommendations = this.generateRecommendations();
    
    if (recommendations.length > 0) {
      this.displayRelatedContent(recommendations);
    }

    // Recommandations commerciales contextuelle
    const commercialRecommendations = this.generateCommercialRecommendations();
    if (commercialRecommendations.length > 0) {
      this.displayCommercialRecommendations(commercialRecommendations);
    }
  }

  /**
   * Génération de recommandations basées sur l'algorithme
   */
  generateRecommendations() {
    const currentPageId = this.findCurrentPageId();
    if (!currentPageId) return [];

    const recommendations = [];
    const directRelations = this.contentDatabase.relationships[currentPageId] || [];
    
    // Recommandations directes (score élevé)
    directRelations.forEach(relatedId => {
      const content = this.findContentById(relatedId);
      if (content) {
        recommendations.push({
          ...content,
          score: 0.9,
          reason: 'direct_relation'
        });
      }
    });

    // Recommandations basées sur les tags (score moyen)
    const currentContent = this.findContentById(currentPageId);
    if (currentContent) {
      this.contentDatabase.docs.forEach(doc => {
        if (doc.id === currentPageId) return;
        
        const commonTags = currentContent.tags.filter(tag => 
          doc.tags.includes(tag)
        );
        
        if (commonTags.length > 0) {
          const score = commonTags.length / Math.max(currentContent.tags.length, doc.tags.length);
          if (score > 0.3) {
            recommendations.push({
              ...doc,
              score: score * 0.7,
              reason: 'common_tags',
              commonTags
            });
          }
        }
      });
    }

    // Recommandations basées sur le topic (score faible)
    this.contentDatabase.docs.forEach(doc => {
      if (doc.id === currentPageId) return;
      if (doc.topic === this.currentTopic) {
        if (!recommendations.find(r => r.id === doc.id)) {
          recommendations.push({
            ...doc,
            score: 0.4,
            reason: 'same_topic'
          });
        }
      }
    });

    // Tri par score et limitation
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }

  /**
   * Génération de recommandations commerciales intelligentes
   */
  generateCommercialRecommendations() {
    const currentPageId = this.findCurrentPageId();
    const currentContent = this.findContentById(currentPageId);
    
    if (!currentContent) return [];

    const recommendations = [];
    
    // Solutions directement liées au contenu
    if (currentContent.commercialSolutions) {
      currentContent.commercialSolutions.forEach(solutionId => {
        const solution = this.findSolutionById(solutionId);
        if (solution) {
          recommendations.push({
            ...solution,
            score: 0.95,
            reason: 'direct_content_match'
          });
        }
      });
    }

    // Solutions basées sur le topic
    this.contentDatabase.solutions.forEach(solution => {
      if (solution.topics.includes(this.currentTopic)) {
        if (!recommendations.find(r => r.id === solution.id)) {
          recommendations.push({
            ...solution,
            score: 0.7,
            reason: 'topic_match'
          });
        }
      }
    });

    // Boost basé sur le comportement utilisateur
    recommendations.forEach(rec => {
      if (this.userBehavior.interestedTopics.includes(this.currentTopic)) {
        rec.score += 0.2;
      }
      if (this.userBehavior.engagementLevel === 'high') {
        rec.score += 0.1;
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  /**
   * Affichage du contenu lié
   */
  displayRelatedContent(recommendations) {
    const container = document.createElement('div');
    container.className = 'related-content-section';
    container.innerHTML = `
      <div class="related-content-header">
        <h3>📚 Articles Connexes</h3>
        <p>Approfondissez vos connaissances avec ces guides complémentaires</p>
      </div>
      <div class="related-content-grid">
        ${recommendations.map(rec => this.createContentCard(rec)).join('')}
      </div>
    `;

    this.insertRelatedContent(container);
  }

  /**
   * Affichage des recommandations commerciales
   */
  displayCommercialRecommendations(recommendations) {
    const container = document.createElement('div');
    container.className = 'commercial-recommendations-section';
    container.innerHTML = `
      <div class="commercial-header">
        <h3>🚀 Solutions Adaptées</h3>
        <p>Automatisez et optimisez avec nos solutions professionnelles</p>
      </div>
      <div class="commercial-grid">
        ${recommendations.map(rec => this.createCommercialCard(rec)).join('')}
      </div>
    `;

    this.insertCommercialRecommendations(container);
  }

  /**
   * Création d'une carte de contenu
   */
  createContentCard(content) {
    const difficultyColors = {
      'beginner': '#22c55e',
      'intermediate': '#f59e0b', 
      'advanced': '#dc2626'
    };

    return `
      <div class="related-content-card" data-content-id="${content.id}">
        <div class="content-meta">
          <span class="content-difficulty" style="background: ${difficultyColors[content.difficulty]}">
            ${content.difficulty}
          </span>
          <span class="content-time">${content.readTime} min</span>
        </div>
        <h4 class="content-title">
          <a href="${content.url}" class="content-link">${content.title}</a>
        </h4>
        <div class="content-tags">
          ${content.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="content-reason">
          ${this.getReasonText(content.reason)}
        </div>
      </div>
    `;
  }

  /**
   * Création d'une carte commerciale
   */
  createCommercialCard(solution) {
    const priorityIcons = {
      'high': '⭐',
      'medium': '🔥',
      'low': '💡'
    };

    return `
      <div class="commercial-card" data-solution-id="${solution.id}">
        <div class="commercial-meta">
          <span class="priority-icon">${priorityIcons[solution.conversionPriority]}</span>
          <span class="pricing-tier">${solution.pricing}</span>
        </div>
        <h4 class="commercial-title">
          <a href="${solution.url}" class="commercial-link" data-utm="related_engine_${solution.id}">
            ${solution.name}
          </a>
        </h4>
        <p class="commercial-description">${solution.description}</p>
        <div class="commercial-tags">
          ${solution.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="commercial-cta">
          <a href="${solution.url}" class="cta-button commercial-link" data-utm="related_cta_${solution.id}">
            En savoir plus →
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Insertion du contenu dans la page
   */
  insertRelatedContent(container) {
    // Cherche le meilleur endroit pour insérer
    const contentContainer = document.querySelector('.article-content, .content-container, main');
    if (contentContainer) {
      // Insère après le contenu principal, avant les CTA
      const ctaBridge = contentContainer.querySelector('.commercial-bridge');
      if (ctaBridge) {
        contentContainer.insertBefore(container, ctaBridge);
      } else {
        contentContainer.appendChild(container);
      }
    }
  }

  insertCommercialRecommendations(container) {
    const existingBridge = document.querySelector('.commercial-bridge');
    if (existingBridge) {
      existingBridge.parentNode.insertBefore(container, existingBridge.nextSibling);
    } else {
      this.insertRelatedContent(container);
    }
  }

  /**
   * Tracking des interactions utilisateur
   */
  trackUserInteractions() {
    // Track clicks sur contenu lié
    document.addEventListener('click', (e) => {
      if (e.target.closest('.related-content-card')) {
        const card = e.target.closest('.related-content-card');
        const contentId = card.getAttribute('data-content-id');
        
        this.trackAnalyticsEvent('related_content_click', {
          content_id: contentId,
          source_page: this.currentPage,
          recommendation_engine: 'related_content'
        });

        this.updateUserBehavior('content_click', contentId);
      }
      
      if (e.target.closest('.commercial-card')) {
        const card = e.target.closest('.commercial-card');
        const solutionId = card.getAttribute('data-solution-id');
        
        this.trackAnalyticsEvent('commercial_recommendation_click', {
          solution_id: solutionId,
          source_page: this.currentPage,
          recommendation_engine: 'commercial_recommendations',
          conversion_intent: 'medium_to_high'
        });

        this.updateUserBehavior('commercial_click', solutionId);
      }
    });
  }

  /**
   * Recommandations basées sur le scroll
   */
  setupScrollBasedRecommendations() {
    let hasShownScrollRecommendations = false;
    
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      // À 70% de scroll, montre des recommandations supplémentaires
      if (scrollPercent > 70 && !hasShownScrollRecommendations) {
        hasShownScrollRecommendations = true;
        this.showScrollBasedRecommendations();
      }
    });
  }

  showScrollBasedRecommendations() {
    // Recommandations contextuelles en fin de lecture
    const recommendedAction = this.getContextualAction();
    if (recommendedAction) {
      this.displayContextualAction(recommendedAction);
    }
  }

  getContextualAction() {
    const readTime = this.estimateReadTime();
    const topic = this.currentTopic;
    
    const actions = {
      'lightning': {
        action: 'trial',
        title: '🎯 Prêt à optimiser votre nœud Lightning ?',
        description: 'Testez DazIA gratuitement pendant 14 jours',
        cta: 'Essai Gratuit DazIA',
        url: 'https://dazno.de/trial/dazia'
      },
      'bitcoin': {
        action: 'hardware',
        title: '⚡ Besoin d\'un nœud Bitcoin performant ?',
        description: 'DazBox est livré pré-configuré et optimisé',
        cta: 'Découvrir DazBox',
        url: 'https://dazno.de/dazbox'
      },
      'development': {
        action: 'api',
        title: '🔌 Intégrer Lightning dans votre app ?',
        description: 'API complète avec documentation interactive',
        cta: 'Tester l\'API Gratuitement',
        url: 'https://dazno.de/api/free-tier'
      }
    };

    return actions[topic] || actions['lightning'];
  }

  displayContextualAction(action) {
    const banner = document.createElement('div');
    banner.className = 'contextual-action-banner';
    banner.innerHTML = `
      <div class="contextual-action-content">
        <div class="action-text">
          <h4>${action.title}</h4>
          <p>${action.description}</p>
        </div>
        <div class="action-cta">
          <a href="${action.url}" class="cta-primary commercial-link" data-utm="contextual_action_${action.action}">
            ${action.cta}
          </a>
        </div>
      </div>
      <button class="close-banner" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(banner);
    
    setTimeout(() => banner.classList.add('show'), 100);
  }

  /**
   * Gestion du comportement utilisateur
   */
  loadUserBehavior() {
    const stored = localStorage.getItem('daznode_user_behavior');
    return stored ? JSON.parse(stored) : {
      interestedTopics: [],
      engagementLevel: 'low',
      visitCount: 0,
      lastVisit: null,
      clickedSolutions: []
    };
  }

  updateUserBehavior(action, target) {
    if (action === 'content_click') {
      if (!this.userBehavior.interestedTopics.includes(this.currentTopic)) {
        this.userBehavior.interestedTopics.push(this.currentTopic);
      }
    }
    
    if (action === 'commercial_click') {
      if (!this.userBehavior.clickedSolutions.includes(target)) {
        this.userBehavior.clickedSolutions.push(target);
      }
      this.userBehavior.engagementLevel = 'high';
    }

    this.userBehavior.visitCount++;
    this.userBehavior.lastVisit = Date.now();

    localStorage.setItem('daznode_user_behavior', JSON.stringify(this.userBehavior));
  }

  /**
   * Méthodes utilitaires
   */
  findCurrentPageId() {
    return this.contentDatabase.docs.find(doc => 
      this.currentPage.includes(doc.url.slice(1, -1))
    )?.id;
  }

  findContentById(id) {
    return this.contentDatabase.docs.find(doc => doc.id === id);
  }

  findSolutionById(id) {
    return this.contentDatabase.solutions.find(sol => sol.id === id);
  }

  getReasonText(reason) {
    const reasons = {
      'direct_relation': '🔗 Contenu complémentaire',
      'common_tags': '🏷️ Sujets similaires',
      'same_topic': '📂 Même catégorie'
    };
    return reasons[reason] || '';
  }

  estimateReadTime() {
    const text = document.querySelector('.content-container, .article-content, main')?.textContent || '';
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200); // 200 mots par minute
  }

  trackAnalyticsEvent(eventName, data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
    
    if (window.DazNodeAnalytics) {
      window.DazNodeAnalytics.sendAnalyticsEvent(eventName, data);
    }
    
    console.log(`📊 Related Content: ${eventName}`, data);
  }
}

// Styles CSS pour les recommandations
const relatedContentCSS = `
.related-content-section, .commercial-recommendations-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
}

.related-content-header, .commercial-header {
  text-align: center;
  margin-bottom: 2rem;
}

.related-content-header h3, .commercial-header h3 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.related-content-header p, .commercial-header p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.related-content-grid, .commercial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.related-content-card, .commercial-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.related-content-card:hover, .commercial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.content-meta, .commercial-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.content-difficulty {
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.content-time {
  color: #64748b;
  font-size: 0.8rem;
}

.priority-icon {
  font-size: 1.2rem;
}

.pricing-tier {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.content-title, .commercial-title {
  margin: 0 0 1rem 0;
}

.content-link, .commercial-link {
  color: #1e293b;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
}

.content-link:hover, .commercial-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.commercial-description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.content-tags, .commercial-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.content-reason {
  color: #64748b;
  font-size: 0.8rem;
  font-style: italic;
}

.commercial-cta {
  margin-top: 1rem;
}

.cta-button {
  background: #3b82f6;
  color: white !important;
  text-decoration: none !important;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  transition: background 0.2s ease;
}

.cta-button:hover {
  background: #2563eb;
  text-decoration: none !important;
}

.contextual-action-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.2);
}

.contextual-action-banner.show {
  transform: translateY(0);
}

.contextual-action-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.action-text h4 {
  margin: 0 0 0.25rem 0;
  color: white;
  font-size: 1.1rem;
}

.action-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.action-cta .cta-primary {
  background: white;
  color: #3b82f6 !important;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.action-cta .cta-primary:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.close-banner {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.close-banner:hover {
  opacity: 1;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .related-content-section, .commercial-recommendations-section {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-color: #475569;
  }
  
  .related-content-header h3, .commercial-header h3 {
    color: #f1f5f9;
  }
  
  .related-content-header p, .commercial-header p {
    color: #94a3b8;
  }
  
  .related-content-card, .commercial-card {
    background: #1e293b;
    border-color: #475569;
  }
  
  .related-content-card:hover, .commercial-card:hover {
    border-color: #60a5fa;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .content-link, .commercial-link {
    color: #f1f5f9;
  }
  
  .content-link:hover, .commercial-link:hover {
    color: #60a5fa;
  }
  
  .commercial-description {
    color: #94a3b8;
  }
  
  .pricing-tier {
    background: #334155;
    color: #e2e8f0;
  }
  
  .tag {
    background: #334155;
    color: #e2e8f0;
  }
  
  .content-reason {
    color: #94a3b8;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .related-content-grid, .commercial-grid {
    grid-template-columns: 1fr;
  }
  
  .contextual-action-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .related-content-section, .commercial-recommendations-section {
    margin: 1rem 0;
    padding: 1rem;
  }
}
`;

// Injection du CSS
const style = document.createElement('style');
style.textContent = relatedContentCSS;
document.head.appendChild(style);

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Délai pour laisser le contenu principal se charger
  setTimeout(() => {
    window.DazNodeRelatedContent = new RelatedContentEngine();
  }, 1000);
});

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RelatedContentEngine;
}