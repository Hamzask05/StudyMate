package com.studymate.task;

import com.studymate.programme.Programme;
import com.studymate.programme.ProgrammeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
 * Le CONTROLLER : la porte d'entrée HTTP du module tâches.
 *   GET    /api/tasks[?programmeId=X] → all()   lister (toutes, ou d'un programme)
 *   POST   /api/tasks                 → create() créer (rattachable à un programme)
 *   PATCH  /api/tasks/{id}            → update() modifier partiellement
 *   DELETE /api/tasks/{id}            → delete() supprimer
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository repository;
    private final ProgrammeRepository programmeRepository; // pour rattacher une tâche à un programme

    public TaskController(TaskRepository repository, ProgrammeRepository programmeRepository) {
        this.repository = repository;
        this.programmeRepository = programmeRepository;
    }

    @GetMapping // GET /api/tasks  ou  GET /api/tasks?programmeId=3
    public List<Task> all(@RequestParam(required = false) Long programmeId) {
        // @RequestParam(required=false) : paramètre optionnel après le "?".
        // Présent → on ne renvoie que les tâches de ce programme ;
        // absent  → on renvoie toutes les tâches (page Tâches globale).
        if (programmeId != null) {
            return repository.findByProgrammeId(programmeId);
        }
        return repository.findAll();
    }

    @PostMapping // POST /api/tasks
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody CreateTaskRequest req) {
        // On construit l'entité à partir du DTO (le front n'envoie qu'un
        // programmeId, pas un objet Programme entier — fiche Relations §7).
        Task task = new Task();
        task.setTitle(req.title());
        task.setDueDate(req.dueDate());
        if (req.programmeId() != null) {
            Programme programme = programmeRepository.findById(req.programmeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Programme " + req.programmeId() + " introuvable"));
            task.setProgramme(programme);
        }
        return repository.save(task);
    }

    @PatchMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody UpdateTaskRequest changes) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tâche " + id + " introuvable"));

        if (changes.title() != null) {
            task.setTitle(changes.title());
        }
        if (changes.done() != null) {
            task.setDone(changes.done());
        }
        if (changes.dueDate() != null) {
            task.setDueDate(changes.dueDate());
        }
        return repository.save(task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Tâche " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    // Corps attendu pour CRÉER une tâche : titre (+ échéance et programme
    // facultatifs). programmeId à null = tâche non rattachée à un programme.
    public record CreateTaskRequest(
            @NotBlank(message = "Le titre est obligatoire")
            @Size(max = 200) String title,
            LocalDate dueDate,
            Long programmeId) {
    }

    // Corps attendu par PATCH (modification partielle).
    public record UpdateTaskRequest(String title, Boolean done, LocalDate dueDate) {
    }
}
