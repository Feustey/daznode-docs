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
    // Ne rien faire, car les icônes sont déjà gérées par les classes CSS (hidden/block)
    // Les icônes sont automatiquement masquées/affichées par les classes Tailwind:
    // - class="h-5 w-5 hidden dark:block" pour l'icône du soleil (visible en mode sombre)
    // - class="h-5 w-5 block dark:hidden" pour l'icône de la lune (visible en mode clair)
  }
}); 