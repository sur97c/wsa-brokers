// @/components/login/VerificationForm.tsx

import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from '@/translations/hooks/useTranslations'
import LoadingButton from '@/components/ui/buttons/LoadingButton'
import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearMessages, resendVerification } from '@/redux/slices/auth.slice'
import { BusinessErrorCode } from '@/models/errors'

interface VerificationFormProps {
  onClose?: () => void
  onFlip?: () => void
  email: string
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  onClose,
  onFlip,
  email,
}) => {
  const { t, translations } = useTranslations()
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector((state) => state.auth)

  const handleResendVerification = async () => {
    dispatch(resendVerification())
  }

  useEffect(() => {
    dispatch(clearMessages())
  }, [dispatch])

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
            <div className="text-center mb-4">
              <p className="text-sm text-dark mb-4">
                {t(translations.modules.loginForm.emailNotVerified.message)}
              </p>
              <p className="text-sm text-dark ">
                {t(translations.modules.loginForm.emailNotVerified.resendLink, {
                  email,
                })}
              </p>
            </div>
            <div className="flex justify-center mb-4">
              <LoadingButton
                type="button"
                onClick={handleResendVerification}
                aria-label={t(
                  translations.modules.loginForm.emailNotVerified.resendLink,
                  {
                    email,
                  }
                )}
                className="bg-[#1A237E] text-white py-2 px-4 rounded 
                hover:bg-[#FF8C00] w-full sm:w-auto
                transition-all duration-300
                [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                hover:shadow-lg transform hover:-translate-y-0.5
                shadow-md hover:shadow-[#FF8C00]/20"
                faIcon={faPaperPlane}
                loading={loading}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
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
        {success && (
          <div className="mt-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {t(translations.modules.loginForm.emailNotVerified.resendLinkInfo, {
              email,
            })}
          </div>
        )}
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error.message}
            {error &&
              error.code ===
                BusinessErrorCode.SEND_EMAIL_VERIFICATION_ERROR && (
                <span className="block text-sm text-red-600 mt-1 underline cursor-pointer ">
                  {t(
                    translations.modules.loginForm.emailNotVerified
                      .resendLinkError,
                    { email }
                  )}
                </span>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificationForm
