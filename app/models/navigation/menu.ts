// app/models/navigation/menu.ts

import { SectionRole } from '@/models/user/roles'

// Keys para la navegación del menú
export const NavigationKeys = [
  'home',
  'dashboard',
  'quotes',
  'policies',
  'claims',
  'payments',
  'clients',
  'management',
  'reports',
] as const

export type NavigationKey = (typeof NavigationKeys)[number]

export interface MenuItem {
  key: NavigationKey
  menuLabel: string
  label: string
  sectionRole: SectionRole // Vinculación con los roles de sección
  requiredPermissions?: {
    read: boolean
  }
}

export function getMenuItems(t: (key: string) => string): MenuItem[] {
  return NavigationKeys.map((key) => ({
    key,
    menuLabel: t(`navigation.${key}`),
    label: key === 'home' ? '' : t(`navigation.${key}`),
    sectionRole: mapNavigationToSectionRole(key),
    requiredPermissions: {
      read: true, // Por defecto solo requerimos permiso de lectura para ver el menú
    },
  }))
}

// Función helper para mapear NavigationKey a SectionRole
function mapNavigationToSectionRole(key: NavigationKey): SectionRole {
  const mappings: Partial<Record<NavigationKey, SectionRole>> = {
    dashboard: SectionRole.DASHBOARD,
    quotes: SectionRole.QUOTES,
    policies: SectionRole.POLICIES,
    claims: SectionRole.CLAIMS,
    payments: SectionRole.PAYMENTS,
    clients: SectionRole.CLIENT_PORTAL,
    management: SectionRole.USER_MANAGEMENT,
    reports: SectionRole.REPORTS,
  }

  return mappings[key] || SectionRole.DASHBOARD
}
