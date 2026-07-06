package com.studymate.flashcard;

import com.studymate.programme.Programme;
import com.studymate.programme.ProgrammeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
 * Porte d'entrée HTTP des flashcards.
 *   GET    /api/flashcards?programmeId=X → celles d'un programme (ou toutes)
 *   POST   /api/flashcards               → créer
 *   DELETE /api/flashcards/{id}          → supprimer
 */
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    private final FlashcardRepository repository;
    private final ProgrammeRepository programmeRepository;

    public FlashcardController(FlashcardRepository repository, ProgrammeRepository programmeRepository) {
        this.repository = repository;
        this.programmeRepository = programmeRepository;
    }

    @GetMapping
    public List<Flashcard> all(@RequestParam(required = false) Long programmeId) {
        if (programmeId != null) {
            return repository.findForProgramme(programmeId);
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Flashcard create(@Valid @RequestBody CreateFlashcardRequest req) {
        Flashcard flashcard = new Flashcard();
        flashcard.setQuestion(req.question());
        flashcard.setAnswer(req.answer());
        if (req.programmeId() != null) {
            Programme programme = programmeRepository.findById(req.programmeId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Programme " + req.programmeId() + " introuvable"));
            flashcard.setProgramme(programme);
        }
        return repository.save(flashcard);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Flashcard " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    // Corps attendu pour créer : question + réponse obligatoires, programme optionnel.
    public record CreateFlashcardRequest(
            @NotBlank(message = "La question est obligatoire") @Size(max = 500) String question,
            @NotBlank(message = "La réponse est obligatoire") @Size(max = 2000) String answer,
            Long programmeId) {
    }
}
