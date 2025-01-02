// app/translations/en/modules/management.ts

import { ManagementTranslations } from '@/translations/types/modules/management'

export const managementEN: ManagementTranslations = {
  title: 'Management',
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
