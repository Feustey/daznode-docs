# Daznode : Votre Nœud Lightning dans le Cloud

## Présentation générale

Daznode est une solution complète qui vous permet d'accéder à un nœud Lightning Network performant, disponible 24h/24 et 7j/7, accessible depuis n'importe quel appareil. Notre mission est de rendre le Lightning Network accessible à tous, des débutants aux utilisateurs expérimentés.

### Pourquoi choisir Daznode ?

#### 1. Recevez vos ⚡zaps de manière fiable

De nombreux utilisateurs de Nostr rencontrent des problèmes comme :
- Des zaps qui ne fonctionnent pas
- Des zaps qui ne se confirment jamais

Les nœuds Daznode sont en ligne 24h/24 et 7j/7, vous permettant de toujours recevoir vos zaps sans interruption.

#### 2. Accédez à votre nœud Lightning depuis n'importe quel appareil 📱💻

Daznode fonctionne dans un navigateur web et s'adapte parfaitement à tous les appareils modernes : iPhone, iPad, Android, Linux, Mac, Windows, Chromebook. Notre interface s'ajuste aussi bien aux petits qu'aux grands écrans.

#### 3. Utilisez un nœud temporaire quand vous en avez besoin 🚮

Le Lightning Network, utilisé correctement, peut être un puissant outil de confidentialité. Les nœuds Daznode sont conçus pour être jetables. Besoin de déplacer des satoshis de manière privée et sécurisée ? Créez un nœud en quelques secondes, obtenez de la capacité entrante, ouvrez des canaux, fermez des canaux ou permettez à d'autres nœuds d'ouvrir des canaux vers vous. Une fois terminé, fermez rapidement tous vos canaux, retirez vos fonds et supprimez le nœud.

#### 4. Obtenez une capacité entrante rapidement 🚀

Obtenir une capacité entrante est un problème courant pour les nouveaux nœuds Lightning. Daznode rend ce processus super simple et instantané.

#### 5. Libérez-vous des contraintes des grandes entreprises technologiques ⛓️‍💥

Les grandes entreprises technologiques et leurs partenaires dans les secteurs bancaires et des cartes de crédit veulent vous enfermer dans leurs "jardins clos", où vous êtes forcé de céder vos données et d'autoriser la surveillance de toutes vos activités. Daznode est 100% basé sur le web et ne nécessite pas l'autorisation d'Apple ou de Google. Et nous n'acceptons pas les cartes de crédit !

#### 6. Essayez Nostr Wallet Connect Icon Nostr Wallet Connect...

Nostr Wallet Connect est un protocole nouveau et expérimental permettant de connecter des nœuds Lightning avec des applications et des sites web. Daznode implémente entièrement cette spécification. Soyez prudent avec les connexions NWC "envoyer et recevoir" - utilisez-les uniquement avec des applications et des sites web de confiance.

#### 7. Obtenez une adresse Lightning 📨

Obtenez une adresse Lightning `@dazno.de` que vous pouvez utiliser pour recevoir des paiements. Le standard d'adresse Lightning n'est pas parfait, mais il est largement pris en charge et fonctionne bien avec Daznode.

#### 8. Éduquez-vous sur le Lightning Network 💡

Daznode est conçu pour être utilisé comme outil pédagogique. L'aide contextuelle détaillée (et divertissante) vous permet de découvrir progressivement les concepts de Lightning, y compris des sujets comme les factures, les données détaillées des nœuds et les devises fiat.

#### 9. Suivez les opérations de longue durée ⏳

De nombreuses opérations sur le Lightning Network ont une propriété déroutante : parfois elles sont super rapides, et parfois elles prennent une éternité. Cela rend difficile la création d'une expérience utilisateur cohérente et compréhensible. Daznode assure le suivi des "opérations en cours" d'une manière qui a du sens aussi bien pour les nouveaux utilisateurs que pour les opérateurs de nœuds expérimentés.

## Modèle de sécurité

L'authentification à deux facteurs, utilisant Google Authenticator (ou similaire), est requise pour tous les utilisateurs de Daznode ayant des soldes supérieurs à 100 000 satoshis. Il s'agit d'une stratégie de sécurité puissante et largement testée qui devrait servir à empêcher les acteurs malveillants d'accéder à votre nœud Daznode.

Comprendre les compromis que nous avons faits est important : nous avons réalisé qu'il existe un problème majeur avec le fait de donner aux utilisateurs une phrase de récupération (seed phrase) et de supposer qu'ils pourraient restaurer leur nœud à tout moment. La plupart des utilisateurs ne seront pas en mesure de restaurer leur nœud avec succès ! Le modèle de restauration "static channel backup" de Lightning est déroutant, même pour les opérateurs de nœuds expérimentés. Une erreur dans ce processus, et vous perdrez tous vos sats.

Pour cette raison, nous stockons les sauvegardes chiffrées et conservons la capacité de restaurer les nœuds en cas de défaillance matérielle. Cette approche devrait bien fonctionner pour les nouveaux utilisateurs et les utilisateurs avec de petits soldes, mais n'est PAS conçue pour les nœuds à grande échelle avec des soldes élevés.

## Prêt à essayer Daznode ?

Inscrivez-vous pour un compte gratuit et commencez dès maintenant à explorer le monde du Lightning Network avec une solution fiable, performante et accessible. 