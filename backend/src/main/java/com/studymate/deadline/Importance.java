package com.studymate.deadline;

/**
 * Le niveau d'importance d'une échéance. Enum = ensemble fermé de valeurs
 * (fiche Relations §8). Stocké en toutes lettres grâce à @Enumerated(STRING).
 */
public enum Importance {
    LOW,    // faible
    MEDIUM, // moyenne
    HIGH    // haute
}
