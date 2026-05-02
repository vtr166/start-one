'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCarrinho } from '@/store/carrinho'
import { useRouter } from 'next/navigation'

const navLinks = [
  { href: '/?categoria=ARABE', label: 'Árabes' },
  { href: '/?categoria=IMPORTADO', label: 'Importados' },
  { href: '/decants', label: '💧 Decants' },
  { href: '/pedido/consulta', label: '📦 Rastrear' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/faq', label: 'FAQ' },
]

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [buscaAberta, setBuscaAberta] = useState(false)
  const [q, setQ] = useState('')
  const { abrirCarrinho, totalItens } = useCarrinho()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const qtd = totalItens()

  useEffect(() => {
    if (buscaAberta) inputRef.current?.focus()
  }, [buscaAberta])

  function handleBusca(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) {
      router.push(`/?q=${encodeURIComponent(q.trim())}`)
      setBuscaAberta(false)
      setQ('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2A2A2A] bg-[#0A0A0A]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.jpeg"
            alt="Start One Imports"
            width={44}
            height={44}
            className="object-contain rounded-full"
          />
          <span className="font-bold text-base tracking-wide hidden sm:inline">
            <span className="gold-text">Start One</span>
            <span className="text-[#555] text-xs ml-1">Imports</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium flex-1 justify-center">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="text-[#888] hover:text-[#C9A84C] transition-colors whitespace-nowrap">
              {label}
            </Link>
          ))}
        </nav>

        {/* Busca + Carrinho + Menu */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Busca */}
          {buscaAberta ? (
            <form onSubmit={handleBusca} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar perfume..."
                className="bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] w-40 md:w-52 transition-all"
              />
              <button type="button" onClick={() => setBuscaAberta(false)} className="p-1.5 text-[#555] hover:text-[#888]">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setBuscaAberta(true)}
              className="p-2 text-[#888] hover:text-[#C9A84C] transition-colors"
              title="Buscar"
            >
              <Search size={20} />
            </button>
          )}

          {/* Carrinho */}
          <button
            onClick={abrirCarrinho}
            className="relative p-2 text-[#888] hover:text-[#C9A84C] transition-colors"
          >
            <ShoppingBag size={20} />
            {qtd > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center">
                {qtd > 9 ? '9+' : qtd}
              </span>
            )}
          </button>

          {/* Menu mobile */}
          <button
            className="lg:hidden p-2 text-[#888] hover:text-[#C9A84C] transition-colors"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <nav className="lg:hidden border-t border-[#2A2A2A] bg-[#111] px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuAberto(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-[#888] hover:text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-[#2A2A2A] mt-2 pt-3">
            <Link
              href="/"
              onClick={() => setMenuAberto(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-[#888] hover:text-[#C9A84C] hover:bg-[#1A1A1A] transition-colors block"
            >
              🏠 Início
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
