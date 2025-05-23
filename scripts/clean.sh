#!/bin/bash
# Nettoyage du build local Eleventy

# Supprime le dossier de sortie
rm -rf public/

# Supprime les fichiers temporaires courants
rm -f force-deploy.tmp npm-debug.log

# Message de confirmation
echo "Nettoyage terminé : dossier public/ et fichiers temporaires supprimés." 