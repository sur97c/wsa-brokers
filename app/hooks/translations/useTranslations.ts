// hooks/useTranslations.ts
'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { Translations } from '@/hooks/translations/translations'
import { esTranslations } from '@/hooks/translations/es-translations'
import { enTranslations } from '@/hooks/translations/en-translations'

const translations = {
  es: esTranslations,
  en: enTranslations,
} as const

type TranslationValues =
  | string
  | Translations[keyof Translations]
  | {
      [K in keyof Translations]: Translations[K] extends object
        ? Translations[K][keyof Translations[K]]
        : Translations[K]
    }[keyof Translations]

export function useTranslations() {
  const params = useParams()
  const lang = (params?.lang as keyof typeof translations) || 'es'

  const currentTranslations = useMemo(() => {
    return translations[lang] || translations.es
  }, [lang])

  const t = <K extends TranslationValues>(
    key: K,
    replacements: Record<string, string> = {}
  ): string => {
    let value: string = typeof key === 'string' ? key : JSON.stringify(key)

    if (typeof key === 'string' && key.includes('.')) {
      const keys = key.split('.')
      let current: any = currentTranslations
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k]
        } else {
          current = key
          break
        }
      }
      value = typeof current === 'string' ? current : JSON.stringify(current)
    }

    return Object.entries(replacements).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`{{${k}}}`, 'g'), v),
      value
    )
  }

  return { t, lang, translations: currentTranslations }
}
