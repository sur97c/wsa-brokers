// app/components/loading/LoadingOverlay.tsx

'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

interface LoadingOverlayProps {
  children: React.ReactNode
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ children }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // const currentPath = pathname + searchParams.toString()

    const handleStart = () => {
      // Solo mostrar loading si realmente estamos navegando a una nueva ruta
      if (!isLoading) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
        }, 150)
        setIsLoading(true)
      }
    }

    const handleComplete = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }

    handleStart()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      handleComplete()
    }
  }, [pathname, searchParams, isLoading])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 scale-100">
          {children}
        </div>
      </div>
    </div>
  )
}
