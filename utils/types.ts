export type DateString =`${number}-${number}-${number}`;

export interface Problem {
  id: string;
  problem: string;
  notes: string;
  date: DateString;
  isProcessed: boolean;
  rootCause?: string;
  createdAt: firebase.default.firestore.FieldValue | string;
}

export interface Stats {
  totalProblems: number;
  rootCauseProblems: number;
}


export enum DateRanges {
  TODAY = 'today',
  LAST_SEVEN_DAYS = 'last_seven_days',
  ALL=  'all'
}