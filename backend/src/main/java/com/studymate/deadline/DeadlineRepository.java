package com.studymate.deadline;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeadlineRepository extends JpaRepository<Deadline, Long> {

    // Requête explicite (cible programme.id). Nécessaire car l'entité expose
    // un getter getProgrammeId() pour le JSON : une requête dérivée du nom
    // "findByProgrammeId" le prendrait à tort pour un champ mappé.
    @Query("SELECT d FROM Deadline d WHERE d.programme.id = :programmeId ORDER BY d.dueDate ASC")
    List<Deadline> findForProgramme(@Param("programmeId") Long programmeId);

    // Toutes les échéances, triées par date (pour la vue globale).
    List<Deadline> findAllByOrderByDueDateAsc();
}
