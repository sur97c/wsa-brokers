// components/login/RecoveryForm.tsx

'use client'

import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import LoadingButton from '@/components/ui/buttons/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearMessages, recoverAccess } from '@/redux/slices/auth.slice'
import { useTranslations } from '@/translations/hooks/useTranslations'

interface RecoveryFormProps {
  onClose?: () => void
  onFlip?: () => void
}

const RecoveryForm: React.FC<RecoveryFormProps> = ({ onClose, onFlip }) => {
  const { t, translations } = useTranslations()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')

  useEffect(() => {
    dispatch(clearMessages())
  }, [dispatch])

  const handleRecoverAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(recoverAccess(email))
  }

  return (
    <div className="back">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-[#FF8C00]
          transition-colors duration-300 z-10"
      >
        <X size={24} />
      </button>
      <div className="bg-white p-2 rounded-md border-b">
        <form className="p-2">
          <div className="flex flex-col">
            <div className="w-full">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb:ml-2 mb:mr-2">
                <div className="w-full sm:flex-grow">
                  <label
                    htmlFor="recover-email"
                    className="block text-sm font-medium text-dark mb-2 sm:mb-0 sm:mr-2"
                  >
                    {t(translations.modules.loginForm.emailToRecoveryAccess)}
                  </label>
                  <input
                    id="recover-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input w-full px-3 py-2 border border-light rounded"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <LoadingButton
                    type="button"
                    onClick={handleRecoverAccess}
                    aria-label={
                      loading
                        ? t(translations.modules.loginForm.sendingEmail)
                        : t(translations.modules.loginForm.sendEmail)
                    }
                    className="bg-[#1A237E] text-white py-2 px-4 rounded 
                    hover:bg-[#FF8C00] w-full
                    transition-all duration-300 md:mt-12
                    [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                    hover:shadow-lg transform hover:-translate-y-0.5
                    shadow-md hover:shadow-[#FF8C00]/20"
                    faIcon={faPaperPlane}
                    loading={loading}
                  />
                </div>
              </div>
              <div className="md:mt-2 mt-4 text-center">
                <span className="block text-sm font-medium text-dark">
                  {t(translations.modules.loginForm.recoveryAccessInfo)}
                </span>
              </div>
            </div>
            <div className="flex justify-center mb-2 mt-4">
              <button
                type="button"
                aria-label={t(translations.modules.loginForm.signIn)}
                onClick={onFlip}
                className="text-primary hover:text-primary-hover flex items-center"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="mr-2 hover:text-primary-hover"
                />
                <span>{t(translations.modules.loginForm.signIn)}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecoveryForm
