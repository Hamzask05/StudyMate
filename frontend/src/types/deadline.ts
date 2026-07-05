// Miroir TypeScript de Deadline.java + son DTO de création.

export type Importance = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Deadline {
  id: number;
  title: string;
  dueDate: string; // date ISO "2026-07-20" (voir fiche Correspondance §4)
  importance: Importance;
  notes: string | null;
  createdAt: string;
  // Renseignés par le backend pour la vue globale (peuvent être null si
  // l'échéance n'est rattachée à aucun programme)
  programmeId: number | null;
  programmeName: string | null;
}

export interface NewDeadline {
  title: string;
  dueDate: string;
  importance: Importance;
  notes?: string;
  programmeId?: number; // facultatif : une échéance peut être générale
}
