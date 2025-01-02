// app/translations/es/index.ts

import { TranslationsConfig } from '@/translations/types'

import { commonES } from './core/common'
import { errorsES } from './core/errors'
import { validationES } from './core/validation'

import { headerES } from './modules/header'
import { userMenuES } from './modules/user-menu'
import { loginFormES } from './modules/login'
import { navigationES } from './modules/navigation'
import { authStateListenerES } from './modules/auth-state'
import { homeES } from './modules/home'
import { dashboardES } from './modules/dashboard'
import { managementES } from './modules/management'
import { advancedTableES } from './modules/advanced-table'
import {
  quotesES,
  policiesES,
  claimsES,
  paymentsES,
  clientsES,
  reportsES,
} from './modules/simple'
import { sessionES } from './core/session'
import { loadingES } from './core/loading'

export const esTranslations: TranslationsConfig = {
  core: {
    common: commonES,
    errors: errorsES,
    session: sessionES,
    validation: validationES,
    loading: loadingES,
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
