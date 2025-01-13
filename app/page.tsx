// app/page.tsx

'use client'

import { useSafeNavigator } from '@/hooks/navigation/useSafeNavigator'

export default function RootPage(): void {
  const { navigateTo } = useSafeNavigator()
  navigateTo('/')
}
