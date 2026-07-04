package com.studymate.note;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RevisionNoteRepository extends JpaRepository<RevisionNote, Long> {

    List<RevisionNote> findByProgrammeIdOrderByCreatedAtDesc(Long programmeId);
}
