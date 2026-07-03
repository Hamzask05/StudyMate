package com.studymate.task;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Le REPOSITORY : notre accès à la base de données.
 *
 * C'est une interface sans corps, et c'est voulu : au démarrage, Spring Data
 * la détecte (car elle étend JpaRepository) et GÉNÈRE son implémentation.
 * Les deux types génériques lui disent quoi gérer :
 *   JpaRepository<Task, Long>
 *                  ▲      ▲
 *            l'entité    le type de sa clé primaire (l'id)
 *
 * On hérite ainsi gratuitement de : findAll(), findById(id), save(task),
 * deleteById(id), existsById(id), count()... — Spring écrit le SQL.
 *
 * Plus tard, on pourra ajouter des méthodes dont Spring déduit la requête
 * depuis le NOM, ex :  List<Task> findByDone(boolean done);  → WHERE done = ?
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
}
