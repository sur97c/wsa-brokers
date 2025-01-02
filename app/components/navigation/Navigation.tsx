// components/navigation/Navigation.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/types'
import { logoutUser } from '@/redux/slices/auth.slice'
import { useRoles } from '@/hooks/auth/useRoles'
import { useLanguage } from '@/translations/hooks/useLanguage'
import { useTranslations } from '@/translations/hooks/useTranslations'
import { useSafeRouter } from '@/hooks/navigation/useSafeRouter'
import Image from 'next/image'
import { IUserClaims } from '@/models/user/user'
import {
  User,
  Home,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  GraduationCap,
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Globe,
} from 'lucide-react'
import type { RoleType } from '@/utils/rolesDefinition'

interface NavigationProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Navigation({ isOpen, onToggle }: NavigationProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { language, changeLanguage } = useLanguage()
  const { t, translations } = useTranslations()
  const [currentEntity, setCurrentEntity] = useState('')
  const Roles = useRoles()
  const pathname = usePathname()
  const auth = useAppSelector((state: RootState) => state.auth)
  const userClaims = auth?.customClaims as IUserClaims | undefined
  const userRoles = userClaims?.roles || []
  const dispatch = useAppDispatch()
  const isMockEnabled = useAppSelector((state: RootState) => {
    // state.mockConfig.useMockData && state.mockConfig.mockEntities.users
    return true
  })
  const { safeNavigate } = useSafeRouter()

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen)

  const filteredRoles = Roles.filter((role: RoleType) => {
    return auth?.isAuthenticated && userRoles.includes(role.key)
  })

  const getIcon = (key: string) => {
    switch (key) {
      case 'home':
        return <Home className="w-5 h-5" /> // Icono de casa para inicio
      case 'dashboard':
        return <LayoutDashboard className="w-5 h-5" /> // Dashboard con widgets
      case 'quotes':
        return <FileText className="w-5 h-5" /> // Documento para cotizaciones
      case 'policies':
        return <ClipboardList className="w-5 h-5" /> // Lista/clipboard para pólizas
      case 'claims':
        return <AlertTriangle className="w-5 h-5" /> // Triángulo de alerta para reclamaciones
      case 'payments':
        return <CreditCard className="w-5 h-5" /> // Tarjeta de crédito para pagos
      case 'clients':
        return <Users className="w-5 h-5" /> // Grupo de usuarios para clientes
      case 'management':
        return <Settings className="w-5 h-5" /> // Engranaje para administración
      case 'reports':
        return <BarChart3 className="w-5 h-5" /> // Gráfica de barras para reportes
      default:
        return <Home className="w-5 h-5" />
    }
  }

  const buildNavigationPath = (
    language: string | undefined,
    key: string
  ): string => {
    const safeLanguage = language?.toString() || 'es'
    return key === 'home' ? `/${safeLanguage}` : `/${safeLanguage}/app/${key}`
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleLanguage = () => {
    changeLanguage(language === 'es' ? 'en' : 'es')
  }

  const handleLogoutUser = async () => {
    await dispatch(logoutUser('USER_REQUESTED'))
    safeNavigate('/')
  }

  const Footer: React.FC = () => {
    if (currentEntity === '') return null
    const message = t(translations.modules.navigation.dataSource)
      .replace(
        `{{source}}`,
        isMockEnabled
          ? t(translations.modules.navigation.mock)
          : t(translations.modules.navigation.real)
      )
      .replace(`{{entity}}`, currentEntity)
    return (
      <>
        {isOpen && (
          <>
            <div className="hidden md:block">
              <div className="absolute bottom-0 w-full p-4 border-t">
                <div className="p-2 bg-blue-100 text-blue-800 rounded text-xs">
                  {message}
                </div>
              </div>
            </div>
            <div className="fixed md:hidden">
              <div className="p-2 bg-blue-100 text-blue-800 rounded text-xs">
                {message}
              </div>
              {/* <div className="text-sm text-gray-500 mb-20 mr-2">{message}</div> */}
              <button
                className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 flex items-center justify-center"
                onClick={handleLogoutUser}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <>
      {/* Header móvil */}
      <div className="fixed md:hidden top-0 left-0 right-0 h-16 bg-white border-b z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <span className="font-semibold text-xl">WSA Broker</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-full
              transition-all duration-300
              [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
              text-gray-600 hover:text-[#FF8C00]
              bg-gray-100 hover:bg-gray-200"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === 'es'
                ? t(translations.modules.home.spanish)
                : t(translations.modules.home.english)}
            </span>
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* Navigation para móvil */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white transform transition-transform duration-1000 ease-in-out z-30 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Perfil de usuario */}
          <div className="p-2 px-3 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-medium">Mi Cuenta</div>
                <div className="text-sm text-gray-500">
                  {auth?.user?.displayName || 'Usuario'}
                </div>
              </div>
            </div>
          </div>
          {/* Links de navegación móvil */}
          <nav className="flex-1 py-4">
            {filteredRoles.map((role: RoleType) => (
              <Link
                key={role.key}
                href={buildNavigationPath(language, role.key)}
                className={`flex items-center px-6 py-3 transition-colors
                  ${
                    pathname ===
                    (role.key === 'home'
                      ? `/${language}`
                      : `/${language}/app/${role}`)
                      ? 'bg-primary bg-opacity-10 text-primary'
                      : 'hover:bg-gray-100'
                  }`}
                onClick={() => {
                  // e.preventDefault()
                  setCurrentEntity(role.menuLabel)
                }}
              >
                {getIcon(role.key)}
                <span className="ml-3">{role.menuLabel}</span>
              </Link>
            ))}

            {/* Links adicionales móvil */}
            {/* <div className="border-t mt-4 pt-4">
              <Link
                href={`/${language}/help`}
                className="flex items-center px-6 py-3 hover:bg-gray-100"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="ml-3">Centro de Ayuda</span>
              </Link>
              <Link
                href={`/${language}/education`}
                className="flex items-center px-6 py-3 hover:bg-gray-100"
              >
                <GraduationCap className="w-5 h-5" />
                <span className="ml-3">Estudiantes y Profesores</span>
              </Link>
            </div> */}
          </nav>
          {/* Footer móvil */}
          <div className="p-4 border-t mb-20">
            <Footer />
            <button
              className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 flex items-center justify-center"
              onClick={handleLogoutUser}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation para desktop */}
      <div
        className={`hidden md:block fixed left-0 top-0 h-full bg-white transform transition-all duration-300 ease-in-out z-30 group 
          hover:border-r hover:border-gray-200
          ${isOpen ? 'w-64 translate-x-200' : 'w-16 -translate-x-0'}
        `}
      >
        {/* Logo section */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/WSA-logo-rect.png"
            alt="WSA Logo"
            width={24}
            height={16}
            priority={true}
            className={`transition-all duration-500 w-24 h-16`}
          />
          {isOpen && <span className="font-semibold text-xl">WSA Broker</span>}
        </div>
        {/* Language section */}
        {isOpen && (
          <div className="w-64 flex items-center justify-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full
                transition-all duration-300
                [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                text-gray-600 hover:text-[#FF8C00]
                bg-gray-100 hover:bg-gray-200"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'es'
                  ? t(translations.modules.home.spanish)
                  : t(translations.modules.home.english)}
              </span>
            </button>
          </div>
        )}
        {/* User profile section */}
        <div className="p-2 px-3">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div
              className={`w-10 h-10 bg-primary flex items-center justify-center transition-[border-radius] duration-300 ease-in-out ${
                !isOpen ? 'rounded-full' : 'rounded-md'
              }`}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">Mi Cuenta</div>
                <div className="text-sm text-gray-500 truncate">
                  {auth?.user?.displayName || 'Usuario'}
                </div>
              </div>
            )}
          </div>

          {/* Dropdown menu desktop */}
          <div ref={dropdownRef}>
            {isDropdownOpen && (
              <div className="mt-2 py-2 bg-white rounded-lg shadow-lg border absolute w-56 z-10 top-24 left-14">
                <Link
                  href={`/${language}/profile`}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>Mi Cuenta</span>
                </Link>
                {/* <Link
                  href={`/${language}/help`}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Centro de Ayuda</span>
                </Link>
                <Link
                  href={`/${language}/education`}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>Estudiantes y Profesores</span>
                </Link> */}
                <button
                  className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={handleLogoutUser}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Navigation links desktop */}
        <nav className="py-4">
          {filteredRoles.map((role: RoleType) => (
            <Link
              key={role.key}
              href={buildNavigationPath(language, role.key)}
              className={`flex items-center px-4 py-2 mb-1 transition-colors
                ${
                  pathname ===
                    (role.key === 'home'
                      ? `/${language}`
                      : `/${language}/app/${role}`) ||
                  currentEntity === role.menuLabel
                    ? 'bg-primary bg-opacity-10 text-secondary'
                    : 'hover:bg-gray-100'
                } ${!isOpen ? 'justify-center' : ''}`}
              onClick={() => {
                // e.preventDefault()
                setCurrentEntity(role.menuLabel)
              }}
            >
              {getIcon(role.key)}
              {isOpen && (
                <span className="ml-3 truncate">{role.menuLabel}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center h-16 px-4">
          <button
            onClick={onToggle}
            className={`hidden group-hover:flex absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-100 items-center justify-center rounded-l-md`}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
        {/* Footer section desktop */}
        <Footer />
      </div>
    </>
  )
}
