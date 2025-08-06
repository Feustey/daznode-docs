/**
 * Script de migration des URLs pour la restructuration de la navigation
 * Usage: node scripts/migration/restructure-urls.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Mapping des anciennes vers nouvelles URLs
const urlMappings = {
  // Documentation vers Découvrir
  '/getting-started/': '/premiers-pas/',
  '/getting-started/bitcoin.md': '/premiers-pas/bitcoin/',
  '/getting-started/introduction.md': '/premiers-pas/introduction/',
  '/getting-started/introduction-blockchain/': '/premiers-pas/blockchain/',
  '/getting-started/les-blockchains/': '/premiers-pas/blockchains/',

  // Lightning Network raccourci
  '/lightning-network/': '/lightning/',
  '/lightning-network/getting-started/': '/lightning/premiers-pas/',
  '/lightning-network/basics/': '/lightning/bases/',
  '/lightning-network/channels/': '/lightning/canaux/',

  // Solutions simplifiées
  '/solutions/dazbox/presentation/': '/dazbox/',
  '/solutions/dazbox/performance/': '/dazbox/performance/',
  '/solutions/dazbox/faq/': '/dazbox/faq/',
  '/solutions/dazia/overview/': '/dazia/',
  '/solutions/dazpay/overview/': '/dazpay/',

  // Guides consolidés
  '/devs/': '/guides/developpeurs/',
  '/devs/api.md': '/guides/developpeurs/api/',
  '/devs/mcp.md': '/guides/developpeurs/mcp/',
  '/devs/rgb.md': '/guides/developpeurs/rgb/',

  // Support centralisé
  '/dazbox/faq.md': '/support/dazbox/',
  '/support/': '/support/',

  // Autres
  '/glossary/': '/glossaire/',
  '/manage-data/': '/guides/gestion-donnees/',
  '/use-data/': '/guides/utilisation-donnees/',
  '/connect-data/': '/guides/connexion-donnees/',
  '/securisation.md': '/guides/securisation/',
  '/cas-dusage-daznode.md': '/dazbox/cas-usage/'
};

class URLMigrator {
  constructor() {
    this.brokenLinks = [];
    this.fixedLinks = [];
    this.createdRedirects = [];
  }

  /**
   * Génère le fichier de redirections Netlify
   */
  generateRedirects() {
    console.log('📝 Génération des redirections Netlify...');
    
    let redirects = '# Redirections automatiques - Migration UX\n\n';
    
    Object.entries(urlMappings).forEach(([oldUrl, newUrl]) => {
      redirects += `${oldUrl} ${newUrl} 301\n`;
      this.createdRedirects.push({ old: oldUrl, new: newUrl });
    });

    // Redirections spéciales pour rétrocompatibilité
    redirects += '\n# Redirections spécifiques\n';
    redirects += '/docs/* /guides/:splat 301\n';
    redirects += '/documentation/* /guides/:splat 301\n';
    redirects += '/.well-known/* /.well-known/:splat 200\n';

    fs.writeFileSync('_redirects', redirects);
    console.log(`✅ ${this.createdRedirects.length} redirections créées dans _redirects`);
  }

  /**
   * Met à jour les liens internes dans tous les fichiers Markdown
   */
  updateInternalLinks() {
    console.log('🔗 Mise à jour des liens internes...');
    
    const markdownFiles = glob.sync('**/*.md', {
      ignore: ['node_modules/**', 'public/**', '_site/**']
    });

    markdownFiles.forEach(file => {
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Recherche et remplacement des liens markdown [text](url)
        content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
          if (urlMappings[url]) {
            console.log(`  📄 ${file}: ${url} → ${urlMappings[url]}`);
            this.fixedLinks.push({ file, old: url, new: urlMappings[url] });
            modified = true;
            return `[${text}](${urlMappings[url]})`;
          }
          return match;
        });

        // Recherche des URLs relatives commençant par /
        Object.entries(urlMappings).forEach(([oldUrl, newUrl]) => {
          if (content.includes(oldUrl)) {
            content = content.replace(new RegExp(oldUrl, 'g'), newUrl);
            modified = true;
            this.fixedLinks.push({ file, old: oldUrl, new: newUrl });
          }
        });

        if (modified) {
          fs.writeFileSync(file, content);
        }
      } catch (error) {
        console.error(`❌ Erreur lors du traitement de ${file}:`, error.message);
      }
    });

    console.log(`✅ ${this.fixedLinks.length} liens mis à jour`);
  }

  /**
   * Audit des liens brisés
   */
  auditBrokenLinks() {
    console.log('🔍 Audit des liens brisés...');
    
    const markdownFiles = glob.sync('**/*.md', {
      ignore: ['node_modules/**', 'public/**', '_site/**']
    });

    markdownFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Extraire tous les liens markdown [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        
        while ((match = linkRegex.exec(content)) !== null) {
          const [fullMatch, text, url] = match;
          
          // Vérifier uniquement les liens internes (commençant par /)
          if (url.startsWith('/') && !url.startsWith('//')) {
            // Construire le chemin du fichier cible
            let targetPath = url.endsWith('/') ? `${url}index.md` : `${url}.md`;
            targetPath = targetPath.replace(/^\//, ''); // Enlever le / initial
            
            if (!fs.existsSync(targetPath)) {
              // Vérifier aussi sans .md
              const altPath = url.replace(/^\//, '');
              if (!fs.existsSync(altPath) && !fs.existsSync(`${altPath}/index.md`)) {
                this.brokenLinks.push({
                  file,
                  text,
                  url,
                  line: this.getLineNumber(content, fullMatch)
                });
              }
            }
          }
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'audit de ${file}:`, error.message);
      }
    });

    console.log(`🔍 ${this.brokenLinks.length} liens potentiellement brisés trouvés`);
    
    if (this.brokenLinks.length > 0) {
      this.generateBrokenLinksReport();
    }
  }

  /**
   * Trouve le numéro de ligne d'un texte dans un contenu
   */
  getLineNumber(content, searchText) {
    const lines = content.substring(0, content.indexOf(searchText)).split('\n');
    return lines.length;
  }

  /**
   * Génère un rapport des liens brisés
   */
  generateBrokenLinksReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalBrokenLinks: this.brokenLinks.length,
      brokenLinks: this.brokenLinks,
      suggestions: this.generateSuggestions()
    };

    fs.writeFileSync('scripts/migration/broken-links-report.json', JSON.stringify(report, null, 2));
    
    // Rapport lisible
    let readableReport = `# Rapport des Liens Brisés\n\nGénéré le: ${new Date().toLocaleString('fr-FR')}\n\n`;
    readableReport += `**Total**: ${this.brokenLinks.length} liens brisés\n\n`;

    this.brokenLinks.forEach((link, index) => {
      readableReport += `## ${index + 1}. ${link.file}:${link.line}\n`;
      readableReport += `- **Texte**: ${link.text}\n`;
      readableReport += `- **URL**: ${link.url}\n`;
      readableReport += `- **Suggestion**: ${this.suggestFix(link.url)}\n\n`;
    });

    fs.writeFileSync('scripts/migration/broken-links-report.md', readableReport);
    console.log('📊 Rapport généré: scripts/migration/broken-links-report.md');
  }

  /**
   * Suggère une correction pour une URL brisée
   */
  suggestFix(brokenUrl) {
    // Recherche de correspondances approximatives
    const allUrls = Object.values(urlMappings);
    
    for (const url of allUrls) {
      if (url.includes(brokenUrl.split('/').pop()) || brokenUrl.includes(url.split('/').pop())) {
        return `Peut-être: ${url}`;
      }
    }
    
    return 'Aucune suggestion automatique';
  }

  /**
   * Génère des suggestions d'amélioration
   */
  generateSuggestions() {
    return [
      'Vérifier les liens externes régulièrement',
      'Utiliser des liens relatifs quand possible',
      'Implémenter un système de vérification automatique',
      'Créer des pages de redirection pour les URLs importantes'
    ];
  }

  /**
   * Met à jour la navigation dans .eleventy.js
   */
  updateEleventyConfig() {
    console.log('⚙️ Mise à jour de la configuration Eleventy...');
    
    try {
      const configPath = '.eleventy.js';
      let content = fs.readFileSync(configPath, 'utf8');
      
      // Remplacer la référence à navigation.json par navigation-new.json
      content = content.replace(
        'require("./_data/navigation.json")',
        'require("./_data/navigation-new.json")'
      );
      
      fs.writeFileSync(configPath, content);
      console.log('✅ Configuration Eleventy mise à jour');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de .eleventy.js:', error.message);
    }
  }

  /**
   * Lance la migration complète
   */
  async run() {
    console.log('🚀 Début de la migration UX...\n');
    
    // Créer le dossier de scripts s'il n'existe pas
    if (!fs.existsSync('scripts/migration')) {
      fs.mkdirSync('scripts/migration', { recursive: true });
    }

    try {
      this.generateRedirects();
      this.updateInternalLinks();
      this.auditBrokenLinks();
      this.updateEleventyConfig();
      
      console.log('\n✅ Migration terminée avec succès!');
      console.log(`📊 Statistiques:`);
      console.log(`   - ${this.createdRedirects.length} redirections créées`);
      console.log(`   - ${this.fixedLinks.length} liens mis à jour`);
      console.log(`   - ${this.brokenLinks.length} liens à vérifier manuellement`);
      
      if (this.brokenLinks.length > 0) {
        console.log('\n⚠️ Veuillez consulter le rapport des liens brisés:');
        console.log('   scripts/migration/broken-links-report.md');
      }
      
    } catch (error) {
      console.error('❌ Erreur durant la migration:', error);
      process.exit(1);
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const migrator = new URLMigrator();
  migrator.run();
}

module.exports = URLMigrator;