// app/models/route/protected.route.ts

import { ReactNode } from 'react'

import { TransitionType } from '@/constants/transitions'

import type { SectionRole } from '../user/roles'

export interface ProtectedRouteMetadata {
  allowedSections: SectionRole[]
  skeletonType?: SectionRole
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
