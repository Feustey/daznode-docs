/**
 * Système de navigation amélioré avec personnalisation et adaptation
 * Intègre les recommandations UX de l'audit
 */

class EnhancedNavigation {
  constructor() {
    this.userProfile = this.loadUserProfile();
    this.currentPath = window.location.pathname;
    this.searchHistory = this.loadSearchHistory();
    this.navigationData = null;
    this.init();
  }

  async init() {
    // Charger les données de navigation
    await this.loadNavigationData();
    
    // Personnaliser la navigation selon le profil
    this.personalizeNavigation();
    
    // Initialiser les composants
    this.initSearchBar();
    this.initProgressBar();
    this.initQuickAccess();
    this.initMobileMenu();
    this.initTooltips();
    
    // Tracker la navigation
    this.trackNavigation();
  }

  async loadNavigationData() {
    try {
      const response = await fetch('/_data/navigation-unified.json');
      this.navigationData = await response.json();
    } catch (error) {
      console.error('Erreur chargement navigation:', error);
    }
  }

  loadUserProfile() {
    const stored = localStorage.getItem('daznode_user_profile');
    return stored ? JSON.parse(stored) : {
      level: 'beginner',
      goals: [],
      expertise: [],
      hasNode: false,
      completedPaths: [],
      t4gBalance: 0
    };
  }

  loadSearchHistory() {
    const stored = localStorage.getItem('daznode_search_history');
    return stored ? JSON.parse(stored) : [];
  }

  personalizeNavigation() {
    const nav = document.querySelector('.main-navigation');
    if (!nav || !this.navigationData) return;

    // Filtrer et ordonner les éléments selon le profil utilisateur
    const personalizedItems = this.filterNavigationItems(this.navigationData.main);
    
    // Reconstruire le menu
    this.renderNavigation(nav, personalizedItems);
    
    // Ajouter les indicateurs visuels
    this.addVisualIndicators();
  }

  filterNavigationItems(items) {
    return items.map(item => {
      // Vérifier si l'item est pertinent pour l'utilisateur
      const relevance = this.calculateRelevance(item);
      
      // Filtrer récursivement les enfants
      if (item.children) {
        item.children = this.filterNavigationItems(item.children);
      }
      
      return { ...item, relevance };
    })
    .filter(item => item.alwaysVisible || item.relevance > 0.3)
    .sort((a, b) => {
      // Prioriser selon la pertinence
      if (a.alwaysVisible) return -1;
      if (b.alwaysVisible) return 1;
      return b.relevance - a.relevance;
    });
  }

  calculateRelevance(item) {
    let score = 0.5; // Score de base
    
    // Augmenter le score si correspond au niveau
    if (item.userLevel === this.userProfile.level) {
      score += 0.3;
    }
    
    // Augmenter si correspond aux objectifs
    if (item.id && this.userProfile.goals.includes(item.id)) {
      score += 0.2;
    }
    
    // Augmenter si correspond à l'expertise
    if (item.expertiseDomain && this.userProfile.expertise.includes(item.expertiseDomain)) {
      score += 0.4;
    }
    
    // Bonus si l'utilisateur a un nœud
    if (this.userProfile.hasNode && item.id === 'technical') {
      score += 0.3;
    }
    
    return Math.min(score, 1);
  }

  renderNavigation(container, items) {
    const nav = document.createElement('nav');
    nav.className = 'enhanced-navigation';
    
    const ul = document.createElement('ul');
    ul.className = 'nav-list';
    
    items.forEach(item => {
      const li = this.createNavItem(item);
      ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    container.innerHTML = '';
    container.appendChild(nav);
  }

  createNavItem(item) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const a = document.createElement('a');
    a.href = item.url;
    a.className = 'nav-link';
    
    // Ajouter l'icône
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'nav-icon';
      icon.textContent = item.icon;
      a.appendChild(icon);
    }
    
    // Ajouter le titre
    const title = document.createElement('span');
    title.className = 'nav-title';
    title.textContent = item.title;
    a.appendChild(title);
    
    // Ajouter les badges
    if (item.badge) {
      const badge = document.createElement('span');
      badge.className = `nav-badge badge-${item.badge.toLowerCase()}`;
      badge.textContent = item.badge;
      a.appendChild(badge);
    }
    
    // Ajouter l'indicateur de récompense
    if (item.reward) {
      const reward = document.createElement('span');
      reward.className = 'nav-reward';
      reward.textContent = `+${item.reward} T4G`;
      a.appendChild(reward);
    }
    
    li.appendChild(a);
    
    // Ajouter les sous-menus
    if (item.children && item.children.length > 0) {
      const subUl = document.createElement('ul');
      subUl.className = 'nav-sublist';
      
      item.children.forEach(child => {
        const subLi = this.createNavItem(child);
        subUl.appendChild(subLi);
      });
      
      li.appendChild(subUl);
      li.classList.add('has-children');
    }
    
    return li;
  }

