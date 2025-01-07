// components/login/LoginForm.tsx

'use client'

import { faArrowRight, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import LoadingButton from '@/components/ui/buttons/LoadingButton'
import { useSafeRouter } from '@/hooks/navigation/useSafeRouter'
import { BusinessErrorCode } from '@/models/errors'
import { SectionRole } from '@/models/user/roles'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  clearMessages,
  loginUser,
  selectAuthView,
  // selectAuth
} from '@/redux/slices/auth.slice'
import { useTranslations } from '@/translations/hooks/useTranslations'

interface LoginFormProps {
  onClose?: () => void
  onFlip?: () => void
  onNeedVerification?: (email: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onFlip,
  onNeedVerification,
}) => {
  const { t, translations } = useTranslations()
  const { safeNavigate } = useSafeRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')

  const { loading, error, user, isAuthenticated } =
    useAppSelector(selectAuthView)

  // const { loading, error, user, isAuthenticated } = useAppSelector(selectAuth)

  useEffect(() => {
    dispatch(clearMessages())
  }, [dispatch])

  useEffect(() => {
    if (user && isAuthenticated) {
      if (onClose) onClose()

      if (user?.sectionRoles.includes(SectionRole.DASHBOARD)) {
        safeNavigate('/dashboard')
      } else {
        const defaultRole = user.sectionRoles[0] || ''
        safeNavigate(`/${defaultRole}`)
      }
    }
  }, [user, onClose, safeNavigate, isAuthenticated])

  const handleLoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await dispatch(
      loginUser({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        rememberMe: formData.get('rememberMe') === 'true',
      })
    )
  }

  const handleFlip = () => {
    dispatch(clearMessages())
    if (onFlip) onFlip()
  }

  const handleCloseLogin = () => {
    dispatch(clearMessages())
    if (onClose) onClose()
  }

  return (
    <div className="front">
      <button
        onClick={handleCloseLogin}
        className="absolute top-4 right-4 text-gray-500 hover:text-[#FF8C00]
      transition-colors duration-300 z-10"
      >
        <X size={24} />
      </button>
      <div className="bg-white p-2 rounded-md border-b">
        <form onSubmit={handleLoginUser} className="p-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-auto w-full">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-dark"
                  >
                    {t(translations.modules.loginForm.email)}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input px-3 py-2 border border-light rounded md:w-auto w-full
    focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00]
    transition-all duration-300"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-dark"
                  >
                    {t(translations.modules.loginForm.password)}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="form-input px-3 py-2 border border-light rounded md:w-auto w-full
                      focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00]
                      transition-all duration-300"
                  />
                </div>

                <div className="flex justify-center md:justify-start md:flex-1 md:hidden">
                  <label className="cursor-pointer md:flex-none text-primary hover:text-primary-hover">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      className="form-checkbox text-[#FF8C00] border-gray-300 rounded
                        focus:ring-[#FF8C00]/20 transition-all duration-300"
                    />
                    <span className="ml-2 text-sm">
                      {t(translations.modules.loginForm.rememberMe)}
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-4 md:hidden w-full">
                <LoadingButton
                  type="submit"
                  aria-label={
                    loading
                      ? t(translations.modules.loginForm.signingIn)
                      : t(translations.modules.loginForm.signIn)
                  }
                  className="bg-[#1A237E] text-white py-2 px-4 rounded hover:bg-[#FF8C00] w-full
                    transition-all duration-300 
                    [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                    hover:shadow-lg transform hover:-translate-y-0.5
                    shadow-md hover:shadow-[#FF8C00]/20"
                  faIcon={faSignInAlt}
                  loading={loading}
                />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 md:mt-4 mt-0">
                <div className="hidden md:flex md:flex-1 md:m-2 justify-center md:justify-start">
                  <label className="cursor-pointer md:flex-none text-primary hover:text-primary-hover">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="form-checkbox text-[#FF8C00] border-gray-300 rounded
                        focus:ring-[#FF8C00]/20 transition-all duration-300"
                    />
                    <span className="ml-2 text-sm">
                      {t(translations.modules.loginForm.rememberMe)}
                    </span>
                  </label>
                </div>
                {/* {error?.code !== BusinessErrorCode.EMAIL_NOT_VERIFIED && ( */}
                <div className="flex justify-center md:justify-start md:flex-1">
                  <div className="md:flex-none md:mt-2">
                    <span
                      onClick={handleFlip}
                      className="cursor-pointer text-sm text-[#1A237E] hover:text-[#FF8C00]
                        transition-all duration-300 flex items-center"
                    >
                      {t(translations.modules.loginForm.recoveryAccess)}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 hover:text-[#FF8C00]"
                      />
                    </span>
                  </div>
                </div>
                {/* )} */}
              </div>
            </div>

            <div className="hidden md:flex md:flex-1 md:m-2 md:justify-center">
              <LoadingButton
                type="submit"
                aria-label={
                  loading
                    ? t(translations.modules.loginForm.signingIn)
                    : t(translations.modules.loginForm.signIn)
                }
                className="bg-[#1A237E] text-white py-2 px-4 rounded hover:bg-[#FF8C00] md:w-auto
                  transition-all duration-300 
                  [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                  hover:shadow-lg transform hover:-translate-y-0.5
                  shadow-md hover:shadow-[#FF8C00]/20"
                faIcon={faSignInAlt}
                loading={loading}
              />
            </div>
          </div>
        </form>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error.message}
            {error &&
              error.code === BusinessErrorCode.EMAIL_NOT_VERIFIED &&
              onNeedVerification && (
                <div onClick={() => onNeedVerification(email)}>
                  <span className="block text-sm text-red-600 mt-1 underline cursor-pointer ">
                    {t(
                      translations.modules.loginForm.emailNotVerified
                        .resendLink,
                      { email }
                    )}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 hover:text-[#FF8C00]"
                    />
                  </span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginForm
