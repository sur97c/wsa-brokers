// app/models/route/protected.route.ts

import { ReactNode } from 'react'
import { RoleKey } from '@/utils/rolesDefinition'
import { TransitionType } from '@/constants/transitions'

export interface ProtectedRouteMetadata {
  allowedRoles: RoleKey[]
  skeletonType?: RoleKey
  transitionType?: TransitionType
  mode: 'redirect' | 'dual'
  redirectPath: string
}

export interface ProtectedRouteState {
  isLoading: boolean
  showSkeleton: boolean
  isAuthorized: boolean
}

export interface ProtectedRouteProps extends ProtectedRouteMetadata {
  children: ReactNode
  publicContent?: ReactNode
}
