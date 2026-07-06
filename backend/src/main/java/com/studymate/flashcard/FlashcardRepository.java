package com.studymate.flashcard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    // Requête explicite (et non dérivée du nom) : on cible programme.id.
    // Nécessaire car l'entité expose un getter getProgrammeId() (pour le JSON) ;
    // une requête dérivée "findByProgrammeId" le confondrait avec un vrai champ.
    @Query("SELECT f FROM Flashcard f WHERE f.programme.id = :programmeId ORDER BY f.createdAt DESC")
    List<Flashcard> findForProgramme(@Param("programmeId") Long programmeId);

    // Toutes les flashcards (vue globale), la plus récente en premier.
    List<Flashcard> findAllByOrderByCreatedAtDesc();
}
