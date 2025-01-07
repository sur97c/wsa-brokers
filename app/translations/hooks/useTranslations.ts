// app/translations/hooks/useTranslations.ts

import React, { createElement, Fragment } from 'react'

import { enTranslations } from '@/translations/en'
import { esTranslations } from '@/translations/es'

import { useLanguage } from './useLanguage'

type InterpolateValue = string | React.ReactNode

function interpolateWithComponents(
  text: string,
  params: Record<string, InterpolateValue>
): React.ReactNode {
  const parts = text.split(/(\{\{[^}]+\}\})/g)

  return parts.map((part, index) => {
    const match = part.match(/\{\{([^}]+)\}\}/)
    if (!match) return part

    const key = match[1]
    const value = params[key]

    return createElement(Fragment, { key: index }, value)
  })
}

export function useTranslations() {
  const { language } = useLanguage()
  const translations = language === 'es' ? esTranslations : enTranslations

  function t<S extends string | undefined>(
    value: S,
    params?: Record<string, InterpolateValue>
  ): string {
    if (!value) return 'TRANSLATION_NOT_FOUND'
    if (!params) return value
    return interpolateWithComponents(value, params) as string
  }

  return { t, translations }
}
