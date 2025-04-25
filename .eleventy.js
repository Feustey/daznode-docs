module.exports = function(eleventyConfig) {
  // Copie les dossiers d'assets statiques vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("assets");
  
  // Ajout du filtre date
  eleventyConfig.addFilter("date", function(value, format) {
    const date = value ? new Date(value) : new Date();
    
    if (format === "yyyy") {
      return date.getFullYear();
    }
    
    // Formats supplémentaires peuvent être ajoutés ici si nécessaire
    return date.toLocaleDateString("fr-FR");
  });
  
  // Traite les fichiers Markdown
  eleventyConfig.setTemplateFormats([
    "md",
    "njk",
    "html"
  ]);

  // Configuration de PageFind pour la recherche
  const { execSync } = require('child_process');
  eleventyConfig.on('eleventy.after', () => {
    console.log('Génération de l\'index de recherche avec PageFind...');
    execSync(`npx pagefind --source public --glob \"**/*.html\"`, { encoding: 'utf-8' });
    console.log('Index de recherche généré avec succès!');
  });

  // Configuration de la sortie
  return {
    dir: {
      input: ".",
      output: "public",
      includes: "_includes",
      layouts: "_layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}; 