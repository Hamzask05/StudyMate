package com.studymate.subject;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Porte d'entrée HTTP du module matières. Mêmes patterns que TaskController :
 *   GET    /api/subjects      → lister
 *   POST   /api/subjects      → créer
 *   PATCH  /api/subjects/{id} → modifier
 *   DELETE /api/subjects/{id} → supprimer
 */
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository repository;

    public SubjectController(SubjectRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Subject> all() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Subject create(@Valid @RequestBody Subject subject) {
        return repository.save(subject);
    }

    @PatchMapping("/{id}")
    public Subject update(@PathVariable Long id, @RequestBody UpdateSubjectRequest changes) {
        Subject subject = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Matière " + id + " introuvable"));

        // On ne modifie que les champs présents dans le JSON (sémantique PATCH)
        if (changes.name() != null) {
            subject.setName(changes.name());
        }
        if (changes.color() != null) {
            subject.setColor(changes.color());
        }
        if (changes.coefficient() != null) {
            subject.setCoefficient(changes.coefficient());
        }
        if (changes.targetGrade() != null) {
            subject.setTargetGrade(changes.targetGrade());
        }
        return repository.save(subject);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Matière " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    // Corps du PATCH : tous les champs optionnels (types objets pour permettre null).
    public record UpdateSubjectRequest(
            String name, String color, Double coefficient, Double targetGrade) {
    }
}
