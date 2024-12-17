import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authReducer from './slices/authSlice'

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
}

// Reducers combinados
const rootReducer = combineReducers({
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configuración del store con ajuste del middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Configuración de persistencia
export const persistor = persistStore(store)

// Tipos para el store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
