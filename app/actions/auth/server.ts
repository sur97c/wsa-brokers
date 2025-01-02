// app/actions/auth/server.ts

'use server'

import { AuthService } from '@/services/auth.service'
import { getAuthProvider } from '@/config/providers'
import { cookies } from 'next/headers'
import { UserCredentials } from '@/models/user/user'
import { getDeviceInformationFromHeaders } from '@/adapters/auth/server'

const authService = new AuthService(getAuthProvider())

export async function loginAction(credentials: UserCredentials) {
  try {
    const user = await authService.login(credentials)
    const sessionData = await getDeviceInformationFromHeaders()

    const cookieStore = await cookies()
    // Limpiar cualquier cookie existente primero
    cookieStore.set({
      name: 'sessionId',
      value: '',
      expires: new Date(0),
      path: '/',
    })

    // Establecer la nueva cookie
    cookieStore.set({
      name: 'sessionId',
      value: user.sessionId!,
      ...(credentials.rememberMe
        ? { maxAge: 30 * 24 * 60 * 60 }
        : { expires: undefined }),
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })

    return {
      success: true,
      data: {
        ...user,
        sessionData,
      },
    }
  } catch (error: unknown) {
    const baseError = error as { message: string; code?: string }
    return {
      success: false,
      error: {
        message: baseError.message || 'Error en el proceso de login',
        code: baseError.code || 'AUTH_ERROR',
      },
    }
  }
}

export async function logoutAction(uid: string) {
  try {
    await authService.logout(uid)
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'sessionId',
      value: '',
      expires: new Date(0),
      path: '/',
    })

    return {
      success: true,
    }
  } catch (error: unknown) {
    const baseError = error as { message: string; code?: string }
    return {
      success: false,
      error: {
        message: baseError.message || 'Error en el proceso de logout',
        code: baseError.code || 'LOGOUT_ERROR',
      },
    }
  }
}

export async function checkSessionAction() {
  try {
    const cookieStore = await cookies()
    console.log('Cookies actuales:', cookieStore.getAll())
    const sessionId = cookieStore.get('sessionId')

    if (!sessionId?.value) {
      return {
        success: false,
        error: {
          message: 'No hay sesión activa',
          code: 'NO_SESSION',
        },
      }
    }

    const user = await authService.validateSession(sessionId.value)

    return {
      success: true,
      data: user,
    }
  } catch (error: unknown) {
    const baseError = error as { message: string; code?: string }
    return {
      success: false,
      error: {
        message: baseError.message || 'Error al verificar la sesión',
        code: baseError.code || 'SESSION_ERROR',
      },
    }
  }
}

export async function recoverAccessAction(email: string) {
  try {
    await authService.recoverAccess(email)

    return {
      success: true,
    }
  } catch (error: unknown) {
    const baseError = error as { message: string; code?: string }
    return {
      success: false,
      error: {
        message:
          baseError.message || 'Error en el proceso de recuperación de acceso',
        code: baseError.code || 'RECOVER_ACCESS_ERROR',
      },
    }
  }
}

export async function resendVerificationAction() {
  try {
    await authService.resendVerification()

    return {
      success: true,
    }
  } catch (error: unknown) {
    const baseError = error as { message: string; code?: string }
    return {
      success: false,
      error: {
        message:
          baseError.message || 'Error en el proceso de reenvío de verificación',
        code: baseError.code || 'RESEND_VERIFICATION_ERROR',
      },
    }
  }
}

export async function updateUserActivityAction(uid: string, isOnline: boolean) {
  try {
    await authService.updateUserActivity(uid, isOnline)

    return {
      success: true,
    }
  } catch (error: unknown) {
    const baseError = error as { message: string; code?: string }
    return {
      success: false,
      error: {
        message:
          baseError.message || 'Error al actualizar la actividad del usuario',
        code: baseError.code || 'UPDATE_ACTIVITY_ERROR',
      },
    }
  }
}
