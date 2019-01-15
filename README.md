# Ankarton

Ceci est un fork du projet [Ankarton](https://github.com/Spyrow/ankarton "Spyrow's Ankarton") de Spyrow. 
Sa version étant outdated, je l'ai remise à jour. 

# Pré-requis 

Il vous faudra installer [NodeJS](https://nodejs.org/fr/ "NodeJS") pour lancer les commandes.


# Installation
## Depuis l'archive

Il suffit simplement de se rendre [ici](https://github.com/Misuki-CG/ankarton/releases "release"), de télécharger l'archive ayant "release" dans son nom et d'extraire cette archive sur votre machine. 

Le fichier **CommandLine.js** se trouve dans le dossier **dist**. 


## En ligne de commande

```
$ git clone https://github.com/Misuki-CG/ankarton.git
$ cd ankarton/
$ npm install
$ npm run lint
$ npm run build
```

Le fichier CommandLine.js se trouvera alors dans le dossier /ankarton/dist/ .


# Utilisation

```
$ node CommandLine.js --out <fichierSortie> [options]
```

Tous les comptes vont être générés dans \<fichierSortie\>

Pour l'utilisation de proxy: 
```
$ node CommandLine.js --out <fichierSortie> -p ./proxy.txt
```

Augmenter le nombre de compte à créer :

```
$ node CommandLine.js --out <fichierSortie> --total nombreCompte
```
Les deux en même temps :
```
$ node CommandLine.js --out <fichierSortie> --total nombreCompte -p ./proxy.txt
```

