document.addEventListener('DOMContentLoaded', function() {
  // Bouton pour replier/déplier le menu
  const toggleButton = document.getElementById('toggle-sidebar');
  const mainContainer = document.querySelector('.main-container');
  const sidebarState = localStorage.getItem('sidebar-state');
  
  // Appliquer l'état du menu depuis localStorage
  if (sidebarState === 'collapsed') {
    mainContainer.classList.add('sidebar-collapsed');
  }
  
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      mainContainer.classList.toggle('sidebar-collapsed');
      
      // Sauvegarder l'état dans localStorage
      const isCollapsed = mainContainer.classList.contains('sidebar-collapsed');
      localStorage.setItem('sidebar-state', isCollapsed ? 'collapsed' : 'expanded');
    });
  }
  
  // Ajouter la classe active au lien de navigation actuel
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-sublist li a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Si le chemin du lien est inclus dans le chemin actuel (pour gérer les sous-pages)
    if (currentPath.includes(linkPath) && linkPath !== '/') {
      link.classList.add('active');
      
      // Si c'est un sous-menu, on ouvre aussi le menu parent
      if (link.closest('.nav-sublist')) {
        const parentItem = link.closest('.nav-item');
        if (parentItem) {
          parentItem.classList.add('expanded');
        }
      }
    } else if (linkPath === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });
  
  // Permettre de plier/déplier les sections du menu
  const navItems = document.querySelectorAll('.nav-item > .nav-link');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      const hasSublist = this.nextElementSibling && this.nextElementSibling.classList.contains('nav-sublist');
      
      if (hasSublist) {
        e.preventDefault();
        const parentItem = this.parentElement;
        parentItem.classList.toggle('expanded');
      }
    });
  });

  // Gestion du menu mobile (hamburger)
  const mobileMenuButton = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (mobileMenuButton && sidebar) {
    mobileMenuButton.addEventListener('click', function() {
      const isOpen = sidebar.classList.toggle('open');
      // Mettre à jour les attributs ARIA
      mobileMenuButton.setAttribute('aria-expanded', isOpen);
      mobileMenuButton.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    // Fermer le menu si on clique en dehors (optionnel)
    document.addEventListener('click', function(e) {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !mobileMenuButton.contains(e.target)
      ) {
        sidebar.classList.remove('open');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'Ouvrir le menu');
      }
    });
  }
}); 