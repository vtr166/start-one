'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Lê ?ref=slug da URL e salva cookie por 30 dias.
 * Adicione <AffiliateTracker /> no layout raiz (dentro de <Suspense>).
 */
export default function AffiliateTracker() {
  const params = useSearchParams()

  useEffect(() => {
    const ref = params.get('ref')
    if (!ref) return

    // Salva cookie por 30 dias
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    document.cookie = `affiliate_ref=${encodeURIComponent(ref)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  }, [params])

  return null
}
