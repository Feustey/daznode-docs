const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Génère un fichier sitemap.xml pour le site
 */
function generateSitemap() {
  console.log('Génération du sitemap...');
  
  // URL de base du site
  const baseUrl = 'https://daznode-docs.netlify.app';
  
  // Date actuelle au format ISO pour la dernière modification
  const lastMod = new Date().toISOString();
  
  // En-tête du fichier XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Trouver tous les fichiers HTML dans le répertoire public
  const htmlFiles = glob.sync('public/**/*.html');
  
  // Pour chaque fichier HTML, créer une entrée dans le sitemap
  htmlFiles.forEach(file => {
    // Convertir le chemin du fichier en URL relative
    let urlPath = file.replace('public/', '');
    
    // Supprimer index.html des URLs
    urlPath = urlPath.replace('index.html', '');
    
    // Ajouter un slash à la fin si pas présent
    if (!urlPath.endsWith('/') && urlPath !== '') {
      urlPath += '/';
    }
    
    // Créer l'URL complète
    const url = `${baseUrl}/${urlPath}`;
    
    // Ajouter l'entrée au sitemap
    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });
  
  // Fermer la balise urlset
  sitemap += `</urlset>`;
  
  // Écrire le fichier sitemap.xml dans le répertoire public
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  
  console.log(`Sitemap généré avec succès: ${htmlFiles.length} URLs indexées.`);
}

// Exécuter la fonction de génération
generateSitemap(); 