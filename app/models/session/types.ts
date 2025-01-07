// app/models/session/types.ts

export interface ValidSessionResponse {
  valid: true
  data: {
    roles: {
      primaryRole: string
      sectionRoles: string[]
    }
    userId: string
    isOnline: boolean
    lastActivity: string
  }
}

export interface InvalidSessionResponse {
  valid: false
  error: {
    message: string
    code: string
  }
}

export type SessionResponse = ValidSessionResponse | InvalidSessionResponse
