import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID from config
export const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Validate connection to Firestore
async function testConnection() {
  try {
    // Attempt to get a dummy doc to check connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client appears to be offline.");
    }
    // Other errors (like permission denied) are expected if the doc doesn't exist or rules are strict
  }
}

testConnection();

export default app;
