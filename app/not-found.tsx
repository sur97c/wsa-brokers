// app/not-found.tsx

import { headers } from 'next/headers'

import ServerErrorPage from '@/components/errors/ServerErrorPage'

export default async function RootNotFound() {
  // Get URL from headers in server component
  const headersList = await headers()
  const pathname = headersList.get('referer') || ''

  // Extract language from pathname
  const params = pathname.match(/\/\/.*\/(?<lang>[a-z]{2})/)
  const lang = params?.groups?.lang || 'es'

  return <ServerErrorPage lang={lang} />
}
