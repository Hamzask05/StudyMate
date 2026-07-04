package com.studymate.task;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.studymate.programme.Programme;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.time.LocalDate;

/**
 * L'ENTITÉ Task : une classe Java "normale" (champs + getters/setters),
 * que les annotations transforment en table de base de données.
 *
 * Au démarrage, Hibernate lit cette classe par réflexion et en déduit :
 *   create table task (id bigint ..., title varchar(200) not null, ...)
 * Chaque objet Task sauvegardé = une ligne dans cette table.
 */
@Entity // dit à Hibernate : "cette classe correspond à une table en BDD"
public class Task {

    @Id // ce champ est la CLÉ PRIMAIRE de la table (identifiant unique de chaque ligne)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ↑ on ne choisit jamais l'id nous-mêmes : la BDD l'attribue toute seule
    //   en auto-incrément (1, 2, 3...) au moment de l'INSERT.
    //   C'est pourquoi on utilise Long (objet) et pas long (primitif) :
    //   un objet peut valoir null tant que la tâche n'est pas encore en BDD.
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    // ↑ règle de VALIDATION : refuse null, "" et "   " (espaces seuls).
    //   Vérifiée à l'entrée de l'API (grâce au @Valid du controller) :
    //   si violée → réponse 400 avec ce message, notre code n'est jamais exécuté.
    @Size(max = 200, message = "Le titre ne doit pas dépasser 200 caractères")
    // ↑ deuxième règle, cumulable. Hibernate s'en sert AUSSI pour dimensionner
    //   la colonne : varchar(200).
    private String title;

    // Pas d'annotation nécessaire : Hibernate mappe les champs simples tout seul
    // (boolean → colonne BOOLEAN, valeur par défaut false pour une nouvelle tâche)
    private boolean done = false;

    // LocalDate = une date sans heure (ex : 2026-07-10) → colonne DATE.
    // Peut rester null : une tâche n'a pas forcément d'échéance.
    private LocalDate dueDate;

    // Instant = un point précis dans le temps (UTC) → colonne TIMESTAMP.
    // Initialisé à la création de l'objet, jamais modifié ensuite.
    private Instant createdAt = Instant.now();

    /**
     * Le programme auquel appartient la tâche (facultatif : une tâche peut
     * exister sans programme, ex. en mode révision spontanée). @ManyToOne :
     * "plusieurs tâches → un programme" ; Hibernate crée la colonne/clé
     * étrangère programme_id dans la table task (fiche Relations §2-3).
     *
     * @JsonIgnore : on n'inclut PAS le programme dans le JSON d'une tâche
     * (ce serait lourd et redondant). Côté front, on récupère les tâches
     * d'un programme via le filtre ?programmeId=… au lieu de lire ce champ.
     * LAZY : comme on ne sérialise pas le programme, inutile de le charger.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Programme programme;

    // ==== Getters / Setters ====
    // Hibernate et Jackson (le convertisseur JSON) passent par eux pour
    // lire/remplir l'objet. Pas de setter pour id ni createdAt : personne
    // ne doit pouvoir les modifier après coup.

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Programme getProgramme() {
        return programme;
    }

    public void setProgramme(Programme programme) {
        this.programme = programme;
    }
}
