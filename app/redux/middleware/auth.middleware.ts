// app/redux/middleware/auth.middleware.ts

import { Middleware } from '@reduxjs/toolkit'
import { auth } from '@/firebase/firebase.client'
import { signOut } from 'firebase/auth'

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Si estamos haciendo logout, asegurarnos de limpiar Firebase Auth
  if (action.type === 'auth/logout/fulfilled') {
    signOut(auth).catch(console.error)
  }

  return next(action)
}
