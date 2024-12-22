// app/hooks/translations/Translations.ts

// import { TableTranslations } from '@/components/advanced-table/advancedTableDefinition'

export interface ManagementTranslations {
  title: string
  advancedTable: {
    users: TableTranslationBase
    [key: string]: TableTranslationBase
  }
}

export interface CommonTranslations {
  loading: string
  error: string
}

export interface HeaderTranslations {
  title: string
  menu: Record<string, string>
  welcome: string
  showLogin: string
  closingSession: string
  closeLogin: string
}

export interface UserMenuTranslations {
  editProfile: string
  setup: string
  dashboardsSettings: string
  notifications: string
  language: string
  spanishLanguage: string
  englishLanguage: string
  theme: string
  showKPIsHome: string
}

export interface LoginFormTranslations {
  email: string
  password: string
  rememberMe: string
  recoveryAccess: string
  recoveryAccessInfo: string
  emailToRecoveryAccess: string
  signingIn: string
  signIn: string
  sendingEmail: string
  sendEmail: string
}

export interface NavigationTranslations {
  title: string
  dataSource: string
  mock: string
  real: string
  home: string
  dashboard: string
  quotes: string
  policies: string
  claims: string
  payments: string
  clients: string
  management: string
  reports: string
}

export interface AuthStateListenerTranslations {
  title: string
  message: string
  extendSession: string
  closeSession: string
}

export interface HomeTranslations {
  title: string
  spanish: string
  english: string
  welcome: string
  message: string
  login: string
  cards: Array<{
    title: string
    description: string
  }>
}

export interface DashboardTranslations {
  title: string
  kpis: Record<
    string,
    {
      title: string
      trend: string
    }
  >
  gauges: Record<
    string,
    {
      name: string
      description: string
    }
  >
  charts: Record<
    string,
    {
      title: string
      tooltip?: string
      types?: Record<string, string>
    }
  >
  common: {
    vsLastMonth: string
    months: Record<string, string>
    weekdays: Record<string, string>
  }
  userActivity: {
    title: string
    subtitle: string
    activeUsers: string
  }
  userStats: Record<
    string,
    {
      title: string
      description: string
      [key: string]: string
    }
  >
}

export interface ValidationTranslations {
  required: string
  invalidEmail: string
  minLength: string
  maxLength: string
  invalidFormat: string
  passwordMismatch: string
  uniqueValue: string
  invalidNumber: string
  invalidDate: string
  futureDate: string
  pastDate: string
}

export interface ErrorTranslations {
  notFound: {
    title: string
    message: string
  }
  genericError: {
    title: string
    message: string
  }
  systemError: {
    title: string
    message: string
  }
  back: string
  home: string
}

export interface TableTranslationBase {
  columns: Record<string, string>
  editCreate: {
    fields: Record<string, string>
    dropDowns: Record<string, Record<string, string>>
    edit: {
      title: string
      successMessage: string
      errorMessage: string
    }
    create: {
      title: string
      successMessage: string
      errorMessage: string
    }
    buttons: {
      save: string
      cancel: string
    }
  }
  rowOptions?: Record<string, string>
  tableOptions?: Record<string, string>
}

export type ModuleWithTableKey = 'management'

export interface KeyTranslations {
  [key: string]: string
}

// export interface Translations {
//   common: CommonTranslations
//   header: HeaderTranslations
//   userMenu: UserMenuTranslations
//   loginForm: LoginFormTranslations
//   navigation: NavigationTranslations
//   authStateListener: AuthStateListenerTranslations
//   home: HomeTranslations
//   dashboard: DashboardTranslations
//   quotes: { title: string }
//   policies: { title: string }
//   claims: { title: string }
//   payments: { title: string }
//   clients: { title: string }
//   management: ManagementTranslations
//   reports: { title: string }
//   //   advancedTable: TableTranslations
//   validation: ValidationTranslations
//   errors: ErrorTranslations
//   [key: string]:
//     | KeyTranslations
//     | ManagementTranslations
//     | CommonTranslations
//     | HeaderTranslations
//     | UserMenuTranslations
//     | LoginFormTranslations
//     | NavigationTranslations
//     | AuthStateListenerTranslations
//     | HomeTranslations
//     | DashboardTranslations
//     | ValidationTranslations
//     | ErrorTranslations
// }

export interface TranslationsType {
  header: HeaderTranslations
  userMenu: UserMenuTranslations
  loginForm: LoginFormTranslations
  navigation: NavigationTranslations
  authStateListener: AuthStateListenerTranslations
  home: HomeTranslations
  dashboard: DashboardTranslations
  quotes: { title: string }
  policies: { title: string }
  claims: { title: string }
  payments: { title: string }
  clients: { title: string }
  management: ManagementTranslations
  reports: { title: string }
  validation: ValidationTranslations
  errors: ErrorTranslations
  [key: string]:
    | KeyTranslations
    | ManagementTranslations
    | CommonTranslations
    | HeaderTranslations
    | UserMenuTranslations
    | LoginFormTranslations
    | NavigationTranslations
    | AuthStateListenerTranslations
    | HomeTranslations
    | DashboardTranslations
    | ValidationTranslations
    | ErrorTranslations
    | { title: string }
}
