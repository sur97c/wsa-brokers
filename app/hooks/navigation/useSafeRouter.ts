// hooks/navigation/useSafeRouter.ts

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/translations/hooks/useLanguage'

export function useSafeRouter() {
  const { language } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  const safeNavigate = (path: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    // Always include language in path for both public and protected routes
    const fullPath =
      cleanPath !== '' ? `/${language}/app/${cleanPath}` : `/${language}`

    if (isMounted) {
      router.push(fullPath)
    } else if (typeof window !== 'undefined') {
      window.location.href = fullPath
    }
  }

  return { safeNavigate }
}
