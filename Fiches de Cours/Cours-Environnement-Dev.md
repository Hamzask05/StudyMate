# 🛠️ Cours : L'environnement de développement

> Fiche du projet **StudyMate** — tout ce qui *entoure* le code : serveurs,
> base de données, ports, commandes. Construite autour d'une comparaison
> avec XAMPP/phpMyAdmin.

---

## Table des matières

1. [La grande différence avec XAMPP](#1-la-grande-différence-avec-xampp)
2. [Tomcat : le serveur web](#2-tomcat--le-serveur-web)
3. [H2 : la base de données embarquée](#3-h2--la-base-de-données-embarquée)
4. [La console H2 (notre phpMyAdmin)](#4-la-console-h2-notre-phpmyadmin)
5. [Ports et localhost](#5-ports-et-localhost)
6. [Démarrer, arrêter, éteindre son PC](#6-démarrer-arrêter-éteindre-son-pc)
7. [Les commandes du quotidien](#7-les-commandes-du-quotidien)
8. [Tableau de correspondance XAMPP ⇄ StudyMate](#8-tableau-de-correspondance-xampp--studymate)

---

## 1. La grande différence avec XAMPP

Avec XAMPP, tu installes des **services** : Apache et MySQL sont des
programmes autonomes qui tournent en arrière-plan de la machine, avec un
panneau de contrôle pour les démarrer/arrêter. Ton code PHP est *déposé
chez eux* (dossier `htdocs`).

Avec Spring Boot, le rapport est **inversé** : il n'y a AUCUN service
installé. Ton application est un simple programme qui **contient** son
serveur web (Tomcat) et sa base de données (H2). Tout naît quand tu lances
la commande, tout meurt quand tu l'arrêtes.

```
XAMPP :        [ Apache (service) ] ◄── tes fichiers .php déposés dedans
               [ MySQL  (service) ]     tournent en permanence

Spring Boot :  [ TON PROGRAMME ]
                  ├── Tomcat (bibliothèque embarquée)
                  ├── H2     (bibliothèque embarquée)
                  └── ton code
               une commande pour tout lancer, Ctrl+C pour tout arrêter
```

**Conséquence pratique :** rien ne tourne en douce sur ta machine, rien à
installer sur un nouveau PC (juste Java), et le projet est autonome.

---

## 2. Tomcat : le serveur web

### Le problème qu'il résout

Une requête HTTP qui arrive du réseau, c'est du **texte brut** sur une
prise réseau :

```
POST /api/tasks HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{"title": "Réviser chapitre 3"}
```

Entre ce texte et ta méthode Java `create(@RequestBody Task task)`, il
faut : écouter le réseau en continu, accepter les connexions, découper le
texte (verbe ? URL ? corps ?), gérer 50 requêtes simultanées, renvoyer les
réponses aux bons demandeurs...

**Tomcat fait tout ce travail.** C'est un serveur web : il parle le
protocole HTTP avec le réseau pour que ton code n'ait jamais à le faire.

```
réseau ──► TOMCAT ──► SPRING ──► ton controller
           (parle     (route vers    (ta logique)
            HTTP)      la bonne
                       méthode)
```

### Tomcat = l'Apache du monde Java

Même métier qu'Apache dans XAMPP : recevoir les requêtes HTTP et faire
exécuter ton code. (Tomcat est d'ailleurs développé par la même fondation :
son nom complet est *Apache Tomcat*.)

### Embarqué, pas installé

- **À l'ancienne** : on installait Tomcat sur la machine (comme Apache) et
  on lui déposait l'application compilée (fichier `.war`) — l'équivalent
  du `htdocs`.
- **Avec Spring Boot** : Tomcat est une **dépendance** apportée par
  `spring-boot-starter-web` dans le `pom.xml`. Ce n'est plus "le serveur
  qui héberge ton app", c'est "ton app qui contient son serveur".

La ligne de log à chaque démarrage :

```
Tomcat started on port 8080 (http)
```

= "le serveur web embarqué écoute sur la porte 8080". Tu n'écriras jamais
une ligne de code pour Tomcat : l'auto-configuration de Spring Boot s'en
charge.

---

## 3. H2 : la base de données embarquée

**H2 est une base de données écrite entièrement en Java.** Contrairement à
MySQL (logiciel serveur séparé, installé, toujours allumé), H2 n'est
qu'une **bibliothèque** — un `.jar` téléchargé par Maven comme n'importe
quelle dépendance. Elle démarre *dans* ton application, dans le même
processus. On dit qu'elle est **embarquée** (embedded).

- **Où sont les données ?** Dans un simple fichier :
  `backend/data/studymate.mv.db` (chemin défini dans
  `application.properties` : `jdbc:h2:file:./data/studymate`).
- **Repartir de zéro ?** Arrête le serveur et supprime le dossier `data/`.
- **Pourquoi H2 seulement en dev ?** C'est un outil de confort local. En
  production on utilisera **PostgreSQL** (vraie BDD serveur, comme MySQL),
  et on changera juste quelques lignes de configuration — le code Java,
  lui, ne change pas (merci JPA/Hibernate, voir fiche Spring Boot §6).

---

## 4. La console H2 (notre phpMyAdmin)

La console web fait partie de la bibliothèque H2 elle-même (les
développeurs de H2 livrent une mini app web d'administration dans le même
`.jar`). Spring Boot la détecte et la branche sur ton serveur grâce à la
ligne :

```properties
spring.h2.console.enabled=true
```

C'est un exemple typique de **l'auto-configuration** : Spring Boot voit
"H2 présent + console demandée" → il monte la console sur `/h2-console`.
Preuve dans les logs : `H2ConsoleAutoConfiguration : H2 console available`.

### S'y connecter

1. Le backend doit tourner. Ouvre **http://localhost:8080/h2-console**
2. Renseigne exactement :

| Champ | Valeur |
|---|---|
| JDBC URL | `jdbc:h2:file:./data/studymate` ⚠️ doit correspondre à `application.properties` |
| User Name | `sa` |
| Password | *(vide)* |

3. **Connect** → à gauche les tables (créées par Hibernate depuis tes
   classes `@Entity`), au centre un éditeur SQL :

```sql
SELECT * FROM TASK;
```

### Différences avec phpMyAdmin

- Plus spartiate : pas d'édition en cliquant dans les cellules — tout
  passe par du SQL (`UPDATE`, `INSERT`...).
- N'existe que quand le backend tourne (elle vit dans ton app).
- ⚠️ Outil de dev uniquement : **jamais activée en production**.

Plus tard avec PostgreSQL, l'équivalent sera un client graphique type
**pgAdmin**, **DBeaver** ou **TablePlus**.

---

## 5. Ports et localhost

- **localhost** = "ma propre machine". Une adresse qui ne sort jamais sur
  internet : personne d'autre ne peut voir ton serveur de dev.
- **Un port** = une "porte" numérotée sur une machine. Plusieurs programmes
  peuvent écouter le réseau en même temps, chacun derrière sa porte :
  - `localhost:8080` → notre backend Spring Boot
  - `localhost:5173` → notre futur frontend React (serveur de dev Vite)
- **"Port already in use"** : deux programmes ne peuvent pas partager la
  même porte. Si le 8080 est occupé par un vieux serveur oublié :
  `lsof -ti:8080 | xargs kill` (voir §7).

---

## 6. Démarrer, arrêter, éteindre son PC

**Il n'y a RIEN à éteindre avant d'éteindre le PC.** Pas de service, pas
de panneau XAMPP :

- Extinction du PC → le programme s'arrête, point.
- **Les données ne risquent rien** : H2 écrit dans son fichier au fil de
  l'eau (avec un journal interne, comme MySQL) — même un arrêt brutal ne
  perd pas ce qui est sauvegardé.
- Au redémarrage du PC, rien ne se relance tout seul. Tu relances le
  serveur à la main quand tu veux travailler, il retrouve le fichier de
  données, tout est là.

### Routine d'une session de dev

```bash
# démarrer (dans un terminal, laisser tourner) :
cd ~/Desktop/vibeCodTest/backend
./mvnw spring-boot:run

# ... on code ... (devtools redémarre le serveur à chaque recompilation)

# arrêter : Ctrl+C dans ce terminal (ou éteindre le PC, même effet)
```

---

## 7. Les commandes du quotidien

| Commande | Effet |
|---|---|
| `./mvnw spring-boot:run` | Lance le backend (compile d'abord si besoin) |
| `Ctrl+C` | Arrête le serveur qui tourne dans ce terminal |
| `./mvnw compile` | Compile (et déclenche le redémarrage auto via devtools) |
| `./mvnw test` | Lance les tests |
| `lsof -ti:8080 \| xargs kill` | Libère le port 8080 (serveur oublié/bloqué) |
| `curl -s http://localhost:8080/api/tasks` | Tester un endpoint depuis le terminal |
| `curl -s -X POST http://localhost:8080/api/tasks -H "Content-Type: application/json" -d '{"title":"test"}'` | Tester un POST avec un corps JSON |

**curl** = envoyer des requêtes HTTP depuis le terminal. C'est exactement
ce que fera React plus tard ; en attendant, c'est notre façon de tester le
backend sans interface.

---

## 8. Tableau de correspondance XAMPP ⇄ StudyMate

| Monde XAMPP/PHP | Notre projet | Différence clé |
|---|---|---|
| Apache | **Tomcat** | Embarqué dans l'app, rien à installer |
| MySQL | **H2** (dev) → **PostgreSQL** (prod) | H2 embarquée ; PostgreSQL viendra au déploiement |
| phpMyAdmin | **Console H2** (`/h2-console`) | Vit dans l'app ; SQL uniquement |
| htdocs (déposer ses fichiers) | Le projet EST le serveur | L'app contient Tomcat, pas l'inverse |
| Panneau XAMPP start/stop | `./mvnw spring-boot:run` / `Ctrl+C` | Aucun service en arrière-plan |
| `.php` interprétés à la volée | `.java` compilés (`./mvnw compile`) | devtools recharge le serveur tout seul |
