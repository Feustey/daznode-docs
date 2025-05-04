module.exports = function(eleventyConfig) {
  // Copie les dossiers d'assets statiques vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("assets");
  
  // Copie le fichier robots.txt vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("robots.txt");
  
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

  // Génération de l'index de recherche Fuse.js
  eleventyConfig.addCollection("searchIndex", function(collectionApi) {
    return collectionApi.getAll().filter(item => item.inputPath.endsWith('.md')).map(item => ({
      title: item.data.title || '',
      url: item.url,
      excerpt: (item.template.frontMatter.content || '').slice(0, 300).replace(/\n/g, ' ')
    }));
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