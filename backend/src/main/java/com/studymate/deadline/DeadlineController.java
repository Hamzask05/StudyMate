package com.studymate.deadline;

import com.studymate.programme.Programme;
import com.studymate.programme.ProgrammeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

/**
 * Porte d'entrée HTTP des échéances.
 *   GET    /api/deadlines?programmeId=X → celles d'un programme (triées par date)
 *   POST   /api/deadlines               → créer
 *   PATCH  /api/deadlines/{id}          → modifier
 *   DELETE /api/deadlines/{id}          → supprimer
 */
@RestController
@RequestMapping("/api/deadlines")
public class DeadlineController {

    private final DeadlineRepository repository;
    private final ProgrammeRepository programmeRepository;

    public DeadlineController(DeadlineRepository repository, ProgrammeRepository programmeRepository) {
        this.repository = repository;
        this.programmeRepository = programmeRepository;
    }

    @GetMapping
    public List<Deadline> all(@RequestParam(required = false) Long programmeId) {
        if (programmeId != null) {
            return repository.findByProgrammeIdOrderByDueDateAsc(programmeId);
        }
        return repository.findAllByOrderByDueDateAsc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Deadline create(@Valid @RequestBody CreateDeadlineRequest req) {
        Deadline deadline = new Deadline();
        deadline.setTitle(req.title());
        deadline.setDueDate(req.dueDate());
        if (req.importance() != null) {
            deadline.setImportance(req.importance());
        }
        deadline.setNotes(req.notes());
        if (req.programmeId() != null) {
            Programme programme = programmeRepository.findById(req.programmeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Programme " + req.programmeId() + " introuvable"));
            deadline.setProgramme(programme);
        }
        return repository.save(deadline);
    }

    @PatchMapping("/{id}")
    public Deadline update(@PathVariable Long id, @RequestBody UpdateDeadlineRequest changes) {
        Deadline deadline = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Échéance " + id + " introuvable"));

        if (changes.title() != null) {
            deadline.setTitle(changes.title());
        }
        if (changes.dueDate() != null) {
            deadline.setDueDate(changes.dueDate());
        }
        if (changes.importance() != null) {
            deadline.setImportance(changes.importance());
        }
        if (changes.notes() != null) {
            deadline.setNotes(changes.notes());
        }
        return repository.save(deadline);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Échéance " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    // Corps attendu pour créer : titre + date obligatoires, importance et notes
    // facultatives, programmeId pour le rattachement.
    public record CreateDeadlineRequest(
            @NotBlank(message = "Le titre est obligatoire") @Size(max = 200) String title,
            @NotNull(message = "La date est obligatoire") LocalDate dueDate,
            Importance importance,
            @Size(max = 2000) String notes,
            Long programmeId) {
    }

    public record UpdateDeadlineRequest(
            String title, LocalDate dueDate, Importance importance, String notes) {
    }
}
