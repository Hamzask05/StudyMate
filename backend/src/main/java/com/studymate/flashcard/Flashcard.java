package com.studymate.flashcard;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.studymate.programme.Programme;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

/**
 * L'ENTITÉ Flashcard : une carte de révision recto/verso (question → réponse),
 * rattachée à un programme. Même patron que Deadline (relation @ManyToOne +
 * champs légers programmeId/programmeName exposés pour la vue globale).
 */
@Entity
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La question est obligatoire")
    @Size(max = 500)
    private String question;

    @NotBlank(message = "La réponse est obligatoire")
    @Size(max = 2000)
    @Column(length = 2000)
    private String answer;

    private Instant createdAt = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Programme programme;

    // ==== Getters / Setters ====

    public Long getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
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

    // Champs "légers" pour la vue globale (id + nom du programme, pas l'objet entier)
    @JsonProperty("programmeId")
    public Long getProgrammeId() {
        return programme != null ? programme.getId() : null;
    }

    @JsonProperty("programmeName")
    public String getProgrammeName() {
        return programme != null ? programme.getName() : null;
    }
}
