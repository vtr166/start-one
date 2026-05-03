'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarBanner(data: {
  badge?: string; titulo1: string; titulo2: string; subtitulo?: string
  imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel?: string; ctaHref?: string; ctaSecLabel?: string; ctaSecHref?: string
  stat1n?: string; stat1label?: string; stat2n?: string; stat2label?: string
  stat3n?: string; stat3label?: string; ordem: number
}) {
  await prisma.banner.create({ data })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function atualizarBanner(id: string, data: Partial<{
  badge: string; titulo1: string; titulo2: string; subtitulo: string
  imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel: string; ctaHref: string; ctaSecLabel: string; ctaSecHref: string
  stat1n: string; stat1label: string; stat2n: string; stat2label: string
  stat3n: string; stat3label: string; ordem: number; ativo: boolean
}>) {
  await prisma.banner.update({ where: { id }, data })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function deletarBanner(id: string) {
  await prisma.banner.delete({ where: { id } })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function importarBannersPadrao() {
  const existe = await prisma.banner.count()
  if (existe > 0) return // já tem banners, não sobrescreve

  const FOTO_FEM  = 'https://images.unsplash.com/photo-1595425959632-34f2822322ce?auto=format&fit=crop&w=1920&q=85'
  const FOTO_MASC = 'https://images.unsplash.com/photo-IEmvTxmJvxY?auto=format&fit=crop&w=1920&q=85'
  const FOTO_GOLD = 'https://images.unsplash.com/photo-NPLI1mFBxlw?auto=format&fit=crop&w=1920&q=85'

  await prisma.banner.createMany({
    data: [
      {
        badge: '🌸 Mais Vendido',
        titulo1: 'O cheiro que',
        titulo2: 'elas não esquecem.',
        subtitulo: 'Lattafa Yara EDP — doce, tropical, fixação de 8h+. O favorito absoluto das brasileiras.',
        imagemUrl: FOTO_FEM,
        acento: '#f9a8d4',
        glow: '#ec4899',
        overlay: 'linear-gradient(100deg,rgba(10,0,8,0.97) 0%,rgba(30,0,20,0.85) 38%,rgba(80,0,50,0.45) 65%,transparent 100%)',
        ctaLabel: 'Comprar Yara',
        ctaHref: '/produto/lattafa-yara',
        ctaSecLabel: 'Experimentar decant',
        ctaSecHref: '/decants',
        stat1n: '+500', stat1label: 'pedidos entregues',
        stat2n: '4.9★', stat2label: 'avaliação média',
        stat3n: '8h+',  stat3label: 'fixação garantida',
        ordem: 0,
      },
      {
        badge: '🔵 Para Ele',
        titulo1: 'Luxo árabe no',
        titulo2: 'seu pescoço.',
        subtitulo: 'Club de Nuit, Asad e Hawas — projeção real, fixação poderosa, elegância que impressiona.',
        imagemUrl: FOTO_MASC,
        acento: '#93c5fd',
        glow: '#3b82f6',
        overlay: 'linear-gradient(100deg,rgba(0,8,20,0.97) 0%,rgba(0,15,35,0.87) 38%,rgba(0,30,70,0.45) 65%,transparent 100%)',
        ctaLabel: 'Ver masculinos',
        ctaHref: '/?genero=MASCULINO',
        ctaSecLabel: 'Montar kit decant',
        ctaSecHref: '/decants',
        stat1n: '+40',  stat1label: 'fragrâncias no catálogo',
        stat2n: '100%', stat2label: 'frascos originais',
        stat3n: '24h',  stat3label: 'entrega expressa',
        ordem: 1,
      },
      {
        badge: '💧 Decants Originais',
        titulo1: 'Experimente antes',
        titulo2: 'de comprar.',
        subtitulo: 'Decants de 5ml retirados dos frascos originais. Compre 4 Pague 3 — experimente sem compromisso.',
        imagemUrl: FOTO_GOLD,
        acento: '#fde68a',
        glow: '#d97706',
        overlay: 'linear-gradient(100deg,rgba(10,8,0,0.97) 0%,rgba(25,18,0,0.87) 38%,rgba(60,40,0,0.45) 65%,transparent 100%)',
        ctaLabel: 'Montar meu kit',
        ctaHref: '/decants',
        ctaSecLabel: 'Ver catálogo completo',
        ctaSecHref: '/',
        stat1n: '5ml',  stat1label: 'por decant original',
        stat2n: '4×3',  stat2label: 'kit com desconto',
        stat3n: '+40',  stat3label: 'opções disponíveis',
        ordem: 2,
      },
    ],
  })

  revalidatePath('/admin/banners')
  revalidatePath('/')
}
