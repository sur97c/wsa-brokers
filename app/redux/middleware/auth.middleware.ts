// app/redux/middleware/auth.middleware.ts

import { Middleware } from '@reduxjs/toolkit'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebase.client'

export const authMiddleware: Middleware = () => (next) => (action) => {
  // Si estamos haciendo logout, asegurarnos de limpiar Firebase Auth
  if (
    (action as unknown as { type: string }).type === 'auth/logout/fulfilled'
  ) {
    signOut(auth).catch(console.error)
  }

  return next(action)
}