  addVisualIndicators() {
    // Marquer l'élément actif
    const activeLink = document.querySelector(`a[href="${this.currentPath}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      
      // Ouvrir les parents si nécessaire
      let parent = activeLink.closest('.nav-sublist');
      while (parent) {
        parent.classList.add('open');
        parent = parent.parentElement.closest('.nav-sublist');
      }
    }
    
    // Ajouter des indicateurs de nouveauté
    this.markNewContent();
    
    // Ajouter des indicateurs de progression
    this.showProgress();
  }

  markNewContent() {
    // Marquer le contenu ajouté dans les 7 derniers jours
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const lastVisit = localStorage.getItem('daznode_last_visit');
    
    if (lastVisit && new Date(lastVisit).getTime() < sevenDaysAgo) {
      document.querySelectorAll('[data-created]').forEach(el => {
        const created = new Date(el.dataset.created).getTime();
        if (created > new Date(lastVisit).getTime()) {
          el.classList.add('new-content');
        }
      });
    }
  }

  showProgress() {
    // Calculer et afficher la progression globale
    const totalPaths = document.querySelectorAll('[data-path]').length;
    const completedPaths = this.userProfile.completedPaths.length;
    const progress = (completedPaths / totalPaths) * 100;
    
    this.updateProgressBar(progress);
  }

  initSearchBar() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    // Initialiser l'autocomplétion
    const autocomplete = new SearchAutocomplete(searchInput, {
      data: this.getSearchData(),
      onSelect: (item) => {
        window.location.href = item.url;
      }
    });
    
    // Filtrer selon le niveau
    autocomplete.setFilter((item, query) => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = !item.userLevel || item.userLevel === this.userProfile.level || 
                          item.userLevel === 'all';
      return matchesQuery && matchesLevel;
    });
    
    // Sauvegarder l'historique
    searchInput.addEventListener('search', (e) => {
      this.addToSearchHistory(e.target.value);
    });
  }

  getSearchData() {
    const data = [];
    
    const extractItems = (items, parent = '') => {
      items.forEach(item => {
        data.push({
          title: item.title,
          url: item.url,
          category: parent,
          description: item.description,
          userLevel: item.userLevel,
          reward: item.reward
        });
        
        if (item.children) {
          extractItems(item.children, item.title);
        }
      });
    };
    
    if (this.navigationData) {
      extractItems(this.navigationData.main);
    }
    
    return data;
  }

  addToSearchHistory(query) {
    if (!query) return;
    
    this.searchHistory = this.searchHistory.filter(q => q !== query);
    this.searchHistory.unshift(query);
    this.searchHistory = this.searchHistory.slice(0, 10); // Garder les 10 derniers
    
    localStorage.setItem('daznode_search_history', JSON.stringify(this.searchHistory));
  }

  initProgressBar() {
    // Créer la barre de progression globale
    const progressContainer = document.createElement('div');
    progressContainer.className = 'global-progress';
    progressContainer.innerHTML = `
      <div class="progress-info">
        <span class="progress-label">Votre progression</span>
        <span class="progress-percentage">0%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-rewards">
        <span class="t4g-balance">${this.userProfile.t4gBalance} T4G</span>
        <span class="next-reward">Prochain: +50 T4G</span>
      </div>
    `;
    
    const header = document.querySelector('header');
    if (header) {
      header.appendChild(progressContainer);
    }
  }

  updateProgressBar(percentage) {
    const fill = document.querySelector('.progress-fill');
    const label = document.querySelector('.progress-percentage');
    
    if (fill) fill.style.width = `${percentage}%`;
    if (label) label.textContent = `${Math.round(percentage)}%`;
  }

  initQuickAccess() {
    // Créer le panneau d'accès rapide
    const quickAccess = document.createElement('div');
    quickAccess.className = 'quick-access-panel';
    quickAccess.innerHTML = `
      <button class="quick-access-toggle" aria-label="Accès rapide">
        <span class="icon">⚡</span>
      </button>
      <div class="quick-access-menu">
        <h3>Accès rapide</h3>
        <div class="quick-items">
          ${this.getQuickAccessItems().map(item => `
            <a href="${item.url}" class="quick-item">
              <span class="quick-icon">${item.icon}</span>
              <span class="quick-title">${item.title}</span>
              ${item.badge ? `<span class="quick-badge">${item.badge}</span>` : ''}
            </a>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(quickAccess);
    
    // Toggle menu
    const toggle = quickAccess.querySelector('.quick-access-toggle');
    const menu = quickAccess.querySelector('.quick-access-menu');
    
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    
    // Fermer en cliquant dehors
    document.addEventListener('click', (e) => {
      if (!quickAccess.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  getQuickAccessItems() {
    // Items personnalisés selon le profil
    const items = [];
    
    if (this.userProfile.level === 'beginner') {
      items.push({
        icon: '📚',
        title: 'Guide débutant',
        url: '/learn/fundamentals/',
        badge: 'NEW'
      });
    }
    
    if (this.userProfile.hasNode) {
      items.push({
        icon: '📊',
        title: 'Dashboard nœud',
        url: '/technical/tools/node-monitor/'
      });
    }
    
    items.push({
      icon: '💰',
      title: 'Mes récompenses',
      url: '/community/profile/#rewards'
    });
    
    items.push({
      icon: '🏆',
      title: 'Challenges',
      url: '/community/challenges/'
    });
    
    return items;
  }

  initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!mobileToggle || !sidebar) return;
    
    // Améliorer le menu mobile avec gestes
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const sidebar = document.querySelector('.sidebar');
    
    if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe vers la droite - ouvrir le menu
      sidebar.classList.add('open');
      document.body.classList.add('menu-open');
    } else if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe vers la gauche - fermer le menu
      sidebar.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  }

  initTooltips() {
    // Ajouter des tooltips contextuels
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = el.dataset.tooltip;
      
      el.addEventListener('mouseenter', () => {
        document.body.appendChild(tooltip);
        const rect = el.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        tooltip.classList.add('visible');
      });
      
      el.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        setTimeout(() => tooltip.remove(), 200);
      });
    });
  }

  trackNavigation() {
    // Enregistrer la visite
    localStorage.setItem('daznode_last_visit', new Date().toISOString());
    
    // Tracker les pages visitées
    const visitedPages = JSON.parse(localStorage.getItem('daznode_visited_pages') || '[]');
    if (!visitedPages.includes(this.currentPath)) {
      visitedPages.push(this.currentPath);
      localStorage.setItem('daznode_visited_pages', JSON.stringify(visitedPages));
    }
    
    // Analytics
    if (window.analytics) {
      window.analytics.track('Page View', {
        path: this.currentPath,
        userLevel: this.userProfile.level,
        hasNode: this.userProfile.hasNode
      });
    }
  }
}

// Classe pour l'autocomplétion de recherche
class SearchAutocomplete {
  constructor(input, options) {
    this.input = input;
    this.options = options;
    this.currentFocus = -1;
    this.init();
  }

  init() {
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Fermer en cliquant dehors
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target)) {
        this.closeAllLists();
      }
    });
  }

  handleInput() {
    const value = this.input.value;
    this.closeAllLists();
    
    if (!value) return;
    
    const list = document.createElement('div');
    list.className = 'autocomplete-items';
    this.input.parentNode.appendChild(list);
    
    let matches = 0;
    this.options.data.forEach(item => {
      if (this.options.filter && !this.options.filter(item, value)) return;
      if (!item.title.toLowerCase().includes(value.toLowerCase())) return;
      
      matches++;
      if (matches > 10) return; // Limiter à 10 résultats
      
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.innerHTML = `
        <span class="item-title">${this.highlight(item.title, value)}</span>
        ${item.category ? `<span class="item-category">${item.category}</span>` : ''}
        ${item.reward ? `<span class="item-reward">+${item.reward} T4G</span>` : ''}
      `;
      
      div.addEventListener('click', () => {
        this.input.value = item.title;
        this.closeAllLists();
        if (this.options.onSelect) {
          this.options.onSelect(item);
        }
      });
      
      list.appendChild(div);
    });
    
    if (matches === 0) {
      const div = document.createElement('div');
      div.className = 'autocomplete-no-results';
      div.textContent = 'Aucun résultat trouvé';
      list.appendChild(div);
    }
  }

  highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  handleKeydown(e) {
    const items = document.querySelectorAll('.autocomplete-item');
    
    if (e.keyCode === 40) { // Flèche bas
      e.preventDefault();
      this.currentFocus++;
      this.addActive(items);
    } else if (e.keyCode === 38) { // Flèche haut
      e.preventDefault();
      this.currentFocus--;
      this.addActive(items);
    } else if (e.keyCode === 13) { // Entrée
      e.preventDefault();
      if (this.currentFocus > -1 && items[this.currentFocus]) {
        items[this.currentFocus].click();
      }
    } else if (e.keyCode === 27) { // Échap
      this.closeAllLists();
    }
  }

  addActive(items) {
    if (!items) return;
    
    this.removeActive(items);
    
    if (this.currentFocus >= items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = items.length - 1;
    
    items[this.currentFocus].classList.add('autocomplete-active');
  }

  removeActive(items) {
    items.forEach(item => item.classList.remove('autocomplete-active'));
  }

  closeAllLists() {
    const items = document.querySelectorAll('.autocomplete-items');
    items.forEach(item => item.remove());
    this.currentFocus = -1;
  }

  setFilter(filterFunc) {
    this.options.filter = filterFunc;
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedNavigation();
});