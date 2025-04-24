const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Charger les termes du glossaire
let glossaryTerms;
try {
  glossaryTerms = require('./glossary_terms.json');
} catch (error) {
  console.error('Vous devez d\'abord exécuter extract_glossary_terms.js');
  process.exit(1);
}

// Trier les termes par longueur (décroissante) pour traiter d'abord les expressions les plus longues
const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);

// Fonction pour échapper les caractères spéciaux des expressions régulières
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Fonction pour vérifier si un chemin doit être ignoré
function shouldIgnorePath(filePath) {
  return filePath.includes('/glossary/') || 
         filePath.includes('/node_modules/') || 
         filePath.includes('/.git/') ||
         filePath.includes('/scripts/');
}

// Fonction qui génère une expression régulière qui correspond à différentes variations d'un terme
function createFlexibleRegex(term) {
  // Si le terme se termine par "é", on cherche aussi la version qui se termine par "es"
  let pattern = escapeRegExp(term);
  
  if (term.endsWith('é')) {
    const baseTerm = term.slice(0, -1);
    pattern = `${escapeRegExp(baseTerm)}(é|és|ées)`;
  } else if (term.endsWith('al')) {
    const baseTerm = term.slice(0, -2);
    pattern = `${escapeRegExp(baseTerm)}(al|aux)`;
  }
  
  // Insensible à la casse
  return new RegExp(`\\b${pattern}\\b`, 'gi');
}

// Nombre total de liens ajoutés
let totalLinksAdded = 0;

// Fonction pour transformer un fichier Markdown
function processFile(filePath) {
  if (shouldIgnorePath(filePath)) {
    return;
  }

  console.log(`Traitement du fichier: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let frontMatter = '';
  let mainContent = content;
  
  // Extraire le front matter s'il existe (pour le préserver)
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (frontMatterMatch) {
    frontMatter = frontMatterMatch[0].substring(0, frontMatterMatch[0].length - frontMatterMatch[2].length);
    mainContent = frontMatterMatch[2];
  }
  
  // Variables pour suivre les modifications et éviter les liens dans les liens
  let modifiedContent = mainContent;
  const processedRanges = [];
  let linksAddedInThisFile = 0;
  
  // Traiter chaque terme
  for (const term of sortedTerms) {
    const anchor = glossaryTerms[term];
    const termRegex = createFlexibleRegex(term);
    
    let match;
    while ((match = termRegex.exec(modifiedContent)) !== null) {
      const matchedTerm = match[0]; // Le terme effectivement trouvé (peut être différent du terme recherché à cause des variations)
      const startIndex = match.index;
      const endIndex = startIndex + matchedTerm.length;
      
      // Vérifier si cette occurrence est déjà dans un lien ou dans un titre
      const isInProcessedRange = processedRanges.some(range => 
        (startIndex >= range.start && startIndex <= range.end) ||
        (endIndex >= range.start && endIndex <= range.end)
      );
      
      // Vérifier si c'est dans un lien Markdown
      const surroundingText = modifiedContent.substring(Math.max(0, startIndex - 5), Math.min(modifiedContent.length, endIndex + 5));
      const isInLink = /\[.*\]\(.*\)/.test(surroundingText);
      
      // Vérifier si c'est dans un titre
      const lineStart = modifiedContent.lastIndexOf('\n', startIndex) + 1;
      const isInTitle = modifiedContent.substring(lineStart, startIndex).trim().startsWith('#');
      
      // Vérifier si c'est dans un bloc de code
      const codeBlockStart = modifiedContent.lastIndexOf('```', startIndex);
      const codeBlockEnd = modifiedContent.indexOf('```', codeBlockStart + 3);
      const isInCodeBlock = codeBlockStart !== -1 && codeBlockEnd !== -1 && startIndex > codeBlockStart && startIndex < codeBlockEnd;
      
      if (!isInProcessedRange && !isInLink && !isInTitle && !isInCodeBlock) {
        // Remplacer par un lien vers le glossaire
        const replacement = `[${matchedTerm}](/glossary/#${anchor})`;
        modifiedContent = 
          modifiedContent.substring(0, startIndex) + 
          replacement + 
          modifiedContent.substring(endIndex);
        
        // Mettre à jour l'index pour les prochaines correspondances
        termRegex.lastIndex = startIndex + replacement.length;
        
        // Marquer cette zone comme traitée
        processedRanges.push({
          start: startIndex,
          end: startIndex + replacement.length
        });
        
        linksAddedInThisFile++;
        totalLinksAdded++;
      }
    }
  }
  
  // Reconstituer le contenu complet avec le front matter
  const newContent = frontMatter + modifiedContent;
  
  // Écrire le contenu mis à jour dans le fichier
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  ${linksAddedInThisFile} liens ajoutés dans ${filePath}`);
  }
}

// Trouver tous les fichiers Markdown dans le projet
const markdownFiles = glob.sync('**/*.md', {
  ignore: ['**/node_modules/**', '**/glossary/**', '**/.git/**', '**/scripts/**']
});

// Traiter chaque fichier
markdownFiles.forEach(processFile);

console.log(`Terminé! ${totalLinksAdded} liens ont été ajoutés dans tous les fichiers.`); 