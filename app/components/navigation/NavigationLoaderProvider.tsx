// app/components/navigation/NavigationLoaderProvider.tsx

'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, type ReactNode } from 'react'

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
  const mountedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Solo mostrar el loader para navegaciones subsecuentes
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    const handleStart = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(true)
      }, 150)
    }

    const handleComplete = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsNavigating(false)
      setLoadingMessage(undefined)
    }

    handleStart()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      handleComplete()
    }
  }, [pathname, searchParams])

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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
