// Appels HTTP pour les sessions Pomodoro terminées.

export interface PomodoroSession {
  id: number;
  workMinutes: number;
  completedAt: string;
}

const API_URL = 'http://localhost:8080/api/pomodoro-sessions';

async function checkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }
}

// Enregistre une session de travail terminée (rattachée à un programme ou non).
export async function createSession(
  workMinutes: number,
  programmeId?: number,
): Promise<PomodoroSession> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workMinutes, programmeId }),
  });
  await checkResponse(response);
  return response.json();
}

// Les sessions d'un programme (pour additionner les minutes travaillées).
export async function fetchSessions(programmeId: number): Promise<PomodoroSession[]> {
  const response = await fetch(`${API_URL}?programmeId=${programmeId}`);
  await checkResponse(response);
  return response.json();
}
