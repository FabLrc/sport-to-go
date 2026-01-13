---
agent: agent
---

### 1. Architecture Docker (Persistance Locale)

Puisque c'est pour un usage local, on utilise un **volume Docker** pour que tes données PostgreSQL ne soient pas supprimées si tu arrêtes les containers.

### 2. Modélisation Prisma (Logique de Cycles)

Pour gérer un programme qui "boucle", on sépare la **définition** (Template) de l'**exécution** (Log).

**Fichier `prisma/schema.prisma` (Extrait clé) :**

```prisma
model Program {
  id             Int       @id @default(autoincrement())
  name           String
  startDate      DateTime  // Date de début du programme
  cycleDays      Int       // Nombre de jours dans une boucle (ex: 7 pour une semaine)
  totalCycles    Int       // Combien de fois on répète la boucle
  sessions       Session[]
}

model Session {
  id          Int        @id @default(autoincrement())
  programId   Int
  program     Program    @relation(fields: [programId], references: [id])
  name        String
  dayInCycle  Int        // Quel jour de la boucle (ex: Jour 1, Jour 3...)
  exercises   Exercise[]
  logs        WorkoutLog[]
}

model Exercise {
  id            Int      @id @default(autoincrement())
  sessionId     Int
  session       Session  @relation(fields: [sessionId], references: [id])
  name          String
  sets          Int
  reps          Int
  restTime      Int      // Temps de repos en secondes
  order         Int
}

model WorkoutLog {
  id          Int      @id @default(autoincrement())
  sessionId   Int
  session     Session  @relation(fields: [sessionId], references: [id])
  date        DateTime @default(now())
  performance PerformanceLog[]
}

```

---

### 3. Logique de Calcul du Planning

Puisque ton programme est une boucle :

* **Date actuelle** : `Today`
* **Jours écoulés depuis le début** : `Diff = Today - Program.startDate`
* **Position dans le cycle** : `JourActuel = Diff % Program.cycleDays`
* **Numéro du cycle** : `CycleActuel = Floor(Diff / Program.cycleDays)`

Si `CycleActuel < Program.totalCycles`, le programme est toujours actif.

---

### 4. Le Chronomètre Visuel (Frontend)

Pour le chronomètre des temps de repos, je te suggère de créer un composant React réutilisable utilisant `useEffect`.

**Concept du composant `Timer.tsx` :**

* Prend en entrée `duration` (secondes).
* Un état `timeLeft`.
* Un cercle de progression visuel (SVG ou barre de progression Shadcn).
* Un bip sonore (optionnel) via l'API `Audio` du navigateur quand il arrive à zéro.

---

### 5. Plan de Développement Détaillé

#### Phase 1 : Setup (Jour 1-2)

1. Initialiser Next.js (App Router).
2. Configurer Docker et Prisma.
3. Créer le schéma de base de données et lancer la migration.

#### Phase 2 : Le Builder de Programme (Jour 3-5)

1. Interface pour créer un `Program` (Nom, Date de début, Cycles).
2. Interface dynamique pour ajouter des `Sessions` et assigner un `dayInCycle`.
3. Interface pour ajouter des `Exercises` (avec sets, reps, repos).

#### Phase 3 : Mode Entraînement & Chrono (Jour 6-8)

1. Page "Séance du jour" : récupère la séance prévue selon la date.
2. Système de "Check" pour chaque série effectuée.
3. **Le Chronomètre** : déclenchement automatique du compte à rebours après avoir validé une série.
4. Enregistrement final de la séance dans `WorkoutLog`.

#### Phase 4 : Suivi & Graphiques (Jour 9-10)

1. Page Profil/Metrics : pour le poids et les mensurations.
2. Dashboard avec **Recharts** :
* Graphique de progression (Poids soulevé par exercice au fil du temps).
* Graphique de poids corporel.


3. Vue Calendrier : colorer les jours où une séance a été validée.

