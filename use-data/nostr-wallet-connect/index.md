# Guide d'utilisation de Nostr Wallet Connect avec Daznode

Nostr Wallet Connect (NWC) est un protocole révolutionnaire qui permet de connecter votre nœud Lightning Daznode à des applications et sites web compatibles. Ce guide vous explique comment configurer et utiliser NWC de manière sécurisée et efficace.

## Qu'est-ce que Nostr Wallet Connect ?

Nostr Wallet Connect est un protocole qui utilise le réseau social décentralisé Nostr pour établir une connexion sécurisée entre votre nœud Lightning et des applications tierces. Cette connexion permet aux applications d'effectuer certaines actions sur votre nœud, comme :

- Créer des factures pour recevoir des paiements
- Envoyer des paiements Lightning
- Vérifier le solde de votre nœud
- Accéder à l'historique des transactions (selon les permissions accordées)

L'avantage principal de NWC est qu'il vous donne un contrôle total sur les permissions que vous accordez à chaque application.

## Types de connexions NWC

Daznode prend en charge trois types de connexions NWC, offrant différents niveaux d'accès :

1. **Lecture seule** : permet aux applications de vérifier votre solde et de voir l'historique des transactions, mais pas d'effectuer des paiements
2. **Réception uniquement** : permet aux applications de créer des factures pour recevoir des paiements, mais pas d'envoyer des fonds
3. **Envoi et réception** : permet aux applications d'envoyer et de recevoir des paiements (à utiliser uniquement avec les applications de confiance)

## Configuration de Nostr Wallet Connect sur Daznode

### Prérequis

- Un compte Daznode actif avec au moins un nœud Lightning
- Un client Nostr (comme Damus, Amethyst, Iris, etc.)
- Une application ou un site web qui prend en charge Nostr Wallet Connect

### Étape 1 : Activer NWC sur votre nœud Daznode

1. Connectez-vous à votre compte Daznode
2. Accédez à votre tableau de bord de nœud
3. Cliquez sur "Paramètres" puis "Nostr Wallet Connect"
4. Activez l'option "Activer Nostr Wallet Connect"

### Étape 2 : Créer une nouvelle connexion NWC

1. Dans la section NWC, cliquez sur "Nouvelle connexion"
2. Choisissez le type de connexion que vous souhaitez créer :
   - Lecture seule
   - Réception uniquement
   - Envoi et réception
3. Définissez une limite de dépense (pour les connexions "Envoi et réception")
4. Donnez un nom à cette connexion pour l'identifier facilement (par exemple, "Twitter Zaps" ou "App de jeu XYZ")
5. Cliquez sur "Créer"

### Étape 3 : Partager votre connexion NWC

Une fois la connexion créée, vous obtiendrez une URL NWC qui ressemble à :
```
nostr+walletconnect://abcdef123456789...?relay=wss://relay.dazno.de
```

Vous pouvez partager cette URL de plusieurs façons :

1. **Code QR** : Scannez le code QR affiché avec l'application compatible NWC
2. **Lien direct** : Cliquez sur le lien NWC depuis l'appareil où l'application est installée
3. **Copier-coller** : Copiez l'URL et collez-la dans l'application qui demande une connexion NWC

### Étape 4 : Autoriser la connexion

Lorsqu'une application tente de se connecter pour la première fois, vous recevrez une notification de confirmation. Vérifiez les détails de la demande de connexion avant d'accepter.

## Utiliser NWC avec des applications populaires

### Clients Nostr pour les Zaps

Les clients Nostr comme Damus, Amethyst et Iris permettent d'envoyer des "zaps" (pourboires Lightning) aux publications et aux profils. Pour configurer les zaps :

1. Ouvrez votre client Nostr
2. Accédez aux paramètres de paiement ou de portefeuille
3. Sélectionnez "Nostr Wallet Connect" comme méthode de paiement
4. Collez votre URL NWC (type "Envoi et réception" recommandé pour les zaps)
5. Testez la connexion en envoyant un petit zap

### Sites web compatibles NWC

De nombreux sites web prennent désormais en charge NWC pour les paiements Lightning :

1. Sur le site, recherchez l'option de paiement Lightning ou NWC
2. Sélectionnez "Nostr Wallet Connect" comme méthode de paiement
3. Scannez le code QR ou cliquez sur le lien pour connecter votre nœud Daznode
4. Autorisez la connexion et effectuez le paiement

## Gérer vos connexions NWC

### Consulter les connexions actives

1. Dans la section NWC de votre tableau de bord Daznode
2. Vous verrez toutes vos connexions NWC actives avec les détails suivants :
   - Nom de la connexion
   - Type de permission
   - Date de création
   - Dernière utilisation
   - Limite de dépense et montant utilisé (pour les connexions "Envoi et réception")

### Modifier une connexion

1. Cliquez sur la connexion que vous souhaitez modifier
2. Vous pouvez :
   - Changer le nom
   - Ajuster la limite de dépense
   - Modifier la durée d'expiration

### Révoquer une connexion

Si vous soupçonnez une activité suspecte ou si vous n'utilisez plus une application :

1. Sélectionnez la connexion concernée
2. Cliquez sur "Révoquer la connexion"
3. Confirmez votre choix

Une fois révoquée, l'application ne pourra plus accéder à votre nœud Lightning jusqu'à ce que vous créiez une nouvelle connexion.

## Bonnes pratiques de sécurité pour NWC

Pour protéger vos fonds lorsque vous utilisez Nostr Wallet Connect :

1. **Utilisez différentes connexions pour différentes applications** plutôt qu'une seule connexion pour tout
2. **Limitez les montants** pour les connexions "Envoi et réception"
3. **Définissez des expirations** pour toutes vos connexions (par exemple, 30 jours)
4. **Vérifiez régulièrement l'activité** de vos connexions NWC
5. **N'accordez pas d'accès "Envoi et réception"** aux applications que vous ne connaissez pas bien
6. **Révoquée immédiatement** toute connexion suspecte

## Dépannage des problèmes courants

### La connexion échoue ou expire rapidement

- Vérifiez que le relais Nostr spécifié est accessible
- Assurez-vous que votre client Nostr est correctement configuré
- Essayez de créer une nouvelle connexion NWC

### Les paiements ne sont pas envoyés

- Vérifiez que vous avez suffisamment de fonds dans votre nœud
- Assurez-vous que vos canaux ont suffisamment de capacité sortante
- Vérifiez que la limite de dépense n'a pas été atteinte

### Les factures ne sont pas générées

- Vérifiez que votre nœud dispose d'une capacité entrante
- Assurez-vous que la connexion NWC a les permissions appropriées
- Vérifiez l'état de votre nœud dans le tableau de bord Daznode

## Avenir de Nostr Wallet Connect

Le protocole NWC est encore en développement et de nouvelles fonctionnalités sont régulièrement ajoutées. Daznode reste à la pointe de cette technologie et mettra à jour son implémentation NWC avec les dernières améliorations, comme :

- Support pour les paiements LNURL
- Notifications en temps réel pour les demandes de paiement
- Contrôles de budget et de dépense plus avancés
- Intégration avec davantage d'applications et de services

Restez informé des dernières mises à jour en suivant le blog et les canaux de communication officiels de Daznode.

## Ressources supplémentaires

- [Spécification technique de Nostr Wallet Connect](https://nwc.getalby.com/)
- [Liste des applications compatibles NWC](/docs/nwc-apps)
- [Forum communautaire Daznode](https://community.dazno.de)
- [FAQ Nostr Wallet Connect](/docs/faq-nwc) 