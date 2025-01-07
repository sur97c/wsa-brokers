// app/[lang]/(protected)/management/user-management/page.tsx

'use client'

import React from 'react'

import { useSafeRouter } from '@/hooks/navigation/useSafeRouter'
import { useTranslations } from '@/translations/hooks/useTranslations'

const UserListPage = () => {
  const { t, translations } = useTranslations()
  const { safeNavigate } = useSafeRouter()

  //   const handleEditUser = (userId: string) => {
  //     safeNavigate(`/management/user-management/${userId}`)
  //   }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t(translations.modules.management.users.list.title)}
        </h1>
        <button
          onClick={() => safeNavigate('/management/user-management/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t(translations.modules.management.users.list.addUser)}
        </button>
      </div>

      {/* Aquí iría tu tabla o lista de usuarios */}
    </div>
  )
}

export default UserListPage
