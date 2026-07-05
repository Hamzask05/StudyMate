// Appels HTTP pour les échéances d'un programme.
import type { Deadline, NewDeadline } from '../types/deadline';

const API_URL = 'http://localhost:8080/api/deadlines';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

export async function fetchDeadlines(programmeId: number): Promise<Deadline[]> {
  const response = await fetch(`${API_URL}?programmeId=${programmeId}`);
  await checkResponse(response);
  return response.json();
}

// Toutes les échéances (tous programmes confondus), triées par date.
export async function fetchAllDeadlines(): Promise<Deadline[]> {
  const response = await fetch(API_URL);
  await checkResponse(response);
  return response.json();
}

export async function createDeadline(deadline: NewDeadline): Promise<Deadline> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deadline),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteDeadline(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response);
}
