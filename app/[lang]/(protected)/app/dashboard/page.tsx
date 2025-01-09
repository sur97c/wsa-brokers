// app/[lang]/(protected)/app/dashboard/page.tsx

'use client'

import { useEffect } from 'react'
import { useTranslations } from '@/translations/hooks/useTranslations'
import BrokerDashboard from './BrokerDashboard'

export default function Management() {
  const { t, translations } = useTranslations()

  useEffect(() => {
    console.log('Dashboard mounted')
  }, [])

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.modules.dashboard.title)}
      </h1>
      <div>
        <p>Debug info - rendered at: {new Date().toISOString()}</p>
      </div>
      <BrokerDashboard />
    </>
  )
}
