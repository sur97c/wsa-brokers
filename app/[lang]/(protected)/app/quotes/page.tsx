// app/[lang]/(protected)/app/quotes/page.tsx

'use client'

import { useTranslations } from '@/translations/hooks/useTranslations'

export default function Management() {
  const { t, translations } = useTranslations()

  return (
    <h1 className="text-2xl font-bold mb-4">
      {t(translations.modules.quotes.title)}
    </h1>
  )
}
