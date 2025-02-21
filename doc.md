# Documentation API NodeJS

## Composition de l'API

L'API est faite en typeScript elle est composée de plusieurs dossier : 

- config
- docs
- src
- test

### Dossier : config

Emplacement des fichiers de configuration des variables suivant l'environnement d'ou est executer l'API.

### Dossier : docs

Emplacement des fichiers pour la documentation des routes seront stockés.

### Dossier : src

Emplacement des fichiers de l'API

### Dossier : test

Emplacement des fichier pour les test unitaires et d'integrité

## Architecture de l'API

Dans ce starter tout un squelette a déjà été penser pour le bon fonctionnement de votre API. 

### ORM : Sequelize

Liaison a une base de donnée grâce a sequelize, dans le dossier `database`. On retrouve un sous dossier `data` qui permet de stocker des données d'initialisation pour la base de donnée. Un fichier `init` qui va initialisé au demarrage de l'API les données dans la base.

### Models

Ce dossier stock tout les `models` de donnée de la table, cela permet a sequelize de générer des `tables`, `parametrage` des champs, mise en place des `contraintes`.

### Tools

Ce dossier est composé de plusieurs classe pour effectuer des fonctions simple, génération d'UUID, chiffrage, gestion de fichier, génération de token, etc.

### Middleware

Il y a déjà un middleware pour tester l'authentification, et un pour le rôle.

### Routes

Les routes sont stocker dans des sous dossiers dans /Routes afin de structurer/organiser l'API.

Chaque route est relier a une classe Validator et une classe Controller, la premiere permet de valider les données en entrer et le controller traite ces données.

### Uploads

Cet emplacement sert a stocker différente image.

### App

Il est à la racine du dossier source est est le coeur de l'API.

## Les packages

Les packages de node ne sont pas installer afin d'avoir un squelette leger pour pouvoir télécharger le starter rapidement.

## Contenu des fichiers

Chaque fichier a un exemple fonctionnel afin d'avoir un model lors d'un démarrage d'un nouveau projet.