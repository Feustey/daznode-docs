const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

// Répertoire de sortie
const outputDir = 'public';

// Éléments essentiels à vérifier
const essentialElements = {
  css: 'link[rel="stylesheet"][href="/style.css"]',
  sidebar: 'aside#sidebar',
  header: 'header',
  footer: 'footer',
  mainContent: 'main'
};

// Vérifier un fichier HTML
function checkHtmlFile(filePath) {
  const relativePath = path.relative(outputDir, filePath);
  const url = '/' + relativePath.replace(/index.html$/, '');
  
  console.log(`\nVérification de ${relativePath} (URL: ${url})`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    let allPresent = true;
    
    // Vérifier chaque élément essentiel
    for (const [name, selector] of Object.entries(essentialElements)) {
      const exists = $(selector).length > 0;
      console.log(`  - ${name}: ${exists ? '✅ Présent' : '❌ Manquant'}`);
      
      if (!exists) {
        allPresent = false;
      }
    }
    
    return {
      url,
      allPresent,
      issues: Object.entries(essentialElements)
        .filter(([_, selector]) => $(selector).length === 0)
        .map(([name]) => name)
    };
  } catch (error) {
    console.error(`  ❌ Erreur lors de la lecture de ${filePath}:`, error.message);
    return {
      url,
      allPresent: false,
      issues: ['error_reading_file']
    };
  }
}

// Trouver tous les fichiers HTML générés
console.log('Recherche des fichiers HTML...');
const htmlFiles = glob.sync(`${outputDir}/**/*.html`);
console.log(`${htmlFiles.length} fichiers HTML trouvés.`);

// Vérifier chaque fichier
const results = htmlFiles.map(checkHtmlFile);

// Afficher le résumé
const pagesWithIssues = results.filter(r => !r.allPresent);

console.log('\n===== RÉSUMÉ =====');
console.log(`Total de pages: ${results.length}`);
console.log(`Pages correctes: ${results.length - pagesWithIssues.length}`);
console.log(`Pages avec problèmes: ${pagesWithIssues.length}`);

if (pagesWithIssues.length > 0) {
  console.log('\nPages à corriger:');
  pagesWithIssues.forEach(page => {
    console.log(`- ${page.url} (Problèmes: ${page.issues.join(', ')})`);
  });
}

// Stocker les résultats dans un fichier JSON
const reportPath = path.join(outputDir, 'html-check-report.json');
fs.writeFileSync(
  reportPath,
  JSON.stringify({
    total: results.length,
    withIssues: pagesWithIssues.length,
    pages: results
  }, null, 2)
);

console.log(`\nRapport enregistré dans ${reportPath}`); 