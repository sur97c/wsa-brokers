// app/translations/es/index.ts

import { TranslationsConfig } from '@/translations/types'

import { commonES } from './core/common'
import { errorsES } from './core/errors'
import { loadingES } from './core/loading'
import { rolesES } from './core/roles'
import { sessionES } from './core/session'
import { validationES } from './core/validation'
import { advancedTableES } from './modules/advanced-table'
import { authStateListenerES } from './modules/auth-state'
import { dashboardES } from './modules/dashboard'
import { headerES } from './modules/header'
import { homeES } from './modules/home'
import { loginFormES } from './modules/login'
import { managementES } from './modules/management'
import { navigationES } from './modules/navigation'
import {
  quotesES,
  policiesES,
  claimsES,
  paymentsES,
  clientsES,
  reportsES,
} from './modules/simple'
import { userMenuES } from './modules/user-menu'

export const esTranslations: TranslationsConfig = {
  core: {
    common: commonES,
    errors: errorsES,
    session: sessionES,
    validation: validationES,
    loading: loadingES,
    roles: rolesES,
  },
  modules: {
    header: headerES,
    userMenu: userMenuES,
    loginForm: loginFormES,
    navigation: navigationES,
    authStateListener: authStateListenerES,
    home: homeES,
    dashboard: dashboardES,
    management: managementES,
    advancedTable: advancedTableES,
    quotes: quotesES,
    policies: policiesES,
    claims: claimsES,
    payments: paymentsES,
    clients: clientsES,
    reports: reportsES,
  },
}
