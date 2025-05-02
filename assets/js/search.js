// Script de recherche Fuse.js pour la documentation Daznode

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  let fuse = null;
  let indexLoaded = false;
  let resultsContainer = null;

  // Crée le conteneur de résultats si besoin
  function ensureResultsContainer() {
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'search-results';
      searchInput.parentNode.appendChild(resultsContainer);
    }
  }

  // Charge l'index de recherche
  async function loadIndex() {
    if (indexLoaded) return;
    const res = await fetch('/search-index.json');
    const data = await res.json();
    fuse = new Fuse(data, {
      keys: ['title', 'excerpt'],
      threshold: 0.3,
      minMatchCharLength: 2
    });
    indexLoaded = true;
  }

  // Affiche les résultats
  function showResults(results) {
    ensureResultsContainer();
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">Aucun résultat</div>';
      return;
    }
    results.slice(0, 8).forEach(r => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `<a href="${r.item.url}"><strong>${r.item.title}</strong><br><span>${r.item.excerpt}</span></a>`;
      resultsContainer.appendChild(item);
    });
  }

  // Gère la recherche
  async function handleSearch(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    await loadIndex();
    const results = fuse.search(query);
    showResults(results);
  }

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSearch(e);
  });
}); 