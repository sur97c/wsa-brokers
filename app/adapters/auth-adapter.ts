// File: app/adapters/auth-adapter.ts

import { auth as clientAuth } from '@/firebase/firebase-client'
import { adminAuth, adminDb } from '@/firebase/firebase-admin'
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

interface FirestoreUser {
  id: string
  name: string
  lastName: string
  status: string
  roles: string[]
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
  blocked?: boolean
  lastActivity?: Date | null
}

interface AuthUser {
  displayName?: string
  email: string
  password?: string
  blocked?: boolean
}

export class AuthAdapter {
  /**
   * Login a user with email and password (Client Context).
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The UID of the authenticated user.
   */
  async login(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        clientAuth,
        email,
        password
      )
      return userCredential.user?.uid || ''
    } catch (error) {
      console.error('Error logging in user:', error)
      throw new AuthError('Failed to log in user.')
    }
  }

  /**
   * Logout the currently authenticated user (Client Context).
   */
  async logout(): Promise<void> {
    try {
      await signOut(clientAuth)
    } catch (error) {
      console.error('Error logging out user:', error)
      throw new AuthError('Failed to log out user.')
    }
  }

  /**
   * Get roles for a user from Firestore.
   * @param uid - The UID of the user.
   * @returns The roles of the user.
   */
  async getRoles(uid: string): Promise<string[]> {
    try {
      const doc = await adminDb.collection('users').doc(uid).get()
      if (!doc.exists) {
        throw new AuthError(`User with UID '${uid}' not found in Firestore.`)
      }
      return doc.data()?.roles || []
    } catch (error) {
      console.error('Error fetching roles from Firestore:', error)
      throw new AuthError('Failed to fetch roles from Firestore.')
    }
  }

  /**
   * Synchronize roles between Firestore and custom claims.
   * @param uid - The UID of the user.
   */
  async syncRolesAndClaims(uid: string): Promise<void> {
    try {
      // Get roles from Firestore
      const roles = await this.getRoles(uid)

      // Update claims in Firebase Authentication
      await this.setCustomClaims(uid, { roles })
    } catch (error) {
      console.error('Error synchronizing roles and claims:', error)
      throw new AuthError('Failed to synchronize roles and claims.')
    }
  }

  /**
   * Sets custom claims for a user.
   * @param uid - The UID of the user.
   * @param claims - Custom claims to set.
   */
  private async setCustomClaims(
    uid: string,
    claims: Record<string, string | string[] | boolean | number | null>
  ): Promise<void> {
    try {
      await adminAuth.setCustomUserClaims(uid, claims)
    } catch (error) {
      console.error('Error setting custom claims:', error)
      throw new AuthError('Failed to set custom claims.')
    }
  }

  /**
   * Updates roles for a user in Firestore and synchronizes with custom claims.
   * @param uid - The UID of the user.
   * @param roles - The roles to set.
   */
  async updateRoles(uid: string, roles: string[]): Promise<void> {
    try {
      // Update roles in Firestore
      const now = new Date()
      await adminDb.collection('users').doc(uid).set(
        {
          roles,
          updatedAt: now,
        },
        { merge: true }
      )

      // Synchronize claims
      await this.syncRolesAndClaims(uid)
    } catch (error) {
      console.error('Error updating roles in Firestore:', error)
      throw new AuthError('Failed to update roles in Firestore.')
    }
  }

  /**
   * Sends a password reset email to the user.
   * @param email - The email of the user who wants to recover access.
   */
  async recoverAccess(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(clientAuth, email)
      console.log(`Password reset email sent to ${email}`)
    } catch (error) {
      console.error('Error sending password reset email:', error)
      throw new AuthError('Failed to send password reset email.')
    }
  }

  /**
   * Creates a user in Firebase Authentication and Firestore.
   * @param authData - Data for Firebase Authentication.
   * @param firestoreData - Data for Firestore user document.
   * @param createdBy - User ID of the creator.
   */
  async createUser(
    authData: AuthUser,
    firestoreData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>,
    createdBy: string
  ): Promise<string> {
    try {
      // Create user in Firebase Authentication
      const user = await adminAuth.createUser({
        email: authData.email,
        password: authData.password,
        displayName: authData.displayName,
      })

      // Prepare Firestore data
      const now = new Date()
      const userData: FirestoreUser = {
        id: user.uid,
        ...firestoreData,
        roles: firestoreData.roles || [],
        createdAt: now,
        updatedAt: now,
        createdBy,
        updatedBy: createdBy,
        blocked: authData.blocked || false,
        lastActivity: null,
      }

      // Save to Firestore
      await adminDb.collection('users').doc(user.uid).set(userData)

      // Synchronize roles as claims
      await this.setCustomClaims(user.uid, { roles: userData.roles })

      return user.uid
    } catch (error) {
      console.error('Error creating user:', error)
      throw new AuthError('Failed to create user.')
    }
  }

  /**
   * Updates a user in Firebase Authentication and Firestore.
   * @param uid - User ID.
   * @param authData - Updated data for Firebase Authentication.
   * @param firestoreData - Updated data for Firestore user document.
   * @param updatedBy - User ID of the updater.
   */
  async updateUser(
    uid: string,
    authData: Partial<AuthUser>,
    firestoreData: Partial<Omit<FirestoreUser, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<void> {
    try {
      // Update user in Firebase Authentication
      if (
        authData.email ||
        authData.displayName ||
        authData.blocked !== undefined
      ) {
        await adminAuth.updateUser(uid, {
          email: authData.email,
          displayName: authData.displayName,
          disabled: authData.blocked,
        })
      }

      // Update Firestore data
      const now = new Date()
      await adminDb
        .collection('users')
        .doc(uid)
        .set(
          {
            ...firestoreData,
            updatedAt: now,
            updatedBy,
          },
          { merge: true }
        )

      // Synchronize roles as claims (if roles were updated)
      if (firestoreData.roles) {
        await this.setCustomClaims(uid, { roles: firestoreData.roles })
      }
    } catch (error) {
      console.error('Error updating user:', error)
      throw new AuthError('Failed to update user.')
    }
  }

  /**
   * Soft deletes a user by disabling their account and marking them as deleted in Firestore.
   * @param uid - User ID.
   * @param deletedBy - User ID of the deleter.
   */
  async deleteUser(uid: string, deletedBy: string): Promise<void> {
    try {
      // Disable user in Firebase Authentication
      await adminAuth.updateUser(uid, { disabled: true })

      // Mark user as deleted in Firestore
      const now = new Date()
      await adminDb.collection('users').doc(uid).set(
        {
          status: 'deleted',
          updatedAt: now,
          updatedBy: deletedBy,
        },
        { merge: true }
      )

      // Clear custom claims
      await this.setCustomClaims(uid, {})
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new AuthError('Failed to delete user.')
    }
  }
}
