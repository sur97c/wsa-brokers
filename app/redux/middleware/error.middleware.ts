// app/redux/middleware/error.middleware.ts

import { Middleware } from '@reduxjs/toolkit'
import { ErrorLogger } from '@/utils/error-logger'

const errorLogger = ErrorLogger.getInstance()

export const errorMiddleware: Middleware = () => (next) => async (action) => {
  try {
    return await next(action)
  } catch (error) {
    // Log el error
    const normalizedError = errorLogger.normalizeError(error)
    errorLogger.logError(error)

    // Propagar el error normalizado
    return next({
      type: 'error/occurred',
      payload: normalizedError,
      error: true,
    })
  }
}
