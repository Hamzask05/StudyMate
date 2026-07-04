// Appels HTTP vers /api/programmes.
import type { NewProgramme, Programme } from '../types/programme';

const API_URL = 'http://localhost:8080/api/programmes';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

export async function fetchProgrammes(): Promise<Programme[]> {
  const response = await fetch(API_URL);
  await checkResponse(response);
  return response.json();
}

// GET /api/programmes/{id} → un seul programme (avec ses matières).
export async function fetchProgramme(id: number): Promise<Programme> {
  const response = await fetch(`${API_URL}/${id}`);
  await checkResponse(response);
  return response.json();
}

export async function createProgramme(programme: NewProgramme): Promise<Programme> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(programme),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteProgramme(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response);
}
