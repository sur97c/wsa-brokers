// app/[lang]/(public)/layout.tsx

'use client'

import { redirect } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { LoadingMessage } from '@/components/loading/LoadingMessage'
import { LoadingOverlay } from '@/components/loading/LoadingOverlay'

type LayoutProps = {
  children: ReactNode
  params: Promise<{
    lang: string
  }>
}

export default function PublicLayout(props: LayoutProps) {
  const { children, params } = props
  const [lang, setLang] = useState<string>()

  useEffect(() => {
    params.then((resolvedParams) => {
      setLang(resolvedParams.lang)
      if (resolvedParams.lang !== 'es' && resolvedParams.lang !== 'en') {
        redirect('/es')
      }
    })
  }, [params])

  if (!lang) {
    return (
      <main className="min-h-screen">
        <LoadingOverlay>
          <LoadingMessage />
        </LoadingOverlay>
      </main>
    )
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
