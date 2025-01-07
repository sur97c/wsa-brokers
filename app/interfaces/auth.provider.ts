// app/interfaces/auth.provider.ts

import {
  SessionInvalidationDetails,
  SessionValidationResult,
  type SessionData,
  type SessionMetrics,
} from '@/models/user/types'
import {
  UserCredentials,
  UserProfile,
  UserActivityUpdate,
} from '@/models/user/user'

export interface IAuthProvider {
  // Métodos de autenticación básica
  login(credentials: UserCredentials): Promise<UserProfile>
  logout(): Promise<void>
  validateUserState(uid: string): Promise<void>
  recoverAccess(email: string): Promise<boolean>
  resendEmailVerification(): Promise<boolean>
  getUserByEmail(email: string): Promise<UserProfile | null>
  // getFirestoreRoles(uid: string): Promise<UserRoles>
  // getFirebaseRoles(uid: string): Promise<UserRoles>
  // setFirebaseRoles(uid: string, roles: UserRoles): Promise<void>
  // setFirestoreRoles(uid: string, roles: UserRoles): Promise<void>
  clearTemporaryClaims(uid: string): Promise<void>

  // Métodos de gestión de usuarios
  getUser(userId: string): Promise<UserProfile>
  syncRoles(
    uid: string,
    options: { sourceOfTruth: 'primary' | 'secondary' }
  ): Promise<void>
  updateUserActivity(uid: string, update: UserActivityUpdate): Promise<void>

  // Métodos de gestión de sesiones
  createSession(uid: string, rememberMe: boolean): Promise<string>
  getSession(sessionId: string): Promise<SessionData | null>
  invalidateSession(
    sessionId: string,
    details: SessionInvalidationDetails
  ): Promise<void>
  checkActiveSessions(uid: string): Promise<SessionValidationResult>
  clearActiveSessions(uid: string): Promise<void>
  getSessionMetrics(uid: string): Promise<SessionMetrics>
}
