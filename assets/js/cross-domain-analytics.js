/**
 * Cross-Domain Analytics & UTM Tracking System
 * Système centralisé pour le tracking entre docs.dazno.de et dazno.de
 */

class CrossDomainAnalytics {
  constructor() {
    this.currentDomain = window.location.hostname;
    this.commercialDomain = 'dazno.de';
    this.docsDomain = 'docs.dazno.de';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.trackPageView();
    this.setupUserJourneyTracking();
  }

  /**
   * Configuration des événements sur tous les liens cross-domain
   */
  setupEventListeners() {
    // Liens commerciaux (vers dazno.de)
    document.querySelectorAll('a[href*="dazno.de"]').forEach(link => {
      link.addEventListener('click', (e) => this.trackCommercialClick(e, link));
    });

    // Liens documentation (vers docs.dazno.de)  
    document.querySelectorAll('a[href*="docs.dazno.de"]').forEach(link => {
      link.addEventListener('click', (e) => this.trackDocsClick(e, link));
    });

    // Liens avec attribut data-utm
    document.querySelectorAll('[data-utm]').forEach(link => {
      link.addEventListener('click', (e) => this.trackUTMClick(e, link));
    });

    // CTA bridges commerciaux
    document.querySelectorAll('.commercial-bridge .commercial-link').forEach(link => {
      link.addEventListener('click', (e) => this.trackBridgeClick(e, link));
    });
  }

  /**
   * Tracking click vers liens commerciaux
   */
  trackCommercialClick(event, link) {
    const utmData = this.generateUTMData(link);
    const finalUrl = this.addUTMToURL(link.href, utmData);
    
    // Update href avec UTM
    link.href = finalUrl;

    // Analytics event
    this.sendAnalyticsEvent('cross_domain_click', {
      source_domain: this.currentDomain,
      target_domain: this.commercialDomain,
      link_type: 'commercial',
      utm_content: utmData.utm_content,
      source_page: window.location.pathname,
      target_url: finalUrl,
      user_journey: this.getUserJourneyStage()
    });

    console.log('🔄 Cross-domain click tracked:', finalUrl);
  }

  /**
   * Tracking click vers documentation
   */
  trackDocsClick(event, link) {
    this.sendAnalyticsEvent('docs_navigation', {
      source_domain: this.currentDomain,
      target_domain: this.docsDomain,
      link_type: 'documentation',
      source_page: window.location.pathname,
      target_url: link.href
    });
  }

  /**
   * Tracking des CTA bridges
   */
  trackBridgeClick(event, link) {
    const bridgeType = link.closest('.commercial-bridge')?.getAttribute('data-bridge-type') || 'unknown';
    const bridgeAction = link.getAttribute('data-bridge-action') || 'click';

    this.sendAnalyticsEvent('commercial_bridge_interaction', {
      bridge_type: bridgeType,
      bridge_action: bridgeAction,
      source_page: window.location.pathname,
      target_url: link.href,
      conversion_intent: 'high'
    });
  }

  /**
   * Tracking des liens avec UTM personnalisés
   */
  trackUTMClick(event, link) {
    const utmContent = link.getAttribute('data-utm');
    
    if (link.href.includes(this.commercialDomain)) {
      const utmData = {
        utm_source: 'docs',
        utm_medium: 'contextual_link',
        utm_campaign: 'docs_to_commercial_context',
        utm_content: utmContent,
        utm_term: window.location.pathname.replace('/', '')
      };
      
      link.href = this.addUTMToURL(link.href, utmData);
    }

    this.sendAnalyticsEvent('contextual_link_click', {
      utm_content: utmContent,
      link_context: 'contextual',
      source_page: window.location.pathname
    });
  }

  /**
   * Génération des paramètres UTM basés sur le contexte
   */
  generateUTMData(link) {
    const utmContent = link.getAttribute('data-utm') || this.inferUTMContent(link);
    const currentPage = window.location.pathname.replace('/', '') || 'home';
    
    return {
      utm_source: 'docs',
      utm_medium: this.getUTMMedium(link),
      utm_campaign: this.getUTMCampaign(link),
      utm_content: utmContent,
      utm_term: currentPage
    };
  }

  /**
   * Détermination du medium UTM basé sur le contexte du lien
   */
  getUTMMedium(link) {
    if (link.closest('.cross-domain-nav')) return 'navigation';
    if (link.closest('.commercial-bridge')) return 'content_bridge';
    if (link.closest('.knowledge-conversion-bridge')) return 'knowledge_bridge';
    if (link.closest('.breadcrumb')) return 'breadcrumb';
    if (link.classList.contains('cta-primary')) return 'primary_cta';
    if (link.classList.contains('cta-secondary')) return 'secondary_cta';
    return 'internal_link';
  }

