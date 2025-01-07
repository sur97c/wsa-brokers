// app/translations/en/modules/management.ts

import { SectionRole, UserRole } from '@/models/user/roles'
import { ManagementTranslations } from '@/translations/types/modules/management'

export const managementEN: ManagementTranslations = {
  title: 'Management',
  users: {
    edit: {
      title: 'Edit User',
    },
    fields: {
      email: 'Email',
      displayName: 'Display Name',
      primaryRole: 'Primary Role',
      name: 'Name',
      lastName: 'Last Name',
      sectionRoles: 'Section Roles',
      specialPermissions: 'Special Permissions',
    },
    permissions: {
      allowMultipleSessions: 'Allow multiple sessions',
      blocked: 'Blocked',
      disabled: 'Disabled',
    },
    editCreate: {
      title: 'Edit User',
      successMessage: 'User updated successfully',
      errorMessage: 'Error updating user',
    },
    buttons: {
      new: 'New',
      save: 'Save',
      cancel: 'Cancel',
    },
    list: {
      title: 'Users',
      addUser: 'Add User',
    },
  },
  roles: {
    [UserRole.SUPERADMIN]: 'Superadmin',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.BROKER]: 'Broker',
    [UserRole.CLIENT]: 'Client',
    sections: {
      [SectionRole.USER_MANAGEMENT]: 'User Management',
      [SectionRole.ROLE_MANAGEMENT]: 'Role Management',
      [SectionRole.SYSTEM_CONFIG]: 'System Config',
      [SectionRole.DASHBOARD]: 'Dashboard',
      [SectionRole.QUOTES]: 'Quotes',
      [SectionRole.POLICIES]: 'Policies',
      [SectionRole.CLAIMS]: 'Claims',
      [SectionRole.REPORTS]: 'Reports',
      [SectionRole.BROKER_PORTAL]: 'Broker Portal',
      [SectionRole.CLIENT_PORTAL]: 'Client Portal',
    },
  },
  advancedTable: {
    users: {
      columns: {
        uid: 'ID',
        email: 'Email',
        emailVerified: 'Verified',
        displayName: 'Display Name',
        name: 'Name',
        lastName: 'Last Name',
        createdAt: 'Created At',
        lastSignInTime: 'Last SignIn Time',
      },
      editCreate: {
        fields: {
          uid: 'ID',
          email: 'Email',
          emailVerified: 'Verified',
          emailNotVerified: 'Not verified',
          displayName: 'Display name',
          name: 'Name',
          lastName: 'Last name',
          createdAt: 'Creation at',
          lastSignInTime: 'Last access',
          status: 'Status',
        },
        dropDowns: {
          status: {
            active: 'Active',
            inactive: 'Inactive',
          },
        },
        edit: {
          title: 'Edit User',
          successMessage: 'User updated successfully',
          errorMessage: 'Error updating user',
        },
        create: {
          title: 'Create User',
          successMessage: 'User created successfully',
          errorMessage: 'Error creating user',
        },
        buttons: {
          save: 'Save',
          cancel: 'Cancel',
        },
      },
      tableOptions: {
        dataSource: 'Change to {{source}} Source',
        mock: 'Mock',
        real: 'Real',
        exportCsv: 'Export to CSV',
      },
      rowOptions: {
        edit: 'Edit',
        delete: 'Delete',
      },
    },
  },
}
