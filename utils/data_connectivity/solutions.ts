import firebase from 'firebase';
import { db } from '../data_connectivity';
import { Solution } from '../types';

export async function saveSolution(userId: string, solution: Partial<Solution>): Promise<void> {
  if (solution?.id) {
    solution.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(userId).collection('solutions').doc(solution.id).set(solution);
  } else {
    solution.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(userId).collection('solutions').add(solution);
  }
}

export async function retrieveSolutions(userId: string | undefined, problemId: string): Promise<Solution[]> {
  if (!userId) return;

  const queryResults = await db
    .collection('users')
    .doc(userId)
    .collection('solutions')
    .where('problemId', '==', problemId)
    .get();
  const solutions = [];
  queryResults.forEach((result) => solutions.push({ ...result.data(), id: result.id }));
  const sortedsolutions = solutions.sort((resa, resb) => resa.createdAt.seconds - resb.createdAt.seconds);
  return sortedsolutions;
}

export async function deleteSolution(userId: string, solutionId: string): Promise<void> {
  await db.collection('users').doc(userId).collection('solutions').doc(solutionId).delete()
  return
}