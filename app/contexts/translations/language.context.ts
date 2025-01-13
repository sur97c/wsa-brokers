// app/context/translations/language.context.ts

'use client'

import { createContext, useContext } from 'react'

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export const useLanguageContext = () => {
  const context = useContext(LanguageContext)
  if (!context)
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  return context
}
