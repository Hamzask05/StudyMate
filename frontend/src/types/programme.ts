// Miroir TypeScript de Programme.java + son DTO de création.
import type { Subject } from './subject';

// L'enum Java TrackingType se reflète en type union (fiche Relations §8).
export type TrackingType = 'GRADES' | 'MOOD';

// Ce que le backend RENVOIE (avec les matières complètes imbriquées).
export interface Programme {
  id: number;
  name: string;
  subjects: Subject[];
  trackingType: TrackingType;
  targetHours: number;
  createdAt: string;
}

// Ce que le front ENVOIE pour créer (miroir du DTO CreateProgrammeRequest :
// des identifiants de matières, pas des objets).
export interface NewProgramme {
  name: string;
  subjectIds: number[];
  trackingType: TrackingType;
  targetHours: number;
}
