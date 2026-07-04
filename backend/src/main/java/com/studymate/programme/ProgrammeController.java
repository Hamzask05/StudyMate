package com.studymate.programme;

import com.studymate.subject.Subject;
import com.studymate.subject.SubjectRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Porte d'entrée HTTP des programmes.
 *
 * Nouveauté : la création utilise un DTO (CreateProgrammeRequest) au lieu de
 * recevoir directement l'entité Programme. Pourquoi ? Parce que ce que le
 * front ENVOIE diffère de ce qu'on STOCKE :
 *   - le front envoie des IDENTIFIANTS de matières (subjectIds = [1, 2])
 *   - l'entité, elle, contient des OBJETS Subject complets
 * Le DTO décrit précisément le corps attendu ; le controller traduit ensuite
 * les ids en vraies matières avant de sauvegarder. (Fiche Spring Boot §12.)
 */
@RestController
@RequestMapping("/api/programmes")
public class ProgrammeController {

    private final ProgrammeRepository repository;
    private final SubjectRepository subjectRepository; // pour retrouver les matières par id

    public ProgrammeController(ProgrammeRepository repository,
                               SubjectRepository subjectRepository) {
        this.repository = repository;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping
    public List<Programme> all() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Programme one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Programme " + id + " introuvable"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Programme create(@Valid @RequestBody CreateProgrammeRequest req) {
        // findAllById : récupère en une requête toutes les matières dont l'id
        // est dans la liste. On refuse un programme sans aucune matière valide.
        List<Subject> subjects = subjectRepository.findAllById(req.subjectIds());
        if (subjects.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Au moins une matière valide est requise");
        }

        Programme programme = new Programme();
        programme.setName(req.name());
        programme.setSubjects(subjects);
        programme.setTargetHours(req.targetHours());
        if (req.trackingType() != null) {
            programme.setTrackingType(req.trackingType());
        }
        return repository.save(programme);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Programme " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    /**
     * Le corps attendu pour créer un programme. C'est le CONTRAT côté entrée :
     * il ne contient QUE ce que le front doit fournir (pas d'id, pas d'objets
     * Subject entiers, juste leurs identifiants).
     */
    public record CreateProgrammeRequest(
            @NotBlank(message = "Le nom du programme est obligatoire") String name,
            List<Long> subjectIds,
            TrackingType trackingType,
            @Positive(message = "L'objectif d'heures doit être positif") double targetHours) {
    }
}
