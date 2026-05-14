import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebaseConfig';

function waitForAuthReady() {
  return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe();
      resolve();
    });
  });
}

export async function ensureSignedIn(): Promise<string> {
  if (!auth.currentUser) {
    await waitForAuthReady();
  }

  if (!auth.currentUser) {
    const result = await signInAnonymously(auth);
    return result.user.uid;
  }

  return auth.currentUser.uid;
}
