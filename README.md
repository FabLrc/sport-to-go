# Sport To Go

Application de suivi d'entraînement sportif avec gestion de programmes cycliques, chronomètre de repos et visualisation des progrès.

## Fonctionnalités

- Gestion de programmes d'entraînement avec cycles
- Mode entraînement avec chronomètre automatisé
- Suivi du poids et des mensurations
- Calendrier d'entraînement
- Dashboard avec statistiques
- API REST complète

## Installation avec Docker Compose

### Configuration requise

- Docker

### Installation

1. Cloner le projet
   ```bash
   git clone <url-du-repo>
   cd sport-to-go
   ```

2. Lancer l'application
   ```bash
   docker-compose up -d --build
   ```

3. Accéder à l'application
   
   http://localhost:3000

## Développement local

### Prérequis

- Node.js 20+
- PostgreSQL 17+

### Configuration

1. Installer les dépendances
   ```bash
   npm install
   ```

2. Créer le fichier `.env`
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sport_tracker"
   ```

3. Initialiser la base de données
   ```bash
   npm run db:push
   ```

4. Lancer le serveur
   ```bash
   npm run dev
   ```

## Structure du projet

```
sport-to-go/
├── app/                 # Pages et API routes
│   ├── api/            # Endpoints API
│   ├── calendar/       # Calendrier
│   ├── dashboard/      # Dashboard
│   ├── profile/        # Profil utilisateur
│   ├── programs/       # Gestion programmes
│   └── workout/        # Mode entraînement
├── components/         # Composants React
│   └── ui/            # Composants UI
├── lib/                # Utilitaires
├── prisma/            # ORM et schéma
└── docker-compose.yml # Configuration Docker
```

## Base de données

Principales entités : Program, Session, Exercise, WorkoutLog, PerformanceLog, BodyMetric.

