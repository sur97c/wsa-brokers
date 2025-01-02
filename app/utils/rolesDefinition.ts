// app/utils/rolesDefinition.ts

export const RoleKeys = [
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

export type RoleKey = (typeof RoleKeys)[number]

export type RoleType = {
  key: RoleKey
  menuLabel: string
  label: string
}

export function getRoles(t: (key: string) => string) {
  return RoleKeys.map((key) => ({
    key,
    menuLabel: t(`navigation.${key}`),
    label: key === 'home' ? '' : t(`navigation.${key}`),
  }))
}
