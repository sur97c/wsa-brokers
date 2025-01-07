// app/[lang]/(protected)/app/clients/page.tsx

'use client'

import { useTranslations } from '@/translations/hooks/useTranslations'

export default function Management() {
  const { t, translations } = useTranslations()

  return (
    <h1 className="text-2xl font-bold mb-4">
      {t(translations.modules.clients.title)}
    </h1>
  )
}
