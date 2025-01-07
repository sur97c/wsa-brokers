// app/adapters/auth/firebase.auth.adapter.ts

import { randomUUID } from 'crypto'

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { UserRecord } from 'firebase-admin/auth'

import { Timestamp, type DocumentData } from 'firebase-admin/firestore'

import { adminAuth, adminDb } from '@/firebase/firebase.admin'
import { auth as clientAuth } from '@/firebase/firebase.client'
import { IAuthProvider } from '@/interfaces/auth.provider'
import {
  AuthError,
  AuthErrorCode,
  BusinessError,
  BusinessErrorCode,
} from '@/models/errors'
import type { SectionRole, UserRole } from '@/models/user/roles'
import type {
  SessionData,
  SessionMetrics,
  SessionValidationResult,
} from '@/models/user/types'
import { UserCredentials, UserProfile } from '@/models/user/user'
import { enTranslations } from '@/translations/en'
import { esTranslations } from '@/translations/es'
import type { Locale } from '@/translations/types/core/locale'

import { getDeviceInformationFromHeaders } from './server'

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

// Helper function antes de la clase
const toDate = (
  value: Timestamp | Date | string | undefined | null
): Date | undefined => {
  if (!value) return undefined

  // Si es Timestamp de Firestore
  if (value instanceof Timestamp) {
    return value.toDate()
  }

  // Si ya es Date
  if (value instanceof Date) {
    return value
  }

  // Si es string, intentar convertir
  if (typeof value === 'string') {
    return new Date(value)
  }

  return undefined
}

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

    console.log('error:', error)
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
      // 1. Primero autenticamos al usuario para obtener su UID
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

      // 2. Sincronizamos los roles inmediatamente después de la autenticación
      // usando Firestore como fuente primaria de verdad
      await this.syncRoles(userCredential.user.uid, {
        sourceOfTruth: 'primary',
      })

      // 3. Después de sincronizar, obtenemos la información actualizada
      const [userDoc, userRecord] = await Promise.all([
        adminDb.collection('users').doc(userCredential.user.uid).get(),
        adminAuth.getUser(userCredential.user.uid),
      ])

      // 4. Construimos y retornamos el perfil del usuario con los roles actualizados
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

  async checkActiveSessions(uid: string): Promise<SessionValidationResult> {
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const userData = userDoc.data()
    const metrics = await this.getSessionMetrics(uid)

    if (userData?.allowMultipleSessions) {
      return { canLogin: true, metrics }
    }

    // Verificar si hay sesiones activas
    const activeSessions = await adminDb
      .collection('sessions')
      .where('userId', '==', uid)
      .where('active', '==', true)
      .get()

    if (activeSessions.empty) {
      return { canLogin: true, metrics }
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
      return { canLogin: true, metrics }
    }

    // Si hay una sesión válida, devolver el ID de la sesión más antigua
    return {
      canLogin: false,
      oldSession: oldestSession,
      metrics,
    }
  }

  private areRolesEqual(
    roles1: { primaryRole: string; sectionRoles: string[] },
    roles2: { primaryRole: string; sectionRoles: string[] }
  ): boolean {
    return (
      roles1.primaryRole === roles2.primaryRole &&
      JSON.stringify(roles1.sectionRoles.sort()) ===
        JSON.stringify(roles2.sectionRoles.sort())
    )
  }

  async syncRoles(
    uid: string,
    options: { sourceOfTruth: 'primary' | 'secondary' }
  ): Promise<void> {
    try {
      const [firestoreDoc, userRecord] = await Promise.all([
        adminDb.collection('users').doc(uid).get(),
        adminAuth.getUser(uid),
      ])

      if (!firestoreDoc.exists) {
        throw new BusinessError(
          this.translations.core.errors.firebase.business.USER_NOT_FOUND_IN_DB,
          BusinessErrorCode.USER_NOT_FOUND_IN_DB
        )
      }

      const firestoreData = firestoreDoc.data()!
      const firebaseClaims = userRecord.customClaims || {}

      // Estructura de Firestore
      const firestoreRoles = {
        sectionRoles: firestoreData.sectionRoles || [],
        primaryRole: firestoreData.primaryRole || null,
      }

      // Estructura actual en Firebase Claims (la vamos a actualizar)
      const firebaseRoles = {
        sectionRoles: firebaseClaims.roles || [], // Notar que accedemos a 'roles' en lugar de 'sectionRoles'
        primaryRole: firebaseClaims.primaryRole || null,
      }

      // let finalRoles
      if (options.sourceOfTruth === 'primary') {
        // Usar Firestore como fuente de verdad
        // finalRoles = firestoreRoles

        if (!this.areRolesEqual(firebaseRoles, firestoreRoles)) {
          // Actualizar Firebase Claims con la nueva estructura
          await adminAuth.setCustomUserClaims(uid, {
            sectionRoles: firestoreRoles.sectionRoles, // Nuevo nombre del campo
            primaryRole: firestoreRoles.primaryRole,
            // No incluimos el campo 'roles' anterior
          })
        }
      } else {
        // Usar Firebase Claims como fuente de verdad
        // finalRoles = {
        //   sectionRoles: firebaseRoles.sectionRoles,
        //   primaryRole: firebaseRoles.primaryRole,
        // }

        if (!this.areRolesEqual(firestoreRoles, firebaseRoles)) {
          await adminDb.collection('users').doc(uid).update({
            sectionRoles: firebaseRoles.sectionRoles,
            primaryRole: firebaseRoles.primaryRole,
            updatedAt: new Date().toISOString(),
          })
        }
      }

      // console.log(`Roles sincronizados para usuario ${uid}:`, finalRoles)
    } catch (error) {
      this.handleFirebaseError(error)
    }
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
    firestoreData?: DocumentData
  ): Promise<UserProfile> {
    const userData =
      firestoreData ||
      (await adminDb.collection('users').doc(firebaseUser.uid).get()).data()

    return {
      uid: String(firebaseUser.uid),
      email: String(firebaseUser.email ?? ''),
      displayName: firebaseUser.displayName
        ? String(firebaseUser.displayName)
        : undefined,
      emailVerified: Boolean(firebaseUser.emailVerified),
      primaryRole: String(
        firebaseUser.customClaims?.primaryRole || ''
      ) as UserRole,
      sectionRoles: (Array.isArray(firebaseUser.customClaims?.sectionRoles)
        ? firebaseUser.customClaims.sectionRoles.map(String)
        : []) as SectionRole[],
      isOnline: Boolean(true),
      lastActivity: toDate(userData?.lastActivity),
      lastLogin: toDate(userData?.lastLogin),
      blocked: Boolean(userData?.blocked || false),
      disabled: Boolean(userData?.disabled || false),
      deleted: Boolean(userData?.deleted || false),
      allowMultipleSessions: Boolean(userData?.allowMultipleSessions || false),
      metadata: userData?.metadata
        ? JSON.parse(JSON.stringify(userData.metadata))
        : undefined,
      updatedAt: toDate(userData?.updatedAt),
      createdAt: toDate(userData?.createdAt) || new Date(),
      sessionId: userData?.sessionId ? String(userData.sessionId) : undefined,
      name: userData?.name ? String(userData.name) : undefined,
      lastName: userData?.lastName ? String(userData.lastName) : undefined,
      createdBy: userData?.createdBy ? String(userData.createdBy) : '',
      updatedBy: userData?.updatedBy ? String(userData.updatedBy) : '',
      activeSessions: Number(userData?.activeSessions || 0),
      lastSessionCreated: toDate(userData?.lastSessionCreated),
      totalHistoricalSessions: Number(userData?.totalHistoricalSessions || 0),
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

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const userRecord = await adminAuth.getUserByEmail(email)
      const userDoc = await adminDb
        .collection('users')
        .doc(userRecord.uid)
        .get()

      if (!userDoc.exists) {
        return null
      }

      return this.buildUserProfile(userRecord, userDoc.data())
    } catch (error) {
      // Si el usuario no existe, retornamos null en lugar de lanzar error
      if (this.isFirebaseError(error) && error.code === 'auth/user-not-found') {
        return null
      }
      this.handleFirebaseError(error)
    }
  }

  async clearTemporaryClaims(uid: string): Promise<void> {
    try {
      const userRecord = await adminAuth.getUser(uid)
      const currentClaims = userRecord.customClaims || {}

      // Mantenemos solo los roles permanentes
      await adminAuth.setCustomUserClaims(uid, {
        sectionRoles: currentClaims.sectionRoles || [],
        primaryRole: currentClaims.primaryRole || null,
      })
    } catch (error) {
      this.handleFirebaseError(error)
    }
  }

  async getSessionMetrics(uid: string): Promise<SessionMetrics> {
    // Métricas por defecto
    const metrics = {
      activeSessions: 0,
      totalHistoricalSessions: 0,
      lastSessionCreated: undefined,
    }

    try {
      // Obtener sesiones activas
      const activeSessionsSnapshot = await adminDb
        .collection('sessions')
        .where('userId', '==', uid)
        .where('isActive', '==', true)
        .get()

      metrics.activeSessions = activeSessionsSnapshot.size

      // Obtener última sesión
      const totalSessionsSnapshot = await adminDb
        .collection('sessions')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()

      if (!totalSessionsSnapshot.empty) {
        const lastSession = totalSessionsSnapshot.docs[0]
        // Convertir la fecha a string ISO
        metrics.lastSessionCreated = lastSession.data().createdAt

        // Obtener conteo total
        const countSnapshot = await adminDb
          .collection('sessions')
          .where('userId', '==', uid)
          .count()
          .get()

        metrics.totalHistoricalSessions = countSnapshot.data()?.count || 0
      }

      // Asegurarse de que todos los valores son serializables
      return {
        activeSessions: Number(metrics.activeSessions),
        totalHistoricalSessions: Number(metrics.totalHistoricalSessions),
        lastSessionCreated: toDate(metrics.lastSessionCreated),
      }
    } catch (error) {
      console.error('[getSessionMetrics] Error:', error)
      return metrics
    }
  }
}
