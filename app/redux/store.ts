// app/redux/store.ts

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import { reduxMiddleware } from '@/redux/middleware'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth.slice'
import noopStorage from './noopStorage'

const isClient = typeof window !== 'undefined'

const isLocalStorageAvailable = () => {
  if (!isClient) return false

  try {
    const testKey = '__test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    console.warn('Local storage is not available', e)
    return false
  }
}

const persistConfig = {
  key: 'root',
  storage: isClient && isLocalStorageAvailable() ? storage : noopStorage,
  // Podemos agregar configuraciones adicionales aquí
  whitelist: ['auth'], // Solo persistir el estado de autenticación
}

const rootReducer = combineReducers({
  auth: authReducer,
  // Otros reducers aquí
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(reduxMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)
