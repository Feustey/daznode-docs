#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CONTENT_EXTENSIONS = ['.md', '.njk'];

// Patterns pour identifier les liens internes
const LINK_PATTERNS = [
  // Markdown links: [text](/path)
  /\[([^\]]*)\]\(\s*\/([^)]*)\)/g,
  // HTML href: href="/path"
  /href\s*=\s*["']\s*\/([^"']*?)["']/g,
];

// Fichiers à ignorer 
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /public/,
  /pagefind/,
];

// Stocker tous les liens trouvés
const foundLinks = new Map();
const brokenLinks = [];

// Fonction pour scanner les fichiers récursivement
function scanDirectory(dir, relativePath = '') {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relativeFilePath = path.join(relativePath, entry);
    
    // Ignorer certains dossiers/fichiers
    if (IGNORE_PATTERNS.some(pattern => pattern.test(relativeFilePath))) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, relativeFilePath);
    } else if (stat.isFile()) {
      const ext = path.extname(entry);
      if (CONTENT_EXTENSIONS.includes(ext)) {
        analyzeFile(fullPath, relativeFilePath);
      }
    }
  }
}

// Fonction pour analyser un fichier et extraire les liens
function analyzeFile(filePath, relativeFilePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Chercher tous les liens internes
    for (const pattern of LINK_PATTERNS) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const linkPath = match[2] || match[1]; // Selon le pattern utilisé
        
        if (linkPath && linkPath.trim()) {
          // Nettoyer le lien (enlever les ancres et paramètres)
          const cleanPath = linkPath.split('#')[0].split('?')[0].trim();
          
          if (cleanPath && !cleanPath.startsWith('http') && !cleanPath.startsWith('mailto:')) {
            // Ajouter le lien à notre collection
            if (!foundLinks.has(cleanPath)) {
              foundLinks.set(cleanPath, []);
            }
            foundLinks.get(cleanPath).push({
              file: relativeFilePath,
              fullMatch: match[0],
              line: getLineNumber(content, match.index)
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error.message);
  }
}

// Fonction pour obtenir le numéro de ligne d'une position
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Fonction pour vérifier si un chemin existe dans le dossier public
function checkPathExists(linkPath) {
  // Normaliser le chemin
  let cleanPath = linkPath.startsWith('/') ? linkPath.slice(1) : linkPath;
  
  if (cleanPath === '' || cleanPath === '/') {
    // Page d'accueil
    return fs.existsSync(path.join(PUBLIC_DIR, 'index.html'));
  }
  
  // Différentes variations à tester
  const pathsToTry = [
    path.join(PUBLIC_DIR, cleanPath),
    path.join(PUBLIC_DIR, cleanPath, 'index.html'),
    path.join(PUBLIC_DIR, cleanPath + '.html'),
    path.join(PUBLIC_DIR, cleanPath + '/index.html'),
  ];
  
  return pathsToTry.some(p => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });
}

// Fonction principale
function main() {
  console.log('🔍 Analyse des liens internes en cours...\n');
  
  // Scanner tous les fichiers
  scanDirectory(ROOT_DIR);
  
  console.log(`📊 Trouvé ${foundLinks.size} liens uniques dans ${Array.from(foundLinks.values()).reduce((acc, arr) => acc + arr.length, 0)} occurrences\n`);
  
  // Vérifier chaque lien
  for (const [linkPath, occurrences] of foundLinks.entries()) {
    const exists = checkPathExists(linkPath);
    
    if (!exists) {
      brokenLinks.push({
        path: linkPath,
        occurrences: occurrences
      });
    }
  }
  
  // Afficher le rapport
  console.log('🚨 RAPPORT DES LIENS CASSÉS\n');
  console.log('=' .repeat(50));
  
  if (brokenLinks.length === 0) {
    console.log('✅ Aucun lien cassé détecté !');
    return;
  }
  
  console.log(`❌ ${brokenLinks.length} liens cassés détectés:\n`);
  
  brokenLinks.forEach((broken, index) => {
    console.log(`${index + 1}. Lien cassé: "${broken.path}"`);
    console.log(`   Trouvé dans ${broken.occurrences.length} fichier(s):`);
    
    broken.occurrences.forEach(occ => {
      console.log(`   - ${occ.file}:${occ.line} → ${occ.fullMatch}`);
    });
    console.log('');
  });
  
  // Suggestions de corrections
  console.log('\n🔧 SUGGESTIONS DE CORRECTIONS:\n');
  console.log('=' .repeat(50));
  
  brokenLinks.forEach((broken, index) => {
    console.log(`${index + 1}. Pour "${broken.path}":`);
    
    // Chercher des pages similaires
    const similarPages = findSimilarPages(broken.path);
    if (similarPages.length > 0) {
      console.log('   Pages similaires disponibles:');
      similarPages.forEach(similar => {
        console.log(`   → ${similar}`);
      });
    } else {
      console.log('   ⚠️  Aucune page similaire trouvée - vérifiez si cette page doit être créée');
    }
    console.log('');
  });
}

// Fonction pour trouver des pages similaires
function findSimilarPages(brokenPath) {
  const similarPages = [];
  
  // Obtenir tous les chemins valides depuis public/
  const validPaths = getAllValidPaths(PUBLIC_DIR, '');
  
  // Recherche de similarité simple
  const pathParts = brokenPath.toLowerCase().split('/').filter(p => p);
  
  for (const validPath of validPaths) {
    const validParts = validPath.toLowerCase().split('/').filter(p => p);
    
    // Calculer la similarité
    const commonParts = pathParts.filter(part => validParts.some(vp => vp.includes(part) || part.includes(vp)));
    
    if (commonParts.length > 0) {
      similarPages.push('/' + validPath);
    }
  }
  
  return similarPages.slice(0, 3); // Limiter à 3 suggestions
}

// Fonction pour obtenir tous les chemins valides
function getAllValidPaths(dir, relativePath) {
  const validPaths = [];
  
  try {
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const newRelativePath = relativePath ? path.join(relativePath, entry) : entry;
      
      if (entry.startsWith('.') || entry === 'pagefind') continue;
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ajouter le dossier comme chemin valide
        validPaths.push(newRelativePath);
        // Récursion
        validPaths.push(...getAllValidPaths(fullPath, newRelativePath));
      } else if (entry === 'index.html') {
        // Le dossier parent est accessible
        if (relativePath) {
          validPaths.push(relativePath);
        }
      }
    }
  } catch (error) {
    // Ignorer les erreurs d'accès
  }
  
  return validPaths;
}

// Exécuter le script
main();