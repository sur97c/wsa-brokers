// app/[lang]/(public)/layout.tsx

'use client'

import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'
import { useTranslations } from '@/translations/hooks/useTranslations'
// import { AnimatedBackground } from '@/components/background/AnimatedBackground'
// import { VideoBackground } from '@/components/background/VideoBackground'
import { LoadingOverlay } from '@/components/loading/LoadingOverlay'
import { LoadingMessage } from '@/components/loading/LoadingMessage'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default function LocaleLayout({ children, params }: LayoutProps) {
  const [resolvedParams, setResolvedParams] = React.useState<{
    lang: string
  } | null>(null)
  const { t, translations } = useTranslations()

  React.useEffect(() => {
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
      {/* <VideoBackground
        videoSrc="/videos/background.mp4"
        overlayOpacity={30}
        fallbackImage="/images/poster.jpg"
      >
        {children}
      </VideoBackground> */}
      {/* <AnimatedBackground overlayOpacity={30}>{children}</AnimatedBackground> */}
      {children}
      <LoadingOverlay>
        <LoadingMessage />
      </LoadingOverlay>
    </main>
  )
}
