// Miroir TypeScript de Flashcard.java + son DTO de création.

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  // Renseignés par le backend pour la vue globale (null si pas de programme)
  programmeId: number | null;
  programmeName: string | null;
}

export interface NewFlashcard {
  question: string;
  answer: string;
  programmeId?: number; // facultatif
}
