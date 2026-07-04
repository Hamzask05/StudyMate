# 🔗 Cours : Les relations entre entités (JPA) et les DTO

> Fiche du projet **StudyMate**. Comment relier des entités entre elles
> (une tâche → une matière, un programme → plusieurs matières) et pourquoi
> ça nous oblige à introduire les DTO. Exemples tirés de l'entité Programme.

---

## Table des matières

1. [Le problème : des données liées](#1-le-problème--des-données-liées)
2. [Les clés étrangères, rappel SQL](#2-les-clés-étrangères-rappel-sql)
3. [Les trois types de relations](#3-les-trois-types-de-relations)
4. [@ManyToMany et la table de liaison](#4-manytomany-et-la-table-de-liaison)
5. [EAGER vs LAZY : quand charger les données liées](#5-eager-vs-lazy--quand-charger-les-données-liées)
6. [Le problème de sérialisation JSON](#6-le-problème-de-sérialisation-json)
7. [Les DTO : séparer ce qui entre de ce qui est stocké](#7-les-dto--séparer-ce-qui-entre-de-ce-qui-est-stocké)
8. [Les enums](#8-les-enums)
9. [Antisèche](#9-antisèche)

---

## 1. Le problème : des données liées

Jusqu'ici nos entités étaient isolées (Task, Subject). Mais les vraies
données sont **reliées** : un programme concerne des matières, une note
appartient à une matière, une tâche relève d'un programme...

Une base relationnelle est justement faite pour ça (d'où "relationnelle").
JPA/Hibernate permet d'exprimer ces liens directement entre objets Java,
avec des annotations, et se charge de les traduire en SQL.

---

## 2. Les clés étrangères, rappel SQL

En SQL, on relie deux tables avec une **clé étrangère** (foreign key) :
une colonne qui contient l'`id` d'une ligne d'une autre table.

Exemple (relation "une tâche → une matière") : la table `task` gagne une
colonne `subject_id` qui pointe vers `subject.id`.

```
  task                        subject
  ┌────┬───────┬────────────┐ ┌────┬──────────────┐
  │ id │ title │ subject_id │ │ id │ name         │
  ├────┼───────┼────────────┤ ├────┼──────────────┤
  │ 1  │ ...   │     5    ──┼─┼─►5 │ Mathématiques│
  └────┴───────┴────────────┘ └────┴──────────────┘
```

C'est exactement ce que tu cochais comme "clé étrangère" dans phpMyAdmin.
Avec JPA, tu n'écris pas cette colonne : une annotation suffit, Hibernate
la crée.

---

## 3. Les trois types de relations

On qualifie une relation par les cardinalités des deux côtés :

| Annotation | Sens | Exemple StudyMate | Stockage SQL |
|---|---|---|---|
| `@ManyToOne` | plusieurs A → un B | plusieurs Tasks → une Subject | colonne `subject_id` dans `task` |
| `@OneToMany` | un A → plusieurs B | une Subject → ses Tasks | (l'inverse du précédent) |
| `@ManyToMany` | plusieurs A ↔ plusieurs B | Programmes ↔ Subjects | table de liaison dédiée |

`@ManyToOne` et `@OneToMany` décrivent la MÊME relation vue des deux côtés.
Souvent on ne met que le côté utile (ex : `Task.subject` en `@ManyToOne`
suffit ; pas besoin de lister toutes les tâches depuis Subject).

---

## 4. @ManyToMany et la table de liaison

Notre Programme concerne plusieurs matières, et une matière peut appartenir
à plusieurs programmes → **@ManyToMany**. En Java :

```java
@ManyToMany(fetch = FetchType.EAGER)
private List<Subject> subjects = new ArrayList<>();
```

Une base relationnelle ne sait pas mettre "une liste" dans une colonne.
La solution universelle : une **table de liaison** (join table) qui ne
contient que des couples d'identifiants. Hibernate la génère seule :

```sql
create table programme_subjects (
    programme_id bigint not null,
    subjects_id  bigint not null
);
```

Un programme lié aux matières 1 et 2 → deux lignes : `(1,1)` et `(1,2)`.
C'est la façon standard de représenter un lien N↔N en SQL.

---

## 5. EAGER vs LAZY : quand charger les données liées

Quand on charge un Programme, faut-il charger ses matières tout de suite ?
Deux stratégies (paramètre `fetch`) :

- **EAGER** (`FetchType.EAGER`) : charge les matières EN MÊME TEMPS que le
  programme. Simple, prévisible.
- **LAZY** (`FetchType.LAZY`) : ne les charge qu'au premier accès
  (`programme.getSubjects()`). Économe si on n'en a pas besoin, mais piège
  fréquent : si l'accès arrive trop tard (connexion BDD déjà fermée), erreur
  `LazyInitializationException`.

Par défaut : `@ManyToMany` et `@OneToMany` sont LAZY ; `@ManyToOne` est
EAGER. Dans StudyMate on a mis le Programme en **EAGER** pour éviter le
piège lié à la conversion JSON (§6). À grande échelle on affinerait, mais
à la nôtre, EAGER = le bon choix par défaut.

---

## 6. Le problème de sérialisation JSON

Quand le controller renvoie un Programme, Jackson le convertit en JSON et
suit les relations. Deux écueils :

1. **Données non chargées (LAZY)** → erreur au moment de sérialiser. Réglé
   ici par EAGER.
2. **Boucle infinie** : si A référence B et B référence A (relation
   bidirectionnelle), Jackson boucle A→B→A→B... à l'infini. On l'évite en
   ne mettant la relation QUE d'un côté (notre Subject ne référence pas les
   Programmes en retour) — d'où un JSON propre :

```json
{ "id": 1, "name": "Révisions Bac Blanc", "trackingType": "GRADES",
  "targetHours": 20.0,
  "subjects": [ { "id": 1, "name": "Mathématiques", ... }, ... ] }
```

---

## 7. Les DTO : séparer ce qui entre de ce qui est stocké

Voici LE moment annoncé (fiche Spring Boot §12). Pour CRÉER un programme,
le front n'envoie pas des objets Subject entiers — il envoie leurs
**identifiants** :

```json
{ "name": "Révisions Bac Blanc", "subjectIds": [1, 2],
  "trackingType": "GRADES", "targetHours": 20 }
```

Ce corps ne correspond PAS à l'entité Programme (qui, elle, contient une
`List<Subject>`, pas une `List<Long>`). On décrit donc le corps attendu par
un **DTO** (Data Transfer Object) — une classe dédiée à l'échange :

```java
public record CreateProgrammeRequest(
        @NotBlank String name,
        List<Long> subjectIds,          // des IDs, pas des objets
        TrackingType trackingType,
        @Positive double targetHours) {}
```

Le controller reçoit ce DTO, puis **traduit** : il retrouve les vraies
matières et construit l'entité.

```java
@PostMapping
public Programme create(@Valid @RequestBody CreateProgrammeRequest req) {
    List<Subject> subjects = subjectRepository.findAllById(req.subjectIds());
    Programme p = new Programme();
    p.setName(req.name());
    p.setSubjects(subjects);         // ids → objets
    p.setTargetHours(req.targetHours());
    p.setTrackingType(req.trackingType());
    return repository.save(p);
}
```

**Pourquoi c'est mieux que de recevoir l'entité directement :**
- le contrat d'entrée est explicite (le front sait exactement quoi envoyer) ;
- on ne peut pas injecter de champs interdits (id, createdAt...) ;
- l'API et le stockage évoluent indépendamment.

En résumé : **DTO en entrée** (ce que le front envoie), **entité en
sortie** (souvent réutilisée telle quelle si elle ne cache rien de
sensible). Un jour on ajoutera aussi des DTO en sortie, quand une entité
contiendra des champs à ne pas exposer (ex : un token Google).

---

## 8. Les enums

Un `enum` = un ensemble FERMÉ de valeurs. Notre suivi de progression ne
peut être que "notes" ou "ressenti" :

```java
public enum TrackingType { GRADES, MOOD }
```

Dans l'entité, on précise comment le stocker :

```java
@Enumerated(EnumType.STRING)   // stocke le texte "GRADES" en base
private TrackingType trackingType;
```

`EnumType.STRING` (le nom) plutôt que `ORDINAL` (la position 0,1) : plus
lisible en base et robuste si on réordonne l'enum. Côté JSON, un enum
voyage comme une simple chaîne (`"GRADES"`), et côté TypeScript on le
reflète par un type union : `type TrackingType = 'GRADES' | 'MOOD'`.

---

## 9. Antisèche

| Besoin | Annotation / outil |
|---|---|
| Plusieurs A pour un B | `@ManyToOne` (clé étrangère côté A) |
| Un B, plusieurs A (vue inverse) | `@OneToMany(mappedBy = ...)` |
| N ↔ N | `@ManyToMany` (table de liaison auto) |
| Charger tout de suite / à la demande | `fetch = EAGER` / `LAZY` |
| Éviter la boucle JSON | relation d'un seul côté (ou `@JsonIgnore`) |
| Décrire le corps reçu | un DTO (`record ...Request`) |
| Traduire ids → entités | `repository.findAllById(ids)` |
| Ensemble fermé de valeurs | `enum` + `@Enumerated(EnumType.STRING)` |
