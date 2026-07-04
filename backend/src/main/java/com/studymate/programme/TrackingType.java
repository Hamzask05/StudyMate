package com.studymate.programme;

/**
 * Le type de suivi de progression choisi pour un programme.
 *
 * Un enum = un ensemble fermé de valeurs possibles (comme une liste de
 * constantes). Ici, un programme se suit soit par notes réelles, soit par
 * ressenti — et rien d'autre. Le compilateur garantit qu'aucune autre
 * valeur ne peut exister.
 */
public enum TrackingType {
    GRADES, // suivi par notes réelles sur 20
    MOOD    // suivi par ressenti auto-évalué (ex : de 1 à 5)
}
