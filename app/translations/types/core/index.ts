// app/translations/types/core/index.ts

import { CommonTranslations } from './common'
import { ErrorTranslations } from './errors'
import type { LoadingTranslations } from './loading'
import type { RoleTranslations } from './roles'
import type { SessionTranslations } from './session'
import { ValidationTranslations } from './validation'

export interface CoreTranslations {
  common: CommonTranslations
  validation: ValidationTranslations
  session: SessionTranslations
  errors: ErrorTranslations
  loading: LoadingTranslations
  roles: RoleTranslations
}
