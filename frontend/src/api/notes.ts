// Appels HTTP pour les fiches de révision d'un programme.

export interface RevisionNote {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
}

const API_URL = 'http://localhost:8080/api/notes';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

export async function fetchNotes(programmeId: number): Promise<RevisionNote[]> {
  const response = await fetch(`${API_URL}?programmeId=${programmeId}`);
  await checkResponse(response);
  return response.json();
}

export async function createNote(
  programmeId: number,
  title: string,
  content: string,
): Promise<RevisionNote> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programmeId, title, content }),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteNote(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response);
}
