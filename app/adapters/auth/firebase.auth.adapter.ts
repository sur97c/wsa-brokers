// app/adapters/auth/firebase.auth.adapter.ts

import { IAuthProvider } from '@/interfaces/auth.provider'
import { auth as clientAuth } from '@/firebase/firebase.client'
import { adminAuth, adminDb } from '@/firebase/firebase.admin'
import {
  UserCredentials,
  UserProfile,
  type SessionData,
} from '@/models/user/user'
import { getDeviceInformationFromHeaders } from './server'
import {
  AuthError,
  AuthErrorCode,
  BusinessError,
  BusinessErrorCode,
} from '@/models/errors'
import { randomUUID } from 'crypto'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { UserRecord } from 'firebase-admin/auth'
import { esTranslations } from '@/translations/es'
import { enTranslations } from '@/translations/en'
import type { Locale } from '@/translations/types/core/locale'

// Primero definimos una interfaz para el error de Firebase
interface FirebaseErrorType {
  code: string
  message: string
  [key: string]: unknown
}

// Definimos una interfaz para nuestro mapeo de errores
// interface ErrorMapEntry {
//   message: string
//   code: string
// }

export class FirebaseAuthAdapter implements IAuthProvider {
  private readonly translations

  constructor(private readonly lang: Locale = 'es') {
    this.translations = this.lang === 'es' ? esTranslations : enTranslations
  }

