// app/components/navigation/NavigationLoader.tsx

'use client'

import { AnimatePresence } from 'framer-motion'

import { LoadingMessage } from '@/components/loading/LoadingMessage'
import { useNavigationLoader } from '@/hooks/navigation/useNavigationLoader'

export const NavigationLoader = () => {
  const { isNavigating, loadingMessage } = useNavigationLoader()

  return (
    <AnimatePresence>
      {isNavigating && (
        <div className="fixed inset-0 z-50 transition-opacity duration-300 opacity-100">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 scale-100">
              <LoadingMessage message={loadingMessage} />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
