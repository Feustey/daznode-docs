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
  
  // Boutons pour le menu mobile
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('main');
  const overlay = document.createElement('div');
  
  // Fonction pour appliquer les classes et structure de lien avec indicateur sur tous les liens
  function enhanceMenuLinks() {
    const allLinks = document.querySelectorAll('#sidebar a:not(.enhanced)');
    allLinks.forEach(link => {
      // Ajouter les classes pour le groupe et la position relative
      link.classList.add('relative', 'group', 'enhanced');
      
      // Vérifier si l'indicateur n'existe pas déjà
      if (!link.querySelector('.active-indicator')) {
        // Créer l'indicateur de page active
        const indicator = document.createElement('span');
        indicator.className = 'active-indicator absolute left-0 h-full w-1 bg-blue-600 dark:bg-blue-400 rounded-r transition-opacity opacity-0 group-[.active]:opacity-100';
        
        // Ajuster la position en fonction du niveau de profondeur
        if (link.closest('[id$="-content"]')) {
          indicator.classList.add('-ml-1');
        } else {
          indicator.classList.add('-ml-2');
        }
        
        // Ajouter à la fin du lien
        link.appendChild(indicator);
      }
    });
  }
  
  // Exécuter l'amélioration des liens
  enhanceMenuLinks();
  
  // Configuration de l'overlay pour mobile
  overlay.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-40', 'hidden');
  document.body.appendChild(overlay);
  
  // Fonction pour ouvrir le menu mobile
  function openMobileMenu() {
    sidebar.classList.remove('hidden');
    sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'slide-in');
    overlay.classList.remove('hidden');
    overlay.classList.add('mobile-overlay');
    document.body.classList.add('overflow-hidden');
  }
  
  // Fonction pour fermer le menu mobile
  function closeMobileMenu() {
    sidebar.classList.add('slide-out');
    overlay.classList.remove('mobile-overlay');
    
    // Attendre que l'animation se termine avant de cacher complètement
    setTimeout(() => {
      sidebar.classList.add('hidden');
      sidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', 'slide-in', 'slide-out');
      overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }
  
  // Attacher les écouteurs d'événements
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
  }
  
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileMenu);
  }
  
  // Fermer le menu quand on clique sur l'overlay
  overlay.addEventListener('click', closeMobileMenu);
  
  // Ajouter aussi la fermeture du menu quand on redimensionne la fenêtre vers desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) { // 768px est le breakpoint md de Tailwind
      closeMobileMenu();
      sidebar.classList.remove('hidden');
      sidebar.classList.add('md:block');
    }
  });
  
  // Restaurer l'état des sections depuis localStorage
  function restoreSectionStates() {
    const openSections = JSON.parse(localStorage.getItem('openSections') || '[]');
    openSections.forEach(sectionId => {
      const content = document.getElementById(sectionId);
      const toggle = document.querySelector(`[aria-controls="${sectionId}"]`);
      
      if (content && toggle) {
        content.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Animer l'icône de rotation
        const icon = toggle.querySelector('svg:last-child');
        if (icon) {
          icon.classList.add('transform', 'rotate-180');
        }
      }
    });
  }
  
  // Sauvegarder l'état des sections ouvertes
  function saveSectionStates() {
    const openSections = [];
    document.querySelectorAll('.section-toggle[aria-expanded="true"]').forEach(toggle => {
      const contentId = toggle.getAttribute('aria-controls');
      if (contentId) {
        openSections.push(contentId);
      }
    });
    
    localStorage.setItem('openSections', JSON.stringify(openSections));
  }
  
  // Ajouter la classe active au lien de navigation actuel avec une meilleure mise en évidence
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('#sidebar a');
  let activeSection = null;
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Si le chemin du lien correspond exactement au chemin actuel ou est inclus dans le chemin actuel
    if ((linkPath && currentPath === linkPath) || 
        (linkPath && currentPath.includes(linkPath) && linkPath !== '/' && currentPath !== '/')) {
      
      // Mettre en évidence le lien actif avec les nouveaux indicateurs
      link.classList.add('active', 'text-blue-600', 'dark:text-blue-400');
      
      // Marquer la section parente comme active
      const parentSection = link.closest('section[data-section]');
      if (parentSection) {
        activeSection = parentSection.getAttribute('data-section');
        const sectionToggle = parentSection.querySelector('.section-toggle');
        if (sectionToggle) {
          // Ajouter une classe d'emphase au toggle parent
          sectionToggle.classList.add('font-medium', 'text-blue-600', 'dark:text-blue-400');
          
          // Afficher cette section
          const contentId = sectionToggle.getAttribute('aria-controls');
          const content = document.getElementById(contentId);
          if (content) {
            content.classList.remove('hidden');
            sectionToggle.setAttribute('aria-expanded', 'true');
            
            // Ajouter la rotation à l'icône
            const icon = sectionToggle.querySelector('svg:last-child');
            if (icon) {
              icon.classList.add('transform', 'rotate-180');
            }
          }
        }
      }
    } else if (linkPath === '/' && (currentPath === '/' || currentPath === '')) {
      link.classList.add('active', 'text-blue-600', 'dark:text-blue-400');
    }
  });
  
  // S'assurer que les liens sont bien cliquables et fermer le menu mobile en cliquant sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.stopPropagation(); // Empêcher que l'événement atteigne le parent (bouton toggle)
      
      // Fermer le menu mobile si on est sur mobile
      if (window.innerWidth < 768) {
        setTimeout(closeMobileMenu, 100); // Léger délai pour que le lien soit bien cliqué
      }
    });
  });
  
  // Gestion des sections dépliables dans la navigation
  const sectionToggles = document.querySelectorAll('.section-toggle');
  
  sectionToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Empêcher la propagation vers d'autres éléments
      
      const contentId = this.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      if (content) {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('hidden');
        
        // Icône de rotation pour les accordéons
        const icon = this.querySelector('svg:last-child');
        if (icon) {
          icon.classList.toggle('transform');
          icon.classList.toggle('rotate-180');
        }
        
        // Sauvegarder l'état actuel
        saveSectionStates();
      }
    });
  });
  
  // Restaurer l'état des sections après avoir configuré les écouteurs d'événements
  restoreSectionStates();
  
  // S'assurer que tous les liens ont les indicateurs, même après manipulation du DOM
  enhanceMenuLinks();
  
  // Si on a un lien actif, s'assurer que sa section soit ouverte
  if (activeSection) {
    const section = document.querySelector(`section[data-section="${activeSection}"]`);
    if (section) {
      const toggle = section.querySelector('.section-toggle');
      const contentId = toggle?.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      
      if (toggle && content) {
        content.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        
        const icon = toggle.querySelector('svg:last-child');
        if (icon) {
          icon.classList.add('transform', 'rotate-180');
        }
        
        // Sauvegarder l'état mis à jour
        saveSectionStates();
      }
    }
  }
  
  // Fonction pour scroller vers un élément avec offset pour le header
  function scrollToElement(element) {
    if (!element || window.innerWidth < 768) return; // Ne pas scroller sur mobile
    
    const headerHeight = 64;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // Scroll automatique vers le lien actif uniquement dans la sidebar, pas dans le contenu principal
  const activeLink = document.querySelector('#sidebar .active');
  if (activeLink && window.innerWidth >= 768) { // Ajouter une condition pour desktop uniquement
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement) {
      // Faire défiler la sidebar vers le lien actif, pas la page entière
      setTimeout(() => {
        sidebarElement.scrollTop = activeLink.offsetTop - 100;
      }, 300);
    }
  }
  
  // Capture des clics sur les liens internes pour scroll avec offset du header
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        scrollToElement(targetElement);
      }
    });
  });

  // Barre de progression du défilement 
  window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // Gestionnaire pour le menu mobile dédié
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  
  if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
    // Ouvrir le menu
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.classList.add('overflow-hidden');
    });
    
    // Fermer le menu
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('overflow-hidden');
    });
    
    // Marquer le lien actif - utiliser la variable existante au lieu d'en déclarer une nouvelle
    // Ne pas redéclarer currentPath, utiliser celle qui existe déjà
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
}); 