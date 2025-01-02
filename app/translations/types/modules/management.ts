// app/translations/types/modules/management.ts

import { TableTranslationBase } from './table'

export interface ManagementTranslations {
  title: string
  advancedTable: {
    users: TableTranslationBase
    [key: string]: TableTranslationBase
  }
}
