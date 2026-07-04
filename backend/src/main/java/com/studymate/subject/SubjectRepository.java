package com.studymate.subject;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Accès BDD pour les matières. Comme pour les tâches : une interface vide qui
 * étend JpaRepository, et Spring Data génère findAll/findById/save/delete...
 */
public interface SubjectRepository extends JpaRepository<Subject, Long> {
}
