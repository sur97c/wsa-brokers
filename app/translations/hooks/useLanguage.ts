// hooks/translations/useLanguage.ts

'use client'

import { useRouter } from 'next/navigation'
import { useLanguageContext } from '@/contexts/translations/language.context'

export function useLanguage() {
  const { language, setLanguage } = useLanguageContext()
  const router = useRouter()

  const changeLanguage = (newLang: string) => {
    localStorage.setItem('preferredLanguage', newLang)
    setLanguage(newLang)
    const path = window.location.pathname
    const segments = path.split('/').filter(Boolean)
    segments[0] = newLang
    router.push(`/${segments.join('/')}`)
  }

  return { language, changeLanguage }
}
