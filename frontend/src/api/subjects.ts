// ============================================================================
// Appels HTTP vers /api/subjects. Même structure que api/tasks.ts.
// ============================================================================

import type { Subject } from '../types/subject';

const API_URL = 'http://localhost:8080/api/subjects';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

export async function fetchSubjects(): Promise<Subject[]> {
  const response = await fetch(API_URL);
  await checkResponse(response);
  return response.json();
}

// Le corps envoyé pour créer une matière (sans id, attribué par la BDD).
export type NewSubject = Omit<Subject, 'id'>;

export async function createSubject(subject: NewSubject): Promise<Subject> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteSubject(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response);
}
