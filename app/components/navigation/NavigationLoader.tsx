// app/components/navigation/NavigationLoader.tsx

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LoadingMessage } from '@/components/loading/LoadingMessage'
import { useNavigationLoader } from '@/hooks/navigation/useNavigationLoader'

export const NavigationLoader = () => {
  const { isNavigating, loadingMessage } = useNavigationLoader()

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <LoadingMessage message={loadingMessage} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
