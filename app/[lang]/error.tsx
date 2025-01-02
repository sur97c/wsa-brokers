// app/[lang]/error.tsx

'use client'

import ClientErrorPage from '@/components/errors/ClientErrorPage'
import { useTranslations } from '@/translations/hooks/useTranslations'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t, translations } = useTranslations()

  console.error(error, reset)
  return (
    <ClientErrorPage
      title={t(translations.core.errors.genericError.title)}
      message={t(translations.core.errors.genericError.message)}
      showBackButton={false}
      showHomeButton={true}
    />
  )
}
