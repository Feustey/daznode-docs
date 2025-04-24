---
layout: base.njk
title: Démarrage avec votre nœud Umbrel
---

# Démarrage avec votre nœud Umbrel

*Temps de lecture estimé : 8 minutes*

## Introduction

Si vous êtes un nouvel utilisateur d'un nœud Umbrel, voici un mini-guide et des liens sur la façon d'utiliser ce logiciel de nœud simple mais puissant. Il est important, si vous partez de zéro, de commencer par lire sur ce qu'est le réseau Lightning de Bitcoin (LN) et comment l'utiliser, les concepts et fonctionnalités de base.

Un nœud Lightning est comme un organisme vivant, tel un mycélium qui a besoin de plus de connexions. Plus vous le connectez à d'autres pairs, plus il prend vie. Alors réfléchissez bien à la façon dont vous connectez votre Umbrel.

## Question à vous poser en tant que nouvel utilisateur d'un nœud Umbrel Bitcoin/LN :

### POURQUOI voulez-vous exécuter un nœud ?

#### Résumé

Bien que certains affirment qu'exécuter un nœud aujourd'hui est purement altruiste, il existe des incitations à le faire :

- **Investissement :** Si vous êtes fortement investi dans Bitcoin, vous pourriez souhaiter soutenir le réseau afin de protéger cet investissement.

- **Performance :** Il est considérablement plus rapide d'interroger une copie locale de la blockchain plutôt que d'interroger des services de données blockchain via Internet.

- **Résistance à la censure :** En recevant et en envoyant des transactions depuis votre propre nœud, personne n'a le pouvoir de vous en empêcher.

- **Confidentialité :** Si vous interrogez d'autres nœuds ou services concernant les données de la blockchain, ils peuvent utiliser ces requêtes pour tenter de vous désanonymiser.

- **Absence de confiance requise :** Posséder une copie du registre que vous avez validée vous-même signifie que vous n'avez pas besoin de faire confiance à un tiers pour être honnête sur l'état du registre.

## Scénarios d'utilisation

### A. Vous êtes un simple utilisateur LN qui veut juste payer ses achats en sats
* Vous aurez besoin de plus de liquidité sortante
* Mais aussi de liquidité entrante au cas où vous devriez recevoir des amis ou autres
* De bons pairs à connecter pour que vos transactions passent facilement et à moindre coût
* Vous n'avez pas besoin d'utiliser trop de fonds dans votre nœud LN, juste assez pour couvrir vos dépenses

### B. Vous êtes un commerçant ou freelance ou prestataire de services vendant des produits/services en ligne ou physiques via LN
* Vous aurez besoin de plus de liquidité entrante, ce qui signifie que d'autres pairs ou même vos propres clients doivent ouvrir des canaux vers votre nœud
* Publiez l'ID de votre nœud auprès de vos clients et encouragez-les à se connecter à votre nœud et à vous payer directement, même sans frais
* Videz périodiquement vos canaux remplis afin d'avoir à nouveau de "l'espace" pour plus de paiements entrants. Il existe de nombreuses façons de le faire
* Vous aurez besoin de bons canaux importants pour pouvoir recevoir autant de paiements que possible
* Vous n'avez pas besoin de mettre trop de fonds de votre côté, vous êtes le destinataire et non le dépensier

### C. Vous êtes juste un opérateur de nœud, vous êtes plus intéressé par le routage des transactions via LN
* Vous n'effectuez pas trop de paiements à l'aide de votre nœud (mauvais, vraiment mauvais)
* Vous aurez besoin de liquidité entrante et sortante. Et beaucoup, alors préparez-vous avec une grande quantité de fonds à mettre dans vos canaux LN. Donc si vous voulez être un nœud de routage avec 20k sats ou 1M sats... OUBLIEZ-LE ! Retournez vous coucher
* Vous aurez besoin de canaux équilibrés, alors mieux vaut rejoindre les "Rings of Fire"
* Vous devrez savoir comment gérer les frais des canaux, alors commencez à apprendre
* Vous aurez besoin d'un matériel solide et d'un nœud toujours en ligne. Ce n'est pas une blague !
* Vous pouvez lentement entrer dans Lightning Pool et "louer"/mettre aux enchères la liquidité de votre nœud. Mais vous aurez besoin d'un nœud solide et de beaucoup de liquidité pour vraiment voir des "revenus"

### D. Vous testez et apprenez, ou vous êtes un développeur utilisant un nœud comme base
* Vous avez juste besoin de quelques canaux entrants et sortants pour jouer avec
* Vous n'avez pas besoin de trop de fonds dedans
* Il est préférable d'informer vos pairs que vous êtes un pair temporaire pour eux, votre nœud est juste un terrain d'essai, ils ne s'attendront donc pas à ce que vous soyez en ligne ou un pair pour toujours

