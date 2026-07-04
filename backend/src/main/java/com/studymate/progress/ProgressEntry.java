package com.studymate.progress;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.studymate.programme.Programme;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.Instant;

/**
 * Un point de progression saisi par l'utilisateur pour un programme.
 *
 * Le SENS de "value" dépend du mode de suivi du programme (trackingType) :
 *   - GRADES : une vraie note sur 20 (ex : 14.5)
 *   - MOOD   : un ressenti de 1 à 5 (auto-évaluation)
 * On stocke la même colonne dans les deux cas ; c'est le front qui l'affiche
 * selon le mode. Chaque point est daté → on peut tracer une courbe.
 */
@Entity
public class ProgressEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Programme programme;

    // La valeur saisie (note /20 ou ressenti /5 selon le programme).
    // @Column(name="score") : "value" est un mot réservé SQL → on nomme la
    // colonne "score" en base, tout en gardant le champ/JSON "value".
    @Column(name = "score")
    private double value;

    // Libellé optionnel du point (ex : "Contrôle chapitre 3").
    private String label;

    private Instant recordedAt = Instant.now();

    public Long getId() {
        return id;
    }

    public Programme getProgramme() {
        return programme;
    }

    public void setProgramme(Programme programme) {
        this.programme = programme;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Instant getRecordedAt() {
        return recordedAt;
    }
}
