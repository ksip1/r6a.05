# 🎬 Projet R6A.05 - Kyllian SIP

> API REST complète de gestion de films développée avec Hapi.js dans le cadre du module R6.05

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Hapi.js](https://img.shields.io/badge/Hapi.js-20.x-orange)](https://hapi.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.x-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement des services externes](#-lancement-des-services-externes)
- [Démarrage du projet](#-démarrage-du-projet)
- [Documentation API](#-documentation-api)
- [Architecture du projet](#-architecture-du-projet)
- [Choix techniques](#-choix-techniques)
- [Tests](#-tests)
- [Auteur](#-auteur)

---

## ✨ Fonctionnalités

### 👤 Gestion des Utilisateurs
- **Inscription** avec hachage sécurisé du mot de passe (bcrypt)
- **Authentification** via JWT (JSON Web Token)
- **CRUD complet** des utilisateurs (Admin uniquement)

### 🔐 Gestion des Rôles (Scopes)
- Scope `user` attribué par défaut à l'inscription
- Scope `admin` pour les opérations de gestion avancée
- Protection des routes sensibles par scope

### 🎥 Gestion des Films
- **CRUD complet** des films (réservé aux admins)
- Informations : titre, description, réalisateur, date de sortie

### ⭐ Gestion des Favoris
- Relation **Many-to-Many** entre Utilisateurs et Films
- Ajout/Suppression de films en favoris
- Consultation de sa liste de favoris

### 📧 Notifications par Email
- **Email de bienvenue** à l'inscription
- **Notification** lors de l'ajout d'un nouveau film (tous les utilisateurs)
- **Notification ciblée** lors de la modification d'un film (utilisateurs ayant ce film en favoris)

### 📤 Export CSV Asynchrone
- Demande d'export déclenchée par un admin
- Traitement asynchrone via **RabbitMQ** (Message Broker)
- Envoi du fichier CSV par email une fois généré

---

## 🛠 Stack Technique

| Technologie | Version | Description |
|-------------|---------|-------------|
| **@hapi/hapi** | 20.x | Framework HTTP Node.js |
| **@hapi/jwt** | 3.x | Authentification JWT |
| **hapi-swagger** | 14.x | Documentation API auto-générée |
| **Objection.js** | 2.x | ORM SQL |
| **Knex.js** | 0.21.x | Query Builder & Migrations |
| **MySQL** | 8.0 | Base de données relationnelle |
| **Nodemailer** | 7.x | Envoi d'emails (via Ethereal.email) |
| **amqplib** | 0.10.x | Client RabbitMQ |
| **Docker** | - | Conteneurisation des services |

---

## 📌 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** (inclus avec Node.js)
- **Docker** et **Docker Compose**
- **Git**

---

## 📥 Installation

1. **Cloner le repository**
```bash
git clone <url-du-repository>
cd iut-project
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement** (voir section suivante)

---

## ⚙️ Configuration

Créez un fichier `.env` dans le dossier `server/` avec les variables suivantes :

```env
# ============================================
# CONFIGURATION BASE DE DONNÉES
# ============================================
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=hapi
DB_DATABASE=user

# ============================================
# CONFIGURATION SERVEUR
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# CONFIGURATION JWT
# ============================================
JWT_SECRET=votre_secret_jwt_ultra_securise_a_changer

# ============================================
# CONFIGURATION MAIL (Ethereal.email pour dev)
# ============================================
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=votre_utilisateur_ethereal@ethereal.email
MAIL_PASS=votre_mot_de_passe_ethereal

# ============================================
# CONFIGURATION RABBITMQ
# ============================================
RABBITMQ_URL=amqp://localhost
```

> 💡 **Astuce** : Pour obtenir des identifiants Ethereal.email de test, rendez-vous sur [https://ethereal.email/create](https://ethereal.email/create)

---

## 🐳 Lancement des services externes

### MySQL via Docker

```bash
docker run --name mysql-iut \
  -e MYSQL_ROOT_PASSWORD=hapi \
  -e MYSQL_DATABASE=user \
  -p 3306:3306 \
  -d mysql:8.0
```

### RabbitMQ via Docker

```bash
docker run --name rabbitmq-iut \
  -p 5672:5672 \
  -p 15672:15672 \
  -d rabbitmq:3-management
```

> 📊 L'interface de management RabbitMQ est accessible sur [http://localhost:15672](http://localhost:15672)  
> Identifiants par défaut : `guest` / `guest`

### Vérifier que les services sont lancés

```bash
docker ps
```

---

## 🚀 Démarrage du projet

### 1. Exécuter les migrations de base de données

Les migrations sont exécutées automatiquement au démarrage en mode développement (`migrateOnStart: true`).

Pour exécuter manuellement les migrations :

```bash
npx knex migrate:latest
```

### 2. Lancer le serveur

```bash
npm start
```

Le serveur démarre sur [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation API

Une documentation Swagger interactive est automatiquement générée et accessible à l'adresse :

### 🔗 [http://localhost:3000/documentation](http://localhost:3000/documentation)

Cette documentation permet de :
- Visualiser tous les endpoints disponibles
- Tester les routes directement depuis le navigateur
- Voir les schémas de requêtes et réponses attendus

---

## 📁 Architecture du projet

```
iut-project/
├── lib/
│   ├── index.js              # Plugin principal Hapi
│   ├── auth/                 # Configuration authentification
│   │   ├── default.js
│   │   └── strategies/
│   │       └── jwt.js        # Stratégie JWT
│   ├── migrations/           # Migrations Knex
│   │   ├── 0-user.js
│   │   ├── 1-add-user-columns.js
│   │   ├── 2-add-scope.js
│   │   ├── 3-create-film.js
│   │   └── 4-create-favorite.js
│   ├── models/               # Modèles Objection.js
│   │   ├── user.js
│   │   └── film.js
│   ├── plugins/              # Plugins Hapi
│   │   ├── @hapi.jwt.js
│   │   ├── @hapipal.schmervice.js
│   │   ├── @hapipal.schwifty.js
│   │   └── swagger.js
│   ├── routes/               # Définition des routes
│   │   ├── user.js
│   │   ├── users.js
│   │   ├── login.js
│   │   ├── film.js
│   │   ├── favorite.js
│   │   ├── export.js
│   │   └── ...
│   └── services/             # Logique métier
│       ├── user.js
│       ├── film.js
│       ├── favorite.js
│       ├── mail.js
│       └── export.js
├── server/
│   ├── index.js              # Point d'entrée serveur
│   ├── manifest.js           # Configuration Glue
│   └── .env                  # Variables d'environnement
├── test/                     # Tests
├── knexfile.js               # Configuration Knex CLI
└── package.json
```

---

## 🎯 Choix techniques

### Framework Hapi.js
Hapi.js a été choisi pour sa **robustesse** et son écosystème riche. Il offre une configuration déclarative et un système de plugins puissant, idéal pour construire des APIs RESTful maintenables.

### Architecture en couches (Routes / Services / Models)
L'utilisation de **@hapipal/haute-couture** permet une organisation automatique du code. Les **services** encapsulent la logique métier, les **routes** gèrent le routing HTTP, et les **models** définissent les entités.

### ORM Objection.js + Knex
- **Knex** pour les migrations et le query building
- **Objection.js** pour l'ORM avec support des relations (belongsToMany, etc.)
- Permet une gestion propre des relations Many-to-Many pour les favoris

### Authentification JWT avec Scopes
Les JWT permettent une authentification **stateless**. Les scopes (`user`, `admin`) sont inclus dans le token et vérifiés à chaque requête pour contrôler les accès.

### Message Broker RabbitMQ
L'export CSV est traité de manière **asynchrone** pour ne pas bloquer l'API. RabbitMQ assure la fiabilité de la file de messages et permet de découpler le producteur (demande d'export) du consommateur (génération CSV).

### Nodemailer avec Ethereal.email
Ethereal.email fournit un **serveur SMTP de test** parfait pour le développement. Les emails sont capturés et visualisables sans réellement les envoyer.

---

## 🧪 Tests

Le projet utilise **@hapi/lab** comme framework de test.

```bash
npm test
```

---

## 👤 Auteur

**ksip1** - Projet réalisé dans le cadre du module R6.05

