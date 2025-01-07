// app/redux/slices/auth.slice.ts

import {
  createSlice,
  createSelector,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit'
import {
  loginAction,
  logoutAction,
  checkSessionAction,
  recoverAccessAction,
  resendVerificationAction,
  updateUserActivityAction,
} from '@/actions/auth/server'
import { BaseError } from '@/models/errors/base.error'
import { UserRole, SectionRole } from '@/models/user/roles'
import type { SerializedUserProfile, SessionMetrics } from '@/models/user/types'
import { UserProfile, UserCredentials } from '@/models/user/user'
import type { RootState } from '@/redux/types'
import type { AuthState } from './auth.types'

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

const serializeUser = (user: UserProfile): SerializedUserProfile => {
  return {
    ...user,
    primaryRole: user.primaryRole.toString(),
    sectionRoles: user.sectionRoles.map((role) => role.toString()),
    lastLogin: user.lastLogin?.toISOString(),
    lastActivity: user.lastActivity?.toISOString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    createdBy: user.createdBy,
    updatedBy: user.updatedBy,
    sessionMetrics: user.sessionMetrics
      ? {
          ...user.sessionMetrics,
          lastSessionCreated:
            user.sessionMetrics.lastSessionCreated?.toISOString(),
        }
      : undefined,
  }
}

const selectAuthState = (state: RootState) => state.auth

const selectUser = createSelector([selectAuthState], (auth: AuthState) => {
  if (!auth.user) return null

  const user = auth.user
  return {
    uid: user.uid as string,
    email: user.email as string,
    emailVerified: user.emailVerified as boolean,
    isOnline: user.isOnline as boolean,
    displayName: user.displayName as string,
    name: user.name as string,
    lastName: user.lastName as string,
    blocked: user.blocked as boolean,
    disabled: user.disabled as boolean,
    deleted: user.deleted as boolean,
    allowMultipleSessions: user.allowMultipleSessions as boolean,
    primaryRole: user.primaryRole as UserRole,
    sectionRoles: user.sectionRoles.map((role) => role as SectionRole),
    lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    lastActivity: user.lastActivity ? new Date(user.lastActivity) : undefined,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    createdBy: user.createdBy ? user.createdBy : undefined,
    updatedBy: user.updatedBy ? user.updatedBy : undefined,
    sessionId: user.sessionId as string,
    sessionMetrics: user.sessionMetrics as SessionMetrics,
    activeSessions: user.activeSessions as number,
    lastSessionCreated: user.lastSessionCreated
      ? new Date(user.lastSessionCreated)
      : undefined,
    totalHistoricalSessions: user.totalHistoricalSessions as number,
    metadata: user.metadata as Record<string, unknown>,
  }
})

export const selectAuthView = createSelector(
  [selectAuthState],
  (auth: AuthState) => ({
    user: selectUser({ auth } as RootState),
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    sessionStatus: auth.sessionStatus,
    success: auth.success,
    logoutRequested: auth.logoutRequested,
    lastActivitySync: auth.lastActivitySync,
    customClaims: auth.customClaims,
  })
)

export const loginUser = createAsyncThunk<
  SerializedUserProfile,
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
    console.log('Data before serialization:', result.data)
    const serializedUser = serializeUser(result.data as UserProfile)
    console.log('Data after serialization:', serializedUser)
    return serializedUser
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
      state.user = serializeUser(action.payload)
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
        state.user = action.payload
        state.loading = false
        state.error = null
        state.isAuthenticated = true
        state.success = true
        state.sessionStatus = 'authenticated'
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
          state.lastActivitySync = action.payload
          // Asegurarnos de guardar la fecha como string ISO
          if (state.user) {
            state.user.lastActivity = new Date().toISOString()
          }
        }
      })
  },
})

// export const selectAuth = (state: RootState) => ({
//   loading: state.auth.loading,
//   error: state.auth.error,
//   user: selectUser(state),
//   isAuthenticated: state.auth.isAuthenticated,
// })

export const {
  setUser,
  clearUser,
  setError,
  clearMessages,
  setLogoutRequested,
} = authSlice.actions
export default authSlice.reducer
