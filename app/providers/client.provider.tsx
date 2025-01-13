// app/providers/client.provider.tsx

'use client'

import React, { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { LanguageProvider } from '@/providers/language.provider'
import { NavigationLoaderProvider } from '@/providers/navigation-loader.provider'
import { store, persistor } from '@/redux/store'

interface ClientProvidersProps {
  children: ReactNode
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
        </LanguageProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default ClientProviders
