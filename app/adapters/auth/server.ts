// app/adapters/auth/server.ts

'use server'

import { headers } from 'next/headers'

export async function getDeviceInformationFromHeaders(): Promise<
  Partial<{ userAgent: string; ip?: string }>
> {
  const headersList = await headers()

  return {
    userAgent: headersList.get('user-agent') || 'unknown',
    ip:
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      headersList.get('x-client-ip') ||
      'unknown',
  }
}
