package com.studymate.deadline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeadlineRepository extends JpaRepository<Deadline, Long> {

    // Requête dérivée du nom : les échéances d'un programme, les plus proches
    // en premier (tri par date croissante). Spring Data génère le SQL.
    List<Deadline> findByProgrammeIdOrderByDueDateAsc(Long programmeId);

    // Toutes les échéances, triées par date (pour la vue globale).
    List<Deadline> findAllByOrderByDueDateAsc();
}
