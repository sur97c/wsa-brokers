// app/api/session/validate/route.ts

import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/firebase/firebase.admin'
import type {
  ValidSessionResponse,
  InvalidSessionResponse,
} from '@/models/session/types'
import type { UserRoles } from '@/models/user/types'

export async function POST(request: Request) {
  function convertToPlainObject(data: unknown): unknown {
    if (data instanceof Date) {
      return data.toISOString()
    }

    if (
      data &&
      typeof data === 'object' &&
      '_seconds' in data &&
      '_nanoseconds' in data &&
      typeof data._seconds === 'number'
    ) {
      return new Date(data._seconds * 1000).toISOString()
    }

    if (Array.isArray(data)) {
      return data.map(convertToPlainObject)
    }

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        result[key] = convertToPlainObject(value)
      }
      return result
    }

    return data
  }

  try {
    const { sessionId } = await request.json()

    // Obtenemos la sesión y convertimos sus datos
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get()
    const sessionData = sessionDoc.data()
    const session = convertToPlainObject(sessionData) as Record<string, unknown>

    if (
      !session ||
      !session.isActive ||
      new Date(session.expiresAt as string) < new Date()
    ) {
      return NextResponse.json<InvalidSessionResponse>({
        valid: false,
        error: { message: 'Invalid session', code: 'INVALID_SESSION' },
      })
    }

    // Obtenemos el usuario y sus claims
    const userAuth = await adminAuth.getUser(session.userId as string)
    const userClaims = userAuth.customClaims as UserRoles | undefined

    if (!userClaims) {
      return NextResponse.json<InvalidSessionResponse>({
        valid: false,
        error: { message: 'User claims not found', code: 'INVALID_CLAIMS' },
      })
    }

    // Actualizamos actividad y convertimos las fechas
    const now = new Date()
    await Promise.all([
      adminDb.collection('sessions').doc(sessionId).update({
        lastActivity: now,
      }),
      adminDb
        .collection('users')
        .doc(session.userId as string)
        .update({
          lastActivity: now,
        }),
    ])

    // Devolvemos solo los datos necesarios ya convertidos
    return NextResponse.json<ValidSessionResponse>({
      valid: true,
      data: {
        roles: {
          primaryRole: userClaims.primaryRole,
          sectionRoles: userClaims.sectionRoles,
        },
        userId: session.userId as string,
        isOnline: true,
        lastActivity: now.toISOString(),
      },
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json<InvalidSessionResponse>({
      valid: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' },
    })
  }
}
