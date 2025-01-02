// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = {
  '/app/payments': ['payments'],
  '/app/quotes': ['quotes'],
  '/app/policies': ['policies'],
  '/app/claims': ['claims'],
  '/app/reports': ['reports'],
  '/app/clients': ['clients'],
  '/app/management': ['management'],
  '/app/dashboard': ['dashboard'],
} as const

export async function middleware(request: NextRequest) {
  console.log('====== MIDDLEWARE START ======')
  console.log('🔒 Request URL:', request.url)

  const pathname = request.nextUrl.pathname
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '')

  console.log('📍 Checking path:', pathWithoutLang)

  // Si no es ruta protegida, permitir acceso
  if (!pathWithoutLang.startsWith('/app/')) {
    console.log('⚪ Not a protected route')
    return NextResponse.next()
  }

  console.log('🛡️ Protected route detected')
  const sessionId = request.cookies.get('sessionId')

  if (!sessionId?.value) {
    console.log('❌ No session found')
    return redirectToLogin(request)
  }

  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/session/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId.value,
          path: pathWithoutLang,
        }),
      }
    )

    const result = await response.json()

    if (!result.valid) {
      console.log('❌ Session validation failed:', result.error)
      return handleInvalidSession(request)
    }

    console.log('✅ Session validated')

    // Verificar roles si es necesario
    const protectedRoute = Object.keys(PROTECTED_PATHS).find((route) =>
      pathWithoutLang.startsWith(route)
    ) as keyof typeof PROTECTED_PATHS | undefined

    if (protectedRoute) {
      const requiredRoles = PROTECTED_PATHS[protectedRoute]
      const userRoles = result.data.roles

      if (!hasRequiredRoles(userRoles, requiredRoles)) {
        console.log('❌ User lacks required roles:', {
          required: requiredRoles,
          userRoles,
        })
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    console.log('✅ Access granted')
    return NextResponse.next()
  } catch (error) {
    console.error('❌ Middleware error:', error)
    return handleInvalidSession(request)
  }
}

function hasRequiredRoles(
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
