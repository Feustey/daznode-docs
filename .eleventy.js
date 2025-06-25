const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
  // Optimisation CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
  
  // Minification HTML simple (sans bibliothèque externe problématique)
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath && outputPath.endsWith(".html") ) {
      return content
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
    }
    return content;
  });
  
  // Configuration Markdown avec anchors
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#",
    }),
    level: [1,2,3,4],
    slugify: eleventyConfig.getFilter("slug")
  });
  eleventyConfig.setLibrary("md", markdownLibrary);
  
  // Copie les dossiers d'assets statiques vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("google7a1c0391a3642e79.html");
  
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
    try {
      console.log('Génération de l\'index de recherche avec PageFind...');
      execSync(`npx pagefind --site public --glob "**/*.html" --output-subdir pagefind`, { encoding: 'utf-8' });
      console.log('Index de recherche généré avec succès!');
    } catch (error) {
      console.error('Erreur lors de la génération de l\'index de recherche avec PageFind:', error);
    }
  });

  // Configuration de la sortie
  eleventyConfig.addGlobalData("navigation", require("./_data/navigation.json"));

  return {
    dir: {
      input: ".",
      output: "public",
      includes: "_includes",
      layouts: "_layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
}; 