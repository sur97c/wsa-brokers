// app/hooks/navigation/useSafeNavigator.ts

'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useLanguageContext } from '@/contexts/translations/language.context'

export function useSafeNavigator() {
  const router = useRouter()
  const { language } = useLanguageContext()

  const navigateTo = useCallback(
    (path: string) => {
      // Remover cualquier / inicial para evitar dobles slashes
      const cleanPath = path.replace(/^\/+/, '')

      // Verificar si la ruta ya empieza con el idioma
      const hasLanguage = /^(es|en)\//.test(cleanPath)

      // Construir la ruta final
      const finalPath = hasLanguage
        ? `/${cleanPath}`
        : `/${language}/${cleanPath}`

      router.push(finalPath)
    },
    [router, language]
  )

  const getRoutePath = useCallback(
    (path: string) => {
      const cleanPath = path.replace(/^\/+/, '')
      const hasLanguage = /^(es|en)\//.test(cleanPath)
      return hasLanguage ? `/${cleanPath}` : `/${language}/${cleanPath}`
    },
    [language]
  )

  return {
    navigateTo,
    getRoutePath,
  }
}
