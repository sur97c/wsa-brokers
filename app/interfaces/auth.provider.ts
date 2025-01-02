// app/interfaces/auth.provider.ts

import { UserCredentials, UserProfile, SessionData } from '@/models/user/user'

export interface IAuthProvider {
  // Métodos de autenticación básica
  login(credentials: UserCredentials): Promise<UserProfile>
  logout(): Promise<void>
  validateUserState(uid: string): Promise<void>
  recoverAccess(email: string): Promise<boolean>
  resendEmailVerification(): Promise<boolean>

  // Métodos de gestión de usuarios
  getUser(userId: string): Promise<UserProfile>
  syncRoles(uid: string): Promise<void>
  updateUserActivity(uid: string, data: Partial<UserProfile>): Promise<void>

  // Métodos de gestión de sesiones
  createSession(uid: string, rememberMe: boolean): Promise<string>
  getSession(sessionId: string): Promise<SessionData | null>
  invalidateSession(sessionId: string): Promise<void>
  checkActiveSessions(uid: string): Promise<{
    canLogin: boolean
    oldSession?: string
  }>
  clearActiveSessions(uid: string): Promise<void>
}
