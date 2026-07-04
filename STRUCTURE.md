# 📚 StudyMate — Assistant de Révisions

Plateforme web tout-en-un pour organiser, suivre et optimiser ses révisions.

---

## 0. Concept central : deux modes d'utilisation

Au lancement, l'utilisateur choisit un mode :

```
              Écran d'accueil
        ┌───────────┴───────────┐
        ▼                       ▼
   MODE PROGRAMME         RÉVISION SPONTANÉE
   (avec mémoire)         (sans mémoire)
```

**Mode Programme** — une unité de révision persistée qui regroupe :
- un nom de programme,
- une ou plusieurs matières,
- un type de suivi de progression : notes réelles /20 (`GRADES`) OU
  ressenti auto-évalué (`MOOD`),
- un objectif d'heures à passer,
- (à terme) l'ajout automatique de ses créneaux dans Google Agenda.
Le programme relie ainsi fiches, Pomodoro, quiz et progression autour
d'un objectif concret.

**Révision spontanée** — accès direct aux mêmes outils (Pomodoro, quiz,
fiches) mais **rien n'est enregistré** : session éphémère, sans trace.

### Entité Programme (modèle de données)

```
Programme (id, name, trackingType[GRADES|MOOD], targetHours, createdAt)
    └── @ManyToMany ──► Subject   (les matières concernées)
```

Les tâches, sessions Pomodoro et notes se rattacheront à un Programme
(et/ou à une matière). La révision spontanée ne crée aucun Programme.

---

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│   Dashboard │ Agenda │ IA │ Progression │ Tâches │ Pomodoro  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────▼──────────────────────────────────┐
│                  BACKEND (Java Spring Boot)                  │
│  Auth │ Services métier │ Intégrations externes │ Scheduler  │
└───────┬──────────────────┬──────────────────┬───────────────┘
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│  PostgreSQL  │  │ Google Calendar │  │  Claude API     │
│  (données)   │  │      API        │  │  (IA: résumés,  │
│              │  │                 │  │   quiz...)      │
└──────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 2. Stack technique

| Couche | Technologie | Pourquoi |
|---|---|---|
| Frontend | **React 18 + Vite + TypeScript** | Écosystème le plus documenté, parfait pour apprendre |
| UI | **Mantine** | Composants prêts à l'emploi : calendrier, graphiques, modales, notifications |
| Graphiques | **Recharts** | Courbes de progression simples à mettre en place |
| État serveur | **TanStack Query** | Gestion des appels API (cache, loading, erreurs) sans effort |
| Backend | **Java 21 + Spring Boot 3** | Framework Java standard : REST, sécurité, accès BDD |
| BDD | **PostgreSQL** (H2 en dev) | Fiable, gratuit ; H2 permet de démarrer sans rien installer |
| ORM | **Spring Data JPA / Hibernate** | Mapping objet-relationnel automatique |
| Auth | **Spring Security + OAuth2 Google** | Un seul login Google = auth + accès à Google Calendar |
| IA | **Claude API (Anthropic)** | Résumés de cours, génération de quiz, flashcards |
| Agenda | **Google Calendar API** | Synchronisation multi-périphériques native |

---

## 3. Modules fonctionnels

### 🗓️ Module Agenda (Google Calendar)
- Connexion du compte Google (OAuth2).
- Création de sessions de révision → synchronisées sur Google Agenda
  (visibles sur téléphone, tablette, etc.).
- Vue calendrier intégrée dans l'app (semaine / mois).
- Rappels automatiques avant chaque session.
- Suggestion de créneaux libres (lecture des événements existants).

### 🤖 Module IA
- **Résumé de cours** : upload d'un cours (texte / PDF) → résumé structuré.
- **Génération de quiz** : QCM générés à partir d'un cours, avec correction
  et explication de chaque réponse.
- **Flashcards** : génération automatique de cartes question/réponse.
- **Explication à la demande** : "explique-moi ce passage plus simplement".
- Historique des contenus générés, rangés par matière.

