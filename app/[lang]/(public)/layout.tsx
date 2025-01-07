// app/[lang]/(public)/layout.tsx

'use client'

import { redirect } from 'next/navigation'
import React, { useEffect, useState, type ReactNode } from 'react'

import { LoadingMessage } from '@/components/loading/LoadingMessage'
import { LoadingOverlay } from '@/components/loading/LoadingOverlay'
import { useTranslations } from '@/translations/hooks/useTranslations'

type LayoutProps = {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  const [resolvedParams, setResolvedParams] = useState<{
    lang: string
  } | null>(null)
  const { t, translations } = useTranslations()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (
      resolvedParams &&
      resolvedParams.lang !== 'es' &&
      resolvedParams.lang !== 'en'
    ) {
      redirect('/es')
    }
  }, [resolvedParams])

  if (!resolvedParams) {
    return <div>{t(translations.core.common.loading)}</div>
  }

  return (
    <main className="min-h-screen">
      {children}
      <LoadingOverlay>
        <LoadingMessage />
      </LoadingOverlay>
    </main>
  )
}
