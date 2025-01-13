// app/firebase/firebase.client.ts

import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  Auth,
  // onAuthStateChanged,
  // User,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// For tests, provide mock values if environment variables are not available
if (process.env.NODE_ENV === 'test') {
  firebaseConfig.apiKey = 'test-api-key'
  firebaseConfig.authDomain = 'test-project.firebaseapp.com'
  firebaseConfig.projectId = 'test-project'
}

// Conditional Firebase initialization
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()
const auth: Auth = getAuth(app)
const db: Firestore = getFirestore(app)

// // Authentication state observer
// onAuthStateChanged(auth, (user: User | null) => {
//   if (user) {
//     console.log('Authenticated user:', user.uid)
//   } else {
//     console.log('Unauthenticated user')
//   }
// })

// Configurar persistencia
setPersistence(auth, browserLocalPersistence).catch(console.error)

export { app, auth, db }
