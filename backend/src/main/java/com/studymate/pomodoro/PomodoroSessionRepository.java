package com.studymate.pomodoro;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {

    // Toutes les sessions d'un programme (pour additionner les minutes côté front).
    List<PomodoroSession> findByProgrammeId(Long programmeId);
}
