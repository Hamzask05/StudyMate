// ============================================================================
// Les appels HTTP vers le backend pour le module tâches.
// Une fonction = un endpoint de notre TaskController Spring.
// C'est l'équivalent en code des curl qu'on tapait dans le terminal.
// ============================================================================

import type { Task } from '../types/task';

const API_URL = 'http://localhost:8080/api/tasks';

// Vérifie la réponse : si le backend répond 4xx/5xx, on lance une erreur
// (fetch ne le fait PAS tout seul — un 404 est une "réponse réussie" pour lui !)
async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

// GET /api/tasks → la liste complète
// "async/await" : une requête réseau prend du temps ; await = "attends la
// réponse avant de continuer". La fonction retourne une Promise<Task[]>,
// c'est-à-dire "un futur tableau de tâches".
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(API_URL);
  await checkResponse(response);
  return response.json(); // le corps JSON → tableau d'objets Task
}

// POST /api/tasks → créer (le backend attribue l'id et renvoie la tâche)
export async function createTask(title: string): Promise<Task> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }), // objet JS → texte JSON
  });
  await checkResponse(response);
  return response.json();
}

// PATCH /api/tasks/{id} → modification partielle (ici : cocher/décocher)
export async function updateTask(
  id: number,
  changes: { title?: string; done?: boolean; dueDate?: string },
): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  await checkResponse(response);
  return response.json();
}

// DELETE /api/tasks/{id} → suppression (le backend répond 204, sans corps)
export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response);
}
