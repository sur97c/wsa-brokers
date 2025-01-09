// middleware.ts

import { SectionRole } from '@/models/user/roles'
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

async function validateSession(
  request: NextRequest,
  sessionId: string
): Promise<{
  valid: boolean
  data?: any
  error?: string
}> {
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/session/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      }
    )

    const textResponse = await response.text()

    await logMessage('Validate Session Response >> Status: {status}', {
      status: response.status,
    })

    await logMessage('Validate Session Response >> Headers: {headers}', {
      headers: Object.fromEntries(response.headers.entries()),
    })

    await logMessage(
      'Validate Session Response >> RawResponse: {rawResponse}',
      {
        rawResponse: textResponse,
      }
    )

    if (!textResponse) {
      return {
        valid: false,
        error: 'Empty response from validation endpoint',
      }
    }

    let result
    try {
      result = JSON.parse(textResponse)
    } catch (error) {
      await logMessage(
        'Error parsing validation error: {error}, response: {response}',
        {
          error: error,
          response: textResponse,
        },
        LogLevel.ERROR
      )
      return {
        valid: false,
        error: `Invalid JSON response: ${textResponse.slice(0, 100)}...`,
      }
    }

    return {
      valid: true,
      data: result,
    }
  } catch (error) {
    await logMessage(
      'Session validation error: {error}',
      { error },
      LogLevel.ERROR
    )
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : 'Unknown validation error',
    }
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '')

  await logMessage('=== MIDDLEWARE START ===')
  await logMessage('middleware::Request URL: {url}', { url: request.url })
  await logMessage('middleware::Method: {method}', { method: request.method })
  await logMessage('middleware::Pathname: {pathname}', {
    pathname: pathname,
  })
  await logMessage('middleware::Path without lang: {pathWithoutLang}', {
    pathWithoutLang: pathWithoutLang,
  })

  if (!pathWithoutLang.startsWith('/app/')) {
    logMessage('⚪ middleware::{pathWithoutLang} Not a protected route', {
      pathWithoutLang: pathWithoutLang,
    })
    return NextResponse.next()
  }

  if (request.method === 'OPTIONS') {
    await logMessage('middleware::OPTIONS request detected, allowing')
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  const sessionId = request.cookies.get('sessionId')
  await logMessage('middleware::Session ID: {sessionId}', {
    sessionId: sessionId?.value,
  })

  if (!sessionId?.value) {
    await logMessage(
      'middleware::No session found, redirecting to login',
      LogLevel.WARN
    )
    return redirectToLogin(request)
  }

  const protectedRoute = Object.keys(PROTECTED_PATHS).find((route) =>
    pathWithoutLang.startsWith(route)
  )
  await logMessage('middleware::Protected route: {protectedRoute}', {
    protectedRoute: protectedRoute,
  })

  if (protectedRoute) {
    const validation = await validateSession(request, sessionId.value)
    if (!validation.valid) {
      await logMessage(
        'Session validation failed: {error}',
        { error: validation.error },
        LogLevel.ERROR
      )
      return redirectToLogin(request)
    }

    const result = await validation.data
    await logMessage('middleware::Session validation result: {result}', {
      result,
    })

    const requiredRoles = PROTECTED_PATHS[protectedRoute]
    await logMessage('middleware::Required roles: {requiredRoles}', {
      requiredRoles: requiredRoles,
    })

    const userSectionRoles = result.data?.roles.sectionRoles
    await logMessage(
      'middleware::User section requiredRoles: {requiredRoles}, userSectionRoles: {userSectionRoles}',
      {
        userSectionRoles: userSectionRoles,
        requiredRoles: requiredRoles,
      }
    )

    if (!hasRequiredSectionRoles(userSectionRoles || [], requiredRoles)) {
      await logMessage(
        'middleware::User lacks required section roles, redirecting to unauthorized',
        LogLevel.WARN
      )
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  await logMessage('middleware::Access granted')
  await logMessage('=== MIDDLEWARE END ===')
  return NextResponse.next()
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

const redirectToLogin = async (request: NextRequest) => {
  const url = new URL('/login', request.url)
  url.searchParams.set('redirect', request.nextUrl.pathname)
  await logMessage('middleware::redirectToLogin, redirect to {pathname}', {
    pathname: url.toString(),
  })
  return NextResponse.redirect(url)
}

// Ajustando el matcher para incluir OPTIONS
export const config = {
  matcher: [
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/app/:path*',
    '/:lang/app/:path*',
  ],
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { SectionRole } from '@/models/user/roles'
// import type { SessionResponse } from '@/models/session/types'

// const isDev = process.env.NODE_ENV === 'development'

// export async function middleware(request: NextRequest) {
//   logger.log('====== MIDDLEWARE START ======')
//   logger.log('Request URL:', request.url)

//   const pathname = request.nextUrl.pathname
//   const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '')

//   logger.log('Checking path:', pathWithoutLang)

//   if (!pathWithoutLang.startsWith('/app/')) {
//     logger.log('⚪ Not a protected route')
//     return NextResponse.next()
//   }

//   logger.log('Protected route detected')
//   const sessionId = request.cookies.get('sessionId')

//   if (!sessionId?.value) {
//     logger.log('No session found')
//     return redirectToLogin(request)
//   }

//   try {
//     const response = await fetch(
//       `${request.nextUrl.origin}/api/session/validate`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ sessionId: sessionId.value }),
//       }
//     )

//     const result = (await response.json()) as SessionResponse

//     if (!result.valid) {
//       logger.log('Session validation failed:', result.error)
//       return handleInvalidSession(request)
//     }

//     logger.log('Session validated')

//     const protectedRoute = Object.keys(PROTECTED_PATHS).find((route) =>
//       pathWithoutLang.startsWith(route)
//     )

//     if (protectedRoute) {
//       const requiredRoles = PROTECTED_PATHS[protectedRoute]
//       const userSectionRoles = result.data?.roles.sectionRoles

//       if (!hasRequiredSectionRoles(userSectionRoles || [], requiredRoles)) {
//         logger.log('User lacks required sectionRoles:', {
//           required: requiredRoles,
//           userSectionRoles,
//         })
//         return NextResponse.redirect(new URL('/unauthorized', request.url))
//       }
//     }

//     logger.log('Access granted')
//     return NextResponse.next()
//   } catch (error) {
//     logger.error('Middleware error:', error)
//     return handleInvalidSession(request)
//   }
// }

// function hasRequiredSectionRoles(
//   userRoles: string[],
//   requiredRoles: readonly string[]
// ): boolean {
//   return (
//     Array.isArray(userRoles) &&
//     Array.isArray(requiredRoles) &&
//     requiredRoles.some((role) => userRoles.includes(role))
//   )
// }

// function redirectToLogin(request: NextRequest) {
//   const url = new URL('/login', request.url)
//   url.searchParams.set('redirect', request.nextUrl.pathname)
//   return NextResponse.redirect(url)
// }

// function handleInvalidSession(request: NextRequest) {
//   const response = redirectToLogin(request)
//   response.cookies.delete('sessionId')
//   return response
// }

// export const config = {
//   matcher: [
//     // Rutas protegidas (con y sin prefijo de idioma)
//     '/app/:path*',
//     '/:lang/app/:path*',
//   ],
// }
