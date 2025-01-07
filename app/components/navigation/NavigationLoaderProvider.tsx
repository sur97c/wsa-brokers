// app/components/navigation/NavigationLoaderProvider.tsx

'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'

import { NavigationLoaderContext } from '@/contexts/navigation/navigation.context'

import { NavigationLoader } from './NavigationLoader'

interface NavigationLoaderProviderProps {
  children: ReactNode
}

export const NavigationLoaderProvider: React.FC<
  NavigationLoaderProviderProps
> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string>()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleStart = () => {
      timeoutId = setTimeout(() => {
        setIsNavigating(true)
      }, 150) // Delay para evitar flashes en navegaciones rápidas
    }

    const handleComplete = () => {
      if (timeoutId) clearTimeout(timeoutId)
      setTimeout(() => {
        setIsNavigating(false)
        setLoadingMessage(undefined)
      }, 300) // Dar tiempo para la animación de salida
    }

    handleStart()
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      handleComplete()
    }
  }, [pathname, searchParams])

  return (
    <NavigationLoaderContext.Provider
      value={{
        isNavigating,
        loadingMessage,
        setIsNavigating,
        setLoadingMessage,
      }}
    >
      {children}
      <NavigationLoader />
    </NavigationLoaderContext.Provider>
  )
}
