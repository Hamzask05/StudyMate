package com.studymate.deadline;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.studymate.programme.Programme;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.time.LocalDate;

/**
 * L'ENTITÉ Deadline : une échéance rattachée à un programme.
 * Trois infos choisies par l'utilisateur : une date, une importance, et un
 * texte libre en guise de notes.
 */
@Entity
public class Deadline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre de l'échéance est obligatoire")
    @Size(max = 200)
    private String title;

    // La date de l'échéance (obligatoire). LocalDate → colonne DATE.
    @NotNull(message = "La date est obligatoire")
    private LocalDate dueDate;

    // Importance stockée en texte ("HIGH"...) plutôt qu'en position numérique.
    @Enumerated(EnumType.STRING)
    private Importance importance = Importance.MEDIUM;

    // Notes libres (facultatives). @Column(length=2000) : colonne plus large
    // que le varchar(255) par défaut, pour un vrai paragraphe.
    @Size(max = 2000)
    @Column(length = 2000)
    private String notes;

    private Instant createdAt = Instant.now();

    // Programme auquel appartient l'échéance (voir Task pour le même motif).
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Programme programme;

    // ==== Getters / Setters ====

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Importance getImportance() {
        return importance;
    }

    public void setImportance(Importance importance) {
        this.importance = importance;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    // Champs "légers" ajoutés au JSON pour la vue globale des échéances :
    // on expose seulement l'id et le nom du programme, pas l'objet entier.
    // (@JsonProperty crée une clé JSON ; l'accès au programme LAZY fonctionne
    // pendant la sérialisation grâce à l'Open-Session-In-View de Spring Boot.)
    @JsonProperty("programmeId")
    public Long getProgrammeId() {
        return programme != null ? programme.getId() : null;
    }

    @JsonProperty("programmeName")
    public String getProgrammeName() {
        return programme != null ? programme.getName() : null;
    }
}
