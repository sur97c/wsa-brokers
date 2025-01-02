// app/models/user.ts

import type { RoleKey } from '@/utils/rolesDefinition'

export interface UserCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  name?: string
  lastName?: string
  roles: string[]
  isOnline: boolean
  lastLogin?: Date | string
  lastActivity?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  emailVerified: boolean
  blocked: boolean
  disabled: boolean
  deleted: boolean
  allowMultipleSessions: boolean
  metadata?: Record<string, unknown>
  sessionId?: string
}

export const serializeUser = (user: UserProfile): UserProfile => {
  return {
    ...user,
    lastLogin:
      user.lastLogin instanceof Date
        ? user.lastLogin.toISOString()
        : user.lastLogin,
    lastActivity:
      user.lastActivity instanceof Date
        ? user.lastActivity.toISOString()
        : user.lastActivity,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
    updatedAt:
      user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : user.updatedAt,
  }
}

export interface SessionData {
  userId: string
  token: string
  deviceInfo: {
    userAgent: string
    ip?: string
  }
  createdAt: Date
  lastActivity: Date
  isActive: boolean
  expiresAt: Date
}

export type UserActivityUpdate = Pick<
  UserProfile,
  'isOnline' | 'lastLogin' | 'lastActivity'
>

export type SessionStatus =
  | 'idle' // Estado inicial
  | 'checking' // Verificando sesión
  | 'authenticated' // Sesión válida
  | 'unauthenticated' // Sin sesión

export interface IUserClaims {
  roles: RoleKey[]
  [key: string]: unknown
}
