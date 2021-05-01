import firebase from 'firebase';
import { stringify } from 'node:querystring';

import { Problem, DateString } from './types';

const firebaseConfig = {
  apiKey: 'AIzaSyDRfaebDobUXhqBcjtfcL_uBKonmYK49CE',
  authDomain: 'the-idea-engine.firebaseapp.com',
  projectId: 'the-idea-engine',
  storageBucket: 'the-idea-engine.appspot.com',
  messagingSenderId: '486130771265',
  appId: '1:486130771265:web:c6a676c05656a410a6edc0',
};
// Initialize Firebase
// tODO: FirebaseError: Firebase: Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export function getToday(): DateString {
  const today = new Date()
  const padElement = (dateEle: number):string => dateEle < 10 ? '0' + String(dateEle) : String(dateEle)
  return `${today.getFullYear()}-${padElement(today.getMonth()+1)}-${padElement(today.getDate())}` as DateString
}

/**
 * Save a problem (either new or existing) to the database
 */
export async function saveProblem(problem: Partial<Problem>): Promise<void> {
  const dateString = getToday();
  // TODO: Add user info
  // TODO: Add in a createdAt, updatedAt timesetamp, and merge the updates rather than over-writing
  let docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | void;
  if (problem?.id) {
    docRef = await db.collection('problems').doc(problem.id).set(problem);
  } else {
    docRef = await db.collection('problems').add(problem);
  }
}

/**
 * Retrieve a list of all problems for the current day
 */
export async function retrieveProblems(date: string = getToday()): Promise<Problem[]> {
  const queryResults = await db.collection('problems').where('date', '==', date).get()
  const problems = [];
  queryResults.forEach((result) => problems.push({ ...result.data(), id: result.id }));
  return problems;
}

/**
 * Retrieves an individual problem
 * @throws {Error} If no problem exists for the provided ID
 */
export async function retrieveProblem(problemId): Promise<Problem> {
  const docSnapshot = await db.collection('problems').doc(problemId).get()
  const problem = docSnapshot.data()
  if (!problem) throw new Error('No problem with that ID found')
  return problem as Problem
}
