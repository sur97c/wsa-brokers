// middleware.ts

import { SectionRole } from '@/models/user/roles'
import type { SessionResponse } from '@/models/session/types'
import { logMessage } from '@/utils/logger/logger'
import { LogLevel } from '@/utils/logger/types'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS: Record<string, SectionRole[]> = {
  '/app/payments': [SectionRole.PAYMENTS],
  '/app/quotes': [SectionRole.QUOTES],
  '/app/policies': [SectionRole.POLICIES],
  '/app/claims': [SectionRole.CLAIMS],
  '/app/reports': [SectionRole.REPORTS],
  '/app/clients': [SectionRole.CLIENTS],
  '/app/management': [SectionRole.USER_MANAGEMENT, SectionRole.ROLE_MANAGEMENT],
  '/app/dashboard': [SectionRole.DASHBOARD],
} as const

export async function middleware(request: NextRequest) {
  await logMessage('====== MIDDLEWARE START ======')
  await logMessage('Request URL: {url}', { url: request.url })

  const pathname = request.nextUrl.pathname
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '')

  await logMessage('Checking path: {path}', { path: pathWithoutLang })

  if (!pathWithoutLang.startsWith('/app/')) {
    await logMessage('⚪ Not a protected route')
    return NextResponse.next()
  }

  await logMessage('Protected route detected')
  const sessionId = request.cookies.get('sessionId')

  if (!sessionId?.value) {
    await logMessage('No session found')
    return redirectToLogin(request)
  }

  await logMessage(
    'Checking session: {sessionId}, service: {service}/api/session/validate',
    {
      sessionId: request.cookies.get('sessionId')?.value,
      service: request.nextUrl.origin,
    }
  )

  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/session/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: sessionId.value }),
      }
    )

    if (!response.ok) {
      await logMessage('Session validation failed: {status}', {
        status: response.status,
      })
      return handleInvalidSession(request)
    }
    await logMessage('Session validation successful, reviewing response')

    await logMessage('Response: {response}', { response: response })

    const responseText = await response.text()

    await logMessage('Response text: {responseText}', { responseText })

    const result = (await response.json()) as SessionResponse

    if (!result.valid) {
      await logMessage('Session validation failed:', result.error)
      return handleInvalidSession(request)
    }

    await logMessage('Session validated')

    const protectedRoute = Object.keys(PROTECTED_PATHS).find((route) =>
      pathWithoutLang.startsWith(route)
    )

    if (protectedRoute) {
      const requiredRoles = PROTECTED_PATHS[protectedRoute]
      const userSectionRoles = result.data?.roles.sectionRoles

      if (!hasRequiredSectionRoles(userSectionRoles || [], requiredRoles)) {
        await logMessage(
          'User lacks required sectionRoles: {required}, {userSectionRoles}',
          {
            required: requiredRoles,
            userSectionRoles,
          }
        )
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    await logMessage('Access granted')
    return NextResponse.next()
  } catch (error) {
    await logMessage('Middleware error: {error}', { error }, LogLevel.ERROR)
    return handleInvalidSession(request)
  } finally {
    await logMessage('====== MIDDLEWARE END ======')
  }
}

function hasRequiredSectionRoles(
  userRoles: string[],
  requiredRoles: readonly string[]
): boolean {
  return (
    Array.isArray(userRoles) &&
    Array.isArray(requiredRoles) &&
    requiredRoles.some((role) => userRoles.includes(role))
  )
}

function redirectToLogin(request: NextRequest) {
  const url = new URL('/login', request.url)
  url.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

function handleInvalidSession(request: NextRequest) {
  const response = redirectToLogin(request)
  response.cookies.delete('sessionId')
  return response
}

export const config = {
  matcher: [
    // Rutas protegidas (con y sin prefijo de idioma)
    '/app/:path*',
    '/:lang/app/:path*',
  ],
}
