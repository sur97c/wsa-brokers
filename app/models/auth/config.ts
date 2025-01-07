// app/models/auth/config.ts

export interface RolesSyncConfig {
  sourceOfTruth: 'firestore' | 'firebase'
}

export interface UserRoles {
  sectionRoles: string[]
  primaryRole: string
}
