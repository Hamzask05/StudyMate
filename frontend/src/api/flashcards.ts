// Appels HTTP pour les flashcards.
import type { Flashcard, NewFlashcard } from '../types/flashcard';

const API_URL = 'http://localhost:8080/api/flashcards';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

export async function fetchFlashcards(programmeId: number): Promise<Flashcard[]> {
  const response = await fetch(`${API_URL}?programmeId=${programmeId}`);
  await checkResponse(response);
  return response.json();
}

// Toutes les flashcards (tous programmes confondus).
export async function fetchAllFlashcards(): Promise<Flashcard[]> {
  const response = await fetch(API_URL);
  await checkResponse(response);
  return response.json();
}

export async function createFlashcard(flashcard: NewFlashcard): Promise<Flashcard> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flashcard),
  });
  await checkResponse(response);
  return response.json();
}

export async function deleteFlashcard(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response);
}
