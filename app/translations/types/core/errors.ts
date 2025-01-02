// app/translations/types/core/errors.ts

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
  firebase: {
    auth: {
      'auth/user-disabled': string
      'auth/invalid-email': string
      'auth/user-not-found': string
      'auth/wrong-password': string
      'auth/email-already-in-use': string
      'auth/email-not-verified': string
      'auth/session-expired': string
      unknown: string
    }
    business: {
      USER_BLOCKED: string
      USER_DELETED: string
      USER_DISABLED: string
      EMAIL_NOT_VERIFIED: string
      USER_NOT_FOUND: string
      USER_NOT_FOUND_IN_DB: string
      unknown: string
    }
  }
}
