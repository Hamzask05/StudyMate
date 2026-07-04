package com.studymate.progress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressEntryRepository extends JpaRepository<ProgressEntry, Long> {

    // Points d'un programme, du plus ancien au plus récent (pour la courbe).
    List<ProgressEntry> findByProgrammeIdOrderByRecordedAtAsc(Long programmeId);
}
