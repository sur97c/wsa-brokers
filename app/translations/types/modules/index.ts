// app/translations/types/modules/index.ts
import { AdvancedTableTranslations } from './advanced-table'
import { AuthStateListenerTranslations } from './auth-state'
import { DashboardTranslations } from './dashboard'
import { HeaderTranslations } from './header'
import { HomeTranslations } from './home'
import { LoginFormTranslations } from './login'
import { ManagementTranslations } from './management'
import { NavigationTranslations } from './navigation'
import { SimpleModuleTranslation } from './simple'
import { UserMenuTranslations } from './user-menu'

export interface ModuleTranslations {
  header: HeaderTranslations
  userMenu: UserMenuTranslations
  loginForm: LoginFormTranslations
  navigation: NavigationTranslations
  authStateListener: AuthStateListenerTranslations
  home: HomeTranslations
  dashboard: DashboardTranslations
  management: ManagementTranslations
  advancedTable: AdvancedTableTranslations
  quotes: SimpleModuleTranslation
  policies: SimpleModuleTranslation
  claims: SimpleModuleTranslation
  payments: SimpleModuleTranslation
  clients: SimpleModuleTranslation
  reports: SimpleModuleTranslation
}
