// hooks/useTranslations.ts
'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { TranslationsType } from '@/hooks/translations/translations'
import { esTranslations } from '@/hooks/translations/es-translations'
import { enTranslations } from '@/hooks/translations/en-translations'

const translations = {
  es: esTranslations,
  en: enTranslations,
} as const

type TranslationValues =
  | string
  | TranslationsType[keyof TranslationsType]
  | {
      [K in keyof TranslationsType]: TranslationsType[K] extends object
        ? TranslationsType[K][keyof TranslationsType[K]]
        : TranslationsType[K]
    }[keyof TranslationsType]

type TranslationValue = string | Record<string, unknown>
type TranslationFunction = (
  key: string,
  replacements?: Record<string, string>
) => string

export const useTranslations = (): {
  t: TranslationFunction
  lang: string
  translations: TranslationsType
} => {
  const params = useParams()
  const lang = (params?.lang as keyof typeof translations) || 'es'

  const currentTranslations: TranslationsType = useMemo(() => {
    return translations[lang] || translations.es
  }, [lang])

  const t = <K extends TranslationValues>(
    key: K,
    replacements: Record<string, string> = {}
  ): string => {
    let value: string = typeof key === 'string' ? key : JSON.stringify(key)

    if (typeof key === 'string' && key.includes('.')) {
      const keys = key.split('.')
      let current: TranslationValue = currentTranslations
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = (current as Record<string, unknown>)[k] as TranslationValue
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
