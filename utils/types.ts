export type DateString =`${number}-${number}-${number}`;

export interface Problem {
  id: string;
  problem: string;
  notes: string;
  date: DateString;
}