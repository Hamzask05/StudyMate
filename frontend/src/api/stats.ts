// Statistiques agrégées pour le tableau de bord d'accueil.

export interface Stats {
  totalHours: number;
  weekHours: number;
  streakDays: number;
  sessionsCount: number;
  programmesCount: number;
  tasksDone: number;
  tasksTotal: number;
  flashcardsCount: number;
}

export async function fetchStats(): Promise<Stats> {
  const response = await fetch('http://localhost:8080/api/stats');
  if (!response.ok) throw new Error(`Le serveur a répondu ${response.status}`);
  return response.json();
}
