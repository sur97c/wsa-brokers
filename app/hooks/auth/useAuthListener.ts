// app/hooks/auth/useAuthListener.ts

import { onAuthStateChanged, User as firebaseUser } from 'firebase/auth'
import { useEffect, useRef } from 'react'

import { auth } from '@/firebase/firebase.client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { checkSessionUser, logoutUser } from '@/redux/slices/auth.slice'
import type { RootState } from '@/redux/types'

export const useAuthListener = () => {
  const dispatch = useAppDispatch()
  const { user, sessionStatus } = useAppSelector(
    (state: RootState) => state.auth
  )
  const attemptedRef = useRef(false)

  useEffect(() => {
    console.log('Setting up auth listener')
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: firebaseUser | null) => {
        console.log('Auth State Change:', {
          hasFirebaseUser: !!firebaseUser,
          hasStoreUser: !!user,
          sessionStatus,
          attempted: attemptedRef.current,
        })

        // Si tenemos usuario de Firebase, verificar sesión
        if (firebaseUser) {
          if (!user || user.uid !== firebaseUser.uid) {
            attemptedRef.current = false
            await dispatch(checkSessionUser())
          }
          return
        }

        // Si no hay usuario de Firebase pero hay sesión activa
        if (
          user &&
          sessionStatus === 'authenticated' &&
          !attemptedRef.current
        ) {
          attemptedRef.current = true
          console.log('Attempting session restoration')

          try {
            const result = await dispatch(checkSessionUser()).unwrap()
            if (!result) {
              await dispatch(logoutUser('SESSION_EXPIRED'))
            }
          } catch (error) {
            console.error('Session restoration failed:', error)
            await dispatch(logoutUser('SESSION_ERROR'))
          }
        }
      }
    )

    return () => unsubscribe()
  }, [dispatch, user, user?.uid, sessionStatus])
}
