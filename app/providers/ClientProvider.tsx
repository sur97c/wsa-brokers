'use client'

import React, { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store'

interface ClientProvidersProps {
  children: ReactNode
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  )
}

export default ClientProviders
