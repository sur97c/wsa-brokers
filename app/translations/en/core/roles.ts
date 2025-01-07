// app/translations/en/core/roles.ts

import { UserRole } from '@/models/user/roles'
import { RoleTranslations } from '@/translations/types/core/roles'

export const rolesEN: RoleTranslations = {
  userRoles: {
    [UserRole.SUPERADMIN]: {
      name: 'Superadmin',
      description: 'Full system access',
      section: 'System Administration',
      defaultRoute: '/dashboard',
      capabilities: [
        'Complete system management',
        'Global configuration',
        'Role administration',
      ],
    },
    [UserRole.ADMIN]: {
      name: 'Admin',
      description: 'User and settings management',
      section: 'Administration',
      defaultRoute: '/management',
      capabilities: [
        'User management',
        'System settings',
        'Administrative reports',
      ],
    },
    [UserRole.BROKER]: {
      name: 'Broker',
      description: 'Policy and client management',
      section: 'Operations',
      defaultRoute: '/clients',
      capabilities: [
        'Policy management',
        'Client support',
        'Operational reports',
      ],
    },
    [UserRole.CLIENT]: {
      name: 'Client',
      description: 'Access to own policies',
      section: 'Client Portal',
      defaultRoute: '/policies',
      capabilities: [
        'Policy visualization',
        'Service requests',
        'Payment history',
      ],
    },
  },
}
