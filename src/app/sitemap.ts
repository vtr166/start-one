import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startoneimports.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    select: { slug: true, atualizadoEm: true },
  })

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE}/decants`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/sobre`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/faq`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const produtoPages: MetadataRoute.Sitemap = produtos.map((p) => ({
    url:             `${BASE}/produto/${p.slug}`,
    lastModified:    p.atualizadoEm,
    changeFrequency: 'weekly' as const,
    priority:        0.9,
  }))

  return [...staticPages, ...produtoPages]
}
