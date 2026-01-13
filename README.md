# 🏋️ Sport To Go

Application de suivi d'entraînement sportif avec gestion de programmes cycliques, chronomètre de repos et visualisation des progrès.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Fonctionnalités

### 📋 Gestion des Programmes
- Création de programmes d'entraînement personnalisés
- Configuration des cycles (nombre de jours par cycle, nombre de cycles)
- Ajout de séances avec assignation au jour du cycle
- Ajout d'exercices avec séries, répétitions et temps de repos

### 🏃 Mode Entraînement
- Affichage de la séance du jour selon le cycle en cours
- Validation des séries une par une
- Enregistrement du nombre de répétitions et du poids utilisé
- **Chronomètre visuel** avec compte à rebours automatique entre les séries
- Signal sonore à la fin du temps de repos

### 📊 Dashboard & Statistiques
- Graphique d'évolution du poids corporel
- Graphique des séances par semaine
- Statistiques globales (séances totales, exercices réalisés)
- Historique des dernières séances

### 📅 Calendrier
- Visualisation mensuelle des séances effectuées
- Indicateurs visuels pour les jours d'entraînement
- Récapitulatif mensuel

### 👤 Profil & Mensurations
- Enregistrement du poids corporel
- Suivi des mensurations (poitrine, taille, hanches, bras, cuisses)
- Historique complet des mesures

## 🚀 Démarrage avec Docker Compose

### Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)

### Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd sport-to-go
   ```

2. **Lancer l'application**
   ```bash
   docker-compose up -d --build
   ```

3. **Accéder à l'application**
   
   Ouvrez votre navigateur et rendez-vous sur : **http://localhost:3000**

### Commandes utiles

```bash
# Démarrer les containers
docker-compose up -d

# Voir les logs
docker-compose logs -f app

# Arrêter les containers
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v
```

## 🛠️ Développement local (sans Docker)

### Prérequis
- Node.js 20+
- PostgreSQL 17+

### Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer la base de données**
   
   Créer un fichier `.env` à la racine :
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sport_tracker"
   ```

3. **Initialiser la base de données**
   ```bash
   npm run db:push
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 📁 Structure du projet

```
sport-to-go/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── calendar/          # Page calendrier
│   ├── dashboard/         # Page dashboard
│   ├── profile/           # Page profil
│   ├── programs/          # Gestion des programmes
│   └── workout/           # Mode entraînement
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── navigation.tsx    # Navigation principale
│   └── timer.tsx         # Chronomètre
├── lib/                   # Utilitaires
├── prisma/               # Schéma Prisma
└── docker-compose.yml    # Configuration Docker
```

## 🗄️ Base de données

L'application utilise PostgreSQL avec Prisma comme ORM. Les principales entités sont :

- **Program** : Programme d'entraînement avec cycles
- **Session** : Séance d'entraînement liée à un jour du cycle
- **Exercise** : Exercice avec séries, répétitions et repos
- **WorkoutLog** : Journal des séances effectuées
- **PerformanceLog** : Détail des performances par série
- **BodyMetric** : Mensurations et poids corporel

## 📝 Licence

MIT
