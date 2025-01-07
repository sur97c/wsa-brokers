// app/translations/types/modules/management.ts

import type { SectionRole, UserRole } from '@/models/user/roles'

import { TableTranslationBase } from './table'

export interface ManagementTranslations {
  title: string
  users: {
    edit: {
      title: string
    }
    fields: {
      email: string
      displayName: string
      primaryRole: string
      name: string
      lastName: string
      sectionRoles: string
      specialPermissions: string
    }
    permissions: {
      allowMultipleSessions: string
      blocked: string
      disabled: string
    }
    editCreate: {
      title: string
      successMessage: string
      errorMessage: string
    }
    buttons: {
      new: string
      save: string
      cancel: string
    }
    list: {
      title: string
      addUser: string
    }
  }
  roles: {
    [UserRole.SUPERADMIN]: string
    [UserRole.ADMIN]: string
    [UserRole.BROKER]: string
    [UserRole.CLIENT]: string
    sections: {
      [SectionRole.USER_MANAGEMENT]: string
      [SectionRole.ROLE_MANAGEMENT]: string
      [SectionRole.SYSTEM_CONFIG]: string
      [SectionRole.DASHBOARD]: string
      [SectionRole.QUOTES]: string
      [SectionRole.POLICIES]: string
      [SectionRole.CLAIMS]: string
      [SectionRole.REPORTS]: string
      [SectionRole.BROKER_PORTAL]: string
      [SectionRole.CLIENT_PORTAL]: string
    }
  }
  advancedTable: {
    users: TableTranslationBase
    [key: string]: TableTranslationBase
  }
}
