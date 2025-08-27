// Sécurisation automatique des liens externes
(function() {
  'use strict';
  
  // Fonction pour sécuriser les liens externes
  function secureExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]:not([href*="docs.dazno.de"])');
    
    links.forEach(link => {
      // Ajouter les attributs de sécurité
      if (!link.hasAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
        const currentRel = link.getAttribute('rel') || '';
        link.setAttribute('rel', (currentRel + ' noopener noreferrer').trim());
      }
      
      // Ajouter target="_blank" pour les liens externes
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
      
      // Ajouter un indicateur visuel pour les liens externes
      if (!link.querySelector('.external-link-icon')) {
        link.innerHTML += '<span class="external-link-icon" aria-hidden="true"> ↗</span>';
      }
    });
  }
  
  // Fonction pour tracker les liens sortants (optionnel, pour analytics)
  function trackExternalLinks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="http"]:not([href*="docs.dazno.de"])');
      
      if (link) {
        // Log pour analytics si disponible
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': link.href,
            'transport_type': 'beacon'
          });
        }
      }
    });
  }
  
  // Exécuter au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', secureExternalLinks);
    document.addEventListener('DOMContentLoaded', trackExternalLinks);
  } else {
    secureExternalLinks();
    trackExternalLinks();
  }
  
  // Observer pour les contenus ajoutés dynamiquement
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        secureExternalLinks();
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();