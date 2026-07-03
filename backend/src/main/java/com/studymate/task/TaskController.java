package com.studymate.task;

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

import java.time.LocalDate;
import java.util.List;

/**
 * Le CONTROLLER : la porte d'entrée HTTP du module tâches.
 * Son seul travail : associer des URLs à des méthodes Java.
 *   GET    /api/tasks      → all()      lister
 *   POST   /api/tasks      → create()   créer
 *   PATCH  /api/tasks/{id} → update()   modifier partiellement
 *   DELETE /api/tasks/{id} → delete()   supprimer
 */
@RestController // composant Spring dont les méthodes répondent en JSON
@RequestMapping("/api/tasks") // préfixe d'URL commun à toutes les méthodes de la classe
public class TaskController {

    private final TaskRepository repository;

    // INJECTION DE DÉPENDANCES : on ne fait jamais "new TaskRepository()".
    // Spring voit ce constructeur au démarrage et fournit lui-même le bean.
    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping // GET /api/tasks
    public List<Task> all() {
        // findAll() → SELECT * FROM task ; la List<Task> retournée est
        // convertie en tableau JSON automatiquement (par Jackson).
        return repository.findAll();
    }

    @PostMapping // POST /api/tasks
    @ResponseStatus(HttpStatus.CREATED) // répondre 201 (créé) plutôt que 200 par défaut
    public Task create(@Valid @RequestBody Task task) {
        // @RequestBody : le JSON du corps de la requête → objet Task
        // @Valid : vérifie les contraintes (@NotBlank, @Size) AVANT d'entrer
        //          ici ; si violation → 400 automatique, la méthode ne tourne pas.
        // save() → INSERT ; l'objet revient avec son id attribué par la BDD.
        return repository.save(task);
    }

    @PatchMapping("/{id}") // PATCH /api/tasks/5  → id = 5
    public Task update(@PathVariable Long id, @RequestBody UpdateTaskRequest changes) {
        // @PathVariable : extrait le {id} de l'URL et le convertit en Long.
        // findById retourne un Optional (boîte pleine ou vide, cf. fiche §7) :
        // si vide, on lance une exception que Spring traduit en réponse 404.
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tâche " + id + " introuvable"));

        // Sémantique PATCH : ne modifier QUE les champs présents dans le JSON.
        // Un champ absent arrive à null ici → on ne touche pas à l'existant.
        if (changes.title() != null) {
            task.setTitle(changes.title());
        }
        if (changes.done() != null) {
            task.setDone(changes.done());
        }
        if (changes.dueDate() != null) {
            task.setDueDate(changes.dueDate());
        }
        // save() sur un objet qui a déjà un id → UPDATE (et non INSERT)
        return repository.save(task);
    }

    @DeleteMapping("/{id}") // DELETE /api/tasks/5
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 : succès, rien à renvoyer
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Tâche " + id + " introuvable");
        }
        repository.deleteById(id);
    }

    // Le corps attendu par PATCH. Un "record" Java : classe immuable déclarée
    // en une ligne (champs + constructeur + accesseurs générés).
    // On utilise Boolean (objet) et non boolean (primitif) pour distinguer
    // "champ absent du JSON" (null) de "false" envoyé volontairement.
    public record UpdateTaskRequest(String title, Boolean done, LocalDate dueDate) {
    }
}
