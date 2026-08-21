import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Assessment, Athlete } from './types';

const assessmentsCol = () => collection(db, 'assessments');
const athletesCol = () => collection(db, 'athletes');

// --- Athletes ---

export async function createAthlete(data: Omit<Athlete, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(athletesCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listAthletes(): Promise<Athlete[]> {
  const snap = await getDocs(query(athletesCol(), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Athlete));
}

// --- Assessments ---

export async function createAssessment(data: Omit<Assessment, 'id'>): Promise<string> {
  const ref = await addDoc(assessmentsCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function loadAssessment(id: string): Promise<Assessment | null> {
  const snap = await getDoc(doc(db, 'assessments', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Assessment;
}

export async function saveAssessment(id: string, data: Omit<Assessment, 'id'>): Promise<void> {
  await updateDoc(doc(db, 'assessments', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function listRecentAssessments(n = 20): Promise<Assessment[]> {
  const snap = await getDocs(
    query(assessmentsCol(), orderBy('createdAt', 'desc'), limit(n)),
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Assessment));
}
