# 🌿 Cours : Git et GitHub

> Fiche du projet **StudyMate**. Git avec les mains, illustré par ce que tu
> fais réellement dans GitHub Desktop avec ce dépôt.

---

## Table des matières

1. [C'est quoi Git, et pourquoi ?](#1-cest-quoi-git-et-pourquoi-)
2. [Git ≠ GitHub](#2-git--github)
3. [Le modèle mental : des instantanés](#3-le-modèle-mental--des-instantanés)
4. [Les trois zones](#4-les-trois-zones)
5. [Le commit : l'acte central](#5-le-commit--lacte-central)
6. [Push et pull : synchroniser avec GitHub](#6-push-et-pull--synchroniser-avec-github)
7. [Le .gitignore](#7-le-gitignore)
8. [Les branches (l'essentiel pour l'instant)](#8-les-branches-lessentiel-pour-linstant)
9. [GitHub Desktop ⇄ commandes Git](#9-github-desktop--commandes-git)
10. [Notre workflow pour StudyMate](#10-notre-workflow-pour-studymate)
11. [Glossaire](#11-glossaire)

---

## 1. C'est quoi Git, et pourquoi ?

Git est un **gestionnaire de versions** : il enregistre l'historique
complet de ton projet, version par version. Concrètement, il répond à :

- *"Ça marchait hier, qu'est-ce que j'ai changé depuis ?"* → comparer
- *"J'ai tout cassé"* → revenir à n'importe quelle version passée
- *"Qui a écrit cette ligne, quand, pourquoi ?"* → tracer
- *"On code à deux sur le même projet"* → fusionner les travaux

Sans Git, on en est aux copies `projet_final_v2_VRAIMENT_final/`. Avec
Git, une seule copie du projet + une base de données cachée (le dossier
`.git/` à la racine de StudyMate) qui contient tout l'historique.

---

## 2. Git ≠ GitHub

Deux choses distinctes, souvent confondues :

- **Git** = le logiciel, installé sur TA machine. Fonctionne 100 % en
  local — tu peux versionner sans internet.
- **GitHub** = un site qui héberge des copies de dépôts Git (+ interface
  web, gestion d'équipe...). C'est la "sauvegarde en ligne" et le point
  de partage. Concurrents : GitLab, Bitbucket.
- **GitHub Desktop** = une application graphique qui exécute les
  commandes Git pour toi en cliquant sur des boutons.

Ton dépôt existe donc en DEUX exemplaires : le local
(`Desktop/vibeCodTest/StudyMate`) et le distant
(`github.com/Hamzask05/StudyMate`, alias **origin**). Ils ne se
synchronisent QUE quand tu le demandes (push / pull).

---

## 3. Le modèle mental : des instantanés

L'historique Git est une **chaîne d'instantanés (snapshots)** du projet
entier, appelés **commits** :

```
commit 1 ──► commit 2 ──► commit 3 ──► ...
"Phase 1"    "Fiche Git"  "Module Pomodoro"
```

Chaque commit contient : l'état complet des fichiers à cet instant, un
message qui décrit le changement, l'auteur, la date, et un identifiant
unique (le *hash*, ex : `a3f8e21`). On peut naviguer vers n'importe quel
commit, comparer deux commits, annuler un commit précis.

---

## 4. Les trois zones

LE concept qui déroute au début. Un fichier modifié traverse trois zones :

```
┌─────────────────┐   git add    ┌─────────────────┐  git commit  ┌────────────────┐
│ RÉPERTOIRE DE   │ ───────────► │     STAGING     │ ───────────► │   HISTORIQUE   │
│ TRAVAIL         │              │ (zone de        │              │ (les commits,  │
│ tes fichiers,   │              │  préparation)   │              │  dans .git/)   │
│ que tu modifies │              │ "sélectionnés   │              │  définitif     │
│ librement       │              │  pour le        │              │                │
│                 │              │  prochain       │              │                │
│                 │              │  commit"        │              │                │
└─────────────────┘              └─────────────────┘              └────────────────┘
```

**Pourquoi une zone intermédiaire ?** Pour composer des commits propres.
Si tu as modifié 10 fichiers pour 2 raisons différentes, tu peux stager
6 fichiers → commit "raison A", puis les 4 autres → commit "raison B".
Chaque commit reste une unité logique cohérente.

Dans **GitHub Desktop**, la staging area est déguisée en cases à cocher :
un fichier coché = stagé, décoché = laissé de côté pour ce commit.

---

## 5. Le commit : l'acte central

Un commit = "je grave l'état actuel des fichiers stagés dans
l'historique, avec un message".

**Le message compte énormément** — c'est lui que tu liras dans 3 mois :

- ✅ `Ajoute le module Pomodoro (minuteur + sauvegarde des sessions)`
- ❌ `update`, `fix`, `changements`

Convention simple : une ligne courte à l'impératif qui complète la
phrase *"Ce commit... [Ajoute le module Pomodoro]"*. Détails éventuels
dans la description en dessous.

**Quand commiter ?** À chaque étape cohérente et si possible
fonctionnelle : une fonctionnalité, une correction, une fiche de cours.
Plusieurs petits commits clairs valent mieux qu'un gros commit fourre-tout
— l'historique devient un journal de bord lisible du projet.

---

## 6. Push et pull : synchroniser avec GitHub

Un commit est **local**. Personne ne le voit tant que tu n'as pas poussé :

- **push** : envoie tes commits locaux vers GitHub (local → distant)
- **fetch** : demande "quoi de neuf côté GitHub ?" sans rien modifier
- **pull** : rapatrie les commits distants dans ta copie locale
  (utile à plusieurs, ou si tu codes depuis deux machines)

Workflow solo typique : *modifier → commit → commit → ... → push* (le
push peut regrouper plusieurs commits d'un coup).

---

## 7. Le .gitignore

Fichier texte listant ce que Git doit **ignorer complètement**. Règle :
on ne versionne QUE ce qui ne peut pas être régénéré. Dans StudyMate :

| Ignoré | Pourquoi |
|---|---|
| `node_modules/` | ~300 Mo régénérés par `npm install` |
| `target/` | Code compilé, régénéré par `./mvnw compile` |
| `data/` | Ta BDD locale — les *données* ne vont pas dans Git, le *code* si |
| `Fiches de Cours/*.pdf` | Régénérables depuis les `.md` |
| `.DS_Store` | Fichiers système macOS |

Autre catégorie à ne JAMAIS commiter : les **secrets** (clés API, mots de
passe). Un secret poussé sur GitHub doit être considéré comme volé, même
si on l'efface après (l'historique garde tout !). On y fera très
attention à partir de la phase IA / Google.

---

## 8. Les branches (l'essentiel pour l'instant)

Une **branche** est une ligne de développement parallèle. `main` est la
branche principale — la version "officielle" du projet.

```
main :     c1 ──► c2 ──► c3 ─────────► c6  (fusion)
                          └─► c4 ──► c5 ─┘   branche "pomodoro"
```

Usage type : développer une fonctionnalité sur une branche sans toucher
`main`, puis **fusionner** (merge) quand ça marche. Indispensable en
équipe ; en solo débutant, travailler directement sur `main` est
acceptable — on introduira les branches (et les pull requests) quand le
projet grossira. Retiens juste : *"Current branch: main"* dans GitHub
Desktop = tu commites sur la ligne principale.

---

## 9. GitHub Desktop ⇄ commandes Git

Ce que fait chaque élément de l'interface :

| Dans GitHub Desktop | Commande équivalente |
|---|---|
| Liste "Changes" à gauche | `git status` |
| Cocher / décocher un fichier | `git add <fichier>` / `git restore --staged` |
| Zone de diff au centre (+vert / -rouge) | `git diff` |
| Bouton "Commit to main" | `git commit -m "message"` |
| Bouton "Push origin" | `git push` |
| Bouton "Fetch origin" | `git fetch` |
| Onglet "History" | `git log` |
| Clic droit sur un commit → Revert | `git revert` (annule proprement) |
| "Discard changes" sur un fichier | `git checkout -- <fichier>` ⚠️ perte définitive des modifs non commitées |

---

## 10. Notre workflow pour StudyMate

1. On code une étape (avec Claude) jusqu'à ce qu'elle **fonctionne**
2. GitHub Desktop → relire le diff (excellente façon de réviser ce qu'on
   a écrit !)
3. Commit avec un message clair (`Ajoute ...`, `Corrige ...`)
4. Push
5. Vérifier sur github.com/Hamzask05/StudyMate que tout est en ligne

L'historique du dépôt devient ainsi le journal de bord du projet, phase
par phase.

---

## 11. Glossaire

| Terme | Définition |
|---|---|
| **Dépôt (repo)** | Un projet suivi par Git (dossier + historique `.git/`) |
| **Commit** | Instantané du projet + message, gravé dans l'historique |
| **Staging** | Zone de préparation : fichiers sélectionnés pour le prochain commit |
| **origin** | Surnom du dépôt distant (ici : GitHub) |
| **Push / Pull** | Envoyer ses commits vers / rapatrier ceux du distant |
| **Branche** | Ligne de développement parallèle ; `main` = la principale |
| **Merge** | Fusionner une branche dans une autre |
| **Diff** | Les différences ligne par ligne entre deux versions |
| **Hash** | Identifiant unique d'un commit (`a3f8e21...`) |
| **Clone** | Copier un dépôt distant sur sa machine |
| **.gitignore** | Liste de ce que Git ne doit jamais suivre |
