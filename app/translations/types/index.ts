// app/translations/types/index.ts
import { CoreTranslations } from './core'
import { ModuleTranslations } from './modules'

export interface TranslationsConfig {
  core: CoreTranslations
  modules: ModuleTranslations
}
