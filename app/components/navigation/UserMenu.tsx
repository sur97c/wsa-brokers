// components/navigation/UserMenu.tsx

'use client'

import {
  faUserCircle,
  faCog,
  faChartLine,
  // faPalette,
  faHome,
  // faLanguage,
  faBell,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

import { useAppSelector } from '@/redux/hooks'
// import ThemeToggle from "@components/theme-toggle/ThemeToggle"
import { selectAuthView } from '@/redux/slices'
import { useTranslations } from '@/translations/hooks/useTranslations'
// import { LanguageSelector } from '@/components/language-selector/LanguageSelector'

interface UserMenuProps {
  onClose: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const auth = useAppSelector(selectAuthView)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showHomeKPIs, setShowHomeKPIs] = useState(true)
  const { t, translations } = useTranslations()

  useEffect(() => {
    // setIsLoadingPage(false)
    // Simular la obtención de notificaciones no leídas
    setUnreadNotifications(Math.floor(Math.random() * 10))
  }, [])

  return (
    <div className="absolute text-primary top-0 right-14 -mt-4 w-72 bg-white rounded-md shadow-lg z-20 max-h-[90vh] overflow-y-auto">
      <div className="p-4 border">
        <div className="flex justify-between">
          <p className="font-medium ">
            {auth?.user?.displayName ||
              auth?.user?.name + ' ' + auth?.user?.lastName}
          </p>
          <FontAwesomeIcon
            size="2x"
            icon={faWindowClose}
            className="cursor-pointer text-primary hover:text-primary-hover focus:outline-none"
            onClick={onClose}
          />
        </div>
        <p className="text-sm">{auth?.user?.email}</p>
      </div>
      <div className="p-2">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
          <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
          {t(translations.modules.userMenu.editProfile)}
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
          <FontAwesomeIcon icon={faCog} className="mr-3" />
          {t(translations.modules.userMenu.setup)}
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-b">
          <FontAwesomeIcon icon={faChartLine} className="mr-3" />
          {t(translations.modules.userMenu.dashboardsSettings)}
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faBell} className="mr-3" />
            {t(translations.modules.userMenu.notifications)}
          </span>
          {unreadNotifications > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadNotifications}
            </span>
          )}
        </button>
        {/* <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faLanguage} className="mr-3" />
            {t(translations.modules.userMenu.language)}
          </span>
          <LanguageSelector />
        </div>
        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faPalette} className="mr-3" />
            {t(translations.modules.userMenu.theme)}
          </span>
          <ThemeToggle />
        </div> */}
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
          onClick={() => setShowHomeKPIs(!showHomeKPIs)}
        >
          <span className="flex items-center">
            <FontAwesomeIcon icon={faHome} className="mr-3" />
            {t(translations.modules.userMenu.showKPIsHome)}
          </span>
          <input
            type="checkbox"
            checked={showHomeKPIs}
            readOnly
            className="form-checkbox h-4 w-4 text-primary"
          />
        </button>
      </div>
    </div>
  )
}

export default UserMenu
