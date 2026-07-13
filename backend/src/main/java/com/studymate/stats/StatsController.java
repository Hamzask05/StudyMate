package com.studymate.stats;

import com.studymate.flashcard.FlashcardRepository;
import com.studymate.pomodoro.PomodoroSession;
import com.studymate.pomodoro.PomodoroSessionRepository;
import com.studymate.programme.ProgrammeRepository;
import com.studymate.task.Task;
import com.studymate.task.TaskRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Statistiques agrégées pour le tableau de bord d'accueil : heures de révision,
 * série de jours consécutifs (streak), tâches, etc. Tout est calculé en une
 * requête à partir des sessions Pomodoro et des tâches.
 */
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final PomodoroSessionRepository sessions;
    private final TaskRepository tasks;
    private final ProgrammeRepository programmes;
    private final FlashcardRepository flashcards;

    public StatsController(PomodoroSessionRepository sessions, TaskRepository tasks,
                           ProgrammeRepository programmes, FlashcardRepository flashcards) {
        this.sessions = sessions;
        this.tasks = tasks;
        this.programmes = programmes;
        this.flashcards = flashcards;
    }

    @GetMapping
    public StatsResponse get() {
        List<PomodoroSession> all = sessions.findAll();
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);

        int totalMinutes = all.stream().mapToInt(PomodoroSession::getWorkMinutes).sum();

        // Heures des 7 derniers jours (aujourd'hui inclus)
        LocalDate weekStart = today.minusDays(6);
        int weekMinutes = all.stream()
                .filter(s -> !dayOf(s, zone).isBefore(weekStart))
                .mapToInt(PomodoroSession::getWorkMinutes)
                .sum();

        // Série (streak) : nb de jours consécutifs avec au moins une session,
        // en terminant aujourd'hui (ou hier si on n'a pas encore révisé aujourd'hui).
        Set<LocalDate> days = all.stream().map(s -> dayOf(s, zone)).collect(Collectors.toSet());
        LocalDate cursor = days.contains(today) ? today : today.minusDays(1);
        int streak = 0;
        while (days.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }

        List<Task> allTasks = tasks.findAll();
        long tasksTotal = allTasks.size();
        long tasksDone = allTasks.stream().filter(Task::isDone).count();

        return new StatsResponse(
                round1(totalMinutes / 60.0),
                round1(weekMinutes / 60.0),
                streak,
                all.size(),
                programmes.count(),
                tasksDone,
                tasksTotal,
                flashcards.count());
    }

    private static LocalDate dayOf(PomodoroSession s, ZoneId zone) {
        return s.getCompletedAt().atZone(zone).toLocalDate();
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    public record StatsResponse(
            double totalHours,
            double weekHours,
            int streakDays,
            int sessionsCount,
            long programmesCount,
            long tasksDone,
            long tasksTotal,
            long flashcardsCount) {
    }
}
