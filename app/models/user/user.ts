// app/models/user/user.ts

import type {
  UserBase,
  UserRoles,
  UserState,
  UserMetadata,
  UserSession,
  UserTimestampsDB,
} from './types'

export interface UserProfile
  extends UserBase,
    UserRoles,
    UserState,
    UserTimestampsDB,
    UserMetadata,
    UserSession {}

export interface UserCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserActivityUpdate = Pick<
  UserProfile,
  'isOnline' | 'lastLogin' | 'lastActivity' | 'sessionId'
>

export type SessionStatus =
  | 'idle'
  | 'checking'
  | 'authenticated'
  | 'unauthenticated'