  /**
   * Détermination de la campagne UTM
   */
  getUTMCampaign(link) {
    const medium = this.getUTMMedium(link);
    const topic = this.getCurrentTopic();
    
    if (medium === 'content_bridge') return 'docs_to_commercial_bridge';
    if (medium === 'knowledge_bridge') return 'knowledge_to_conversion';
    if (medium === 'navigation') return 'cross_domain_navigation';
    if (topic) return `${topic}_documentation_conversion`;
    return 'docs_to_commercial';
  }

  /**
   * Inférence du contenu UTM basé sur le contexte
   */
  inferUTMContent(link) {
    // Basé sur le texte du lien
    const linkText = link.textContent.trim().toLowerCase();
    if (linkText.includes('essai') || linkText.includes('trial')) return 'trial_cta';
    if (linkText.includes('démo') || linkText.includes('demo')) return 'demo_request';
    if (linkText.includes('prix') || linkText.includes('tarif')) return 'pricing_inquiry';
    if (linkText.includes('solution')) return 'solution_overview';
    if (linkText.includes('support')) return 'support_request';
    
    // Basé sur l'URL de destination
    const url = link.href.toLowerCase();
    if (url.includes('/trial')) return 'trial_signup';
    if (url.includes('/demo')) return 'demo_booking';
    if (url.includes('/pricing')) return 'pricing_view';
    if (url.includes('/dazbox')) return 'dazbox_product';
    if (url.includes('/dazia')) return 'dazia_product';
    if (url.includes('/dazpay')) return 'dazpay_product';
    
    return 'generic_cross_link';
  }

  /**
   * Ajout des paramètres UTM à une URL
   */
  addUTMToURL(url, utmData) {
    try {
      const urlObj = new URL(url);
      
      Object.entries(utmData).forEach(([key, value]) => {
        if (value) urlObj.searchParams.set(key, value);
      });
      
      return urlObj.toString();
    } catch (e) {
      console.warn('Invalid URL for UTM tracking:', url);
      return url;
    }
  }

  /**
   * Tracking de page view avec contexte cross-domain
   */
  trackPageView() {
    const pageData = {
      page_title: document.title,
      page_path: window.location.pathname,
      domain: this.currentDomain,
      topic: this.getCurrentTopic(),
      has_commercial_cta: document.querySelectorAll('.commercial-link').length > 0,
      cross_links_count: document.querySelectorAll('a[href*="dazno.de"]').length
    };

    this.sendAnalyticsEvent('page_view_docs', pageData);
  }

  /**
   * Détection du topic/sujet actuel de la page
   */
  getCurrentTopic() {
    // Basé sur l'URL
    const path = window.location.pathname;
    if (path.includes('/lightning-network')) return 'lightning-network';
    if (path.includes('/bitcoin')) return 'bitcoin';
    if (path.includes('/dazbox')) return 'dazbox';
    if (path.includes('/devs')) return 'developers';
    if (path.includes('/rag')) return 'rag-ai';
    
    // Basé sur les métadonnées de page
    const metaTopic = document.querySelector('meta[name="topic"]');
    if (metaTopic) return metaTopic.content.toLowerCase().replace(/\s+/g, '-');
    
    return null;
  }

  /**
   * Détermination du stage de user journey
   */
  getUserJourneyStage() {
    const path = window.location.pathname;
    const hasCommercialIntent = document.querySelectorAll('.commercial-bridge').length > 0;
    
    if (path.includes('/getting-started') || path === '/') return 'awareness';
    if (path.includes('/guide') || path.includes('/tutorial')) return 'consideration';
    if (hasCommercialIntent) return 'evaluation';
    return 'education';
  }

  /**
   * Configuration du tracking de parcours utilisateur
   */
  setupUserJourneyTracking() {
    // Tracking du scroll depth
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Milestones de scroll
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          this.sendAnalyticsEvent('scroll_milestone', {
            scroll_depth: scrollPercent,
            page_path: window.location.pathname,
            topic: this.getCurrentTopic()
          });
        }
      }
    };

    // Time on page tracking
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      this.sendAnalyticsEvent('page_engagement', {
        time_on_page: timeOnPage,
        max_scroll_depth: maxScrollDepth,
        commercial_clicks: this.commercialClickCount || 0,
        page_path: window.location.pathname
      });
    });

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  /**
   * Envoi centralisé des événements analytics
   */
  sendAnalyticsEvent(eventName, eventData) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        ...eventData,
        timestamp: Date.now(),
        session_id: this.getSessionId()
      });
    }

    // Console pour debug en développement
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
      console.log(`📊 Analytics Event: ${eventName}`, eventData);
    }

    // Envoi vers endpoint custom si configuré
    if (window.DAZNODE_ANALYTICS_ENDPOINT) {
      fetch(window.DAZNODE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, data: eventData })
      }).catch(e => console.warn('Analytics endpoint failed:', e));
    }
  }

  /**
   * Génération/récupération d'un ID de session
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('daznode_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('daznode_session_id', sessionId);
    }
    return sessionId;
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.DazNodeAnalytics = new CrossDomainAnalytics();
});

// Export pour usage manuel si nécessaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CrossDomainAnalytics;
}