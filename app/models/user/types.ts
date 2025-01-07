// app/models/user/types.ts

import type { BaseEntity } from '@/models/base.entity'
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

export interface UserTimestampsDB
  extends Pick<
    BaseEntity,
    'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
  > {
  lastLogin?: Date
  lastActivity?: Date
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
  error?: {
    code: string
    message: string
  }
  oldSession?: string
  metrics: SessionMetrics
}

export interface UserSession {
  sessionId?: string
  activeSessions: number
  lastSessionCreated?: Date
  totalHistoricalSessions: number
}

export interface SessionMetrics {
  activeSessions: number
  lastSessionCreated?: Date
  totalHistoricalSessions: number
}

// Nueva interfaz para el estado serializado en Redux
export interface SerializedUserProfile
  extends Omit<
    UserProfile,
    | 'primaryRole'
    | 'sectionRoles'
    | keyof UserTimestampsDB
    | 'lastSessionCreated'
  > {
  primaryRole: string
  sectionRoles: string[]
  // Timestamps serializados
  lastLogin?: string
  lastActivity?: string
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  sessionId?: string
  activeSessions: number
  lastSessionCreated?: string
  totalHistoricalSessions: number
}
