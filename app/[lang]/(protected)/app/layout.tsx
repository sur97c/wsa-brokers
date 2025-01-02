// app/[lang]/(protected)/app/layout.tsx

'use client'

import { AuthStateListener } from '@/components/auth/AuthStateListener'
import Navigation from '@/components/navigation/Navigation'
import { useState } from 'react'
import { NavigationLoaderProvider } from '@/components/navigation/NavigationLoaderProvider'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthStateListener>
      <NavigationLoaderProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <Navigation
            isOpen={isSidebarOpen}
            onToggle={() => setSidebarOpen(!isSidebarOpen)}
          />
          <div
            className={`flex-1 transition-all duration-300 overflow-auto
                ml-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'} mt-16 md:mt-0`}
          >
            <main className="relative w-full min-h-full">
              <div className="p-8">{children}</div>
            </main>
          </div>
        </div>
      </NavigationLoaderProvider>
    </AuthStateListener>
  )
}
