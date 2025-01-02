// hooks/auth/useRoles.ts

import { useMemo } from 'react'
import { useTranslations } from '@/translations/hooks/useTranslations'
import type { RoleType } from '@/utils/rolesDefinition'

export function useRoles() {
  const { translations } = useTranslations()

  const Roles: RoleType[] = useMemo(
    () => [
      {
        key: 'dashboard',
        menuLabel: translations.modules.navigation.dashboard,
        label: translations.modules.navigation.dashboard,
      },
      {
        key: 'quotes',
        menuLabel: translations.modules.navigation.quotes,
        label: translations.modules.navigation.quotes,
      },
      {
        key: 'policies',
        menuLabel: translations.modules.navigation.policies,
        label: translations.modules.navigation.policies,
      },
      {
        key: 'claims',
        menuLabel: translations.modules.navigation.claims,
        label: translations.modules.navigation.claims,
      },
      {
        key: 'payments',
        menuLabel: translations.modules.navigation.payments,
        label: translations.modules.navigation.payments,
      },
      {
        key: 'clients',
        menuLabel: translations.modules.navigation.clients,
        label: translations.modules.navigation.clients,
      },
      {
        key: 'management',
        menuLabel: translations.modules.navigation.management,
        label: translations.modules.navigation.management,
      },
      {
        key: 'reports',
        menuLabel: translations.modules.navigation.reports,
        label: translations.modules.navigation.reports,
      },
    ],
    [translations]
  )

  return Roles
}
