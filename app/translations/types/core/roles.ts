// app/translations/types/core/roles.ts

import { UserRole } from '@/models/user/roles'

export interface UserRoleTranslation {
  name: string
  description: string
  section: string
  permissions?: string[]
  // Aquí podemos agregar más metadata según se necesite
  capabilities?: string[]
  accessLevel?: string
  defaultRoute?: string
}

export interface RoleTranslations {
  userRoles: {
    [key in UserRole]: UserRoleTranslation
  }
  sectionRoles?: {
    [key in UserRole]: UserRoleTranslation
  }
}
