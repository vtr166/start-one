import Link from 'next/link'
import { Droplets, Gift, Sparkles } from 'lucide-react'

export default function SecaoDecants() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/25 bg-gradient-to-br from-[#1a1200] via-[#0f0f0f] to-[#0a0a0a] p-8 md:p-10">

        {/* Círculo decorativo */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }} />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }} />

        <div className="relative flex flex-col md:flex-row items-center gap-8">

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Sparkles size={13} className="text-[#C9A84C]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Combos Exclusivos</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#F5F5F5] mb-2">
              Descubra sem compromisso
            </h2>
            <p className="text-[#888] text-sm leading-relaxed max-w-md mb-5">
              Decants de <strong className="text-[#C9A84C]">5ml retirados dos frascos originais</strong>. Teste, se apaixone, depois invista. Com nossos combos você ainda economiza.
            </p>

            {/* Badges dos combos */}
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30">
                <Gift size={14} className="text-[#C9A84C]" />
                <span className="text-xs font-bold text-[#C9A84C]">Compre 4, Pague 3</span>
                <span className="text-[10px] bg-[#C9A84C] text-[#0A0A0A] font-black px-1.5 py-0.5 rounded-full">25% OFF</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                <Gift size={14} className="text-green-400" />
                <span className="text-xs font-bold text-green-400">Compre 6, Pague 4</span>
                <span className="text-[10px] bg-green-500 text-white font-black px-1.5 py-0.5 rounded-full">33% OFF</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex flex-col gap-3 text-center min-w-[180px]">
            <Link href="/decants" className="btn-gold text-sm px-8 py-3 whitespace-nowrap flex items-center justify-center gap-2">
              <Droplets size={15} />
              Montar meu Kit
            </Link>
            <p className="text-[10px] text-[#555]">A partir de R$ 18,00 · {'>'}20 perfumes disponíveis</p>
          </div>
        </div>
      </div>
    </section>
  )
}
