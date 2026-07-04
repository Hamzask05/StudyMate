package com.studymate.note;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
 * Une fiche de révision rattachée à un programme (titre + contenu libre).
 * Pour l'instant saisie à la main ; le module IA pourra plus tard en générer
 * automatiquement à partir d'un cours.
 */
@Entity
public class RevisionNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Programme programme;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200)
    private String title;

    // Contenu potentiellement long → colonne dimensionnée large (10 000 car.).
    @Column(length = 10000)
    private String content;

    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }

    public Programme getProgramme() {
        return programme;
    }

    public void setProgramme(Programme programme) {
        this.programme = programme;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
