'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Renderiza header/footer/extras apenas fora de rotas /promo/*.
 * Páginas de landing page de tráfego pago ficam "nuas" (sem nav global).
 */
export default function ConditionalLayout({
  children,
  header,
  footer,
  extras,
}: {
  children: ReactNode
  header: ReactNode
  footer: ReactNode
  extras: ReactNode
}) {
  const pathname = usePathname()
  const isPromo = pathname?.startsWith('/promo/')

  if (isPromo) {
    // Landing pages: sem header, footer ou pop-ups
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {extras}
    </>
  )
}
