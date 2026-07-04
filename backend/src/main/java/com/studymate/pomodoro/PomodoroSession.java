package com.studymate.pomodoro;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.studymate.programme.Programme;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.Instant;

/**
 * Une session de travail Pomodoro TERMINÉE.
 *
 * On n'enregistre que les sessions de travail réellement finies (pas les
 * pauses, pas les sessions abandonnées) : chaque ligne = du temps de
 * révision effectif, qui alimentera le décompte des heures d'un programme
 * et la future courbe de progression.
 */
@Entity
public class PomodoroSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Le programme travaillé (facultatif : null en mode révision spontanée).
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Programme programme;

    // Durée de la session de travail, en minutes.
    private int workMinutes;

    // Instant de fin de la session.
    private Instant completedAt = Instant.now();

    public Long getId() {
        return id;
    }

    public Programme getProgramme() {
        return programme;
    }

    public void setProgramme(Programme programme) {
        this.programme = programme;
    }

    public int getWorkMinutes() {
        return workMinutes;
    }

    public void setWorkMinutes(int workMinutes) {
        this.workMinutes = workMinutes;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
}
