// todo: Move into data_connectivity folder
import firebase from 'firebase';
import { Stats } from './types';

import { Problem, DateString, DateRanges } from './types';

const firebaseConfig = {
  apiKey: 'AIzaSyDRfaebDobUXhqBcjtfcL_uBKonmYK49CE',
  authDomain: 'the-idea-engine.firebaseapp.com',
  projectId: 'the-idea-engine',
  storageBucket: 'the-idea-engine.appspot.com',
  messagingSenderId: '486130771265',
  appId: '1:486130771265:web:c6a676c05656a410a6edc0',
};

enum Operation {
  ADD_PROBLEM = 'ADD_PROBLEM',
  ADD_ROOTCAUSE = 'ADD_ROOTCAUSE',
  ADD_SOLUTIONS = 'ADD_SOlUTIONS',
  DELETE_PROBLEM = 'DELETE_PROBLEM',
  DELETE_PROBLEM_WITH_ROOTCAUSE = 'DELETE_PROBLEM_WITH_ROOTCAUSE',
}

// Initialize Firebase
// tODO: FirebaseError: Firebase: Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const db = firebase.firestore();

function formatDate(date: Date): DateString {
  const padElement = (dateEle: number): string => (dateEle < 10 ? '0' + String(dateEle) : String(dateEle));
  return `${date.getFullYear()}-${padElement(date.getMonth() + 1)}-${padElement(date.getDate())}` as DateString;
}

async function manageProblemCounters(userId: string, operation: Operation): Promise<void> {
  // todo: if ever move beyond me, make this transactional
  switch (operation) {
    case Operation.ADD_PROBLEM:
      await db.collection('users').doc(userId).update('totalProblems', firebase.firestore.FieldValue.increment(1));
      break;
    case Operation.ADD_ROOTCAUSE:
      await db.collection('users').doc(userId).update('rootCauseProblems', firebase.firestore.FieldValue.increment(1));
      break;
    case Operation.ADD_SOLUTIONS:
      // This makes some horrible assumptions about every problem being root-caused before adding a solution
      await db.collection('users').doc(userId).update('rootCauseProblems', firebase.firestore.FieldValue.increment(-1));
      // todo: Add the solutions update here
      break;
    case Operation.DELETE_PROBLEM:
      await db.collection('users').doc(userId).update('totalProblems', firebase.firestore.FieldValue.increment(-1));
      break;
    case Operation.DELETE_PROBLEM_WITH_ROOTCAUSE:
      await db.collection('users').doc(userId).update('rootCauseProblems', firebase.firestore.FieldValue.increment(-1));
      await db.collection('users').doc(userId).update('totalProblems', firebase.firestore.FieldValue.increment(-1));
      break;
  }
}

export const firebaseAuth = firebase.auth();

export function getToday(): DateString {
  const today = new Date();
  return formatDate(today);
}

/**
 * Save a problem (either new or existing) to the database
 */
export async function saveProblem(userId: string, problem: Partial<Problem>): Promise<void> {
  //todo: does this ever get called without a userId? Why am I checking when the param is not optional?
  if (!userId) throw new Error('UserId not set');

  if (problem?.id) {
    problem.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(userId).collection('problems').doc(problem.id).set(problem);
  } else {
    problem.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(userId).collection('problems').add(problem);
    manageProblemCounters(userId, Operation.ADD_PROBLEM);
  }
}

/**
 * Retrieve a list of all problems for the current day
 */
export async function retrieveProblems(
  userId: string | undefined,
  date: string = getToday()
): Promise<Problem[] | undefined> {
  if (!userId) return;
  const queryResults = await db.collection('users').doc(userId).collection('problems').where('date', '==', date).get();
  const problems = [];
  queryResults.forEach((result) => problems.push({ ...result.data(), id: result.id }));
  const sortedProblems = problems.sort((resa, resb) => resa.createdAt.seconds - resb.createdAt.seconds);
  return sortedProblems;
}

/**
 * Retrieves an individual problem
 * @throws {Error} If no problem exists for the provided ID
 */
export async function retrieveProblem(userId: string | undefined, problemId: string): Promise<Problem | undefined> {
  if (!problemId || !userId) return;

  const docSnapshot = await db.collection('users').doc(userId).collection('problems').doc(problemId).get();
  const problem = { ...docSnapshot.data(), id: docSnapshot.id };
  if (!problem) throw new Error('No problem with that ID found');
  return problem as Problem;
}

export async function retrieveProblemRange(userId: string, dateRange: DateRanges): Promise<Problem[] | undefined> {
  if (!userId) return;

  const startDate = {
    [DateRanges.TODAY]: getToday(),
    [DateRanges.LAST_SEVEN_DAYS]: (() => {
      const today = new Date();
      const sevenDaysAgo = today.setDate(today.getDate() - 7);
      return formatDate(new Date(sevenDaysAgo));
    })(),
  }[dateRange];

  let queryResults: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
  if (startDate) {
    queryResults = await db.collection('users').doc(userId).collection('problems').where('date', '>=', startDate).get();
  } else {
    queryResults = await db.collection('users').doc(userId).collection('problems').get();
  }

  const problems = [];
  queryResults.forEach((result) => problems.push({ ...result.data(), id: result.id }));
  const sortedProblems = problems.sort((resa, resb) => (resa.createdAt?.seconds || 1) - (resb.createdAt?.seconds || 1));
  return sortedProblems;
}

export async function deleteProblem(userId: string, problem: Partial<Problem>): Promise<void> {
  if (!userId) throw new Error('UserId not set');
  await db.collection('users').doc(userId).collection('problems').doc(problem.id).delete();
  const operation = !!problem.rootCause ? Operation.DELETE_PROBLEM_WITH_ROOTCAUSE : Operation.DELETE_PROBLEM;
  await manageProblemCounters(userId, operation);
  return;
}

export async function saveRootCause(userId: string, problem: Partial<Problem>, rootCauseText: string): Promise<void> {
  if (!userId) throw new Error('UserId not set');
  if (!problem) throw new Error('problem not set');

  await db.collection('users').doc(userId).collection('problems').doc(problem.id).update({ rootCause: rootCauseText });
  !problem.rootCause?.trim() && (await manageProblemCounters(userId, Operation.ADD_ROOTCAUSE));
  return;
}

/**
 * Fetches the problem stats (e.g. total problems, etc) for use on the dashboard
 */
export async function fetchProblemStats(userId: string): Promise<Stats> {
  if (!userId) return;
  const docSnapshot = await db.collection('users').doc(userId).get();
  return docSnapshot.data() as Stats;
}

