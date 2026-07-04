package com.studymate.subject;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * L'ENTITÉ Subject : une matière (Maths, Physique, Anglais...).
 *
 * C'est la "colonne vertébrale" de l'app : tâches, sessions Pomodoro et notes
 * viendront s'y rattacher (relations qu'on ajoutera à l'étape suivante).
 * Pour l'instant, une entité autonome — même structure que Task, avec de
 * nouveaux champs.
 */
@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la matière est obligatoire")
    @Size(max = 100)
    private String name;

    // Couleur d'affichage au format hexadécimal (ex : "#4c6ef5").
    // Servira à distinguer les matières d'un coup d'œil dans l'interface.
    @Size(max = 20)
    private String color = "#4c6ef5";

    // Coefficient de la matière (pour pondérer les notes dans la future
    // courbe de progression). @Positive : doit être > 0.
    @Positive(message = "Le coefficient doit être positif")
    private double coefficient = 1.0;

    // Objectif de note visé, sur 20. Double (objet) et non double (primitif)
    // pour pouvoir rester null : une matière n'a pas forcément d'objectif.
    // @DecimalMin/@DecimalMax bornent la valeur quand elle est renseignée.
    @DecimalMin(value = "0.0", message = "L'objectif doit être entre 0 et 20")
    private Double targetGrade;

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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public double getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    public Double getTargetGrade() {
        return targetGrade;
    }

    public void setTargetGrade(Double targetGrade) {
        this.targetGrade = targetGrade;
    }
}
