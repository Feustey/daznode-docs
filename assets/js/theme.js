// Application immédiate du thème pour éviter le flash de contenu
(function() {
  // Vérifie le localStorage dès le début
  const savedTheme = localStorage.getItem('theme');
  
  // Applique le thème sauvegardé ou le thème par défaut
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    // Si pas de préférence enregistrée, utiliser les préférences système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('darkToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', function() {
    // Toggle de la classe dark sur html
    const isDark = document.documentElement.classList.toggle('dark');
    
    // On sauvegarde la préférence dans le localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // On change l'icône si nécessaire
    updateThemeToggle(isDark);
  });
  
  // Initialise l'icône au chargement
  const isDark = document.documentElement.classList.contains('dark');
  updateThemeToggle(isDark);
  
  // Écoute les changements de préférence système
  prefersDarkScheme.addEventListener('change', function(e) {
    const systemPrefersDark = e.matches;
    const currentTheme = localStorage.getItem('theme');
    
    // Si l'utilisateur n'a pas explicitement choisi de thème, suivre le système
    if (!currentTheme) {
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
        updateThemeToggle(true);
      } else {
        document.documentElement.classList.remove('dark');
        updateThemeToggle(false);
      }
    }
  });
  
  function updateThemeToggle(isDark) {
    // Optionnel: Mettre à jour le texte ou l'icône du bouton
    // Exemple:
    themeToggle.textContent = isDark ? 'Mode clair' : 'Mode sombre';
    
    // Alternative avec des icônes SVG:
    /*
    if (isDark) {
      themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>';
    } else {
      themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>';
    }
    */
  }
}); 