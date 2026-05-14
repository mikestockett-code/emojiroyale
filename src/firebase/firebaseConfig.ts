import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCc5_L2sAP-xVNKGIh8ZcqF4vj9p2pfMAI',
  authDomain: 'emoji-royale6741.firebaseapp.com',
  databaseURL: 'https://emoji-royale6741-default-rtdb.firebaseio.com',
  projectId: 'emoji-royale6741',
  storageBucket: 'emoji-royale6741.firebasestorage.app',
  messagingSenderId: '338154552013',
  appId: '1:338154552013:web:681518f57d7a5fd9218784',
  measurementId: 'G-N4N4LY6WFF',
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);
