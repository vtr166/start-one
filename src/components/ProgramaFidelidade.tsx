import { Gift, Star, ShoppingBag } from 'lucide-react'

export default function ProgramaFidelidade() {
  const passos = [
    { icon: ShoppingBag, label: '1ª compra', desc: 'Qualquer produto' },
    { icon: ShoppingBag, label: '2ª compra', desc: 'Acumula pontos' },
    { icon: ShoppingBag, label: '3ª compra', desc: 'Metade do caminho' },
    { icon: ShoppingBag, label: '4ª compra', desc: 'Quase lá!' },
    { icon: Gift, label: '5ª compra', desc: '1 decant GRÁTIS 🎉', destaque: true },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="card-dark p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-4">
            <Star size={12} className="text-[#C9A84C]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Programa de Fidelidade</span>
          </div>
          <h2 className="text-2xl font-black text-[#F5F5F5] mb-2">
            A cada 5 compras,<br />
            <span className="text-[#C9A84C]">1 decant grátis</span>
          </h2>
          <p className="text-sm text-[#888] max-w-sm mx-auto">
            Compre, acumule e ganhe um decant da sua escolha completamente grátis na quinta compra.
          </p>
        </div>

        {/* Passos */}
        <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2">
          {passos.map((passo, i) => {
            const Icon = passo.icon
            return (
              <div key={i} className="flex items-center">
                <div className={`flex flex-col items-center text-center w-20 sm:w-24 ${passo.destaque ? '' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all ${
                    passo.destaque
                      ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]'
                      : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#555]'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <p className={`text-[11px] font-bold leading-tight ${passo.destaque ? 'text-[#C9A84C]' : 'text-[#888]'}`}>
                    {passo.label}
                  </p>
                  <p className="text-[10px] text-[#555] leading-tight mt-0.5 hidden sm:block">{passo.desc}</p>
                </div>
                {i < passos.length - 1 && (
                  <div className="w-8 sm:w-12 h-px bg-[#2A2A2A] shrink-0 mx-1" />
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-[#555] mt-6">
          * Controle via WhatsApp. Entre em contato para verificar seu saldo de compras.
        </p>
      </div>
    </section>
  )
}
