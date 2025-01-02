// app/hooks/route/useProtectedRoute.ts

import { useState, useEffect, useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useSafeRouter } from '@/hooks/navigation/useSafeRouter'
import { useNavigationLoader } from '@/hooks/navigation/useNavigationLoader'
import { useTranslations } from '@/translations/hooks/useTranslations'
import type {
  ProtectedRouteMetadata,
  ProtectedRouteState,
} from '@/models/route/protected.route'

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
  const { safeNavigate } = useSafeRouter()
  const { setIsNavigating, setLoadingMessage } = useNavigationLoader()

  const checkAuthorization = useCallback(() => {
    if (!user || !user.roles) return false
    return config.allowedRoles.some((role) => user.roles.includes(role))
  }, [user, config.allowedRoles])

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
          safeNavigate('/')
        }
        return
      }

      if (isAuthenticated) {
        const isAuthorized = checkAuthorization()
        if (!isAuthorized) {
          if (mounted) {
            setIsNavigating(true)
            safeNavigate('/unauthorized')
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
    safeNavigate,
    setIsNavigating,
    setLoadingMessage,
    t,
    translations.core.loading.checkingSession,
  ])

  return state
}
