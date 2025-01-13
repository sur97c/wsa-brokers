// app/components/navigation/navigation-loader.provider.tsx

'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, type ReactNode, useCallback } from 'react'
import { NavigationLoader } from '@/components/navigation/NavigationLoader'
import { NavigationLoaderContext } from '@/contexts/navigation/navigation.context'

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
  const previousPathRef = useRef(pathname)
  const previousSearchParamsRef = useRef(searchParams)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstMount = useRef(true)

  const clearNavigationTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    // No mostrar el loader en el montaje inicial
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    // Verificar si realmente hubo un cambio en la navegación
    const isPathChanged = previousPathRef.current !== pathname
    const isSearchParamsChanged =
      previousSearchParamsRef.current?.toString() !== searchParams?.toString()

    if (!isPathChanged && !isSearchParamsChanged) {
      return
    }

    // Actualizar referencias
    previousPathRef.current = pathname
    previousSearchParamsRef.current = searchParams

    clearNavigationTimeout()

    // Iniciar navegación
    timeoutRef.current = setTimeout(() => {
      setIsNavigating(true)
    }, 150)

    // Simular finalización de navegación
    const completionTimeout = setTimeout(() => {
      clearNavigationTimeout()
      setIsNavigating(false)
      setLoadingMessage(undefined)
    }, 500) // Ajusta este tiempo según necesites

    return () => {
      clearTimeout(completionTimeout)
      clearNavigationTimeout()
    }
  }, [pathname, searchParams, clearNavigationTimeout])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      clearNavigationTimeout()
    }
  }, [clearNavigationTimeout])

  const contextValue = {
    isNavigating,
    loadingMessage,
    setIsNavigating,
    setLoadingMessage,
  }

  return (
    <NavigationLoaderContext.Provider value={contextValue}>
      {children}
      <NavigationLoader />
    </NavigationLoaderContext.Provider>
  )
}
