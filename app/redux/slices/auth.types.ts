// app/redux/slices/auth.types.ts

import type { BaseError } from '@/models/errors'
import { UserProfile, type SessionStatus } from '@/models/user/user'
import type { RoleKey } from '@/utils/rolesDefinition'

export interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  error: BaseError | null
  sessionStatus: SessionStatus
  success?: boolean
  customClaims?: {
    roles: RoleKey[]
  }
  lastActivitySync: number | null
  logoutRequested: boolean
}
