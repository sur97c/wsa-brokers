// app/[lang]/(protected)/app/dashboard/page.tsx

'use client'

import { useTranslations } from '@/translations/hooks/useTranslations'
import BrokerDashboard from './BrokerDashboard'

export default function Management() {
  const { t, translations } = useTranslations()

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.modules.dashboard.title)}
      </h1>
      <BrokerDashboard />
    </>
  )
}
