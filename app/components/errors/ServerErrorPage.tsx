//components/errors/ServerErrorPage.tsx

import { esTranslations } from '@/translations/es'
import { enTranslations } from '@/translations/en'

interface ErrorPageProps {
  title?: string
  message?: string
  lang?: string
}

export default function ServerErrorPage({
  title,
  message,
  lang,
}: ErrorPageProps) {
  const translations = lang === 'es' ? esTranslations : enTranslations

  // console.log(lang)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {title || translations.core.errors.notFound.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {message || translations.core.errors.notFound.message}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={`/${lang}`}
            className="px-6 py-2 bg-[#FF8C00] text-white rounded transition-all duration-500
              hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {translations.core.errors.home}
          </a>
        </div>
      </div>
    </div>
  )
}