### 📈 Module Avancement
- Saisie des notes (contrôles, examens blancs, quiz internes).
- **Courbe de progression paramétrable** — l'utilisateur choisit les
  paramètres pris en compte :
  - notes soumises (pondérables par coefficient),
  - scores aux quiz IA,
  - heures de révision effectuées (via Pomodoro),
  - taux de complétion des tâches,
  - régularité (jours consécutifs de révision).
- Vue par matière + vue globale.
- Objectifs (ex : "atteindre 14 de moyenne en maths") avec jauge.

### ✅ Module Tâches
- Todo-list par matière ou globale.
- Cases à cocher, priorités, dates d'échéance.
- Sous-tâches (ex : "Réviser chapitre 3" → "Relire", "Faire les exos").
- Option : convertir une tâche en session dans l'agenda.

### ⏱️ Module Minuteur / Pomodoro
- Minuteur simple (durée libre).
- **Mode Pomodoro** : 25 min travail / 5 min pause / pause longue toutes
  les 4 sessions — durées personnalisables.
- Association d'une session à une matière ou une tâche.
- Historique des sessions → alimente la courbe d'avancement.
- Notification sonore + navigateur en fin de cycle.

### 👤 Transverse
- Compte utilisateur (login Google).
- Gestion des matières (couleur, coefficient, objectif).
- Dashboard d'accueil : prochaines sessions, tâches du jour, minuteur
  rapide, mini-courbe de progression.

---

## 4. Structure du projet

```
studymate/
├── backend/                          # Spring Boot
│   ├── src/main/java/com/studymate/
│   │   ├── StudymateApplication.java
│   │   ├── config/                   # Sécurité, CORS, clés API
│   │   │   ├── SecurityConfig.java
│   │   │   └── GoogleOAuthConfig.java
│   │   ├── auth/                     # Login Google, sessions, JWT
│   │   ├── user/                     # Profil, préférences
│   │   ├── subject/                  # Matières
│   │   ├── calendar/                 # Intégration Google Calendar
│   │   │   ├── CalendarController.java
│   │   │   ├── CalendarService.java
│   │   │   └── GoogleCalendarClient.java
│   │   ├── ai/                       # Intégration Claude API
│   │   │   ├── AiController.java
│   │   │   ├── SummaryService.java
│   │   │   ├── QuizService.java
│   │   │   └── FlashcardService.java
│   │   ├── progress/                 # Notes, paramètres, calcul courbe
│   │   │   ├── GradeController.java
│   │   │   ├── ProgressService.java  # agrégation des paramètres choisis
│   │   │   └── ProgressSettings.java
│   │   ├── task/                     # Tâches et sous-tâches
│   │   └── pomodoro/                 # Sessions de minuteur
│   │   └── common/                   # Exceptions, DTO partagés
│   ├── src/main/resources/
│   │   ├── application.yml           # config (BDD, OAuth, clés)
│   │   └── db/migration/             # scripts Flyway (schéma BDD)
│   └── pom.xml
│
├── frontend/                         # React + Vite + TypeScript
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                   # routing (React Router)
│   │   ├── api/                      # appels au backend (1 fichier / module)
│   │   │   ├── client.ts             # fetch configuré (base URL, auth)
│   │   │   ├── calendar.ts
│   │   │   ├── ai.ts
│   │   │   ├── progress.ts
│   │   │   ├── tasks.ts
│   │   │   └── pomodoro.ts
│   │   ├── pages/                    # 1 page = 1 module
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CalendarPage.tsx
│   │   │   ├── AiPage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   └── PomodoroPage.tsx
│   │   ├── components/               # composants réutilisables
│   │   │   ├── layout/               # sidebar, header
│   │   │   ├── quiz/                 # QuizPlayer, QuizResult
│   │   │   ├── progress/             # ProgressChart, ParamSelector
│   │   │   ├── tasks/                # TaskList, TaskItem
│   │   │   └── timer/                # PomodoroTimer, TimerSettings
│   │   ├── hooks/                    # logique réutilisable (useTimer...)
│   │   └── types/                    # types TypeScript partagés
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml                # PostgreSQL en local
└── README.md
```

