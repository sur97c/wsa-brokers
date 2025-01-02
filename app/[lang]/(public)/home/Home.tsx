// app/[lang]/(public)/home/Home.tsx

import React, { useState } from 'react'
import clsx from 'clsx'
import {
  FlipCard,
  type BackContentType,
} from '@/components/ui/FlipCard/FlipCard'
import { useTranslations } from '@/translations/hooks/useTranslations'
import LoginForm from '@/components/auth/LoginForm'
import RecoveryForm from '@/components/auth/RecoveryForm'
import Header from './components/Header'
import FeatureSection from './components/FeatureSection'
import VerificationForm from '@/components/auth/VerificationForm'
import { AnimatedBackground } from '@/components/background/AnimatedBackground'
// import { VideoBackground } from '@/components/background/VideoBackground'

const Home: React.FC = () => {
  const { t, translations } = useTranslations()
  const [showLogin, setShowLogin] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [backContent, setBackContent] = useState<BackContentType>('recovery')
  const [verificationEmail, setVerificationEmail] = useState<string>('')

  const handleLoginClick = (type: BackContentType = 'recovery') => {
    setBackContent(type)
    setShowLogin(true)
    requestAnimationFrame(() => {
      setIsTransitioning(true)
    })
  }

  const handleCloseLogin = () => {
    setIsTransitioning(false)
    setTimeout(() => {
      setIsFlipped(false)
      setShowLogin(false)
    }, 1000)
  }

  const getBackContent = () => {
    switch (backContent) {
      case 'recovery':
        return (
          <RecoveryForm
            onFlip={() => {
              setIsFlipped(false)
              setBackContent('recovery')
            }}
            onClose={handleCloseLogin}
          />
        )
      case 'verification':
        return (
          <VerificationForm
            email={verificationEmail}
            onFlip={() => {
              setIsFlipped(false)
              setBackContent('recovery')
            }}
            onClose={handleCloseLogin}
          />
        )
    }
  }

  // {
  //   /* <VideoBackground
  //       videoSrc="/videos/background.mp4"
  //       overlayOpacity={30}
  //       fallbackImage="/images/poster.jpg"
  //     >
  //       {children}
  //     </VideoBackground> */
  // }
  // {
  //   /* <AnimatedBackground overlayOpacity={30}>{children}</AnimatedBackground> */
  // }
  return (
    <AnimatedBackground overlayOpacity={30}>
      <div className="min-h-screen relative">
        <Header />
        <main className="flex flex-col">
          <section
            className="flex flex-col items-center justify-center px-4 md:px-6 
            text-center mb-32"
          >
            {' '}
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 
              transition-all duration-500 max-w-4xl
              [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
              hover:text-[#1A237E]"
            >
              {t(translations.modules.home.welcome)}
            </h1>
            <p
              className="text-base md:text-lg lg:text-xl mb-8 text-gray-600 
              transition-all duration-300 max-w-2xl px-4
              hover:text-[#1A237E]/80"
            >
              {t(translations.modules.home.message)}
            </p>
            <button
              onClick={() => handleLoginClick()}
              className="px-6 py-2 bg-gray-800 text-white rounded transition-all duration-500
                [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                hover:bg-[#FF8C00] hover:shadow-lg transform hover:-translate-y-0.5
                shadow-md hover:shadow-[#FF8C00]/20"
            >
              {t(translations.modules.home.login)}
            </button>
          </section>

          <div className="relative">
            <FeatureSection />
          </div>
        </main>

        {showLogin && (
          <div
            className={clsx(
              'fixed inset-0 bg-black transition-all duration-1000',
              isTransitioning ? 'bg-opacity-50' : 'bg-opacity-0'
            )}
            style={{ marginTop: '-150px' }}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className={clsx(
                  'transform transition-all duration-1000 w-full',
                  isTransitioning
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                )}
              >
                <div
                  className={clsx(
                    'bg-white rounded-lg shadow-lg',
                    'transition-all duration-1000',
                    '[filter:grayscale(100%)] hover:[filter:grayscale(0%)]',
                    'hover:shadow-xl hover:shadow-[#FF8C00]/20',
                    'border-transparent hover:border-[#FF8C00]',
                    'relative'
                  )}
                >
                  <div className="relative">
                    <FlipCard
                      frontContent={
                        <LoginForm
                          onFlip={() => setIsFlipped(true)}
                          onClose={handleCloseLogin}
                          onNeedVerification={(email) => {
                            setVerificationEmail(email)
                            setBackContent('verification')
                            setIsFlipped(true)
                          }}
                        />
                      }
                      backContent={getBackContent()}
                      isFlipped={isFlipped}
                      extraWidth={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  )
}

export default Home
