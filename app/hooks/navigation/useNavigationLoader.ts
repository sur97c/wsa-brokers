// app/hooks/navigation/useNavigationLoader.ts

import { useContext } from 'react'
import { NavigationLoaderContext } from '@/contexts/navigation/navigation.context'

export const useNavigationLoader = () => {
  const context = useContext(NavigationLoaderContext)

  if (context === undefined) {
    throw new Error(
      'useNavigationLoader must be used within a NavigationLoaderProvider'
    )
  }

  return context
}
