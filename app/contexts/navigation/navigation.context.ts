// app/contexts/navigation/navigation.context.ts

import { createContext } from 'react'

interface NavigationLoaderState {
  isNavigating: boolean
  loadingMessage?: string
  setIsNavigating: (value: boolean) => void
  setLoadingMessage: (message: string) => void
}

export const NavigationLoaderContext = createContext<NavigationLoaderState>({
  isNavigating: false,
  loadingMessage: undefined,
  setIsNavigating: () => {},
  setLoadingMessage: () => {},
})
