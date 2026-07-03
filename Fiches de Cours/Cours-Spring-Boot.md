# 🌱 Cours complet : Spring Boot

> Fiche de cours du projet **StudyMate**. Tous les exemples viennent du projet,
> pour faire le lien direct entre la théorie et le code qu'on écrit ensemble.

---

## Table des matières

1. [C'est quoi Spring Boot ?](#1-cest-quoi-spring-boot-)
2. [Rappel : comment marche une app web](#2-rappel--comment-marche-une-app-web)
3. [Anatomie d'un projet Spring Boot](#3-anatomie-dun-projet-spring-boot)
4. [Le cœur de Spring : les beans et l'injection de dépendances](#4-le-cœur-de-spring--les-beans-et-linjection-de-dépendances)
5. [L'architecture en couches](#5-larchitecture-en-couches)
6. [La couche Entity : JPA et Hibernate](#6-la-couche-entity--jpa-et-hibernate)
7. [La couche Repository : parler à la BDD sans SQL](#7-la-couche-repository--parler-à-la-bdd-sans-sql)
8. [La couche Controller : exposer des URLs](#8-la-couche-controller--exposer-des-urls)
9. [La couche Service : la logique métier](#9-la-couche-service--la-logique-métier)
10. [Vie complète d'une requête (exemple pas à pas)](#10-vie-complète-dune-requête-exemple-pas-à-pas)
11. [Validation des données](#11-validation-des-données)
12. [Les DTO : ne pas exposer ses entités](#12-les-dto--ne-pas-exposer-ses-entités)
13. [Configuration et variables d'environnement](#13-configuration-et-variables-denvironnement)
14. [Gestion des erreurs](#14-gestion-des-erreurs)
15. [Glossaire](#15-glossaire)
16. [Antisèche des annotations](#16-antisèche-des-annotations)

---

## 1. C'est quoi Spring Boot ?

**Spring** est LE framework Java pour construire des applications (surtout web).
Un framework = une boîte à outils + une façon d'organiser son code. Spring
existe depuis 2003 et fait tourner une énorme partie des backends du monde
(banques, e-commerce, startups...).

Problème historique : Spring "nu" demandait énormément de configuration.
**Spring Boot** (2014) est une surcouche qui applique le principe
*"convention plutôt que configuration"* :

- ❌ Avant : installer un serveur web, écrire des dizaines de fichiers XML,
  câbler chaque brique à la main.
- ✅ Avec Spring Boot : tu déclares ce que tu veux (`spring-boot-starter-web`),
  et tout est pré-configuré avec des choix par défaut intelligents. Le serveur
  web (Tomcat) est **embarqué** : ton app est un simple programme Java qui se
  lance avec une commande.

**En une phrase : Spring Boot te laisse écrire uniquement le code de TON
application ; toute la plomberie (serveur HTTP, connexion BDD, conversion
JSON...) est gérée pour toi.**

### Les "starters"

Un starter = un pack de dépendances pour un besoin donné. Dans notre `pom.xml` :

| Starter | Ce qu'il apporte |
|---|---|
| `spring-boot-starter-web` | Serveur Tomcat embarqué, API REST, conversion JSON |
| `spring-boot-starter-data-jpa` | Hibernate + Spring Data (accès BDD via objets) |
| `spring-boot-starter-validation` | Validation des données entrantes |
| `h2` | Mini base de données de développement |
| `spring-boot-devtools` | Redémarrage auto du serveur quand le code change |

---

## 2. Rappel : comment marche une app web

```
NAVIGATEUR (frontend React)          SERVEUR (backend Spring Boot)
        │                                      │
        │  ── requête HTTP ──────────────────► │
        │     PATCH /api/tasks/5              │  1. reçoit la requête
        │     corps: {"done": true}           │  2. exécute la logique
        │                                      │  3. lit/écrit la BDD
        │  ◄────────────────── réponse HTTP ── │
        │     status: 200                      │
        │     corps: {"id":5, "done":true}    │
```

### Une requête HTTP, c'est 3 choses

1. **Une méthode (un verbe)** qui exprime l'intention :
   - `GET` → lire ("donne-moi les tâches")
   - `POST` → créer ("ajoute cette tâche")
   - `PUT` / `PATCH` → modifier (tout / une partie)
   - `DELETE` → supprimer
2. **Une URL** qui désigne la ressource : `/api/tasks`, `/api/tasks/5`
3. **Un corps (body)** optionnel, en **JSON**, qui transporte les données.

### Une réponse HTTP, c'est 2 choses

1. **Un code de statut** :
   - `2xx` = succès (200 OK, 201 Created, 204 No Content)
   - `4xx` = erreur du client (400 requête invalide, 404 introuvable)
   - `5xx` = erreur du serveur (bug chez nous)
2. **Un corps** en JSON (la donnée demandée, ou le détail de l'erreur).

### JSON

Le format d'échange universel. Du texte structuré en clés/valeurs :

```json
{ "id": 5, "title": "Réviser chapitre 3", "done": false, "priority": "HAUTE" }
```

Ça ressemble à un objet Java, et ce n'est pas un hasard : Spring convertit
automatiquement **objet Java ⇄ JSON** dans les deux sens (grâce à une
bibliothèque nommée Jackson). Tu ne manipules jamais le JSON à la main.

### REST

Une **API REST** est simplement une API web qui respecte ces conventions :
des URLs qui désignent des ressources (`/api/tasks`) + des verbes HTTP qui
expriment l'action + du JSON. Quand on dit "on expose un endpoint REST",
on dit juste "on crée une URL qui répond selon ces règles".

---

## 3. Anatomie d'un projet Spring Boot

```
backend/
├── pom.xml                        ← carte d'identité du projet (Maven)
├── mvnw                           ← "Maven wrapper" : télécharge Maven tout seul
├── data/                          ← fichiers de la BDD H2 (créés au lancement)
└── src/
    ├── main/
    │   ├── java/com/studymate/
    │   │   └── StudymateApplication.java   ← point d'entrée
    │   └── resources/
    │       └── application.properties      ← configuration
    └── test/                      ← tests automatisés
```

### pom.xml (Maven)

**Maven** est l'outil de build : il télécharge les bibliothèques déclarées
dans `pom.xml` (les *dépendances*), compile le code, lance les tests.
Commandes utiles :

```bash
./mvnw compile           # compiler
./mvnw spring-boot:run   # lancer le serveur
./mvnw test              # lancer les tests
```

### Le point d'entrée

```java
@SpringBootApplication
public class StudymateApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudymateApplication.class, args);
    }
}
```

`@SpringBootApplication` déclenche au démarrage :
1. **L'auto-configuration** : Spring regarde les dépendances présentes et
   configure ce qu'il faut (il voit `h2` + `data-jpa` → il configure la BDD).
2. **Le scan des composants** : Spring parcourt le package `com.studymate`
   et tous ses sous-packages, repère les classes annotées (`@RestController`,
   `@Service`...), les instancie et les connecte entre elles (→ section 4).

### application.properties

La configuration en clé=valeur : port du serveur, connexion BDD, etc.
Exemple de notre projet :

```properties
spring.datasource.url=jdbc:h2:file:./data/studymate   # où est la BDD
spring.jpa.hibernate.ddl-auto=update                   # crée les tables tout seul
spring.jpa.show-sql=true                               # affiche le SQL exécuté
```

---

## 4. Le cœur de Spring : les beans et l'injection de dépendances

**LE concept fondamental de Spring.** Tout le reste en découle.

### Le problème

En Java classique, si `TaskController` a besoin de `TaskRepository`, il doit
le créer lui-même :

```java
public class TaskController {
    private TaskRepository repo = new TaskRepository(/* config BDD... */);
}
```

Chaque classe fabrique ses outils → code rigide, dur à tester, config dupliquée.

### La solution de Spring : l'inversion de contrôle

Tu ne fais **jamais** `new` sur tes composants. Spring maintient un
**conteneur** : au démarrage, il crée une instance unique de chaque classe
annotée (`@Service`, `@RestController`, `@Repository`...) — ces instances
s'appellent des **beans** — puis il les **injecte** là où on les demande.

Comment on demande ? Par le **constructeur** :

```java
@RestController
public class TaskController {

    private final TaskRepository repository;

    // Spring voit ce constructeur, trouve le bean TaskRepository
    // dans son conteneur, et le passe automatiquement ici.
    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }
}
```

C'est **l'injection de dépendances** (DI) : tu déclares ce dont tu as
besoin, Spring te le fournit. Retiens la règle pratique :

> Une classe annotée + un constructeur qui liste ses besoins = Spring
> assemble tout, tout seul, au démarrage.

---

## 5. L'architecture en couches

Un backend Spring s'organise en couches, chacune avec UN rôle. Une requête
les traverse dans l'ordre :

```
   requête HTTP
        │
┌───────▼────────┐
│   CONTROLLER   │  Porte d'entrée : reçoit la requête, renvoie la réponse.
│ @RestController│  AUCUNE logique métier ici.
└───────┬────────┘
┌───────▼────────┐
│    SERVICE     │  Logique métier : règles, calculs, orchestration.
│    @Service    │  (ex : calculer la courbe de progression)
└───────┬────────┘
┌───────▼────────┐
│   REPOSITORY   │  Accès BDD : sauvegarder, chercher, supprimer.
│  @Repository   │  Interface quasi vide — Spring écrit le code.
└───────┬────────┘
┌───────▼────────┐
│     ENTITY     │  La donnée elle-même : classe Java = table BDD.
│    @Entity     │
└────────────────┘
```

**Pourquoi séparer ?** Chaque fichier reste petit et lisible, on sait
toujours où chercher, et on peut modifier une couche sans casser les autres.
Dans StudyMate, chaque module (task, ai, progress...) a son propre paquet
de ces 3-4 fichiers.

*Cas particulier : quand il n'y a aucune logique (un simple CRUD comme les
tâches), on peut sauter la couche Service et appeler le Repository depuis
le Controller. On ajoute le Service dès qu'une vraie logique apparaît.*

---

## 6. La couche Entity : JPA et Hibernate

### Le problème que ça résout

Une BDD relationnelle stocke des **tables** (lignes/colonnes) et se manipule
en **SQL**. Java manipule des **objets**. Faire la traduction à la main
(écrire `INSERT INTO task (title, done) VALUES (?, ?)` partout) est long et
source d'erreurs.

Un **ORM** (Object-Relational Mapper) fait cette traduction automatiquement.

- **JPA** = la norme Java qui définit les annotations (`@Entity`, `@Id`...)
- **Hibernate** = le logiciel qui implémente cette norme (celui qu'on utilise)

### Une entité = une table

```java
@Entity                 // "cette classe correspond à une table en BDD"
public class Task {

    @Id                                                  // clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // auto-incrémentée
    private Long id;

    private String title;      // → colonne "title"  (VARCHAR)
    private boolean done;      // → colonne "done"   (BOOLEAN)
    private LocalDate dueDate; // → colonne "due_date" (DATE)

    // + getters et setters
}
```

Au démarrage, grâce à `spring.jpa.hibernate.ddl-auto=update`, Hibernate
compare tes entités avec la BDD et **crée/ajuste les tables tout seul**.
Tu n'écris jamais de `CREATE TABLE`.

> ⚠️ `ddl-auto=update` est un confort de développement. En production on
> gère le schéma avec des migrations versionnées (Flyway) — on verra ça
> au moment du déploiement.

### Comment Hibernate fabrique le `create table` (le film du démarrage)

1. **Scan** : Hibernate parcourt le package et repère par réflexion les
   classes étiquetées `@Entity`.
2. **Construction du modèle** : il inspecte chaque champ et se construit
   la description de la table idéale :

   | Dans la classe Java | Déduction |
   |---|---|
   | `class Task` | table `task` |
   | `Long id` + `@Id` + `@GeneratedValue(IDENTITY)` | `id bigint primary key` auto-incrémenté |
   | `String title` + `@Size(max=200)` + `@NotBlank` | `title varchar(200) not null` |
   | `boolean done` | `done boolean not null` (primitif = jamais null) |
   | `LocalDate dueDate` | `due_date date` (camelCase → snake_case automatique) |
   | `Instant createdAt` | `created_at timestamp(6) with time zone` |

3. **Dialecte** : la syntaxe SQL exacte varie selon la BDD (H2, PostgreSQL,
   MySQL...). Hibernate détecte la BDD connectée et adapte son SQL — c'est
   pour ça qu'on passera à PostgreSQL sans changer le code Java.
4. **Comparaison** (mode `ddl-auto=update`) : il compare son modèle avec la
   BDD réelle. Table absente → `create table` ; conforme → rien ; champ
   ajouté dans la classe → `alter table add column`.

Après le démarrage, le même modèle sert à traduire chaque opération à la
volée : `save(task)` → `insert into task (...) values (?, ...)`, exécution,
récupération de l'id généré. Visible dans la console grâce à
`spring.jpa.show-sql=true`.

### Relations entre entités

Une tâche appartient à une matière ? Ça se déclare :

```java
@ManyToOne                 // plusieurs tâches → une matière
private Subject subject;   // Hibernate crée une colonne subject_id (clé étrangère)
```

Les principales : `@ManyToOne` (N→1), `@OneToMany` (1→N), `@ManyToMany`.

---

## 7. La couche Repository : parler à la BDD sans SQL

C'est la partie la plus magique de Spring. Tu écris une **interface vide** :

```java
public interface TaskRepository extends JpaRepository<Task, Long> {
}                                        //          ▲     ▲
                                         //     l'entité   le type de son id
```

Et tu obtiens gratuitement, sans écrire une ligne d'implémentation :

```java
repository.findAll()        // SELECT * FROM task
repository.findById(5L)     // SELECT * FROM task WHERE id = 5
repository.save(task)       // INSERT ou UPDATE selon le cas
repository.deleteById(5L)   // DELETE FROM task WHERE id = 5
repository.count()          // SELECT COUNT(*) FROM task
```

**Comment ?** Au démarrage, Spring Data détecte l'interface et **génère
l'implémentation** (le SQL) automatiquement.

### Requêtes dérivées du nom de la méthode

Encore plus fort : Spring lit le **nom** de tes méthodes et en déduit le SQL :

```java
List<Task> findByDone(boolean done);              // WHERE done = ?
List<Task> findBySubjectIdOrderByDueDate(Long id); // WHERE subject_id = ? ORDER BY due_date
```

### Optional : gérer le "pas trouvé"

`findById` retourne un `Optional<Task>` : une boîte qui contient une tâche
**ou rien** (si l'id n'existe pas). Ça force à gérer proprement le cas
"introuvable" au lieu de planter sur un `null` :

```java
Task task = repository.findById(id)
        .orElseThrow(() -> new TaskNotFoundException(id));
```

---

## 8. La couche Controller : exposer des URLs

Le controller **mappe des URLs sur des méthodes Java** :

```java
@RestController                // "mes méthodes répondent en JSON"
@RequestMapping("/api/tasks")  // préfixe commun de toutes les URLs
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {  // injection (§4)
        this.repository = repository;
    }

    @GetMapping                       // GET /api/tasks
    public List<Task> all() {
        return repository.findAll();  // la liste sera convertie en JSON
    }

    @PostMapping                      // POST /api/tasks
    @ResponseStatus(HttpStatus.CREATED)          // répond 201 au lieu de 200
    public Task create(@RequestBody Task task) { // JSON reçu → objet Task
        return repository.save(task);
    }

    @GetMapping("/{id}")              // GET /api/tasks/5
    public Task one(@PathVariable Long id) {     // le 5 de l'URL → paramètre id
        return repository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")           // DELETE /api/tasks/5
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
```

### Les 3 annotations pour extraire les infos d'une requête

| Annotation | D'où vient la donnée | Exemple |
|---|---|---|
| `@PathVariable` | Un morceau de l'URL | le `5` de `/api/tasks/5` |
| `@RequestParam` | Après le `?` dans l'URL | `?done=true` |
| `@RequestBody` | Le corps JSON de la requête | `{"title": "..."}` → objet Java |

---

## 9. La couche Service : la logique métier

Quand une opération dépasse le simple "lire/écrire en BDD", elle va dans un
`@Service`. Exemple futur de StudyMate — le calcul de la courbe :

```java
@Service
public class ProgressService {

    private final GradeRepository grades;
    private final PomodoroSessionRepository sessions;

    public ProgressService(GradeRepository grades,
                           PomodoroSessionRepository sessions) {
        this.grades = grades;
        this.sessions = sessions;
    }

    public List<ProgressPoint> computeCurve(Long userId, ProgressSettings settings) {
        // récupérer les notes, les sessions pomodoro,
        // appliquer les pondérations choisies par l'utilisateur,
        // produire les points de la courbe
    }
}
```

Le controller correspondant restera minuscule : il reçoit la requête,
appelle `progressService.computeCurve(...)`, renvoie le résultat. **Un
controller qui fait 5 lignes par méthode, c'est bon signe.**

---

## 10. Vie complète d'une requête (exemple pas à pas)

Le front envoie : `POST /api/tasks` avec `{"title": "Réviser chap. 3"}`.

1. **Tomcat** (serveur embarqué) reçoit la requête sur le port 8080.
2. Spring regarde sa table de routage : `POST` + `/api/tasks`
   → méthode `create()` de `TaskController`.
3. **Jackson** convertit le JSON du corps en objet `Task`
   (grâce à `@RequestBody`).
4. Le controller appelle `repository.save(task)`.
5. **Hibernate** génère et exécute le SQL :
   `insert into task (title, done) values ('Réviser chap. 3', false)`
   — visible dans la console grâce à `spring.jpa.show-sql=true`.
6. La BDD attribue l'id (auto-incrément) → l'objet `Task` revient avec `id=1`.
7. Jackson convertit l'objet en JSON, Spring répond :
   `201 Created` + `{"id":1, "title":"Réviser chap. 3", "done":false}`.
8. Le front reçoit la réponse et affiche la nouvelle tâche.

**Toi, tu n'as écrit que les étapes 2 et 4** (le controller et l'appel au
repository). Tout le reste, c'est Spring.

---

## 11. Validation des données

Ne jamais faire confiance à ce qui arrive du front. On pose des contraintes
directement sur les champs :

```java
public class Task {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200)
    private String title;

    @FutureOrPresent(message = "La date doit être aujourd'hui ou après")
    private LocalDate dueDate;
}
```

Et on active la vérification avec `@Valid` dans le controller :

```java
public Task create(@Valid @RequestBody Task task) { ... }
```

Si une contrainte est violée, Spring répond **400 Bad Request** tout seul,
sans exécuter ta méthode. Contraintes courantes : `@NotBlank`, `@NotNull`,
`@Size`, `@Min`, `@Max`, `@Email`, `@Positive`.

---

## 12. Les DTO : ne pas exposer ses entités

Un **DTO** (Data Transfer Object) est une classe qui représente ce qui
**entre ou sort** de l'API, distincte de l'entité stockée en BDD.

Pourquoi ? L'entité `User` contiendra un jour `googleRefreshToken` — hors de
question de l'envoyer au navigateur. Le DTO permet de choisir exactement les
champs exposés. En Java moderne, un `record` suffit :

```java
// ce que le front a le droit de voir :
public record UserDto(Long id, String name, String email) {}

// ce que le front doit envoyer pour créer une tâche :
public record CreateTaskRequest(@NotBlank String title, LocalDate dueDate) {}
```

*Au début du projet (module Tâches), entité et DTO seraient identiques, donc
on exposera l'entité directement pour rester simple. On introduira les DTO
dès qu'une différence apparaîtra — je te préviendrai à ce moment-là.*

---

## 13. Configuration et variables d'environnement

Règle d'or : **aucun secret (clé API, mot de passe) dans le code ni dans
Git**. `application.properties` sait lire les variables d'environnement :

```properties
claude.api.key=${CLAUDE_API_KEY}
spring.datasource.password=${DB_PASSWORD:}
#          valeur par défaut si absente ─┘
```

### Les profils

Spring permet plusieurs configs selon le contexte :

- `application.properties` → config commune + développement (H2)
- `application-prod.properties` → production (PostgreSQL, URLs réelles)

On active un profil avec la variable `SPRING_PROFILES_ACTIVE=prod`. C'est
comme ça qu'on passera de H2 à PostgreSQL au déploiement **sans changer une
ligne de code**.

---

## 14. Gestion des erreurs

Que répondre quand on demande la tâche n°999 qui n'existe pas ? Un **404**
propre. Le mécanisme Spring : lancer une exception, et la traduire en
réponse HTTP dans un **handler global** :

```java
// une exception métier à nous :
public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(Long id) {
        super("Tâche " + id + " introuvable");
    }
}

// le traducteur exceptions → réponses HTTP, pour TOUTE l'app :
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)          // → 404
    public Map<String, String> notFound(TaskNotFoundException e) {
        return Map.of("error", e.getMessage());
    }
}
```

Avantage : les controllers ne gèrent aucune erreur — ils lancent des
exceptions, le handler centralise la traduction.

---

## 15. Glossaire

| Terme | Définition |
|---|---|
| **API** | Interface qu'un programme expose pour que d'autres lui parlent |
| **REST** | Conventions pour construire une API web (URLs + verbes HTTP + JSON) |
| **Endpoint** | Une URL exposée par l'API (ex : `GET /api/tasks`) |
| **JSON** | Format texte d'échange de données (clés/valeurs) |
| **Maven** | Outil de build : dépendances + compilation + tests |
| **Tomcat** | Serveur web embarqué dans Spring Boot |
| **Bean** | Objet créé et géré par Spring dans son conteneur |
| **Injection de dépendances** | Spring fournit à chaque classe ce qu'elle demande au constructeur |
| **Entité** | Classe Java qui correspond à une table BDD |
| **ORM / Hibernate** | Traducteur automatique objets Java ⇄ tables SQL |
| **JPA** | La norme Java des ORM (Hibernate l'implémente) |
| **Repository** | Interface d'accès à la BDD, implémentée par Spring Data |
| **DTO** | Objet qui définit ce qui entre/sort de l'API (≠ entité) |
| **CRUD** | Create, Read, Update, Delete — les 4 opérations de base |
| **localhost** | Ta propre machine ; `localhost:8080` = port 8080 de ta machine |
| **Profil** | Jeu de configuration (dev, prod...) activable au lancement |

---

## 16. Antisèche des annotations

### Démarrage & composants
| Annotation | Sens |
|---|---|
| `@SpringBootApplication` | Point d'entrée : auto-config + scan des composants |
| `@RestController` | Composant qui expose des endpoints JSON |
| `@Service` | Composant de logique métier |
| `@Component` | Composant générique géré par Spring |

### Routage HTTP
| Annotation | Sens |
|---|---|
| `@RequestMapping("/api/tasks")` | Préfixe d'URL pour toute la classe |
| `@GetMapping`, `@PostMapping`, `@PatchMapping`, `@PutMapping`, `@DeleteMapping` | Lie un verbe+URL à une méthode |
| `@PathVariable` | Extrait un morceau de l'URL (`/tasks/{id}`) |
| `@RequestParam` | Extrait un paramètre `?cle=valeur` |
| `@RequestBody` | Convertit le corps JSON en objet Java |
| `@ResponseStatus(...)` | Fixe le code de statut de la réponse |

### JPA (BDD)
| Annotation | Sens |
|---|---|
| `@Entity` | Classe = table |
| `@Id` | Clé primaire |
| `@GeneratedValue` | Id auto-généré par la BDD |
| `@ManyToOne`, `@OneToMany` | Relations entre tables |

### Validation & erreurs
| Annotation | Sens |
|---|---|
| `@Valid` | Déclenche la validation du corps reçu |
| `@NotBlank`, `@Size`, `@Min`... | Contraintes sur les champs |
| `@RestControllerAdvice` | Gestionnaire d'erreurs global |
| `@ExceptionHandler` | Traduit une exception en réponse HTTP |
