const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const excludeDirs = ['node_modules', '.git', 'public', '_site'];

// Compteurs pour le rapport
let filesChecked = 0;
let filesFixed = 0;
let errors = [];

// Fonction pour vérifier si une chaîne a besoin de guillemets
function needsQuotes(str) {
  if (typeof str !== 'string') return false;
  
  // Caractères problématiques en YAML
  return str.includes(':') || 
         str.includes('-') || 
         str.includes('#') || 
         str.includes('&') || 
         str.includes('*') || 
         str.includes('{') || 
         str.includes('}') || 
         str.includes('[') || 
         str.includes(']') || 
         str.includes('!') || 
         str.includes('|') || 
         str.includes('>') || 
         str.includes('@');
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    filesChecked++;
    
    // Lire le contenu du fichier
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Analyser avec gray-matter (qui utilise js-yaml)
    try {
      const parsed = matter(content);
      let needsFix = false;
      
      // Vérifier chaque champ du frontmatter
      for (const [key, value] of Object.entries(parsed.data)) {
        if (needsQuotes(value) && !content.includes(`${key}: "${value}"`) && !content.includes(`${key}: '${value}'`)) {
          needsFix = true;
          console.log(`\x1b[33m⚠️ Détecté\x1b[0m: Champ "${key}" dans ${filePath} contient des caractères spéciaux sans guillemets`);
        }
      }
      
      // Corriger le fichier si nécessaire
      if (needsFix) {
        console.log(`\x1b[36m🔧 Correction\x1b[0m: ${filePath}`);
        
        // Extraire la partie frontmatter originale
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;
        
        const originalFrontmatter = frontmatterMatch[1];
        let newFrontmatter = originalFrontmatter;
        
        // Corriger chaque champ problématique
        for (const [key, value] of Object.entries(parsed.data)) {
          if (needsQuotes(value) && typeof value === 'string') {
            // Regex pour trouver le champ sans tenir compte de l'indentation
            const regex = new RegExp(`(^|\\n)(\\s*)${key}:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*)(\\n|$)`, 'g');
            newFrontmatter = newFrontmatter.replace(regex, `$1$2${key}: "${value}"$3$4`);
          }
        }
        
        // Remplacer l'ancien frontmatter par le nouveau
        const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${newFrontmatter}\n---`);
        fs.writeFileSync(filePath, newContent, 'utf8');
        filesFixed++;
      }
    } catch (e) {
      console.log(`\x1b[31m❌ Erreur\x1b[0m: Impossible d'analyser ${filePath}`);
      console.log(`   Message: ${e.message}`);
      errors.push({ file: filePath, error: e.message });
    }
  } catch (e) {
    console.log(`\x1b[31m❌ Erreur\x1b[0m: Impossible de lire ${filePath}`);
  }
}

// Fonction pour parcourir récursivement les répertoires
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer les répertoires exclus
      if (!excludeDirs.includes(file)) {
        walkDir(filePath);
      }
    } else if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      processFile(filePath);
    }
  }
}

// Fonction principale
function main() {
  console.log('\x1b[1m🔍 Vérification des fichiers Markdown pour problèmes de frontmatter...\x1b[0m\n');
  
  walkDir(rootDir);
  
  console.log('\n\x1b[1m📊 Rapport :\x1b[0m');
  console.log(`   Fichiers vérifiés: ${filesChecked}`);
  console.log(`   Fichiers corrigés: ${filesFixed}`);
  console.log(`   Erreurs détectées: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n\x1b[1m❌ Fichiers avec erreurs non corrigées :\x1b[0m');
    errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
    console.log('\n👉 Ces fichiers nécessitent une correction manuelle.');
  }
  
  if (filesFixed > 0) {
    console.log('\n\x1b[32m✅ Corrections appliquées avec succès !\x1b[0m');
  } else if (errors.length === 0) {
    console.log('\n\x1b[32m✅ Aucun problème détecté !\x1b[0m');
  }
}

// Exécuter le script
main();