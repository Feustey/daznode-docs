const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Fonction pour vérifier et ajouter le layout à un fichier
function addLayoutToFile(filePath) {
  try {
    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Analyser le frontmatter
    const { data, content } = matter(fileContent);
    
    // Vérifier si le layout est déjà défini
    if (!data.layout) {
      console.log(`Ajout du layout à ${filePath}`);
      
      // Ajouter le layout
      data.layout = 'base.njk';
      
      // Réécrire le fichier avec le layout ajouté
      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedContent);
      
      return true; // Layout ajouté
    } else {
      console.log(`Le fichier ${filePath} a déjà un layout défini: ${data.layout}`);
      return false; // Pas de changement
    }
  } catch (error) {
    console.error(`Erreur lors du traitement de ${filePath}:`, error);
    return false;
  }
}

// Trouver tous les fichiers Markdown
const markdownFiles = glob.sync('**/*.md', {
  ignore: ['node_modules/**', 'public/**', 'scripts/**', '.git/**']
});

// Statistiques
let stats = {
  total: markdownFiles.length,
  updated: 0,
  skipped: 0,
  errors: 0
};

// Traiter chaque fichier
markdownFiles.forEach(file => {
  try {
    const wasUpdated = addLayoutToFile(file);
    if (wasUpdated) {
      stats.updated++;
    } else {
      stats.skipped++;
    }
  } catch (error) {
    console.error(`Erreur lors du traitement de ${file}:`, error);
    stats.errors++;
  }
});

// Afficher les résultats
console.log('\nRésumé:');
console.log(`Total de fichiers traités: ${stats.total}`);
console.log(`Fichiers mis à jour: ${stats.updated}`);
console.log(`Fichiers ignorés (layout déjà défini): ${stats.skipped}`);
console.log(`Erreurs: ${stats.errors}`); 