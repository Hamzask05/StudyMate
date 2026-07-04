package com.studymate.programme;

import com.studymate.subject.Subject;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * L'ENTITÉ Programme : une unité de révision persistée (mode "avec mémoire").
 * C'est le concept central de l'app — voir STRUCTURE.md §0.
 *
 * Nouveauté par rapport aux entités précédentes : une RELATION vers d'autres
 * entités (les matières). En base, cette relation devient une table de
 * liaison ; en Java, elle s'écrit avec l'annotation @ManyToMany.
 */
@Entity
public class Programme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du programme est obligatoire")
    @Size(max = 150)
    private String name;

    /**
     * Les matières concernées (une ou plusieurs).
     *
     * @ManyToMany : "plusieurs programmes peuvent partager plusieurs matières".
     * Hibernate crée automatiquement une TABLE DE LIAISON (programme_subjects)
     * qui contient les couples (programme_id, subject_id) — c'est ainsi qu'une
     * relation N↔N se stocke dans une base relationnelle.
     *
     * fetch = EAGER : on charge les matières EN MÊME TEMPS que le programme.
     * Sans ça (LAZY par défaut), les matières ne seraient chargées qu'à la
     * demande, ce qui pose problème au moment de convertir en JSON (la
     * connexion BDD est déjà refermée). EAGER = simple et sûr à notre échelle.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Subject> subjects = new ArrayList<>();

    /**
     * Le type de suivi. @Enumerated(STRING) dit à Hibernate de stocker le NOM
     * de la valeur ("GRADES") dans la colonne, plutôt que sa position (0, 1) —
     * beaucoup plus lisible et robuste si on réordonne l'enum plus tard.
     */
    @Enumerated(EnumType.STRING)
    private TrackingType trackingType = TrackingType.GRADES;

    // Objectif d'heures à passer sur ce programme.
    @Positive(message = "L'objectif d'heures doit être positif")
    private double targetHours;

    private Instant createdAt = Instant.now();

    // ==== Getters / Setters ====

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }

    public TrackingType getTrackingType() {
        return trackingType;
    }

    public void setTrackingType(TrackingType trackingType) {
        this.trackingType = trackingType;
    }

    public double getTargetHours() {
        return targetHours;
    }

    public void setTargetHours(double targetHours) {
        this.targetHours = targetHours;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
