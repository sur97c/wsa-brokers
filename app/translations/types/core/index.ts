// app/translations/types/core/index.ts

import { CommonTranslations } from './common'
import { ValidationTranslations } from './validation'
import { ErrorTranslations } from './errors'
import type { SessionTranslations } from './session'
import type { LoadingTranslations } from './loading'

export interface CoreTranslations {
  common: CommonTranslations
  validation: ValidationTranslations
  session: SessionTranslations
  errors: ErrorTranslations
  loading: LoadingTranslations
}
