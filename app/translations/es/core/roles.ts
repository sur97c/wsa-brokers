// app/translations/es/core/roles.ts

import { UserRole } from '@/models/user/roles'
import { RoleTranslations } from '@/translations/types/core/roles'

export const rolesES: RoleTranslations = {
  userRoles: {
    [UserRole.SUPERADMIN]: {
      name: 'Super Administrador',
      description: 'Acceso total al sistema',
      section: 'Administración del Sistema',
      defaultRoute: '/dashboard',
      capabilities: [
        'Gestión completa del sistema',
        'Configuración global',
        'Administración de roles',
      ],
    },
    [UserRole.ADMIN]: {
      name: 'Administrador',
      description: 'Gestión de usuarios y configuraciones',
      section: 'Administración',
      defaultRoute: '/management',
      capabilities: [
        'Gestión de usuarios',
        'Configuraciones del sistema',
        'Reportes administrativos',
      ],
    },
    [UserRole.BROKER]: {
      name: 'Agente',
      description: 'Gestión de pólizas y clientes',
      section: 'Operaciones',
      defaultRoute: '/clients',
      capabilities: [
        'Gestión de pólizas',
        'Atención a clientes',
        'Reportes operativos',
      ],
    },
    [UserRole.CLIENT]: {
      name: 'Cliente',
      description: 'Acceso a pólizas propias',
      section: 'Portal Cliente',
      defaultRoute: '/policies',
      capabilities: [
        'Visualización de pólizas',
        'Solicitud de servicios',
        'Historial de pagos',
      ],
    },
  },
}
