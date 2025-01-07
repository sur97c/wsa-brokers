// app/redux/types.ts

import type { AuthState } from './slices/auth.types'
import { store } from './store'

export interface RootState {
  auth: AuthState
  // ... otros estados
}
// export type RootState = ReturnType<(typeof store)['getState']>
export type AppDispatch = (typeof store)['dispatch']
