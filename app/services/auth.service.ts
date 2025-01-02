// app/services/auth.service.ts

import { IAuthProvider } from '@/interfaces/auth.provider'
import { UserCredentials, UserProfile } from '@/models/user/user'
import {
  BusinessError,
  BusinessErrorCode,
  type BaseError,
} from '@/models/errors'
import { getAuthProvider } from '@/config/providers'

export class AuthService {
  private authProvider: IAuthProvider

  private mapErrorCode(code: string | undefined): BusinessErrorCode {
    const errorCode = Object.values(BusinessErrorCode).find(
      (enumCode) => enumCode === code
    )
    return errorCode || BusinessErrorCode.SESSION_VALIDATION_ERROR
  }

  constructor(authProvider?: IAuthProvider) {
    this.authProvider = authProvider || getAuthProvider()
  }

  async login(credentials: UserCredentials): Promise<UserProfile> {
    // Realizar login básico
    const user = await this.authProvider.login(credentials)

    // Validar estado del usuario
    await this.authProvider.validateUserState(user.uid)

    // Verificar sesiones activas
    const sessionCheck = await this.authProvider.checkActiveSessions(user.uid)

    if (!sessionCheck.canLogin) {
      // Si existe una sesión antigua, la invalidamos antes de crear la nueva
      if (sessionCheck.oldSession) {
        await this.authProvider.invalidateSession(sessionCheck.oldSession)
      } else {
        throw new BusinessError(
          'Ya existe una sesión activa para este usuario',
          BusinessErrorCode.ACTIVE_SESSION_EXISTS
        )
      }
    }

    // Crear nueva sesión
    const sessionId = await this.authProvider.createSession(
      user.uid,
      credentials.rememberMe || false
    )

    // Sincronizar roles, REVIEW: ¿Por qué se sincronizan los roles aquí?
    await this.authProvider.syncRoles(user.uid)

    // Actualizar actividad
    await this.authProvider.updateUserActivity(user.uid, {
      isOnline: true,
      lastLogin: new Date(),
      lastActivity: new Date(),
    })

    return {
      ...user,
      sessionId,
    }
  }

  async logout(uid: string): Promise<void> {
    // Actualizar estado del usuario
    await this.authProvider.updateUserActivity(uid, {
      isOnline: false,
      lastActivity: new Date(),
    })

    // Cerrar sesión en el provider
    await this.authProvider.logout()

    // Limpiar sesiones activas
    await this.authProvider.clearActiveSessions(uid)
  }

  // En auth.service.ts, añadamos más logs para debug
  async validateSession(sessionId: string): Promise<UserProfile> {
    try {
      console.log('Iniciando validación de sesión:', sessionId)

      // 1. Verificar sesión
      const session = await this.authProvider.getSession(sessionId)
      console.log('Sesión encontrada:', session)

      if (
        !session ||
        !session.isActive ||
        new Date(session.expiresAt) < new Date()
      ) {
        console.warn('Sesión inválida:', {
          exists: !!session,
          isActive: session?.isActive,
          expiresAt: session?.expiresAt,
        })
        throw new BusinessError(
          'Sesión inválida o expirada',
          BusinessErrorCode.INVALID_SESSION
        )
      }

      // 2. Obtener usuario
      const user = await this.authProvider.getUser(session.userId)
      console.log('Usuario obtenido:', user.uid)

      // 3. Validar estado
      await this.authProvider.validateUserState(user.uid)
      console.log('Estado del usuario validado')

      // 4. Actualizar actividad
      await this.authProvider.updateUserActivity(user.uid, {
        lastActivity: new Date(),
      })
      console.log('Actividad actualizada')

      return {
        ...user,
        sessionId,
      }
    } catch (error: unknown) {
      console.error('Error en validateSession:', error)
      const baseError = error as { message: string; code?: string }
      throw new BusinessError(
        baseError.message || 'Error al validar la sesión',
        this.mapErrorCode(baseError.code),
        {
          originalError: {
            message: (error as BaseError).message,
            name: (error as BaseError).name,
            stack: (error as BaseError).stack,
          },
        }
      )
    }
  }

  async recoverAccess(email: string): Promise<void> {
    await this.authProvider.recoverAccess(email)
  }

  async resendVerification(): Promise<void> {
    await this.authProvider.resendEmailVerification()
  }

  async updateUserActivity(uid: string, isOnline: boolean): Promise<void> {
    await this.authProvider.updateUserActivity(uid, {
      isOnline: isOnline,
      lastActivity: new Date(),
    })
  }
}
