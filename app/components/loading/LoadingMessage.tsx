// app/components/loading/LoadingMessage.tsx

import React from 'react'

import { useTranslations } from '@/translations/hooks/useTranslations'

import { Spinner } from './Spinner'

interface LoadingMessageProps {
  message?: string
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({ message }) => {
  const { t, translations } = useTranslations()

  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-[#1A237E] font-medium">
        {message || t(translations.core.common.loading)}
      </p>
    </div>
  )
}
