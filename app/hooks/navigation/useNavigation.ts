// hooks/navigation/useNavigation.ts

import { useMemo } from 'react'

import { MenuItem, NavigationKeys } from '@/models/navigation/menu'
import { RolePermissions, SectionRole } from '@/models/user/roles'
import { useAppSelector } from '@/redux/hooks'
import { useTranslations } from '@/translations/hooks/useTranslations'

export function useNavigation() {
  const { translations } = useTranslations()
  const { user } = useAppSelector((state) => state.auth)

  const menuItems = useMemo<MenuItem[]>(() => {
    return NavigationKeys.map((key) => {
      const item: MenuItem = {
        key,
        menuLabel: translations.modules.navigation[key],
        label: translations.modules.navigation[key],
        sectionRole: mapKeyToSectionRole(key),
      }

      // TO REVIEW: Si hay un usuario y el item tiene un rol de sección asociado
      // verificamos los permisos
      if (user?.primaryRole && item.sectionRole) {
        item.requiredPermissions = {
          read: true, // RolePermissions[user.primaryRole][item.sectionRole].read,
        }
      }

      return item
    })
  }, [translations]) //, user?.primaryRole

  // Filtramos los items según los permisos del usuario
  const authorizedMenuItems = useMemo(() => {
    if (!user) return []

    return menuItems.filter((item) => {
      // Si no tiene sectionRole, es público (como home)
      if (!item.sectionRole) return true

      // Si tiene permisos requeridos, verificamos
      if (item.requiredPermissions) {
        return item.requiredPermissions.read
      }

      return false
    })
  }, [menuItems, user])

  return {
    menuItems: authorizedMenuItems,
    // Helper functions
    isItemVisible: (sectionRole: SectionRole) => {
      if (!user?.primaryRole) return false
      return true
      console.log(sectionRole)
      // return RolePermissions[user.primaryRole][sectionRole].read
    },
    hasPermission: (
      sectionRole: SectionRole,
      permission: keyof (typeof RolePermissions)[keyof typeof RolePermissions][SectionRole]
    ) => {
      if (!user?.primaryRole) return false
      return true
      console.log(sectionRole, permission)
      // return RolePermissions[user.primaryRole][sectionRole][permission]
    },
  }
}

// Helper function para mapear keys de navegación a roles de sección
function mapKeyToSectionRole(
  key: (typeof NavigationKeys)[number]
): SectionRole {
  const map: Partial<Record<(typeof NavigationKeys)[number], SectionRole>> = {
    dashboard: SectionRole.DASHBOARD,
    quotes: SectionRole.QUOTES,
    policies: SectionRole.POLICIES,
    claims: SectionRole.CLAIMS,
    payments: SectionRole.PAYMENTS,
    clients: SectionRole.CLIENTS,
    management: SectionRole.USER_MANAGEMENT,
    reports: SectionRole.REPORTS,
  }

  return map[key] || SectionRole.DASHBOARD
}
