import type { Metadata } from 'next'
import { ShieldCheck, Sparkles, Truck, Heart, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nós | Start One Imports',
  description: 'Conheça a Start One Imports — importação inteligente de perfumes árabes e importados originais.',
}

const diferenciais = [
  {
    icon: ShieldCheck,
    titulo: 'Autenticidade garantida',
    desc: 'Todos os nossos perfumes são 100% originais, adquiridos diretamente de distribuidores autorizados. Nunca vendemos réplicas ou inspirações.',
  },
  {
    icon: Sparkles,
    titulo: 'Curadoria especializada',
    desc: 'Cada perfume do nosso catálogo é selecionado com cuidado — testamos, aprovamos e só então oferecemos ao nosso cliente.',
  },
  {
    icon: Heart,
    titulo: 'Sistema de decants',
    desc: 'Criamos o sistema de decants justamente para que você possa experimentar antes de investir. Acreditamos que você merece se apaixonar antes de comprar.',
  },
  {
    icon: Truck,
    titulo: 'Entrega segura',
    desc: 'Embalamos com cuidado para que seu perfume chegue intacto. Enviamos para todo o Brasil com rastreamento e suporte pós-entrega.',
  },
]

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-14">

      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] font-bold mb-3">Nossa história</p>
        <h1 className="text-4xl md:text-5xl font-black text-[#F5F5F5] mb-5 leading-tight">
          Importação inteligente,<br />
          <span className="gold-text">produtos de alto padrão</span>
        </h1>
        <p className="text-[#888] text-base leading-relaxed max-w-xl mx-auto">
          A Start One nasceu da paixão por fragrâncias e da frustração de pagar preços absurdos
          por perfumes que poderiam ser acessíveis. Resolvemos mudar isso.
        </p>
      </div>

      {/* História */}
      <div className="card-dark p-8 md:p-10 mb-10">
        <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">Como tudo começou</h2>
        <div className="space-y-4 text-sm text-[#888] leading-relaxed">
          <p>
            A <strong className="text-[#C9A84C]">Start One Imports</strong> surgiu da vontade de trazer ao Brasil o melhor do mercado de perfumaria árabe e internacional,
            sem os exageros de preço que afastam quem realmente ama fragrâncias.
          </p>
          <p>
            Percebemos que marcas como <strong className="text-[#F5F5F5]">Lattafa, Rasasi, Armaf e Al Haramain</strong> — gigantes do Oriente Médio —
            eram praticamente desconhecidas por aqui, apesar de rivalizarem em qualidade com grandes grifes europeias por uma fração do preço.
          </p>
          <p>
            Decidimos importar com inteligência, selecionar com critério e oferecer a você a experiência completa:
            desde o <strong className="text-[#F5F5F5]">decant de 5ml</strong> para experimentar sem comprometer o orçamento, até o
            frasco completo quando o amor é confirmado.
          </p>
        </div>
      </div>

      {/* Diferenciais */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-[#F5F5F5] mb-6 text-center">Por que escolher a Start One?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diferenciais.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="card-dark p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5] mb-1">{titulo}</h3>
                <p className="text-xs text-[#888] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Números */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { numero: '20+', label: 'Perfumes no catálogo' },
          { numero: '200+', label: 'Clientes satisfeitos' },
          { numero: '5★', label: 'Avaliação média' },
        ].map(({ numero, label }) => (
          <div key={label} className="card-dark p-6 text-center">
            <p className="text-3xl font-black gold-text mb-1">{numero}</p>
            <p className="text-xs text-[#555]">{label}</p>
          </div>
        ))}
      </div>

      {/* Rating */}
      <div className="card-dark p-8 mb-10 text-center">
        <div className="flex justify-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={22} className="text-[#C9A84C] fill-[#C9A84C]" />
          ))}
        </div>
        <p className="text-lg font-bold text-[#F5F5F5] mb-1">"Minha loja de perfumes de confiança"</p>
        <p className="text-sm text-[#888]">— avaliação de clientes no Instagram @start_oneoficial</p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-[#888] text-sm mb-5">Pronto para encontrar sua próxima fragrância favorita?</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/" className="btn-gold text-sm px-8 py-3">Ver Catálogo</Link>
          <a
            href="https://instagram.com/start_oneoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold text-sm px-8 py-3"
          >
            Seguir no Instagram
          </a>
        </div>
      </div>
    </div>
  )
}
