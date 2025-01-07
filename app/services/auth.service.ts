// app/services/auth.service.ts

import { getAuthProvider } from '@/config/providers'
import { IAuthProvider } from '@/interfaces/auth.provider'
import {
  BusinessError,
  BusinessErrorCode,
  type BaseError,
} from '@/models/errors'
import {
  SessionValidationResult,
  type SessionMetrics,
} from '@/models/user/types'
import { UserCredentials, UserProfile } from '@/models/user/user'

interface RoleSyncOptions {
  sourceOfTruth: 'primary' | 'secondary'
}

export class AuthService {
  private authProvider: IAuthProvider
  private rolesSyncConfig: RoleSyncOptions = {
    sourceOfTruth: 'primary',
  }

  constructor(authProvider?: IAuthProvider, rolesSyncConfig?: RoleSyncOptions) {
    this.authProvider = authProvider || getAuthProvider()
    if (rolesSyncConfig) {
      this.rolesSyncConfig = rolesSyncConfig
    }
  }

  private async validatePreLoginConditions(
    email: string
  ): Promise<SessionValidationResult> {
    try {
      // console.log('=======> Validando condiciones de inicio de sesión:', email)
      const user = await this.authProvider.getUserByEmail(email)
      if (!user) {
        throw new BusinessError(
          'Usuario no encontrado',
          BusinessErrorCode.USER_NOT_FOUND
        )
      }

      await this.authProvider.validateUserState(user.uid)

      const sessionCheck = await this.authProvider.checkActiveSessions(user.uid)

      // console.log('=======> Obteniendo métricas de sesión', sessionCheck)
      const metrics = await this.authProvider.getSessionMetrics(user.uid)

      // console.log(
      //   '=======> Validando sesiones activas',
      //   sessionCheck?.activeSessions
      // )
      if (
        (!user.allowMultipleSessions && sessionCheck?.activeSessions) ||
        0 > 0
      ) {
        return {
          canLogin: false,
          metrics,
          error: {
            code: BusinessErrorCode.ACTIVE_SESSION_EXISTS,
            message: 'Ya existe una sesión activa para este usuario',
          },
        }
      }

      // console.log('======> Regresando con éxito', metrics)
      return {
        canLogin: true,
        metrics,
      }
    } catch (error) {
      console.log(
        '=======> Error al validar condiciones de inicio de sesión:',
        error
      )
      const baseError = error as BaseError
      throw new BusinessError(
        baseError.message,
        baseError.code as BusinessErrorCode
      )
    }
  }

  private async syncUserRoles(uid: string): Promise<void> {
    try {
      await this.authProvider.syncRoles(uid, {
        sourceOfTruth: this.rolesSyncConfig.sourceOfTruth,
      })
    } catch (error) {
      console.error('Error sincronizando roles:', error)
      throw new BusinessError(
        'Error al sincronizar roles de usuario',
        BusinessErrorCode.ROLE_SYNC_ERROR
      )
    }
  }

  private mapErrorCode(code: string | undefined): BusinessErrorCode {
    const errorCode = Object.values(BusinessErrorCode).find(
      (enumCode) => enumCode === code
    )
    return errorCode || BusinessErrorCode.SESSION_VALIDATION_ERROR
  }

  async login(credentials: UserCredentials): Promise<UserProfile> {
    let sessionId: string | undefined
    let sessionMetrics: SessionMetrics | undefined
    let user: UserProfile | undefined

    // 1. Validación inicial del correo
    const preLoginCheck = await this.validatePreLoginConditions(
      credentials.email
    )

    if (!preLoginCheck.canLogin) {
      throw new BusinessError(
        preLoginCheck.error?.message || 'No se puede iniciar sesión',
        preLoginCheck.error?.code as BusinessErrorCode
      )
    }

    try {
      // 2. Login básico que ahora incluye la sincronización de roles
      user = await this.authProvider.login(credentials)

      // 3. Ya no necesitamos llamar a syncUserRoles aquí porque ya se hizo en el adapter
      // await this.syncUserRoles(user.uid)

      // 4. Creación de sesión
      sessionId = await this.authProvider.createSession(
        user.uid,
        credentials.rememberMe || false
      )

      // 5. Actualización de actividad
      await this.authProvider.updateUserActivity(user.uid, {
        isOnline: true,
        lastLogin: new Date(),
        lastActivity: new Date(),
        sessionId,
      })

      sessionMetrics = preLoginCheck.metrics
      if (sessionMetrics && sessionMetrics.activeSessions > 0) {
        console.warn(
          `Usuario ${user.uid} tiene ${sessionMetrics.activeSessions} sesiones activas`
        )
      }

      return {
        ...user,
        sessionId,
        sessionMetrics,
      }
    } catch (error) {
      if (sessionId) {
        await this.invalidateSession(sessionId, user?.uid || '').catch(
          console.error
        )
      }
      const baseError = error as BaseError
      throw new BusinessError(
        baseError.message,
        baseError.code as BusinessErrorCode
      )
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

  async invalidateSession(sessionId: string, uid: string): Promise<void> {
    console.log(
      `Iniciando invalidación de sesión: ${sessionId} para usuario: ${uid}`
    )

    await this.authProvider.updateUserActivity(uid, {
      isOnline: false,
      lastActivity: new Date(),
    })

    await this.authProvider.invalidateSession(sessionId, {
      endedAt: new Date(),
      endReason: 'MANUAL_INVALIDATION',
    })

    await this.authProvider.logout()
    await this.authProvider.clearTemporaryClaims(uid)

    console.log(`Sesión ${sessionId} invalidada exitosamente`)
  }

  // En auth.service.ts, añadamos más logs para debug
  async validateSession(sessionId: string): Promise<UserProfile> {
    try {
      // console.log('Iniciando validación de sesión:', sessionId)

      // 1. Verificar sesión
      const session = await this.authProvider.getSession(sessionId)
      // console.log('Sesión encontrada:', session)

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
      // console.log('Usuario obtenido:', user.uid)

      // 3. Validar estado
      await this.authProvider.validateUserState(user.uid)
      // console.log('Estado del usuario validado')

      // 4. Actualizar actividad
      await this.authProvider.updateUserActivity(user.uid, {
        lastActivity: new Date(),
        isOnline: true,
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
