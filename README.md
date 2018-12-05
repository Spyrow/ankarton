# Ankarton

Ceci est un fork du projet [Ankarton](https://github.com/Spyrow/ankarton "Spyrow's Ankarton") de Spyrow. 
Sa version étant outdated, je l'ai remise à jour. 

# Pré-requis 

Il vous faudra installer [NodeJS](https://nodejs.org/fr/ "NodeJS") pour lancer les commandes.


# Installation
## En ligne de commande

```
$ git clone https://github.com/Misuki-CG/ankarton.git
$ npm install
$ npm run lint
$ npm run build
```

## Depuis l'archive

Il suffit simplement de se rendre dans l'onglet "release" de ce repo, de télécharger l'archive ayant "release" dans son nom et d'extraire cette archive sur votre machine. 


# Utilisation

```
$ node CommandLine.js --out <fichierSortie> [options]
```

Tous les comptes vont être générés dans <fichierSortie> 
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

