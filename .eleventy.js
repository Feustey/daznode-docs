const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Copie les dossiers d'assets statiques vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("assets/js");
  
  // Copie les fichiers de base vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  
  // Traitement CSS avec PostCSS et Tailwind
  eleventyConfig.addWatchTarget("./assets/css/");
  eleventyConfig.on("eleventy.before", async () => {
    const cssInput = fs.readFileSync('./assets/css/style.css', 'utf8');
    
    const cssOutput = await postcss([
      tailwindcss,
      autoprefixer
    ]).process(cssInput, {
      from: './assets/css/style.css',
      to: './public/style.css'
    });
    
    // Création du répertoire si nécessaire
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public', { recursive: true });
    }
    
    // Écriture du CSS transformé
    fs.writeFileSync('./public/style.css', cssOutput.css);
    console.log("CSS processed with Tailwind & PostCSS");
  });
  
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