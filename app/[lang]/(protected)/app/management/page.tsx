// app/[lang]/(protected)/app/management/page.tsx

'use client'

import { useSafeNavigator } from '@/hooks/navigation/useSafeNavigator'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/types'
import { useTranslations } from '@/translations/hooks/useTranslations'

export default function Management() {
  const { t, translations } = useTranslations()
  const user = useAppSelector((state: RootState) => state.auth.user)

  const { navigateTo } = useSafeNavigator()

  const handleNewUser = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    navigateTo(`/management/user-management/new`)
  }

  const handleEditUser = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    navigateTo(`/management/user-management/${user?.uid}`)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {t(translations.modules.management.title)}
      </h1>
      {/* A continuación mostramos el nombre del usuario actual y dos botones pra crear un nuevo usuario o para editar el actual */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Usuario: user?.displayName
          {user?.name + ' ' + user?.lastName}
          {/* {user?.email} */}
          {user?.primaryRole}
          {/* {user?.sectionRoles}
          {user?.allowMultipleSessions}
          {user?.blocked}
          {user?.disabled} */}
        </h2>
        <div className="flex">
          <button className="btn btn-primary mr-2" onClick={handleNewUser}>
            {t(translations.modules.management.users.editCreate.title)}
          </button>
          <button className="btn btn-secondary" onClick={handleEditUser}>
            {t(translations.modules.management.users.edit.title)}
          </button>
        </div>
      </div>
    </>
  )
}
