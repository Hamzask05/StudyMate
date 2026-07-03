# StudyMate

Assistant de révisions : organisation de l'emploi du temps (Google Agenda),
résumés de cours et quiz par IA, suivi de progression, tâches et minuteur
Pomodoro.

## Stack

| Couche | Technologie |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Data JPA |
| Base de données | H2 (développement), PostgreSQL (production) |
| Frontend | React 18, TypeScript, Vite, Mantine, TanStack Query |

## Structure

```
backend/           API REST Spring Boot (port 8080)
frontend/          Interface React (port 5173)
Fiches de Cours/   Notes de cours du projet (Spring Boot, React, ...)
STRUCTURE.md       Architecture détaillée et roadmap
```

## Lancer le projet en local

Prérequis : Java 21+ et Node.js 20+.

```bash
# Terminal 1 — backend (http://localhost:8080)
cd backend
./mvnw spring-boot:run

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Console de la base de données (dev) : http://localhost:8080/h2-console
(JDBC URL `jdbc:h2:file:./data/studymate`, utilisateur `sa`, mot de passe vide).

## Avancement

- [x] Phase 1 — Module Tâches complet (API REST + interface)
- [ ] Phase 2 — Matières et minuteur Pomodoro
- [ ] Phase 3 — Notes et courbe de progression
- [ ] Phase 4 — IA : résumés de cours et quiz
- [ ] Phase 5 — Synchronisation Google Agenda
- [ ] Phase 6 — Dashboard et déploiement
