---
layout: base.njk
title: "RGB - Création d'Actifs"
description: "Guide complet pour créer des tokens, NFT et contrats intelligents avec RGB sur Bitcoin."
keywords: ["création actifs RGB", "tokens RGB", "NFT RGB", "contrats RGB", "RGB20", "RGB21"]
---

# RGB - Création d'Actifs 🎨

*Temps de lecture estimé : 20 minutes*

## Vue d'Ensemble 🌐

RGB permet de créer trois types principaux d'actifs :
- **RGB20** : Tokens fongibles (comme USDT, USDC)
- **RGB21** : Actifs non-fongibles (NFT, certificats)
- **RGB25** : Contrats intelligents complexes

## Tokens Fongibles (RGB20) 💰

### Stablecoin Simple
```bash
# Création d'un stablecoin USD
rgb issue fungible \
  --schema rgb20 \
  --name "Mon USD Coin" \
  --ticker "MUSD" \
  --precision 6 \
  --supply 1000000000000 \
  --description "Stablecoin adossé au dollar américain" \
  --seal "$GENESIS_UTXO"
```

### Token de Gouvernance
```bash
# Token avec supply limitée pour la gouvernance
rgb issue fungible \
  --schema rgb20 \
  --name "DAO Governance Token" \
  --ticker "DGOV" \
  --precision 18 \
  --supply 21000000000000000000000000 \
  --inflatable false \
  --burnable true \
  --seal "$GENESIS_UTXO"
```

### Token Rewards/Points
```bash
# Token pour programme de fidélité
rgb issue fungible \
  --schema rgb20 \
  --name "Loyalty Points" \
  --ticker "LPTS" \
  --precision 0 \
  --supply 0 \
  --inflatable true \
  --max-supply 1000000000 \
  --seal "$GENESIS_UTXO"
```

### Paramètres Avancés RGB20

#### Contrôle de l'Inflation
```json
{
  "inflatable": true,
  "max_supply": 1000000000,
  "inflation_rate": {
    "annual_percent": 2.5,
    "compound": true
  },
  "mint_authority": "<pubkey>"
}
```

#### Métadonnées Riches
```json
{
  "name": "Mon Token Awesome",
  "description": "Token révolutionnaire pour...",
  "image": "ipfs://QmHash...",
  "external_url": "https://montoken.com",
  "properties": {
    "category": "DeFi",
    "use_case": "Governance",
    "audit_report": "ipfs://audit-hash"
  }
}
```

## Actifs Non-Fongibles (RGB21) 🎭

### NFT de Collection
```bash
# Création d'une collection NFT
rgb issue non-fungible \
  --schema rgb21 \
  --name "Bitcoin Art Collection" \
  --description "Collection d'art numérique exclusive" \
  --max-items 1000 \
  --seal "$GENESIS_UTXO"
```

### Certificat Numérique
```bash
# Certificat de propriété immobilière
rgb issue non-fungible \
  --schema rgb21 \
  --name "Titre de Propriété #123" \
  --description "Appartement 123 Rue de Bitcoin" \
  --max-items 1 \
  --metadata-file property-metadata.json \
  --seal "$GENESIS_UTXO"
```

### Item de Jeu Vidéo
```bash
# Épée légendaire pour jeu
rgb issue non-fungible \
  --schema rgb21 \
  --name "Excalibur Lightning" \
  --description "Épée légendaire infusée d'énergie Bitcoin" \
  --max-items 1 \
  --attributes-file sword-attributes.json \
  --seal "$GENESIS_UTXO"
```

### Métadonnées NFT Avancées

#### Fichier property-metadata.json
```json
{
  "name": "Appartement Satoshi #123",
  "description": "Magnifique appartement dans le quartier Bitcoin",
  "image": "ipfs://QmPropertyImage...",
  "external_url": "https://immobilier-rgb.com/123",
  "attributes": [
    {"trait_type": "Surface", "value": "75 m²"},
    {"trait_type": "Pièces", "value": 3},
    {"trait_type": "Quartier", "value": "Bitcoin District"},
    {"trait_type": "Année Construction", "value": 2021},
    {"trait_type": "Vue", "value": "Lightning Network"}
  ],
  "properties": {
    "legal_document": "ipfs://QmLegalDoc...",
    "valuation_report": "ipfs://QmValuation...",
    "energy_certificate": "A+"
  }
}
```

#### Fichier sword-attributes.json
```json
{
  "name": "Excalibur Lightning",
  "description": "Épée légendaire forgée dans la foudre",
  "image": "ipfs://QmSwordImage...",
  "animation_url": "ipfs://QmSwordAnimation...",
  "attributes": [
    {"trait_type": "Damage", "value": 999},
    {"trait_type": "Speed", "value": 85},
    {"trait_type": "Rarity", "value": "Legendary"},
    {"trait_type": "Element", "value": "Lightning"},
    {"trait_type": "Durability", "value": "Infinite"}
  ],
  "stats": {
    "attack_power": 999,
    "magic_power": 750,
    "critical_chance": 15,
    "lightning_damage": 500
  }
}
```

## Contrats Intelligents (RGB25) 🤖

