// app/hooks/route/useProtectedRoute.ts

import { useState, useEffect, useCallback } from 'react'
import { useNavigationLoader } from '@/hooks/navigation/useNavigationLoader'
import { useSafeNavigator } from '@/hooks/navigation/useSafeNavigator'
import type {
  ProtectedRouteMetadata,
  ProtectedRouteState,
} from '@/models/route/protected.route'
import type { SectionRole } from '@/models/user/roles'
import { useAppSelector } from '@/redux/hooks'
import { useTranslations } from '@/translations/hooks/useTranslations'

export const useProtectedRoute = (
  config: ProtectedRouteMetadata
): ProtectedRouteState => {
  const [state, setState] = useState<ProtectedRouteState>({
    isLoading: true,
    showSkeleton: true,
    isAuthorized: false,
  })

  const { t, translations } = useTranslations()
  const { user, isAuthenticated, sessionStatus } = useAppSelector(
    (state) => state.auth
  )
  const { navigateTo } = useSafeNavigator()
  const { setIsNavigating, setLoadingMessage } = useNavigationLoader()

  const checkAuthorization = useCallback(() => {
    if (!user || !user.primaryRole || !user.sectionRoles) return false
    return config.allowedSections.some((section: SectionRole) =>
      user.sectionRoles.includes(section)
    )
  }, [user, config.allowedSections])

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      if (sessionStatus === 'checking') {
        if (mounted) {
          setLoadingMessage(t(translations.core.loading.checkingSession))
        }
        return
      }

      if (sessionStatus === 'unauthenticated') {
        if (mounted && config.mode !== 'dual') {
          setIsNavigating(true)
          navigateTo('/')
        }
        return
      }

      if (isAuthenticated) {
        const isAuthorized = checkAuthorization()
        if (!isAuthorized) {
          if (mounted) {
            setIsNavigating(true)
            navigateTo('/unauthorized')
          }
          return
        }

        if (mounted) {
          setState({
            isLoading: false,
            showSkeleton: false,
            isAuthorized: true,
          })
          setIsNavigating(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [
    sessionStatus,
    isAuthenticated,
    checkAuthorization,
    config.mode,
    navigateTo,
    setIsNavigating,
    setLoadingMessage,
    t,
    translations.core.loading.checkingSession,
  ])

  return state
}