  private isFirebaseError(error: unknown): error is FirebaseErrorType {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as FirebaseErrorType).code === 'string'
    )
  }

  private isFirebaseAuthCode(
    code: string
  ): code is keyof typeof this.translations.core.errors.firebase.auth {
    return code in this.translations.core.errors.firebase.auth
  }

  private isBusinessErrorCode(
    code: string
  ): code is keyof typeof this.translations.core.errors.firebase.business {
    return code in this.translations.core.errors.firebase.business
  }

  private handleFirebaseError(error: unknown): never {
    if (this.isFirebaseError(error)) {
      // Si es un error de autenticación
      if (this.isFirebaseAuthCode(error.code)) {
        throw new AuthError(
          this.translations.core.errors.firebase.auth[error.code],
          error.code as AuthErrorCode,
          {
            originalError: error as Record<string, unknown>,
          }
        )
      }

      // Si es un error de negocio
      if (this.isBusinessErrorCode(error.code)) {
        throw new BusinessError(
          this.translations.core.errors.firebase.business[error.code],
          error.code as BusinessErrorCode,
          {
            originalError: error as Record<string, unknown>,
          }
        )
      }

      // Si no es ninguno de los anteriores, lanzar error desconocido de auth
      throw new AuthError(
        this.translations.core.errors.firebase.auth.unknown,
        AuthErrorCode.UNKNOWN_AUTH_ERROR,
        {
          originalError: error as Record<string, unknown>,
        }
      )
    }

    // Si no es un error de Firebase, lanzar error genérico
    throw new AuthError(
      this.translations.core.errors.firebase.auth.unknown,
      AuthErrorCode.UNKNOWN_AUTH_ERROR,
      {
        originalError: error as Record<string, unknown>,
      }
    )
  }

  async login(credentials: UserCredentials): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        clientAuth,
        credentials.email,
        credentials.password
      )

      if (!userCredential.user) {
        throw new AuthError(
          this.translations.core.errors.firebase.business.USER_NOT_FOUND,
          AuthErrorCode.USER_NOT_FOUND
        )
      }

      const userDoc = await adminDb
        .collection('users')
        .doc(userCredential.user.uid)
        .get()

      const userRecord = await adminAuth.getUser(userCredential.user.uid)
      return this.buildUserProfile(userRecord, userDoc.data())
    } catch (error) {
      this.handleFirebaseError(error)
    }
  }

  async recoverAccess(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(clientAuth, email)
      return true
    } catch (error) {
      this.handleFirebaseError(error)
    }
  }

  async resendEmailVerification(): Promise<boolean> {
    try {
      await sendEmailVerification(clientAuth.currentUser!)
      return true
    } catch (error) {
      this.handleFirebaseError(error)
    }
  }

  async getUser(userId: string): Promise<UserProfile> {
    try {
      const [authUser, userDoc] = await Promise.all([
        adminAuth.getUser(userId),
        adminDb.collection('users').doc(userId).get(),
      ])

      const userData = userDoc.data()
      if (!userData) {
        throw new BusinessError(
          this.translations.core.errors.firebase.business.USER_NOT_FOUND,
          BusinessErrorCode.USER_NOT_FOUND
        )
      }

      return this.buildUserProfile(authUser, userData)
    } catch (error: unknown) {
      this.handleFirebaseError(error)
    }
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionDoc = await adminDb
        .collection('sessions')
        .doc(sessionId)
        .get()

      if (!sessionDoc.exists) {
        return null
      }

      return sessionDoc.data() as SessionData
    } catch (error: unknown) {
      this.handleFirebaseError(error)
    }
  }

  async createSession(uid: string, rememberMe: boolean): Promise<string> {
    try {
      const deviceInfo = await getDeviceInformationFromHeaders()
      const sessionData: SessionData = {
        userId: uid,
        token: randomUUID(),
        deviceInfo: {
          userAgent: deviceInfo.userAgent || 'unknown',
          ip: deviceInfo.ip,
        },
        createdAt: new Date(),
        lastActivity: new Date(),
        isActive: true,
        expiresAt: new Date(
          Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
        ),
      }

      const sessionRef = await adminDb.collection('sessions').add(sessionData)
      return sessionRef.id
    } catch (error: unknown) {
      this.handleFirebaseError(error)
    }
  }

  async validateUserState(uid: string): Promise<void> {
    const [authUser, firestoreUser] = await Promise.all([
      adminAuth.getUser(uid),
      adminDb.collection('users').doc(uid).get(),
    ])

    if (!authUser.emailVerified) {
      throw new BusinessError(
        this.translations.core.errors.firebase.business.EMAIL_NOT_VERIFIED,
        BusinessErrorCode.EMAIL_NOT_VERIFIED
      )
    }

    if (authUser.disabled) {
      throw new BusinessError(
        this.translations.core.errors.firebase.business.USER_DISABLED,
        BusinessErrorCode.USER_DISABLED
      )
    }

    const userData = firestoreUser.data()
    if (!userData) {
      throw new BusinessError(
        this.translations.core.errors.firebase.business.USER_NOT_FOUND_IN_DB,
        BusinessErrorCode.USER_NOT_FOUND
      )
    }

    if (userData.blocked) {
      throw new BusinessError(
        this.translations.core.errors.firebase.business.USER_BLOCKED,
        BusinessErrorCode.USER_BLOCKED
      )
    }

    if (userData.deleted) {
      throw new BusinessError(
        this.translations.core.errors.firebase.business.USER_DELETED,
        BusinessErrorCode.USER_DELETED
      )
    }
  }

  async checkActiveSessions(
    uid: string
  ): Promise<{ canLogin: boolean; oldSession?: string }> {
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const userData = userDoc.data()

    if (userData?.allowMultipleSessions) {
      return { canLogin: true }
    }

    const activeSessions = await adminDb
      .collection('sessions')
      .where('userId', '==', uid)
      .where('active', '==', true)
      .get()

    if (activeSessions.empty) {
      return { canLogin: true }
    }

    // Verificar si las sesiones existentes están expiradas
    const now = new Date()
    let hasValidSession = false
    let oldestSession: string | undefined

    activeSessions.docs.forEach((doc) => {
      const session = doc.data()
      if (new Date(session.expiresAt) > now) {
        hasValidSession = true
      } else if (!oldestSession) {
        oldestSession = doc.id
      }
    })

    // Si no hay sesiones válidas, permitir el login
    if (!hasValidSession) {
      return { canLogin: true }
    }

    // Si hay una sesión válida, devolver el ID de la sesión más antigua
    return {
      canLogin: false,
      oldSession: oldestSession,
    }
  }

  async syncRoles(uid: string): Promise<void> {
    const authUser = await adminAuth.getUser(uid)
    const roles = authUser.customClaims?.roles || []

    await adminDb.collection('users').doc(uid).update({
      roles,
      updatedAt: new Date(),
    })
  }

  async updateUserActivity(
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    const deviceInfo = await getDeviceInformationFromHeaders()
    await adminDb
      .collection('users')
      .doc(uid)
      .update({
        ...data,
        lastActivity: new Date(),
      })

    await adminDb
      .collection('sessions')
      .where('userId', '==', uid)
      .where('isActive', '==', true)
      .get()
      .then((snapshot) => {
        const batch = adminDb.batch()
        snapshot.docs.forEach((doc) => {
          batch.update(doc.ref, {
            lastActivity: new Date(),
            deviceInfo: {
              userAgent: deviceInfo.userAgent,
              ip: deviceInfo.ip,
            },
          })
        })
        return batch.commit()
      })
  }

  private async buildUserProfile(
    firebaseUser: UserRecord,
    firestoreData?: FirebaseFirestore.DocumentData
  ): Promise<UserProfile> {
    const userData =
      firestoreData ||
      (await adminDb.collection('users').doc(firebaseUser.uid).get()).data()

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified,
      roles: firebaseUser.customClaims?.roles || [],
      isOnline: true,
      lastLogin: new Date(),
      lastActivity: new Date(),
      blocked: userData?.blocked || false,
      disabled: userData?.disabled || false,
      deleted: userData?.deleted || false,
      allowMultipleSessions: userData?.allowMultipleSessions || false,
      metadata: userData?.metadata,
    }
  }

  async logout(): Promise<void> {
    try {
      await clientAuth.signOut()
    } catch (error) {
      this.handleFirebaseError(error)
    }
  }

  async clearActiveSessions(uid: string): Promise<void> {
    try {
      // Limpiar registro de sesiones en Firestore
      await adminDb
        .collection('sessions')
        .where('userId', '==', uid)
        .where('active', '==', true)
        .get()
        .then((snapshot) => {
          const batch = adminDb.batch()
          snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, {
              active: false,
              endedAt: new Date(),
            })
          })
          return batch.commit()
        })
    } catch (error) {
      this.handleFirebaseError(error)
    }
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await adminDb.collection('sessions').doc(sessionId).update({
      isActive: false,
      lastActivity: new Date(),
    })
  }
}