---

## 5. Modèle de données (principales entités)

```
User        (id, email, name, googleRefreshToken, préférences)
Subject     (id, userId, name, color, coefficient, targetGrade)
Course      (id, subjectId, title, rawContent, summary, createdAt)
Quiz        (id, courseId, questions JSON, createdAt)
QuizAttempt (id, quizId, score, answers JSON, date)
Flashcard   (id, courseId, question, answer)
Grade       (id, subjectId, value, maxValue, coefficient, date, label)
Task        (id, userId, subjectId?, title, done, priority, dueDate, parentTaskId?)
PomodoroSession (id, userId, subjectId?, taskId?, workMinutes, date)
ProgressSettings (id, userId, paramètres activés + pondérations JSON)
StudyEvent  (id, userId, subjectId?, googleEventId, start, end)
```

---

## 6. API REST (aperçu)

| Méthode | Endpoint | Description |
|---|---|---|
| `GET`  | `/api/auth/login/google` | Démarre le login Google OAuth2 |
| `GET`  | `/api/calendar/events` | Événements de la période |
| `POST` | `/api/calendar/events` | Crée une session (+ sync Google) |
| `POST` | `/api/ai/summary` | Résume un cours |
| `POST` | `/api/ai/quiz` | Génère un quiz depuis un cours |
| `POST` | `/api/ai/quiz/{id}/attempt` | Soumet les réponses d'un quiz |
| `GET`  | `/api/progress/curve?subjectId=` | Points de la courbe |
| `PUT`  | `/api/progress/settings` | Paramètres de la courbe |
| `POST` | `/api/grades` | Soumet une note |
| `GET/POST/PATCH/DELETE` | `/api/tasks` | CRUD tâches (PATCH = cocher) |
| `POST` | `/api/pomodoro/sessions` | Enregistre une session terminée |

---

## 7. Roadmap de développement

### Phase 1 — Fondations ✦ *(commencer ici)*
- [ ] Squelette Spring Boot + BDD H2 + première entité (Task)
- [ ] Squelette React/Vite + Mantine + routing + layout (sidebar)
- [ ] Module **Tâches** complet (CRUD + cocher) — le plus simple, idéal
      pour apprendre le front

### Phase 2 — Minuteur & Matières
- [ ] Gestion des matières
- [ ] Minuteur + mode Pomodoro (100 % front) puis sauvegarde des sessions

### Phase 3 — Progression
- [ ] Saisie des notes
- [ ] Courbe avec Recharts + sélection des paramètres

### Phase 4 — IA
- [ ] Upload de cours + résumé (Claude API)
- [ ] Génération de quiz + interface de réponse + scores → courbe

### Phase 5 — Google Calendar
- [ ] OAuth2 Google (login)
- [ ] Sync des sessions de révision + vue calendrier

### Phase 6 — Finitions
- [ ] Dashboard d'accueil
- [ ] Notifications, dark mode, responsive mobile
- [ ] Déploiement (ex : backend sur Railway/Render, front sur Vercel)

---

## 8. Points d'attention

- **Clés API** : jamais dans le code — variables d'environnement
  (`application.yml` lit `${CLAUDE_API_KEY}`, etc.). Les appels Claude et
  Google passent **toujours par le backend**, jamais directement du front.
- **OAuth Google** : demander les scopes `calendar` dès le login pour
  éviter une double autorisation.
- **Coûts IA** : limiter la taille des cours envoyés (découpage) et
  mettre en cache résumés/quiz déjà générés.
- **Pomodoro** : le minuteur tourne côté front ; on n'enregistre en BDD
  que les sessions *terminées* (pas besoin de temps réel côté serveur).
