/* ─── Meta Pixel — helper de eventos ──────────────────────────
   Chama window.fbq de forma segura (só existe no cliente).
   ─────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args)
  }
}

/** Usuário adicionou item ao carrinho */
export function pixelAddToCart(params: {
  value: number
  currency?: string
  contentName?: string
}) {
  fbq('track', 'AddToCart', {
    value:        params.value,
    currency:     params.currency ?? 'BRL',
    content_name: params.contentName,
  })
}

/** Usuário entrou no checkout */
export function pixelInitiateCheckout(params: {
  value: number
  numItems: number
  currency?: string
}) {
  fbq('track', 'InitiateCheckout', {
    value:     params.value,
    num_items: params.numItems,
    currency:  params.currency ?? 'BRL',
  })
}

/** Compra confirmada (evento mais valioso) */
export function pixelPurchase(params: {
  value: number
  orderId?: string
  currency?: string
}) {
  fbq('track', 'Purchase', {
    value:      params.value,
    currency:   params.currency ?? 'BRL',
    content_ids: [params.orderId ?? ''],
  })
}

/** Usuário visualizou a landing page de oferta */
export function pixelViewContent(params: {
  contentName: string
  value?: number
  currency?: string
}) {
  fbq('track', 'ViewContent', {
    content_name: params.contentName,
    value:        params.value,
    currency:     params.currency ?? 'BRL',
  })
}
