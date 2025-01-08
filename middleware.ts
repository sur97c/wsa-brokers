// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Usando console.warn para asegurar que se muestren los logs
  console.warn('=== MIDDLEWARE START ===')
  console.warn('Request URL:', request.url)
  console.warn('Method:', request.method)
  console.warn('Pathname:', request.nextUrl.pathname)

  const pathname = request.nextUrl.pathname

  // Si es una petición OPTIONS, permitirla
  if (request.method === 'OPTIONS') {
    console.warn('OPTIONS request detected, allowing')
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  if (!pathname.includes('/app/')) {
    console.warn('Not a protected route, proceeding')
    return NextResponse.next()
  }

  const sessionId = request.cookies.get('sessionId')
  console.warn('Session ID:', sessionId?.value)

  if (!sessionId?.value) {
    console.warn('No session found, redirecting to login')
    return redirectToLogin(request)
  }

  console.warn('=== MIDDLEWARE END ===')
  return NextResponse.next()
}

function redirectToLogin(request: NextRequest) {
  const url = new URL('/login', request.url)
  url.searchParams.set('redirect', request.nextUrl.pathname)
  console.warn('Redirecting to:', url.toString())
  return NextResponse.redirect(url)
}

// Ajustando el matcher para incluir OPTIONS
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/app/:path*',
    '/:lang/app/:path*',
  ],
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { SectionRole } from '@/models/user/roles'
// import type { SessionResponse } from '@/models/session/types'

// const isDev = process.env.NODE_ENV === 'development'

// const logger = {
//   log: (...args: unknown[]) => {
//     if (isDev) {
//       console.log(...args)
//     }
//   },
//   error: (...args: unknown[]) => {
//     if (isDev) {
//       console.error(...args)
//     }
//   },
// }

// const PROTECTED_PATHS: Record<string, SectionRole[]> = {
//   '/app/payments': [SectionRole.PAYMENTS],
//   '/app/quotes': [SectionRole.QUOTES],
//   '/app/policies': [SectionRole.POLICIES],
//   '/app/claims': [SectionRole.CLAIMS],
//   '/app/reports': [SectionRole.REPORTS],
//   '/app/clients': [SectionRole.CLIENTS],
//   '/app/management': [SectionRole.USER_MANAGEMENT, SectionRole.ROLE_MANAGEMENT],
//   '/app/dashboard': [SectionRole.DASHBOARD],
// } as const

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
