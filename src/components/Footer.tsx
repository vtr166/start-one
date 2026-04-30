import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="font-bold text-lg mb-3">
            <span className="gold-text">Start One</span>
            <span className="text-[#555] text-sm ml-1">Imports</span>
          </h3>
          <p className="text-xs text-[#555] leading-relaxed mb-4">
            Importação inteligente, produtos de alto padrão. Perfumes árabes e importados originais com qualidade garantida.
          </p>
          <a
            href="https://instagram.com/start_oneoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#555] hover:text-[#C9A84C] transition-colors border border-[#2A2A2A] px-3 py-2 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            @start_oneoficial
          </a>
        </div>

        {/* Catálogo */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-4">Catálogo</h4>
          <ul className="space-y-2.5 text-xs text-[#555]">
            <li><Link href="/?categoria=ARABE" className="hover:text-[#C9A84C] transition-colors">Perfumes Árabes</Link></li>
            <li><Link href="/?categoria=IMPORTADO" className="hover:text-[#C9A84C] transition-colors">Importados</Link></li>
            <li><Link href="/?genero=MASCULINO" className="hover:text-[#C9A84C] transition-colors">Para Ele 🔵</Link></li>
            <li><Link href="/?genero=FEMININO" className="hover:text-[#C9A84C] transition-colors">Para Ela 🩷</Link></li>
            <li><Link href="/?tipo=DECANT" className="hover:text-[#C9A84C] transition-colors">Decants 5ml 💧</Link></li>
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-4">A Marca</h4>
          <ul className="space-y-2.5 text-xs text-[#555]">
            <li><Link href="/sobre" className="hover:text-[#C9A84C] transition-colors">Sobre Nós</Link></li>
            <li><Link href="/faq" className="hover:text-[#C9A84C] transition-colors">Perguntas Frequentes</Link></li>
            <li>
              <a href="https://instagram.com/start_oneoficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Garantias */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-4">Garantias</h4>
          <ul className="space-y-2.5 text-xs text-[#555]">
            {[
              '✅ 100% Produtos Originais',
              '💧 Decants disponíveis',
              '🚚 Envio para todo Brasil',
              '🔒 Pagamento seguro (MP)',
              '📦 Embalagem reforçada',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A1A1A] px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-[#333]">
          <span>© {new Date().getFullYear()} Start One Imports. Todos os direitos reservados.</span>
          <div className="flex items-center gap-1 text-[#3A3A3A]">
            <ShieldCheck size={11} />
            <span>Pagamento seguro via Mercado Pago</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
