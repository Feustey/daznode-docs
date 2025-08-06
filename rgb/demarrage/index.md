---
layout: base.njk
title: "RGB - Guide de Démarrage"
description: "Premiers pas avec RGB : installation, création de votre premier actif et première transaction."
keywords: ["RGB démarrage", "installation RGB", "premier actif RGB", "transaction RGB", "tutoriel RGB"]
---

# RGB - Guide de Démarrage 🏁

*Temps de lecture estimé : 15 minutes*

## Prérequis 📋

### Connaissances Requises
- Bases de Bitcoin et blockchain
- Utilisation d'un terminal/ligne de commande
- Notions de cryptographie (optionnel)

### Environnement Technique
- Système : Linux, macOS ou Windows (WSL)
- Mémoire : 4GB RAM minimum
- Stockage : 500MB d'espace libre
- Connexion : Internet stable

## Installation 🛠️

### Option 1 : Installation via Cargo (Recommandée)
```bash
# Installation de Rust (si pas déjà installé)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Installation RGB CLI
cargo install rgb-cli --features=cli

# Vérification de l'installation
rgb --version
```

### Option 2 : Binaires Précompilés
```bash
# Téléchargement pour Linux
wget https://github.com/RGB-WG/rgb-cli/releases/latest/download/rgb-cli-linux.tar.gz
tar -xzf rgb-cli-linux.tar.gz
sudo mv rgb-cli /usr/local/bin/

# Vérification
rgb --version
```

### Configuration Initiale ⚙️
```bash
# Création du répertoire de configuration
mkdir -p ~/.rgb

# Génération des clés
rgb init

# Configuration du réseau (testnet pour débuter)
rgb config set network testnet
```

## Premier Portefeuille RGB 💼

### Création du Portefeuille
```bash
# Génération d'un nouveau portefeuille
rgb wallet create "MonPremierWallet"

# Affichage des adresses
rgb wallet addresses

# Sauvegarde du seed (IMPORTANT !)
rgb wallet export-seed
```

### Financement en Bitcoin
Pour utiliser RGB, vous avez besoin de Bitcoin (testnet) :
```bash
# Génération d'une adresse Bitcoin
rgb wallet bitcoin-address

# Demande de testnet coins
# Utilisez un faucet comme : https://testnet-faucet.mempool.co/
```

## Création de Votre Premier Actif 🎨

### Token Fongible (RGB20)
```bash
# Création d'un token simple
rgb issue fungible \
  --name "Mon Token" \
  --ticker "MTK" \
  --precision 8 \
  --supply 1000000 \
  --seal "txid:vout"

# Le seal fait référence à un UTXO Bitcoin que vous possédez
```

### Paramètres Expliqués
- **name** : Nom affiché du token
- **ticker** : Symbole court (3-5 caractères)
- **precision** : Nombre de décimales
- **supply** : Nombre total de tokens
- **seal** : UTXO Bitcoin associé

### Vérification de la Création
```bash
# Liste de vos actifs
rgb assets list

# Détails d'un actif spécifique
rgb asset info <asset-id>

# Historique des transactions
rgb asset history <asset-id>
```

## Première Transaction 🔄

### Préparation du Transfert
```bash
# Création d'une facture pour le destinataire
rgb invoice create \
  --asset-id <votre-asset-id> \
  --amount 100

# La facture générée ressemble à :
# rgb:invoice:xyz123...
```

### Exécution du Transfert
```bash
# Envoi de tokens
rgb transfer \
  --invoice "rgb:invoice:xyz123..." \
  --fee-rate 1.0

# Confirmation de la transaction
rgb transaction status <txid>
```

### Réception de Tokens
```bash
# Acceptation des tokens reçus
rgb accept <consignment-file>

# Mise à jour du solde
rgb wallet refresh

# Vérification du nouveau solde
rgb balance
```

## Gestion des Erreurs Courantes ⚠️

### "Insufficient funds"
```bash
# Vérification du solde Bitcoin
rgb wallet bitcoin-balance

# Si insuffisant, utilisez un faucet testnet
```

### "Invalid seal"
```bash
# Listez vos UTXO disponibles
rgb wallet utxos

# Utilisez un UTXO valid avec des fonds
```

### "Network error"
```bash
# Vérification de la configuration réseau
rgb config show

# Changement de serveur Electrum si nécessaire
rgb config set electrum-server "electrum.example.com:50002"
```

## Bonnes Pratiques 🎯

### Sécurité
- **Sauvegardez vos seeds** : Stockez-les en sécurité
- **Utilisez testnet** : Pour vos premiers tests
- **Vérifiez les montants** : Avant chaque transaction
- **Gardez vos clés privées** : Ne les partagez jamais

### Performance
- **Surveillez les frais** : Ajustez selon la congestion
- **Groupez les transactions** : Économisez sur les frais
- **Maintenez vos UTXO** : Pour de meilleures performances

### Débogage
```bash
# Mode verbeux pour plus de détails
rgb --verbose <commande>

# Logs détaillés
rgb --log-level debug <commande>

# Export des logs
rgb export-logs > rgb-debug.log
```

## Ressources d'Aide 🎆

### Documentation
- [RGB CLI Manual](https://github.com/RGB-WG/rgb-cli/wiki)
- [RGB Standards](https://github.com/RGB-WG/rgb-core)
- [Examples Repository](https://github.com/RGB-WG/rgb-examples)

### Communauté
- [Discord RGB](https://discord.gg/rgb)
- [Telegram Developers](https://t.me/rgbdevs)
- [StackOverflow](https://stackoverflow.com/questions/tagged/rgb-protocol)

### Support Technique
- [GitHub Issues](https://github.com/RGB-WG/rgb-cli/issues)
- [RGB Academy](https://academy.rgb.tech/)
- [Community Forum](https://forum.rgb.tech/)

## Prochaines Étapes 🚀

1. **Explorez les contrats avancés** → [Création d'Actifs](/rgb/creation-actifs/)
2. **Intégrez dans vos apps** → [Développement](/rgb/developpement/)
3. **Découvrez les cas d'usage** → [Cas d'Usage](/rgb/cas-usage/)

> **Conseil Pratique :** 💡 Commencez toujours sur testnet avec de petits montants. Une fois à l'aise, vous pourrez passer sur mainnet avec de vrais bitcoins.