### Contrat d'Assurance Simple
```rust
// Exemple de schéma RGB25 pour assurance
use rgb::contract::*;

#[derive(Contract)]
pub struct InsuranceContract {
    pub premium: Amount,
    pub coverage: Amount,
    pub expiry: Timestamp,
    pub conditions: Vec<Condition>,
}

#[derive(State)]
pub enum InsuranceState {
    Active { premium_paid: bool },
    Claimed { amount: Amount },
    Expired,
}
```

### Contrat de Prêt P2P
```rust
#[derive(Contract)]
pub struct LoanContract {
    pub principal: Amount,
    pub interest_rate: Percentage,
    pub duration: Duration,
    pub collateral: AssetId,
    pub lender: PublicKey,
    pub borrower: PublicKey,
}

#[derive(Transition)]
pub enum LoanTransition {
    Originate { terms: LoanTerms },
    Repay { amount: Amount },
    Liquidate { collateral_amount: Amount },
    Default,
}
```

### Contrat de Vente Conditionnelle
```rust
#[derive(Contract)]
pub struct EscrowContract {
    pub seller: PublicKey,
    pub buyer: PublicKey,
    pub arbiter: PublicKey,
    pub asset: AssetId,
    pub price: Amount,
    pub conditions: Vec<DeliveryCondition>,
}
```

## Outils de Création Avancés 🛠️

### RGB Studio (Interface Graphique)
```bash
# Installation de RGB Studio
cargo install rgb-studio

# Lancement de l'interface
rgb-studio
```

### Templates et Générateurs
```bash
# Génération d'un template RGB20
rgb template generate \
  --type fungible \
  --name "MonToken" \
  --output ./mon-token-config.json

# Utilisation du template
rgb issue --config ./mon-token-config.json
```

### Validation et Tests
```bash
# Validation d'un contrat avant création
rgb validate-schema ./mon-contrat.json

# Test en mode simulation
rgb simulate-issue \
  --config ./mon-contrat.json \
  --testnet

# Test des transitions
rgb test-transitions ./mon-contrat.json
```

## Bonnes Pratiques 🎯

### Conception du Token

1. **Définissez clairement l'usage**
   - Utility token vs Security token
   - Mécanismes d'incitation
   - Modèle économique

2. **Choisissez les paramètres adaptés**
   - Precision selon l'usage (0-18)
   - Supply totale réaliste
   - Inflation/deflation

3. **Sécurisez la gouvernance**
   - Multi-signature pour mint
   - Timelock pour changements
   - Transparence des décisions

### Sécurité

1. **Auditez vos contrats**
   ```bash
   # Audit automatique
   rgb audit ./mon-contrat.json
   
   # Vérification des vulnérabilités
   rgb security-check ./mon-contrat.json
   ```

2. **Testez en profondeur**
   ```bash
   # Tests de stress
   rgb stress-test --contract ./mon-contrat.json
   
   # Tests de régression
   rgb regression-test --suite ./tests/
   ```

3. **Monitoring post-lancement**
   ```bash
   # Surveillance des métriques
   rgb monitor --asset-id <id> --metrics all
   
   # Alertes automatisées
   rgb alerts setup --email admin@exemple.com
   ```

### Conformité Légale

1. **Consultez un avocat** spécialisé en crypto
2. **Respectez les réglementations locales**
3. **Implémentez KYC/AML si nécessaire**
4. **Documentez l'usage prévu**

## Dépannage 🔧

### Erreurs Communes

#### "Genesis validation failed"
```bash
# Vérification du seal
rgb utxo verify $GENESIS_UTXO

# Vérification des fonds
rgb balance bitcoin
```

#### "Schema validation error"
```bash
# Vérification du schéma
rgb schema validate ./mon-schema.json

# Réparation automatique
rgb schema fix ./mon-schema.json
```

#### "Insufficient Bitcoin for fees"
```bash
# Vérification du solde Bitcoin
rgb wallet bitcoin-balance

# Estimation des frais
rgb estimate-fee --asset-creation
```

## Exemples Concrets 🎆

### Stablecoin Euro (EURE)
```bash
# Stablecoin adossé à l'Euro
rgb issue fungible \
  --schema rgb20 \
  --name "Euro RGB" \
  --ticker "EURE" \
  --precision 6 \
  --supply 0 \
  --inflatable true \
  --metadata '{"backed_by":"EUR","issuer":"RGB Bank SA"}' \
  --seal "$GENESIS_UTXO"
```

### Token de Carbon Credits
```bash
# Token pour crédits carbone
rgb issue fungible \
  --schema rgb20 \
  --name "Carbon Credit Token" \
  --ticker "CCT" \
  --precision 3 \
  --supply 1000000000 \
  --burnable true \
  --metadata '{"ton_co2_per_token":1,"certification":"VCS"}' \
  --seal "$GENESIS_UTXO"
```

### Collection d'Art Génératif
```bash
# NFT collection avec traits aléatoires
rgb issue non-fungible \
  --schema rgb21 \
  --name "Bitcoin Punks" \
  --max-items 10000 \
  --randomized-traits true \
  --traits-file ./bitcoin-punks-traits.json \
  --seal "$GENESIS_UTXO"
```

> **Pro Tip :** 💡 Commencez simple avec un RGB20 basique, puis ajoutez progressivement des fonctionnalités avancées. La complexité peut être introduite via des mises à jour de contrat.