# Guide de démarrage rapide pour Daznode

Ce guide vous aidera à configurer rapidement votre nœud Lightning avec Daznode. Suivez ces étapes simples pour commencer à utiliser le Lightning Network en quelques minutes.

## 1. Créer un compte

1. Visitez [https://dazno.de](https://dazno.de) et cliquez sur "S'inscrire"
2. Entrez votre adresse email et créez un mot de passe sécurisé
3. Vérifiez votre email et confirmez votre compte

## 2. Configurer l'authentification à deux facteurs (2FA)

Pour protéger votre nœud, nous recommandons vivement de configurer l'authentification à deux facteurs :

1. Dans les paramètres de votre compte, activez la 2FA
2. Scannez le code QR avec une application comme Google Authenticator ou Authy
3. Entrez le code à six chiffres pour confirmer la configuration

*Note : La 2FA est obligatoire pour les comptes avec un solde supérieur à 100 000 satoshis.*

## 3. Démarrer votre premier nœud Lightning

1. Dans votre tableau de bord, cliquez sur "Créer un nœud"
2. Choisissez un nom pour votre nœud
3. Sélectionnez les options de configuration (par défaut recommandé pour les débutants)
4. Confirmez la création du nœud (un petit paiement de 250 satoshis est requis pour éviter les abus)

## 4. Alimenter votre nœud

Pour commencer à utiliser le Lightning Network, vous devez d'abord ajouter des fonds à votre nœud :

### Option A : Dépôt on-chain

1. Dans votre tableau de bord, cliquez sur "Dépôt"
2. Sélectionnez "Dépôt on-chain"
3. Une adresse Bitcoin unique sera générée
4. Envoyez des bitcoins à cette adresse depuis votre portefeuille
5. Attendez la confirmation de la transaction (généralement 3 confirmations)

### Option B : Recevoir un paiement Lightning

Si vous avez déjà un canal entrant, vous pouvez recevoir des paiements Lightning :

1. Cliquez sur "Recevoir"
2. Entrez le montant que vous souhaitez recevoir
3. Une facture Lightning (invoice) sera générée
4. Partagez cette facture avec l'expéditeur
5. Le paiement sera instantanément crédité sur votre nœud une fois reçu

## 5. Ouvrir votre premier canal Lightning

Pour envoyer des paiements via le Lightning Network, vous devez ouvrir au moins un canal :

1. Dans votre tableau de bord, cliquez sur "Canaux" puis "Ouvrir un canal"
2. Vous pouvez soit :
   - Ouvrir un canal avec un nœud Daznode (recommandé pour les débutants)
   - Entrer l'URI d'un nœud spécifique avec lequel vous souhaitez vous connecter
3. Entrez le montant que vous souhaitez allouer à ce canal
4. Confirmez l'ouverture du canal (cela nécessite une transaction on-chain)
5. Attendez que le canal soit actif (généralement après 3 confirmations)

## 6. Recevoir de la capacité entrante

Pour recevoir des paiements Lightning, vous avez besoin d'une capacité entrante :

1. Dans "Canaux", cliquez sur "Obtenir de la capacité entrante"
2. Choisissez le montant de capacité entrante souhaité
3. Payez les frais associés (qui varient en fonction des frais on-chain actuels)
4. Un canal entrant sera ouvert pour vous par Daznode

## 7. Envoyer votre premier paiement Lightning

Une fois que vous avez un canal actif :

1. Cliquez sur "Envoyer"
2. Collez la facture Lightning que vous souhaitez payer
3. Vérifiez les détails et confirmez le paiement
4. Le paiement sera instantané si votre canal dispose de suffisamment de liquidité sortante

## 8. Recevoir votre premier paiement Lightning

Lorsque vous avez de la capacité entrante :

1. Cliquez sur "Recevoir"
2. Entrez le montant et éventuellement une description
3. Une facture Lightning sera générée
4. Partagez cette facture avec l'expéditeur
5. Une fois payée, les fonds seront instantanément disponibles dans votre nœud

## 9. Explorer les fonctionnalités avancées

Après vous être familiarisé avec les bases, explorez ces fonctionnalités avancées :

- **Gestion des canaux** : Équilibrez vos canaux pour optimiser leur utilisation
- **Nostr Wallet Connect** : Connectez votre nœud à des applications Nostr
- **Adresse Lightning** : Configurez votre adresse @dazno.de personnalisée
- **Données détaillées** : Explorez l'historique des transactions et les statistiques de votre nœud

## 10. Sécurité et bonnes pratiques

- Ne stockez pas de grandes quantités de bitcoins sur votre nœud Daznode
- Utilisez toujours l'authentification à deux facteurs
- Fermez les canaux inactifs pour récupérer vos fonds
- Sauvegardez régulièrement les informations importantes de votre nœud

## Besoin d'aide ?

- Consultez notre [documentation complète](/docs)
- Rejoignez notre communauté sur [Nostr](#) ou [Telegram](#)
- Contactez notre support à support@dazno.de

Félicitations ! Vous êtes maintenant prêt à explorer le monde passionnant du Lightning Network avec Daznode. 