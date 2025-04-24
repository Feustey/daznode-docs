# Daznode Documentation

Documentation technique pour Daznode, un nœud Lightning Network accessible dans le navigateur.

## Déploiement sur Netlify

Pour déployer cette documentation sur Netlify:

1. Connectez-vous à votre compte Netlify
2. Créez un nouveau site depuis Git
3. Sélectionnez le dépôt contenant cette documentation
4. Utilisez les paramètres suivants:
   - **Branche à déployer**: `main`
   - **Commande de build**: `npm run build`
   - **Répertoire de publication**: `public`
   - **Répertoire de fonctions**: `netlify/functions` (si vous utilisez des fonctions Netlify)

## Structure du projet

- `getting-started/` - Documentation de démarrage
- `connect-data/` - Guides de connexion de données
- `manage-data/` - Guides de gestion des données
- `use-data/` - Guides d'utilisation des données
- `administration/` - Documentation d'administration 