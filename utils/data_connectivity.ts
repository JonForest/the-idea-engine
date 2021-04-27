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

export async function saveProblem(problem: Partial<Problem>) {
  const dateString = new Date().toISOString().slice(0, 10);
  // TODO: Add user info
  let docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | void
  if (problem?.id) {
    docRef = await db.collection('days').doc(dateString).collection('problems').doc(problem.id).set(problem);
  } else {
    docRef = await db.collection('days').doc(dateString).collection('problems').add(problem);
  }
}
