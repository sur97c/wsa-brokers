// app/models/user/types.ts

import type { UserProfile } from '@/models/user/user'
import type { UserRole, SectionRole } from './roles'

// Tipos base para información del usuario
export interface UserBase {
  uid: string
  email: string
  displayName?: string
  name?: string
  lastName?: string
  emailVerified: boolean
}

// Tipos para roles y permisos del usuario
export interface UserRoles {
  primaryRole: UserRole
  sectionRoles: SectionRole[]
}

// Tipos para estados del usuario
export interface UserState {
  isOnline: boolean
  blocked: boolean
  disabled: boolean
  deleted: boolean
  allowMultipleSessions: boolean
}

// Para el modelo de base de datos, usamos Date
export interface UserTimestampsDB {
  lastLogin?: Date
  lastActivity?: Date
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: string
}

// Tipos para metadata adicional
export interface UserMetadata {
  metadata?: Record<string, unknown>
}

// Tipos para sesión
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

export interface SessionInvalidationDetails {
  endedAt: Date
  endReason:
    | 'MANUAL_INVALIDATION'
    | 'SESSION_EXPIRED'
    | 'USER_LOGOUT'
    | 'SYSTEM'
}

export interface SessionValidationResult {
  canLogin: boolean
  metrics?: SessionMetrics
  error?: {
    code: string
    message: string
  }
  activeSessions?: number
  oldSession?: string
}

export interface SessionMetrics {
  activeSessions: number
  lastSessionCreated?: Date
  totalHistoricalSessions: number
}

export interface UserSession {
  sessionId?: string
  sessionMetrics?: SessionMetrics
  activeSessions: number
  lastSessionCreated?: Date
  totalHistoricalSessions: number
}

export interface SerializedSessionMetrics {
  activeSessions: number
  lastSessionCreated?: string // Cambiado de Date a string
  totalHistoricalSessions: number
}

// Nueva interfaz para el estado serializado en Redux
export interface SerializedUserProfile
  extends Omit<
    UserProfile,
    'primaryRole' | 'sectionRoles' | keyof UserTimestampsDB | 'sessionMetrics'
  > {
  primaryRole: string
  sectionRoles: string[]
  // Timestamps serializados
  lastLogin?: string
  lastActivity?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  sessionMetrics?: SerializedSessionMetrics
}
