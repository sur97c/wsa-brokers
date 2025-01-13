// app/providers/language.provider.tsx

import { useParams } from 'next/navigation'
import { type ReactNode, useState, useEffect } from 'react'
import { LanguageContext } from '@/contexts/translations/language.context'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const [language, setLanguage] = useState<string>(
    (params.lang as string) || 'es'
  )

  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage')
    if (storedLang && storedLang !== language) {
      setLanguage(storedLang)
    } else if (!storedLang) {
      localStorage.setItem('preferredLanguage', language)
    }
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
