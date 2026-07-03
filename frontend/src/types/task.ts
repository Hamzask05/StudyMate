// ============================================================================
// La "forme" d'une tâche côté front : le miroir TypeScript de Task.java.
// Quand le backend nous envoie son JSON, on le range dans cette interface —
// le compilateur nous protège alors des fautes de frappe (task.titel → erreur).
// ============================================================================

export interface Task {
  id: number;
  title: string;
  done: boolean;
  // "string | null" = ce champ peut être une chaîne OU null (pas d'échéance).
  // Les dates voyagent en texte dans le JSON ("2026-07-10") ; on les
  // convertira en objets Date seulement si on doit calculer dessus.
  dueDate: string | null;
  createdAt: string;
}
