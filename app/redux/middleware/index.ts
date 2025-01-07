// app/middleware/redux/index.ts

import { authMiddleware } from './auth.middleware'
import { errorMiddleware } from './error.middleware'

export const reduxMiddleware = [
  errorMiddleware,
  authMiddleware,
  // otros middleware...
]
