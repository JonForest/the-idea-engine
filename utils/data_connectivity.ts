import firebase from 'firebase';

import { Problem } from './types';

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

function getToday() {
return new Date().toISOString().slice(0, 10);
}

function getBaseRef(dateString: string) {
  return db.collection('days').doc(dateString).collection('problems')
}

/**
 * Save a problem (either new or existing) to the database
 */
export async function saveProblem(problem: Partial<Problem>): Promise<void> {
  const dateString = getToday()
  // TODO: Add user info
  // TODO: Add in a createdAt, updatedAt timesetamp, and merge the updates rather than over-writing
  let docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | void
  if (problem?.id) {
    docRef = await getBaseRef(dateString).doc(problem.id).set(problem);
  } else {
    docRef = await getBaseRef(dateString).add(problem);
  }
}

/**
 * Retrieve a list of all problems for the current day
 */
export async function retrieveProblems(): Promise<Problem[]> {
  const dateString = getToday()
  const queryResults = await getBaseRef(dateString).get()
  const problems = []
  queryResults.forEach(result => problems.push({...result.data(), id: result.id}))
  return problems
}