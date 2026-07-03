# ⚛️ Cours complet : React (+ Vite, TypeScript, Mantine)

> Fiche du projet **StudyMate**. Le frontend est le territoire nouveau pour
> toi — cette fiche part de zéro et s'appuie sur ce que tu connais déjà
> (Java, PHP, et notre backend Spring Boot).

---

## Table des matières

1. [C'est quoi React ?](#1-cest-quoi-react-)
2. [Node.js et npm : le "Maven" du front](#2-nodejs-et-npm--le-maven-du-front)
3. [Vite : le serveur de développement](#3-vite--le-serveur-de-développement)
4. [TypeScript : du JavaScript typé](#4-typescript--du-javascript-typé)
5. [JSX : du HTML dans le code](#5-jsx--du-html-dans-le-code)
6. [Les composants : la brique de base](#6-les-composants--la-brique-de-base)
7. [Les props : passer des données à un composant](#7-les-props--passer-des-données-à-un-composant)
8. [L'état (useState) : le concept central](#8-létat-usestate--le-concept-central)
9. [Événements et formulaires](#9-événements-et-formulaires)
10. [Afficher des listes](#10-afficher-des-listes)
11. [Les hooks : la boîte à outils](#11-les-hooks--la-boîte-à-outils)
12. [Parler au backend : fetch et TanStack Query](#12-parler-au-backend--fetch-et-tanstack-query)
13. [Mantine : les composants tout faits](#13-mantine--les-composants-tout-faits)
14. [Structure de notre projet](#14-structure-de-notre-projet)
15. [Glossaire](#15-glossaire)

---

## 1. C'est quoi React ?

Sans framework, une interface web se manipule en JavaScript "brut" :
*"trouve la balise `<ul>`, crée un `<li>`, insère-le, mets à jour le
compteur là-bas..."*. Chaque changement de donnée t'oblige à mettre à jour
la page à la main, morceau par morceau. Sur une vraie app, ça devient
ingérable — on oublie toujours un morceau.

**React renverse la logique.** Tu ne décris plus *comment* modifier la
page, tu décris **à quoi la page doit ressembler en fonction des données** :

```
UI = f(données)        "l'interface est une fonction des données"
```

Quand une donnée change (une tâche est cochée), tu changes **la donnée**,
et React recalcule et met à jour tout seul les morceaux de page concernés
— rien d'autre. C'est le même renversement que Hibernate côté backend : tu
déclares, le framework exécute.

React est développé par Meta depuis 2013 ; c'est la bibliothèque front la
plus utilisée au monde, d'où sa documentation et ses tutos innombrables.

---

## 2. Node.js et npm : le "Maven" du front

- **Node.js** = un moteur qui exécute du JavaScript **hors navigateur**,
  sur ta machine. On ne s'en sert pas pour notre app elle-même (elle
  tourne dans le navigateur), mais pour les **outils de développement** :
  le serveur de dev, le compilateur TypeScript...
- **npm** (Node Package Manager) = l'équivalent exact de Maven :
  - `package.json` ⟷ `pom.xml` (liste des dépendances + scripts)
  - `node_modules/` ⟷ le dossier des `.jar` téléchargés (jamais dans Git !)
  - `npm install` ⟷ télécharger les dépendances
  - `npm run dev` ⟷ `./mvnw spring-boot:run`

---

## 3. Vite : le serveur de développement

**Vite** (prononcé "vit", c'est du français !) est l'outil qui fait
tourner le front en développement :

- `npm run dev` → serveur sur **http://localhost:5173** qui sert ton app.
- **Hot reload** : tu sauvegardes un fichier → la page se met à jour
  *instantanément* dans le navigateur, sans même la recharger. (Le
  pendant de notre `devtools` Spring, en encore plus rapide.)
- Pour la production, `npm run build` transforme tout le projet en un
  petit paquet de fichiers statiques (HTML/CSS/JS) optimisés qu'on
  hébergera n'importe où.

Pendant le dev, on aura donc **deux serveurs** en parallèle :

```
localhost:5173  → Vite, sert l'interface React     (terminal 1)
localhost:8080  → Spring Boot, sert l'API + la BDD (terminal 2)
```

---

## 4. TypeScript : du JavaScript typé

Le navigateur ne comprend que le **JavaScript**, un langage SANS types :
une variable peut contenir un nombre puis une chaîne, une faute de frappe
sur un nom de champ ne se voit qu'à l'exécution... Venant de Java, c'est
déroutant.

**TypeScript** = JavaScript + les types. Fichiers `.ts`/`.tsx`, compilés
en JavaScript par Vite. Pour toi qui connais Java, c'est un terrain connu :

```typescript
// on décrit la forme d'un objet (≈ notre entité côté front) :
interface Task {
  id: number;
  title: string;
  done: boolean;
  dueDate: string | null;   // "string OU null" — le ? des Optional
}

let t: Task = { id: 1, title: "Réviser", done: false, dueDate: null };
t.titel = "oops";   // ✗ erreur détectée À LA COMPILATION, comme en Java
```

Différences avec Java à connaître : les types s'écrivent APRÈS le nom
(`title: string`), l'inférence est partout (`let x = 5` → x est un
`number`), et les "interfaces" décrivent des formes d'objets, pas des
contrats de classes.

---

## 5. JSX : du HTML dans le code

En React, on écrit le HTML **directement dans le code** (fichiers `.tsx`) :

```tsx
const message = <h1>Bonjour StudyMate</h1>;
```

Ce n'est pas une chaîne de caractères — c'est une syntaxe spéciale, le
**JSX**, compilée en JavaScript par Vite. Les règles à connaître :

```tsx
// 1. Les accolades { } insèrent du code/des variables dans le HTML :
const name = "Hamza";
const el = <h1>Bonjour {name}, il est {new Date().getHours()}h</h1>;

// 2. class devient className (class est un mot réservé en JS) :
<div className="card">...</div>

// 3. Une condition ? L'opérateur ternaire ou && :
{task.done ? <s>{task.title}</s> : <span>{task.title}</span>}
{tasks.length === 0 && <p>Aucune tâche !</p>}

// 4. Un composant doit retourner UNE seule balise racine
//    (au besoin un "fragment" vide <>...</>)
```

Si tu as fait du PHP : JSX rappelle le mélange HTML/`<?php ?>`, mais
inversé — c'est du HTML *dans* le langage plutôt que du langage dans le
HTML, et c'est vérifié par le compilateur.

---

## 6. Les composants : la brique de base

**Un composant = une fonction qui retourne du JSX.** C'est l'unité de
construction de toute l'interface :

```tsx
function WelcomeCard() {
  return (
    <div>
      <h2>Bienvenue sur StudyMate</h2>
      <p>Prêt à réviser ?</p>
    </div>
  );
}
```

Et on l'utilise **comme une balise HTML** (nom avec Majuscule) :

```tsx
function App() {
  return (
    <div>
      <WelcomeCard />
      <WelcomeCard />   {/* réutilisable à volonté */}
    </div>
  );
}
```

L'app entière est un **arbre de composants** emboîtés :

```
App
├── Sidebar
└── TasksPage
    ├── AddTaskForm
    └── TaskList
        ├── TaskItem   ("Réviser chap. 3")
        └── TaskItem   ("Exos de physique")
```

Règle d'or : **un composant = un fichier = une responsabilité**, comme nos
classes côté Java.

---

## 7. Les props : passer des données à un composant

Les **props** (properties) sont les paramètres d'un composant — passés
comme des attributs HTML, reçus comme argument de la fonction :

```tsx
interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  return <li>{task.title} {task.done && "✓"}</li>;
}

// utilisation — chaque TaskItem reçoit SA tâche :
<TaskItem task={maTache} />
```

Les props descendent **toujours du parent vers l'enfant** (jamais
l'inverse), comme des arguments de méthode. C'est ce qui rend les
composants prévisibles : mêmes props → même rendu.

---

## 8. L'état (useState) : le concept central

**LE concept React à comprendre absolument.**

Une interface vit : la liste des tâches change, le champ de saisie se
remplit, le minuteur décompte. Ces données changeantes s'appellent
**l'état** (state). React fournit `useState` pour les déclarer :

```tsx
import { useState } from "react";

function Counter() {
  //     valeur    fonction pour la changer      valeur initiale
  //        ▼            ▼                            ▼
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Cliqué {count} fois
    </button>
  );
}
```

Le mécanisme, pas à pas :
1. Premier affichage : `count` vaut 0 → React affiche "Cliqué 0 fois"
2. Clic → `setCount(1)` est appelé
3. React note que l'état a changé → il **ré-exécute la fonction** `Counter`
4. Cette fois `useState` retourne 1 → le JSX produit "Cliqué 1 fois"
5. React compare l'ancien et le nouveau JSX et ne met à jour dans la vraie
   page **que ce qui a changé** (le texte du bouton)

C'est le fameux **re-render** : à chaque changement d'état, la fonction
composant est rejouée et l'affichage suit. D'où la règle absolue :

> ⚠️ On ne modifie JAMAIS l'état directement (`count++` ne redessine
> rien !). On passe TOUJOURS par le setter (`setCount(...)`) — c'est lui
> qui prévient React qu'il faut redessiner.

---

## 9. Événements et formulaires

Réagir aux actions de l'utilisateur = passer une fonction à un attribut
`onQuelqueChose` :

```tsx
function AddTaskForm() {
  const [title, setTitle] = useState("");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();          // empêche le rechargement de page
      console.log("À créer :", title);
      setTitle("");                // vide le champ
    }}>
      <input
        value={title}                                // l'affichage vient de l'état
        onChange={(e) => setTitle(e.target.value)}   // chaque frappe met à jour l'état
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}
```

Note le motif du champ : `value` vient de l'état, `onChange` le met à
jour. L'état est la **source de vérité**, le champ ne fait que la
refléter — on dit que le champ est *contrôlé*.

---

## 10. Afficher des listes

Pas de boucle `for` dans le JSX — on transforme le tableau de données en
tableau de JSX avec `.map()` :

```tsx
function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```

⚠️ Le **`key`** est obligatoire sur l'élément répété : c'est l'étiquette
qui permet à React de reconnaître chaque ligne d'un rendu à l'autre (pour
ne redessiner que ce qui bouge). Toujours utiliser un identifiant stable —
notre `task.id` de la BDD est parfait.

---

## 11. Les hooks : la boîte à outils

Les fonctions `useXxx` s'appellent des **hooks** : elles "branchent" des
capacités sur un composant. Les principaux :

| Hook | Rôle |
|---|---|
| `useState` | Mémoriser une donnée qui change (§8) |
| `useEffect` | Exécuter du code "à côté" du rendu (timer, écouteur...) |
| `useQuery` / `useMutation` | (TanStack Query) parler au backend (§12) |

Deux règles imposées par React : les hooks s'appellent **au niveau
racine** du composant (jamais dans un `if` ou une boucle), et uniquement
dans des composants ou d'autres hooks. On peut créer les siens (ex : un
`useTimer()` pour le Pomodoro) en combinant les hooks de base.

---

## 12. Parler au backend : fetch et TanStack Query

### La base : fetch

Le navigateur sait envoyer des requêtes HTTP en JavaScript via `fetch` —
l'équivalent de nos `curl` :

```typescript
// GET
const response = await fetch("http://localhost:8080/api/tasks");
const tasks: Task[] = await response.json();

// POST
await fetch("http://localhost:8080/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Réviser chap. 3" }),
});
```

Le `await` : une requête réseau prend du temps ; `await` = "attends la
réponse avant la ligne suivante" (le code est dit *asynchrone* — on y
reviendra en pratiquant).

### Le confort : TanStack Query

Utiliser `fetch` seul oblige à gérer soi-même : le chargement en cours,
les erreurs, le rafraîchissement des données après une modification...
**TanStack Query** est la bibliothèque standard qui gère tout ça :

```tsx
function TasksPage() {
  // useQuery : "ces données viennent du serveur, gère leur cycle de vie"
  const { data: tasks, isPending, error } = useQuery({
    queryKey: ["tasks"],           // étiquette de cette donnée dans le cache
    queryFn: fetchTasks,           // la fonction qui fait le fetch
  });

  if (isPending) return <p>Chargement…</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  return <TaskList tasks={tasks} />;
}
```

Et pour modifier : `useMutation` + "invalider" la queryKey → TanStack
recharge la liste automatiquement. On verra ça en pratique.

### CORS : le garde du corps du navigateur

Par défaut, le navigateur **interdit** à une page servie par
`localhost:5173` d'appeler un serveur sur `localhost:8080` (protection
contre les sites malveillants). Le backend doit explicitement déclarer
"j'autorise ce front" — c'est la configuration **CORS** qu'on ajoutera
côté Spring. Si tu vois une erreur rouge `blocked by CORS policy` dans la
console du navigateur : c'est ça.

---

## 13. Mantine : les composants tout faits

Écrire un beau bouton, une modale, un calendrier en HTML/CSS pur = des
heures. **Mantine** est une bibliothèque de composants React prêts à
l'emploi et cohérents visuellement :

```tsx
import { Button, Checkbox, TextInput, Card } from "@mantine/core";

<Card shadow="sm">
  <TextInput label="Titre" placeholder="Nouvelle tâche" />
  <Checkbox label="Fait" />
  <Button color="green">Ajouter</Button>
</Card>
```

On garde nos composants à nous (TaskList, PomodoroTimer...) mais on les
construit AVEC les briques Mantine au lieu de balises HTML nues. Doc :
https://mantine.dev (chaque composant a sa page avec exemples copiables).

---

## 14. Structure de notre projet

```
frontend/
├── package.json          ← le "pom.xml" : dépendances + scripts npm
├── node_modules/         ← les bibliothèques téléchargées (≈ .jar, hors Git)
├── vite.config.ts        ← configuration de Vite
├── index.html            ← LA page unique de l'app (quasi vide : React remplit)
└── src/
    ├── main.tsx          ← point d'entrée : monte <App /> dans la page
    ├── App.tsx           ← composant racine
    ├── api/              ← les appels au backend (1 fichier / module)
    ├── types/            ← les interfaces TypeScript (Task...)
    ├── pages/            ← 1 page = 1 module (TasksPage, PomodoroPage...)
    └── components/       ← briques réutilisables (TaskItem...)
```

**SPA** (Single Page Application) : contrairement à PHP où chaque URL
renvoie une nouvelle page générée par le serveur, ici le navigateur charge
UNE page + le JavaScript, puis React redessine le contenu localement en
appelant l'API pour les données. Le serveur ne renvoie plus jamais de HTML.

---

## 15. Glossaire

| Terme | Définition |
|---|---|
| **Node.js** | Moteur JavaScript hors navigateur (pour nos outils de dev) |
| **npm** | Le Maven du front : dépendances + scripts (`package.json`) |
| **Vite** | Serveur de dev (hot reload) + empaqueteur pour la prod |
| **TypeScript** | JavaScript + types, compilé en JavaScript |
| **JSX** | Syntaxe HTML-dans-le-code des fichiers `.tsx` |
| **Composant** | Fonction qui retourne du JSX ; brique de l'interface |
| **Props** | Paramètres d'un composant (parent → enfant) |
| **État (state)** | Données changeantes d'un composant (`useState`) |
| **Re-render** | React ré-exécute le composant après un changement d'état |
| **Hook** | Fonction `useXxx` qui ajoute une capacité à un composant |
| **fetch** | L'HTTP du navigateur (le `curl` de JavaScript) |
| **TanStack Query** | Gestion des données serveur (cache, chargement, erreurs) |
| **CORS** | Autorisation que le backend doit donner au front (autre port) |
| **Mantine** | Bibliothèque de composants tout faits |
| **SPA** | App en une page : React redessine, l'API fournit les données |
| **Hot reload** | La page se met à jour dès qu'on sauvegarde un fichier |
