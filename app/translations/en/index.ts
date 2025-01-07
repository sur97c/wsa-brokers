// app/translations/en/index.ts

import { TranslationsConfig } from '@/translations/types'

import { commonEN } from './core/common'
import { errorsEN } from './core/errors'
import { loadingEN } from './core/loading'
import { rolesEN } from './core/roles'
import { sessionEN } from './core/session'
import { validationEN } from './core/validation'
import { advancedTableEN } from './modules/advanced-table'
import { authStateListenerEN } from './modules/auth-state'
import { dashboardEN } from './modules/dashboard'
import { headerEN } from './modules/header'
import { homeEN } from './modules/home'
import { loginFormEN } from './modules/login'
import { managementEN } from './modules/management'
import { navigationEN } from './modules/navigation'
import {
  quotesEN,
  policiesEN,
  claimsEN,
  paymentsEN,
  clientsEN,
  reportsEN,
} from './modules/simple'
import { userMenuEN } from './modules/user-menu'

export const enTranslations: TranslationsConfig = {
  core: {
    common: commonEN,
    errors: errorsEN,
    session: sessionEN,
    validation: validationEN,
    loading: loadingEN,
    roles: rolesEN,
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
