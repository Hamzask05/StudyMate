package com.studymate.pomodoro;

import com.studymate.programme.Programme;
import com.studymate.programme.ProgrammeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Enregistrement et lecture des sessions Pomodoro terminées.
 *   POST /api/pomodoro-sessions             → enregistrer une session finie
 *   GET  /api/pomodoro-sessions?programmeId= → sessions d'un programme
 */
@RestController
@RequestMapping("/api/pomodoro-sessions")
public class PomodoroSessionController {

    private final PomodoroSessionRepository repository;
    private final ProgrammeRepository programmeRepository;

    public PomodoroSessionController(PomodoroSessionRepository repository,
                                     ProgrammeRepository programmeRepository) {
        this.repository = repository;
        this.programmeRepository = programmeRepository;
    }

    @GetMapping
    public List<PomodoroSession> all(@RequestParam(required = false) Long programmeId) {
        if (programmeId != null) {
            return repository.findByProgrammeId(programmeId);
        }
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PomodoroSession create(@Valid @RequestBody CreateSessionRequest req) {
        PomodoroSession session = new PomodoroSession();
        session.setWorkMinutes(req.workMinutes());
        if (req.programmeId() != null) {
            Programme programme = programmeRepository.findById(req.programmeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Programme " + req.programmeId() + " introuvable"));
            session.setProgramme(programme);
        }
        return repository.save(session);
    }

    // Corps attendu : la durée travaillée (+ le programme, facultatif).
    public record CreateSessionRequest(
            @Positive(message = "La durée doit être positive") int workMinutes,
            Long programmeId) {
    }
}
