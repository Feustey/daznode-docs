---
layout: base.njk
title: Import
---

# Section Learn de Daznode

Cette section offre un guide d'apprentissage complet sur Lightning Network, organisé en sections et chapitres, disponible en plusieurs langues.

## Structure du projet

```
/learn
  /components         # Composants React spécifiques à la section Learn
  /content            # Contenu Markdown organisé par langue et section
    /[language]       # Dossiers pour chaque langue (fr, en, es, de)
      /[section]      # Dossiers pour chaque section (basics, channels, etc.)
        [chapter].md  # Fichiers markdown pour chaque chapitre
  /utils              # Utilitaires pour le traitement des fichiers Markdown
  /[locale]           # Pages dynamiques pour chaque langue
    /[section]        # Pages dynamiques pour chaque section
      /[chapter]      # Pages dynamiques pour chaque chapitre
  page.tsx            # Page d'accueil (redirection vers la langue appropriée)
  metadata.ts         # Métadonnées pour la section
```

## Fichiers Markdown

Chaque fichier Markdown (.md) contient:

- **Frontmatter** : En-tête YAML avec métadonnées
- **Contenu** : Corps du document en Markdown

### Format du Frontmatter

```yaml
---
title: Titre du chapitre
order: 1 # Ordre d'affichage dans la section
section: basics # Nom de la section
language: fr # Code de langue (fr, en, es, de)
description: Brève description du contenu
tags: [tag1, tag2] # Tags pour la recherche
lastUpdated: 2023-11-15 # Date de dernière mise à jour
---
```

## Ajout de contenu

Pour ajouter un nouveau chapitre:

1. Créez un fichier .md dans le répertoire approprié (/content/[language]/[section]/)
2. Assurez-vous d'inclure le frontmatter correct
3. Écrivez le contenu en Markdown
4. Si vous ajoutez une nouvelle section, créez un nouveau dossier

## Traductions

Pour ajouter une traduction:

1. Créez un fichier .md avec le même nom dans le dossier de langue correspondant
2. Mettez à jour le champ `language` dans le frontmatter
3. Traduisez le contenu

## Rendu du Markdown

Le Markdown est rendu en HTML côté client avec:

- `marked` pour la conversion Markdown → HTML
- `highlight.js` pour la coloration syntaxique du code

## Remarques techniques

- Utilisation de Next.js pour les routes dynamiques
- Pages générées côté client pour permettre le passage d'une langue à l'autre
- Structure optimisée pour l'ajout facile de nouvelles sections et chapitres
