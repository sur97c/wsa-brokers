// app/[lang]/(protected)/app/management/user-management/[id]/UserManagementContent.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useSafeNavigator } from '@/hooks/navigation/useSafeNavigator'
import { UserRole } from '@/models/user/roles'
import type { UserProfile } from '@/models/user/user'
import { useAppSelector } from '@/redux/hooks'
import { selectAuthView } from '@/redux/slices'
import { useTranslations } from '@/translations/hooks/useTranslations'
import { EditUserForm } from '../EditUserForm'

interface UserManagementContentProps {
  id: string
}

const UserManagementContent: React.FC<UserManagementContentProps> = ({
  id,
}) => {
  const { t, translations } = useTranslations()
  const { navigateTo } = useSafeNavigator()
  const [user, setUser] = useState<UserProfile | null>(null)
  const currentUser = useAppSelector(selectAuthView).user

  useEffect(() => {
    console.log('UserManagementPage: Fetching user with id:', id)
    setUser(currentUser)
  }, [currentUser, id])

  const handleSave = async (userData: Partial<UserProfile>) => {
    try {
      console.log('User updated:', userData)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleClose = () => {
    navigateTo('/management/user-management')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t(translations.modules.management.users.edit.title)}
        </h1>
      </div>

      <EditUserForm
        user={user || undefined}
        currentUserRole={
          (currentUser?.primaryRole as UserRole) || UserRole.CLIENT
        }
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  )
}

export default UserManagementContent
