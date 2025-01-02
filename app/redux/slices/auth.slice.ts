// app/redux/slices/auth.slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { UserProfile, UserCredentials, serializeUser } from '@/models/user/user'
import {
  loginAction,
  logoutAction,
  checkSessionAction,
  recoverAccessAction,
  resendVerificationAction,
  updateUserActivityAction,
} from '@/actions/auth/server'
import { BaseError } from '@/models/errors/base.error'
import type { AuthState } from './auth.types'
import { RoleKey, RoleKeys } from '@/utils/rolesDefinition'

interface StoreState {
  auth: {
    user: UserProfile | null
    lastActivitySync: number | null
  }
}

interface AuthError {
  code: string
  message: string
}

const validateRoles = (roles: string[]): RoleKey[] => {
  return roles.filter((role): role is RoleKey =>
    RoleKeys.includes(role as RoleKey)
  )
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionStatus: 'idle',
  customClaims: { roles: [] },
  lastActivitySync: null,
  logoutRequested: false,
} as AuthState

export const loginUser = createAsyncThunk<
  UserProfile,
  UserCredentials,
  {
    rejectValue: AuthError
  }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const result = await loginAction(credentials)
    if (!result.success) {
      return rejectWithValue({
        code: result.error?.code || 'UNKNOWN_ERROR',
        message: result.error?.message ?? 'Unknown error',
      })
    }
    return serializeUser(result.data as UserProfile)
  } catch (error: unknown) {
    return rejectWithValue(error as AuthError)
  }
})

export type LogoutReason =
  | 'USER_REQUESTED'
  | 'SESSION_EXPIRED'
  | 'NO_FIREBASE_USER'
  | 'SESSION_ERROR'

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (
    reason: LogoutReason = 'USER_REQUESTED',
    { getState, rejectWithValue }
  ) => {
    const state = getState() as StoreState
    const userId = state.auth.user?.uid

    if (!userId) {
      return rejectWithValue('No hay usuario autenticado')
    }

    try {
      console.log(`Iniciando logout - Razón: ${reason}`)
      const result = await logoutAction(userId)
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      return { reason }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const checkSessionUser = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const result = await checkSessionAction()

      if (!result.success) {
        return rejectWithValue({
          message: result.error?.message || 'Session check failed',
          code: result.error?.code || 'SESSION_ERROR',
        })
      }

      return serializeUser(result.data as UserProfile)
    } catch (error: unknown) {
      const baseError = error as BaseError
      return rejectWithValue({
        message: baseError.message,
        code: baseError.code || 'UNKNOWN_ERROR',
      })
    }
  }
)

export const recoverAccess = createAsyncThunk(
  'auth/recoverAccess',
  async (email: string, { rejectWithValue }) => {
    try {
      const result = await recoverAccessAction(email)
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      return result.success
    } catch (error: unknown) {
      const baseError = error as BaseError
      return rejectWithValue(baseError.message)
    }
  }
)

export const updateUserActivity = createAsyncThunk(
  'auth/updateActivity',
  async (force: boolean = false, { getState, rejectWithValue }) => {
    const state = getState() as StoreState
    const userId = state.auth.user?.uid
    const lastSync = state.auth.lastActivitySync

    if (!userId) {
      return rejectWithValue({
        code: 'NO_USER',
        message: 'No hay usuario autenticado',
      })
    }

    // Si no es forzado, verificar si ha pasado suficiente tiempo
    if (!force && lastSync) {
      const timeSinceLastSync = Date.now() - lastSync
      if (timeSinceLastSync < 5 * 60 * 1000) {
        // 5 minutos
        return null // No actualizar si no ha pasado suficiente tiempo
      }
    }

    // Actualizar la última actividad
    try {
      const result = await updateUserActivityAction(userId, true)
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      // return result.success
      return Date.now() // Retornar timestamp actual
    } catch (error: unknown) {
      const baseError = error as BaseError
      return rejectWithValue(baseError.message)
    }
  }
)

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (_, { rejectWithValue }) => {
    try {
      const result = await resendVerificationAction()
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      return result.success
    } catch (error: unknown) {
      const baseError = error as BaseError
      return rejectWithValue(baseError.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload ?? null
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
    },
    setError: (state, action: PayloadAction<BaseError>) => {
      state.error = action.payload
    },
    clearMessages: (state) => {
      state.error = null
      state.success = false
    },
    setLogoutRequested: (state, action: PayloadAction<boolean>) => {
      state.logoutRequested = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.logoutRequested = false
        state.loading = true
        state.error = null
        state.sessionStatus = 'checking'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.logoutRequested = false
        state.user = action.payload ?? null
        state.loading = false
        state.error = null
        state.isAuthenticated = true
        state.success = true
        state.sessionStatus = 'authenticated'
        state.customClaims = {
          roles: validateRoles(action.payload.roles || []),
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.logoutRequested = false
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.success = false
        state.error = action.payload as BaseError
        state.sessionStatus = 'unauthenticated'
      })

      // Check Session
      .addCase(checkSessionUser.pending, (state) => {
        state.sessionStatus = 'checking'
        state.error = null
      })
      .addCase(checkSessionUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload
        state.sessionStatus = 'authenticated'
        state.error = null
        state.customClaims = {
          roles: validateRoles(action.payload.roles || []),
        }
      })
      .addCase(checkSessionUser.rejected, (state, action) => {
        state.user = null
        state.isAuthenticated = false
        state.sessionStatus = 'unauthenticated'
        state.error = action.payload as BaseError
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutRequested = false
        state.user = null
        state.isAuthenticated = false
        state.success = true
        state.sessionStatus = 'unauthenticated'
      })

      // Recover Access
      .addCase(recoverAccess.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(recoverAccess.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(recoverAccess.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as BaseError
        state.success = false
      })

      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as BaseError
        state.success = false
      })

      .addCase(updateUserActivity.fulfilled, (state, action) => {
        if (action.payload) {
          // Si hay payload, actualizar timestamp
          state.lastActivitySync = action.payload
        }
        if (state.user) {
          state.user.lastActivity = new Date().toISOString()
        }
      })
  },
})

export const {
  setUser,
  clearUser,
  setError,
  clearMessages,
  setLogoutRequested,
} = authSlice.actions
export default authSlice.reducer
