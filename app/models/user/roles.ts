// app/models/user/roles.ts

// Roles principales (jerárquicos)
export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  BROKER = 'broker',
  CLIENT = 'client',
}

// Roles por modulo
export enum ModuleRole {
  DASHBOARD = 'dashboard',
  QUOTES = 'quotes',
  PAYMENTS = 'payments',
  POLICIES = 'policies',
  CLAIMS = 'claims',
  CLIENTS = 'clients',
  MANAGEMENT = 'management',
  REPORTS = 'reports',
}

// Roles por sección (permisos de acceso)
export enum SectionRole {
  // Secciones de Administración
  USER_MANAGEMENT = 'user_management',
  ROLE_MANAGEMENT = 'role_management',
  SYSTEM_CONFIG = 'system_config',
  // Secciones de Negocio
  DASHBOARD = 'dashboard',
  QUOTES = 'quotes',
  PAYMENTS = 'payments',
  POLICIES = 'policies',
  CLAIMS = 'claims',
  CLIENTS = 'clients',
  REPORTS = 'reports',
  // Otras secciones específicas
  BROKER_PORTAL = 'broker_portal',
  CLIENT_PORTAL = 'client_portal',
}

// Definición de acceso a secciones por rol
export const RoleAccess: Record<UserRole, SectionRole[]> = {
  [UserRole.SUPERADMIN]: Object.values(SectionRole),
  [UserRole.ADMIN]: Object.values(SectionRole).filter(
    (role) =>
      role !== SectionRole.ROLE_MANAGEMENT && role !== SectionRole.SYSTEM_CONFIG
  ),
  [UserRole.BROKER]: [
    SectionRole.DASHBOARD,
    SectionRole.BROKER_PORTAL,
    SectionRole.QUOTES,
    SectionRole.POLICIES,
    SectionRole.PAYMENTS,
    SectionRole.CLAIMS,
    SectionRole.CLIENTS,
    SectionRole.REPORTS,
  ],
  [UserRole.CLIENT]: [
    SectionRole.CLIENT_PORTAL,
    SectionRole.QUOTES,
    SectionRole.POLICIES, // Solo verá sus propias pólizas
  ],
}

// Permisos específicos por sección
export interface SectionPermissions {
  read: boolean
  create: boolean
  update: boolean
  delete: boolean
  approve?: boolean // Para secciones que requieren aprobación
  assign?: boolean // Para asignación de recursos
}

// Matriz de permisos por rol y sección
export const RolePermissions: Record<
  UserRole,
  Record<SectionRole, SectionPermissions>
> = {
  [UserRole.SUPERADMIN]: {
    // Secciones de Administración - Acceso total
    [SectionRole.USER_MANAGEMENT]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.ROLE_MANAGEMENT]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.SYSTEM_CONFIG]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    // Secciones de Negocio - Acceso total
    [SectionRole.DASHBOARD]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.QUOTES]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.PAYMENTS]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.POLICIES]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.CLAIMS]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.CLIENTS]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.REPORTS]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.BROKER_PORTAL]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
    [SectionRole.CLIENT_PORTAL]: {
      read: true,
      create: true,
      update: true,
      delete: true,
      approve: true,
      assign: true,
    },
  },
  [UserRole.ADMIN]: {
    // Secciones de Administración - Sin acceso a role_management y [SectionRole.SYSTEM_CONFIG]
    [SectionRole.USER_MANAGEMENT]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.ROLE_MANAGEMENT]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.SYSTEM_CONFIG]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    // Secciones de Negocio - Acceso casi total
    [SectionRole.DASHBOARD]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.QUOTES]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.PAYMENTS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.POLICIES]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.CLAIMS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.CLIENTS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.REPORTS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.BROKER_PORTAL]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: true,
      assign: true,
    },
    [SectionRole.CLIENT_PORTAL]: {
      read: true,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
  },
  [UserRole.BROKER]: {
    // Sin acceso a secciones administrativas
    [SectionRole.USER_MANAGEMENT]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.ROLE_MANAGEMENT]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.SYSTEM_CONFIG]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    // Acceso limitado a secciones de negocio
    [SectionRole.DASHBOARD]: {
      read: true,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.QUOTES]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.PAYMENTS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.POLICIES]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.CLAIMS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.CLIENTS]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.REPORTS]: {
      read: true,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.BROKER_PORTAL]: {
      read: true,
      create: true,
      update: true,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.CLIENT_PORTAL]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
  },
  [UserRole.CLIENT]: {
    // Sin acceso a secciones administrativas
    user_management: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    role_management: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.SYSTEM_CONFIG]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    // Acceso muy limitado a secciones de negocio
    [SectionRole.DASHBOARD]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.QUOTES]: {
      read: true,
      create: true,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.PAYMENTS]: {
      read: true,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.POLICIES]: {
      read: true,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.CLAIMS]: {
      read: true,
      create: true,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.CLIENTS]: {
      read: true,
      create: true,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.REPORTS]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.BROKER_PORTAL]: {
      read: false,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
    [SectionRole.CLIENT_PORTAL]: {
      read: true,
      create: false,
      update: false,
      delete: false,
      approve: false,
      assign: false,
    },
  },
}

export type UserRoleAssignment = {
  primaryRole: UserRole
  sectionRoles: SectionRole[]
}

export interface RoleManagementConfig {
  allowedPrimaryRoles: UserRole[]
  allowedSectionRoles: Record<UserRole, SectionRole[]>
}
