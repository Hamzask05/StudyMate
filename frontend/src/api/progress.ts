// Appels HTTP pour les points de progression d'un programme.

export interface ProgressEntry {
  id: number;
  value: number;
  label: string | null;
  recordedAt: string;
}

const API_URL = 'http://localhost:8080/api/progress-entries';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

export async function fetchEntries(programmeId: number): Promise<ProgressEntry[]> {
  const response = await fetch(`${API_URL}?programmeId=${programmeId}`);
  await checkResponse(response);
  return response.json();
}

export async function createEntry(
  programmeId: number,
  value: number,
  label?: string,
): Promise<ProgressEntry> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programmeId, value, label }),
  });
  await checkResponse(response);
  return response.json();
}
