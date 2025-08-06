const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const { minify } = require("html-minifier");
const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Shortcode pour les schémas JSON-LD
  eleventyConfig.addShortcode("schema", function(schema) {
    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  });

  // Copie les dossiers d'assets statiques vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // Configuration Markdown
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  })
  .use(markdownItAttrs);

  eleventyConfig.setLibrary("md", markdownLibrary);

  // Minification CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minification HTML en production
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(process.env.ELEVENTY_ENV === "production" && outputPath && outputPath.endsWith(".html")) {
      let minified = minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
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

  // Configuration de PageFind pour la recherche
  const { execSync } = require('child_process');
  eleventyConfig.on('eleventy.after', () => {
    if(process.env.ELEVENTY_ENV === "production") {
      try {
        console.log('Génération de l\'index de recherche avec PageFind...');
        execSync(`npx pagefind --site public --glob "**/*.html" --output-subdir pagefind`, { encoding: 'utf-8' });
        console.log('Index de recherche généré avec succès!');
      } catch (error) {
        console.error('Erreur lors de la génération de l\'index de recherche avec PageFind:', error);
      }
    }
  });

  // Configuration de la sortie et données globales
  eleventyConfig.addGlobalData("navigation", require("./_data/navigation-new.json"));
  eleventyConfig.addGlobalData("collaborativeNav", require("./_data/navigation-collaborative.json"));
  
  // Shortcodes pour la plateforme collaborative
  eleventyConfig.addShortcode("t4gBalance", function(amount) {
    return `<span class="t4g-balance"><span class="t4g-icon">💎</span>${amount.toLocaleString()} T4G</span>`;
  });
  
  eleventyConfig.addShortcode("expertiseBadge", function(domain, level) {
    const domainIcons = {
      'lightning': '⚡',
      'hardware': '🔧', 
      'security': '🛡️',
      'economics': '💰',
      'education': '🎓',
      'decentralization': '🌐',
      't4g_innovation': '🚀'
    };
    
    return `<span class="expertise-badge ${domain} ${level}">
      ${domainIcons[domain] || '🔹'} ${level}
    </span>`;
  });
  
  eleventyConfig.addShortcode("contributionReward", function(type, baseAmount, multipliers = {}) {
    let displayAmount = baseAmount;
    let multiplierText = '';
    
    if (multipliers.complexity) displayAmount *= multipliers.complexity;
    if (multipliers.impact) displayAmount *= multipliers.impact;
    
    if (Object.keys(multipliers).length > 0) {
      multiplierText = ` (×${Object.values(multipliers).reduce((a, b) => a * b, 1).toFixed(1)})`;
    }
    
    return `<div class="contribution-reward">
      <span class="reward-type">${type}</span>
      <span class="reward-amount">${Math.floor(displayAmount)} T4G${multiplierText}</span>
    </div>`;
  });

  return {
    dir: {
      input: ".",
      output: "public",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: [
      "md",
      "njk",
      "html"
    ]
  };
}; 