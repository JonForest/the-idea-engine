export type DateString =`${number}-${number}-${number}`;

export type Problem = {
  id: string;
  problem: string;
  notes: string;
  date: DateString;
  isProcessed: boolean;
  rootCause?: string;
  updatedAt: firebase.default.firestore.FieldValue;
  createdAt: firebase.default.firestore.FieldValue;
}

export type Solution = {
  id: string;
  problemId: string;
  description: string;
  updatedAt: firebase.default.firestore.FieldValue;
  createdAt: firebase.default.firestore.FieldValue;
}

export type Stats = {
  totalProblems: number;
  rootCauseProblems: number;
}



export enum DateRanges {
  TODAY = 'today',
  LAST_SEVEN_DAYS = 'last_seven_days',
  ALL=  'all'
}