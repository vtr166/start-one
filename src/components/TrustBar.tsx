import { ShieldCheck, Truck, Droplets, RefreshCw, HeadphonesIcon } from 'lucide-react'

const itens = [
  { icon: ShieldCheck, titulo: '100% Originais', desc: 'Todos os perfumes com autenticidade garantida' },
  { icon: Droplets, titulo: 'Decants disponíveis', desc: 'Experimente 5ml antes de comprar o frasco' },
  { icon: Truck, titulo: 'Envio para todo Brasil', desc: 'Embalagem segura via Correios e transportadoras' },
  { icon: RefreshCw, titulo: 'Troca garantida', desc: 'Problema com o pedido? Resolvemos na hora' },
  { icon: HeadphonesIcon, titulo: 'Suporte no WhatsApp', desc: 'Atendimento rápido e personalizado' },
]

export default function TrustBar() {
  return (
    <section className="border-y border-[#2A2A2A] bg-[#111]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {itens.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                <Icon size={18} className="text-[#C9A84C]" />
              </div>
              <p className="text-xs font-bold text-[#F5F5F5]">{titulo}</p>
              <p className="text-[11px] text-[#555] leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
