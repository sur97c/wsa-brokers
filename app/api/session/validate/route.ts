// app/api/session/validate/route.ts

import { NextResponse } from 'next/server'
import { adminDb } from '@/firebase/firebase.admin'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // Verificar sesión
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get()

    const session = sessionDoc.data()

    if (
      !session ||
      !session.isActive ||
      new Date(session.expiresAt) < new Date()
    ) {
      console.log('Session invalid:', { session, now: new Date() })
      return NextResponse.json({
        valid: false,
        error: { message: 'Invalid session', code: 'INVALID_SESSION' },
      })
    }

    // Obtener datos del usuario
    const userDoc = await adminDb.collection('users').doc(session.userId).get()

    const userData = userDoc.data()

    if (!userData) {
      return NextResponse.json({
        valid: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' },
      })
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

    return NextResponse.json({
      valid: true,
      data: {
        roles: userData.roles || [],
        userId: session.userId,
        isOnline: userData.isOnline,
      },
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({
      valid: false,
      error: { message: 'Server error', code: 'SERVER_ERROR' },
    })
  }
}
