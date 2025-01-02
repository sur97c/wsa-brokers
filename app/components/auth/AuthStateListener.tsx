// app/components/auth/AuthStateListener.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logoutUser, updateUserActivity } from '@/redux/slices/auth.slice'
import { useAuthListener } from '@/hooks/auth/useAuthListener'
import { useSafeRouter } from '@/hooks/navigation/useSafeRouter'
import { useTranslations } from '@/translations/hooks/useTranslations'
import Notification from '@/components/notification/Notification'
import { faClock, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'

const SESSION_TIMEOUT =
  Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) || 1800000
const DIALOG_TIMEOUT = Number(process.env.NEXT_PUBLIC_DIALOG_TIMEOUT) || 300000

interface AuthStateListenerProps {
  children: React.ReactNode
}

export function AuthStateListener({ children }: AuthStateListenerProps) {
  const { t, translations } = useTranslations()
  const { safeNavigate } = useSafeRouter()
  const dispatch = useAppDispatch()

  const [isSessionTimeoutVisible, setIsSessionTimeoutVisible] = useState(false)
  const [isDisabledVisible, setIsDisabledVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const { user, sessionStatus } = useAppSelector((state) => state.auth)
  const rememberMe = user?.sessionId != null // Si hay sessionId significa que el usuario eligió rememberMe

  useAuthListener()

  const handleLogout = useCallback(async () => {
    if (user?.uid) {
      // Forzar última actualización antes de logout
      await dispatch(updateUserActivity(true))
      await dispatch(logoutUser('SESSION_EXPIRED'))
      setIsSessionTimeoutVisible(false)
      setIsDisabledVisible(false)
      safeNavigate('/')
    }
  }, [dispatch, safeNavigate, user?.uid])

  const handleExtendSession = useCallback(async () => {
    if (user?.uid) {
      await dispatch(updateUserActivity(true)) // Forzar actualización
      setIsSessionTimeoutVisible(false)
      setTimeLeft(SESSION_TIMEOUT)
    }
  }, [dispatch, user?.uid])

  useEffect(() => {
    if (!user || sessionStatus !== 'authenticated' || rememberMe) return

    const checkSession = () => {
      const lastActivity = user.lastActivity
        ? new Date(user.lastActivity).getTime()
        : Date.now()
      const timeSinceLastActivity = Date.now() - lastActivity

      if (
        timeSinceLastActivity > SESSION_TIMEOUT - DIALOG_TIMEOUT &&
        !isSessionTimeoutVisible
      ) {
        setIsSessionTimeoutVisible(true)
        setTimeLeft(
          Math.floor((SESSION_TIMEOUT - timeSinceLastActivity) / 1000)
        )
      }

      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        handleLogout()
      }
    }

    const handleUserActivity = debounce(() => {
      if (!isSessionTimeoutVisible) {
        dispatch(updateUserActivity(false))
      }
    }, 1000) // Debounce de 1 segundo para eventos frecuentes

    const sessionCheckInterval: NodeJS.Timeout = setInterval(checkSession, 1000)
    window.addEventListener('mousemove', handleUserActivity)
    window.addEventListener('keydown', handleUserActivity)
    window.addEventListener('click', handleUserActivity)

    return () => {
      clearInterval(sessionCheckInterval)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      window.removeEventListener('click', handleUserActivity)
      handleUserActivity.cancel() // Limpiar debounce
    }
  }, [
    dispatch,
    user,
    sessionStatus,
    isSessionTimeoutVisible,
    handleLogout,
    rememberMe,
  ])

  useEffect(() => {
    if (!isSessionTimeoutVisible || timeLeft <= 0) return

    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleLogout()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    // Limpiamos solo el intervalo de la cuenta regresiva
    return () => {
      clearInterval(countdownInterval)
    }
  }, [isSessionTimeoutVisible, timeLeft, handleLogout])

  return (
    <>
      {children}

      {isSessionTimeoutVisible && (
        <Notification
          icon={faClock}
          iconColor="text-[#FF8C00]"
          title={t(translations.core.session.timeoutWarning)}
          message={t(translations.core.session.timeoutMessage, {
            minutes: Math.floor(timeLeft / 60),
            seconds: timeLeft % 60,
          })}
          primaryButtonText={t(translations.core.session.extend)}
          secondaryButtonText={t(translations.core.session.logout)}
          onPrimaryButtonClick={handleExtendSession}
          onSecondaryButtonClick={handleLogout}
        />
      )}

      {isDisabledVisible && (
        <Notification
          icon={faUserSlash}
          iconColor="text-red-500"
          title={t(translations.core.session.accountDisabled)}
          message={t(translations.core.session.accountDisabledMessage)}
          primaryButtonText={t(translations.core.session.logout)}
          onPrimaryButtonClick={handleLogout}
        />
      )}
    </>
  )
}
