// app/translations/types/modules/index.ts
import { HeaderTranslations } from './header'
import { UserMenuTranslations } from './user-menu'
import { LoginFormTranslations } from './login'
import { NavigationTranslations } from './navigation'
import { AuthStateListenerTranslations } from './auth-state'
import { HomeTranslations } from './home'
import { DashboardTranslations } from './dashboard'
import { ManagementTranslations } from './management'
import { AdvancedTableTranslations } from './advanced-table'
import { SimpleModuleTranslation } from './simple'

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
