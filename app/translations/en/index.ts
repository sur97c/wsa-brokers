// app/translations/en/index.ts

import { TranslationsConfig } from '@/translations/types'

import { commonEN } from './core/common'
import { errorsEN } from './core/errors'
import { validationEN } from './core/validation'

import { headerEN } from './modules/header'
import { userMenuEN } from './modules/user-menu'
import { loginFormEN } from './modules/login'
import { navigationEN } from './modules/navigation'
import { authStateListenerEN } from './modules/auth-state'
import { homeEN } from './modules/home'
import { dashboardEN } from './modules/dashboard'
import { managementEN } from './modules/management'
import { advancedTableEN } from './modules/advanced-table'
import {
  quotesEN,
  policiesEN,
  claimsEN,
  paymentsEN,
  clientsEN,
  reportsEN,
} from './modules/simple'
import { sessionEN } from './core/session'
import { loadingEN } from './core/loading'

export const enTranslations: TranslationsConfig = {
  core: {
    common: commonEN,
    errors: errorsEN,
    session: sessionEN,
    validation: validationEN,
    loading: loadingEN,
  },
  modules: {
    header: headerEN,
    userMenu: userMenuEN,
    loginForm: loginFormEN,
    navigation: navigationEN,
    authStateListener: authStateListenerEN,
    home: homeEN,
    dashboard: dashboardEN,
    management: managementEN,
    advancedTable: advancedTableEN,
    quotes: quotesEN,
    policies: policiesEN,
    claims: claimsEN,
    payments: paymentsEN,
    clients: clientsEN,
    reports: reportsEN,
  },
}
