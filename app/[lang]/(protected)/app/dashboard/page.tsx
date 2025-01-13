// app/[lang]/(protected)/app/dashboard/page.tsx

'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from '@/translations/hooks/useTranslations'
import BrokerDashboard from './BrokerDashboard'

export default function DashboardPage() {
  const { t, translations } = useTranslations()
  const mountCount = useRef(0)

  useEffect(() => {
    mountCount.current += 1
    console.log('Dashboard mounted count:', mountCount.current)
    return () => {
      console.log('Dashboard - Unmount')
    }
  }, [])

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.modules.dashboard.title)}
      </h1>
      <BrokerDashboard />
    </div>
  )
}
