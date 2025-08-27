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

  // Shortcode pour FAQ Schema
  eleventyConfig.addShortcode("faqSchema", function(faqs) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    return `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
  });

  // Shortcode pour HowTo Schema
  eleventyConfig.addShortcode("howToSchema", function(title, description, steps, totalTime) {
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": title,
      "description": description,
      "totalTime": totalTime || "PT30M",
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        "url": step.url || "",
        "image": step.image || ""
      }))
    };
    return `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`;
  });

  // Shortcode pour Article Schema enrichi
  eleventyConfig.addShortcode("articleSchema", function(data) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "author": {
        "@type": "Person",
        "name": data.author || "DazNode Team"
      },
      "datePublished": data.date,
      "dateModified": data.modified || data.date,
      "publisher": {
        "@type": "Organization",
        "name": "DazNode Documentation",
        "logo": {
          "@type": "ImageObject",
          "url": "https://docs.dazno.de/assets/images/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": data.url
      }
    };
    return `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`;
  });

  // Shortcode pour images optimisées avec lazy loading et formats modernes
  eleventyConfig.addShortcode("image", function(src, alt, sizes, loading = "lazy") {
    const path = require('path');
    const basename = path.basename(src, path.extname(src));
    const dir = path.dirname(src);
    
    // Générer les chemins pour WebP et AVIF
    const webpSrc = `${dir}/${basename}.webp`;
    const avifSrc = `${dir}/${basename}.avif`;
    
    // Calculer les dimensions par défaut si non fournies
    const defaultSizes = sizes || "(max-width: 768px) 100vw, 50vw";
    
    return `<picture>
      <source type="image/avif" srcset="${avifSrc}" sizes="${defaultSizes}">
      <source type="image/webp" srcset="${webpSrc}" sizes="${defaultSizes}">
      <img src="${src}" alt="${alt}" loading="${loading}" decoding="async" sizes="${defaultSizes}">
    </picture>`;
  });

  // Shortcode pour images responsive avec dimensions
  eleventyConfig.addShortcode("responsiveImage", function(src, alt, width, height, loading = "lazy") {
    const path = require('path');
    const basename = path.basename(src, path.extname(src));
    const dir = path.dirname(src);
    
    // Générer srcset pour différentes résolutions
    const srcset1x = src;
    const srcset2x = `${dir}/${basename}@2x${path.extname(src)}`;
    const srcset3x = `${dir}/${basename}@3x${path.extname(src)}`;
    
    // Formats modernes
    const webpSrcset = `${dir}/${basename}.webp 1x, ${dir}/${basename}@2x.webp 2x`;
    const avifSrcset = `${dir}/${basename}.avif 1x, ${dir}/${basename}@2x.avif 2x`;
    
    return `<picture>
      <source type="image/avif" srcset="${avifSrcset}">
      <source type="image/webp" srcset="${webpSrcset}">
      <img 
        src="${srcset1x}" 
        srcset="${srcset1x} 1x, ${srcset2x} 2x, ${srcset3x} 3x"
        alt="${alt}" 
        width="${width}" 
        height="${height}" 
        loading="${loading}" 
        decoding="async"
      >
    </picture>`;
  });

  // Copie les dossiers d'assets statiques vers le répertoire de sortie
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Configuration Markdown
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
    permalinkBefore: false,
    permalinkSpace: false
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
    
    if (format === "yyyy-MM-dd") {
      return date.toISOString().split('T')[0];
    }
    
    // Formats supplémentaires peuvent être ajoutés ici si nécessaire
    return date.toLocaleDateString("fr-FR");
  });

  // Filtre split pour Nunjucks
  eleventyConfig.addFilter("split", function(str, delimiter) {
    if (typeof str !== "string") return [];
    return str.split(delimiter || "");
  });

  // Filtre reject pour filtrer les éléments vides
  eleventyConfig.addFilter("reject", function(arr, condition) {
    if (!Array.isArray(arr)) return arr;
    return arr.filter(item => {
      if (condition === "empty") {
        return item !== "" && item != null;
      }
      return item !== condition;
    });
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