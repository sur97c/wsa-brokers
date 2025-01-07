// app/firebase/firebase.admin.ts

import * as admin from 'firebase-admin'
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

// Firebase Admin configuration
const serviceAccount: admin.ServiceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
} as admin.ServiceAccount

// Conditional Firebase Admin initialization
const adminApp: App = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    })
  : getApp()

const adminAuth: Auth = getAuth(adminApp)
const adminDb: Firestore = getFirestore(adminApp)

export { adminApp, adminAuth, adminDb }
