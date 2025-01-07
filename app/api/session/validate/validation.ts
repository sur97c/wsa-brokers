// app/api/session/validate/validation.ts

import { adminAuth, adminDb } from '@/firebase/firebase.admin'
import { SectionRole } from '@/models/user/roles'
import type { UserRoles } from '@/models/user/types'

interface SessionValidationResult {
  valid: boolean
  data?: {
    roles: {
      primaryRole: string
      sectionRoles: string[]
    }
    userId: string
    isOnline: boolean
  }
  error?: {
    message: string
    code: string
  }
}

export async function validateSessionFirestore(
  sessionId: string
): Promise<SessionValidationResult> {
  try {
    // Verificar sesión
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get()
    const session = sessionDoc.data()

    if (
      !session ||
      !session.isActive ||
      new Date(session.expiresAt) < new Date()
    ) {
      return {
        valid: false,
        error: { message: 'Invalid session', code: 'INVALID_SESSION' },
      }
    }

    // Obtener claims del usuario desde Auth
    const userAuth = await adminAuth.getUser(session.userId)
    const userClaims = userAuth.customClaims as UserRoles | undefined

    if (!userClaims) {
      return {
        valid: false,
        error: { message: 'User claims not found', code: 'INVALID_CLAIMS' },
      }
    }

    // Actualizar última actividad
    await Promise.all([
      adminDb.collection('sessions').doc(sessionId).update({
        lastActivity: new Date(),
      }),
      adminDb.collection('users').doc(session.userId).update({
        lastActivity: new Date(),
      }),
    ])

    return {
      valid: true,
      data: {
        roles: {
          primaryRole: userClaims.primaryRole,
          sectionRoles: userClaims.sectionRoles,
        },
        userId: session.userId,
        isOnline: true,
      },
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return {
      valid: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' },
    }
  }
}

export async function validateSessionClaims(
  sessionId: string
): Promise<SessionValidationResult> {
  try {
    // Solo verificamos la existencia y validez de la sesión
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get()
    const session = sessionDoc.data()

    if (
      !session ||
      !session.isActive ||
      new Date(session.expiresAt) < new Date()
    ) {
      return {
        valid: false,
        error: { message: 'Invalid session', code: 'INVALID_SESSION' },
      }
    }

    // Obtener claims del usuario desde Auth (más rápido que Firestore)
    const userAuth = await adminAuth.getUser(session.userId)
    const userClaims = userAuth.customClaims as UserRoles | undefined

    if (!userClaims) {
      return {
        valid: false,
        error: { message: 'User claims not found', code: 'INVALID_CLAIMS' },
      }
    }

    return {
      valid: true,
      data: {
        roles: {
          primaryRole: userClaims.primaryRole,
          sectionRoles: userClaims.sectionRoles,
        },
        userId: session.userId,
        isOnline: true,
      },
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return {
      valid: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' },
    }
  }
}

export function hasRequiredSectionRoles(
  userRoles: string[],
  requiredRoles: SectionRole[]
): boolean {
  return requiredRoles.some((role) => userRoles.includes(role))
}
