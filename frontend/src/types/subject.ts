// Miroir TypeScript de Subject.java (voir fiche Correspondance §7 : les deux
// doivent rester alignés). targetGrade peut être null → "number | null".
export interface Subject {
  id: number;
  name: string;
  color: string;
  coefficient: number;
  targetGrade: number | null;
}
