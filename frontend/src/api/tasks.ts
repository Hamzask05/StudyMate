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

// GET /api/tasks → toutes les tâches, OU celles d'un programme si programmeId
// est fourni (ajoute ?programmeId=… à l'URL, lu par le @RequestParam du back).
export async function fetchTasks(programmeId?: number): Promise<Task[]> {
  const url = programmeId ? `${API_URL}?programmeId=${programmeId}` : API_URL;
  const response = await fetch(url);
  await checkResponse(response);
  return response.json();
}

// POST /api/tasks → créer. programmeId facultatif : rattache la tâche à un
// programme (ou tâche libre si omis).
export async function createTask(title: string, programmeId?: number): Promise<Task> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, programmeId }),
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
