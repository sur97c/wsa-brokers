// app/redux/slices/auth.types.ts

import type { BaseError } from '@/models/errors'
import type { SerializedUserProfile } from '@/models/user/types'
import type { SessionStatus, UserProfile } from '@/models/user/user'

export interface AuthState {
  user: SerializedUserProfile | null
  isAuthenticated: boolean
  loading: boolean
  error: BaseError | null
  sessionStatus: SessionStatus
  success?: boolean
  lastActivitySync: number | null
  logoutRequested: boolean
  customClaims: { roles: string[] }
}

// Estado expuesto a los componentes
export interface AuthStateView {
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  error: BaseError | null
  sessionStatus: SessionStatus
  success?: boolean
  lastActivitySync: number | null
  logoutRequested: boolean
  customClaims: { roles: string[] }
}
