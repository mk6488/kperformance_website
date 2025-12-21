import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from './firebase';

const db = getFirestore();

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

export function useIsAdmin(uid?: string | null) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!uid) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    getDoc(doc(db, 'adminUsers', uid))
      .then((snap) => {
        if (!mounted) return;
        setIsAdmin(snap.exists());
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [uid]);

  return { isAdmin, loading };
}

export async function adminSignIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function adminSignOut() {
  return signOut(auth);
}
