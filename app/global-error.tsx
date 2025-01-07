// app/global-error.tsx

'use client'

import ClientErrorPage from '@/components/errors/ClientErrorPage'
import { enTranslations } from '@/translations/en'
import { esTranslations } from '@/translations/es'
import type { Locale } from '@/translations/types/core/locale'

export default function GlobalError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string }
  reset: () => void
  params: { lang: Locale }
}) {
  const translations = params.lang === 'es' ? esTranslations : enTranslations

  console.error(error, reset)

  return (
    <html>
      <body>
        <ClientErrorPage
          title={translations.core.errors.systemError.title}
          message={translations.core.errors.systemError.message}
          showBackButton={false}
          showHomeButton={true}
        />
      </body>
    </html>
  )
}
