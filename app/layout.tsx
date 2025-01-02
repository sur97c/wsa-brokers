// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientProviders from '@/providers/client.provider'
import './globals.scss'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'WSA Brokers',
  description: 'WSA Brokers',
  icons: {
    icon: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${inter.variable} font-sans`}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
