package com.studymate.progress;

import com.studymate.programme.Programme;
import com.studymate.programme.ProgrammeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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
 * Saisie et lecture des points de progression d'un programme.
 *   POST /api/progress-entries             → ajouter un point (note ou ressenti)
 *   GET  /api/progress-entries?programmeId= → points d'un programme (pour la courbe)
 */
@RestController
@RequestMapping("/api/progress-entries")
public class ProgressEntryController {

    private final ProgressEntryRepository repository;
    private final ProgrammeRepository programmeRepository;

    public ProgressEntryController(ProgressEntryRepository repository,
                                   ProgrammeRepository programmeRepository) {
        this.repository = repository;
        this.programmeRepository = programmeRepository;
    }

    @GetMapping
    public List<ProgressEntry> all(@RequestParam Long programmeId) {
        return repository.findByProgrammeIdOrderByRecordedAtAsc(programmeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProgressEntry create(@Valid @RequestBody CreateEntryRequest req) {
        Programme programme = programmeRepository.findById(req.programmeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Programme " + req.programmeId() + " introuvable"));

        ProgressEntry entry = new ProgressEntry();
        entry.setProgramme(programme);
        entry.setValue(req.value());
        entry.setLabel(req.label());
        return repository.save(entry);
    }

    // value : note /20 ou ressenti /5 (validé simplement >= 0 ; la borne haute
    // dépend du mode, elle est contrôlée côté front).
    public record CreateEntryRequest(
            @NotNull Long programmeId,
            @PositiveOrZero double value,
            String label) {
    }
}
