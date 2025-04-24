const fs = require('fs');
const path = require('path');

// Lire le contenu du fichier glossaire
const glossaryContent = fs.readFileSync(path.join(__dirname, '../glossary/index.md'), 'utf8');

// Expression régulière pour extraire les titres de sections
const sectionRegex = /^## ([^\n]+)/gm;
const subsectionRegex = /^### ([^\n]+)/gm;

// Objet pour stocker les termes et leurs ancres
const glossaryTerms = {};

// Fonction pour créer une ancre valide
function createAnchor(term) {
  return term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .toLowerCase()
    .replace(/['']/g, '') // Supprime les apostrophes
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/[^a-z0-9-]/g, ''); // Supprime tous les caractères non alphanumériques sauf les tirets
}

// Extraire les sections principales
let match;
while ((match = sectionRegex.exec(glossaryContent)) !== null) {
  const fullTerm = match[1].trim();
  
  // Gérer les termes avec des parenthèses (en extrayant les deux versions)
  if (fullTerm.includes('(')) {
    const mainTerm = fullTerm.split('(')[0].trim();
    const englishTerm = fullTerm.match(/\(([^)]+)\)/)?.[1].trim();
    
    // Créer l'ancre à partir du terme principal
    const anchor = createAnchor(mainTerm);
    
    glossaryTerms[mainTerm] = anchor;
    if (englishTerm) {
      glossaryTerms[englishTerm] = anchor;
    }
  } else {
    // Terme simple sans parenthèses
    const anchor = createAnchor(fullTerm);
    
    glossaryTerms[fullTerm] = anchor;
  }
}

// Extraire les sous-sections
while ((match = subsectionRegex.exec(glossaryContent)) !== null) {
  const fullTerm = match[1].trim();
  
  // Gérer les termes avec des parenthèses (en extrayant les deux versions)
  if (fullTerm.includes('(')) {
    const mainTerm = fullTerm.split('(')[0].trim();
    const englishTerm = fullTerm.match(/\(([^)]+)\)/)?.[1].trim();
    
    // Créer l'ancre à partir du terme principal
    const anchor = createAnchor(mainTerm);
    
    glossaryTerms[mainTerm] = anchor;
    if (englishTerm) {
      glossaryTerms[englishTerm] = anchor;
    }
  } else {
    // Terme simple sans parenthèses
    const anchor = createAnchor(fullTerm);
    
    glossaryTerms[fullTerm] = anchor;
  }
}

// Écrire le résultat dans un fichier JSON
fs.writeFileSync(
  path.join(__dirname, 'glossary_terms.json'), 
  JSON.stringify(glossaryTerms, null, 2), 
  'utf8'
);

console.log('Termes du glossaire extraits et sauvegardés dans glossary_terms.json'); 