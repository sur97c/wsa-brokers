// // app/middleware/redux/logging.middleware.ts

// import { Middleware } from '@reduxjs/toolkit'
// import { Logger } from '@/utils/logger/logger'
// import { LogLevel } from '@/utils/logger/types'

// const logger = Logger.getInstance()

// export const loggingMiddleware: Middleware = (store) => (next) => (action) => {
//   // Obtener userId y sessionId del estado si están disponibles
//   const state = store.getState()
//   const userId = state.auth?.user?.uid
//   const sessionId = state.auth?.user?.sessionId

//   // Log antes de la acción
//   logger.log({
//     timestamp: new Date(),
//     level: LogLevel.INFO,
//     message: `Action Dispatched: ${action.type}`,
//     context: {
//       action: action.type,
//       payload: action.payload,
//     },
//     userId,
//     sessionId,
//   })

//   // Ejecutar la acción
//   const result = next(action)

//   // Log después de la acción
//   const newState = store.getState()
//   logger.log({
//     timestamp: new Date(),
//     level: LogLevel.DEBUG,
//     message: `State Updated: ${action.type}`,
//     context: {
//       action: action.type,
//       changedState: getDiff(state, newState),
//     },
//     userId,
//     sessionId,
//   })

//   return result
// }

// // Utilidad para detectar cambios en el estado
// function getDiff(
//   prevState: unknown,
//   newState: unknown
// ): Record<string, unknown> {
//   const diff: Record<string, unknown> = {}

//   if (
//     typeof prevState === 'object' &&
//     typeof newState === 'object' &&
//     prevState !== null &&
//     newState !== null
//   ) {
//     for (const key in newState) {
//       if (prevState[key as keyof typeof prevState] !== newState[key]) {
//         diff[key] = newState[key]
//       }
//     }
//   }

//   return diff
// }