### E. Vous voulez être "l'Oncle Jim Banque" pour votre famille et vos amis
* Vous offrirez des services bancaires BTC à votre famille et à vos amis. Cela signifie beaucoup de responsabilité et de confiance. Ce n'est pas une blague, vous êtes maintenant une vraie banque
* Vous aurez besoin de liquidité dans les deux sens (entrée/sortie) pour couvrir les besoins de vos "clients". N'oubliez pas : la liquidité de votre nœud est leur "eau dans les tuyaux", pas leurs fonds. Alors gardez toujours vos tuyaux remplis d'eau
* Vous pouvez offrir de nombreux "services bancaires", que vous pouvez réaliser en utilisant LNDHUB Bluewallet et LNDHUB LNBits. Et bien d'autres...
* Vous devrez former vos clients sur l'utilisation de ces services, alors commencez à créer vos propres guides web simples pour eux

### F. "Je veux gagner de l'argent avec mon nœud, je veux des gains, je veux un certain % par mois", "Je veux miner des bitcoins avec mon nœud", "Je veux un revenu passif"...
* OUBLIEZ ÇA !
* C'est une mauvaise mentalité, c'est une mentalité communiste paresseuse, gagner de l'argent sans rien faire. Pour gagner de l'argent, vous et votre nœud devez travailler dur
* Un nœud BTC/LN n'est pas une merde de DeFi shitcoin airdrop, c'est une chose sérieuse. Si vous venez de ce "côté obscur", il n'y a "pas de soupe pour vous"
* Arrêtez de penser comme ça et revoyez les 5 points précédents

## À RETENIR

### 8 points à toujours garder en mémoire

**Tout d'abord : le mot de passe par défaut du nœud Umbrel est _moneyprintergobrrr_**

**2ème -** CHAQUE application Umbrel aura une adresse onion différente, donc si vous prévoyez de l'utiliser en dehors de votre LAN, enregistrez ces adresses onion dans les favoris de votre navigateur Tor, mais ne les exposez/partagez JAMAIS en public. Rappelez-vous qu'en utilisant des adresses onion, il n'est pas nécessaire d'ouvrir des ports sur votre routeur et le trafic est sécurisé.

**3ème -** changez le mot de passe par défaut de votre nœud Umbrel, mais gardez à l'esprit que pour le moment, les applications Thunderhub et Lightning Terminal ne mettront pas à jour ce mot de passe et conserveront le mot de passe par défaut. Vous pouvez changer ce mot de passe en fouillant manuellement dans le ventre du référentiel docker de chaque application.

**4ème -** **ATTENDEZ** que le nœud soit entièrement synchronisé et n'envoyez pas de fonds à votre portefeuille de nœud jusque-là. Vous ne pouvez pas les utiliser de toute façon jusqu'à ce qu'il soit synchronisé, alors pourquoi tant de précipitation ? La **patience** est la clé pour un opérateur de nœud.

**5ème -** Ayez en place une alimentation de secours UPS. C'est très important, en particulier pour les machines Raspberry Pi. Toute fluctuation d'alimentation, même courte, peut affecter votre matériel et en particulier ce qui est le plus important - le disque dur.

**6ème -** la carte mSD est l'endroit où réside le système d'exploitation Umbrel, elle peut être reflashée autant de fois que vous le souhaitez (comme vous l'avez fait lors de la 1ère installation), en utilisant toujours la dernière version d'Umbrel. Cela n'affectera en aucune façon les données du nœud. Ne retirez pas cette carte ! Sans système d'exploitation, votre nœud est MORT.

**7ème -** votre disque SSD/HDD est l'endroit où résident les données utilisateur et les données blockchain Bitcoin. Cela signifie - gardez un œil dessus pour qu'il ne soit pas cassé.

**8ème -** Sauvegardez vos canaux ! Chaque fois que vous ouvrez/fermez des canaux ou que vous effectuez des mises à jour de votre système, faites une sauvegarde statique de l'état de vos canaux. Allez sur le tableau de bord Umbrel → Lightning → cliquez sur les 3 points à droite et sélectionnez sauvegarder les canaux. En option, vous pouvez ajouter une WatchTower à votre nœud.

Il existe 3 façons d'avoir une sauvegarde pour vos canaux LN :

* sauvegarde SCB manuelle, en enregistrant le fichier sur votre PC local/clé USB
* automatisée, par les scripts Umbrel, chaque fois que vous éteignez/redémarrez le nœud ou le mettez à jour, ouvrez/fermez des canaux, le fichier est enregistré dans :
`/home/umbrel/umbrel/lnd/data/chain/bitcoin/mainnet/channel.backup`
* cette sauvegarde SCB automatisée est également téléchargée sur les serveurs Umbrel et chiffrée avec la seed de votre nœud, elle peut ensuite être récupérée avec l'aide des développeurs Umbrel, en fournissant votre seed comme preuve.

## MODES D'INSTALLATION

### A. Utilisation d'un Raspberry Pi 4
* Veuillez utiliser le tutoriel matériel d'Umbrel pour les modèles RaspPi qui ont été testés pour le nœud Umbrel (pour éviter de futurs problèmes matériels).
* En option, vous pouvez également utiliser TheBitcoinMachine RaspPi versions, fonctionne bien et a belle apparence. 