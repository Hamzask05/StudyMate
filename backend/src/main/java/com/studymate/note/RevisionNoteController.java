package com.studymate.note;

import com.studymate.programme.Programme;
import com.studymate.programme.ProgrammeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Fiches de révision d'un programme.
 *   GET    /api/notes?programmeId= → fiches d'un programme
 *   POST   /api/notes              → créer une fiche
 *   DELETE /api/notes/{id}         → supprimer
 */
@RestController
@RequestMapping("/api/notes")
public class RevisionNoteController {

    private final RevisionNoteRepository repository;
    private final ProgrammeRepository programmeRepository;

    public RevisionNoteController(RevisionNoteRepository repository,
                                  ProgrammeRepository programmeRepository) {
        this.repository = repository;
        this.programmeRepository = programmeRepository;
    }

    @GetMapping
    public List<RevisionNote> all(@RequestParam Long programmeId) {
        return repository.findByProgrammeIdOrderByCreatedAtDesc(programmeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RevisionNote create(@Valid @RequestBody CreateNoteRequest req) {
        Programme programme = programmeRepository.findById(req.programmeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Programme " + req.programmeId() + " introuvable"));

        RevisionNote note = new RevisionNote();
        note.setProgramme(programme);
        note.setTitle(req.title());
        note.setContent(req.content());
        return repository.save(note);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fiche " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    public record CreateNoteRequest(
            @NotNull Long programmeId,
            @NotBlank(message = "Le titre est obligatoire") String title,
            String content) {
    }
}
