'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Users, Image,
  Percent, LogOut, Boxes, Store, Star, Gift, Menu, X,
} from 'lucide-react'
import { fazerLogout } from './login/actions'

const links = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/pedidos',    label: 'Pedidos',     icon: ShoppingBag },
  { href: '/admin/produtos',   label: 'Produtos',    icon: Package },
  { href: '/admin/estoque',    label: 'Estoque',     icon: Boxes },
  { href: '/admin/banners',    label: 'Banners',     icon: Image },
  { href: '/admin/promocoes',  label: 'Promoções',   icon: Percent },
  { href: '/admin/cupons',     label: 'Cupons',      icon: Tag },
  { href: '/admin/afiliados',  label: 'Afiliados',   icon: Users },
  { href: '/admin/avaliacoes', label: 'Avaliações',  icon: Star },
  { href: '/admin/fidelidade', label: 'Fidelidade',  icon: Gift },
]

export default function AdminNav() {
  const path = usePathname()
  const [aberto, setAberto] = useState(false)

  // Fecha o drawer ao trocar de página
  useEffect(() => { setAberto(false) }, [path])

  // Bloqueia scroll do body quando drawer aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const ativo = path === href || (href !== '/admin' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                ativo
                  ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                  : 'text-[#888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#2A2A2A] space-y-1">
        <Link
          href="/"
          onClick={onClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-[#F5F5F5] transition-colors"
        >
          <Store size={16} />
          Ver loja
        </Link>
        <form action={fazerLogout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* ── Top bar mobile ─────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center justify-between px-4">
        <div>
          <p className="text-[10px] text-[#555] uppercase tracking-widest leading-none">Painel</p>
          <p className="font-bold text-sm gold-text leading-tight">Start One</p>
        </div>
        <button
          onClick={() => setAberto(true)}
          className="p-2 text-[#888] hover:text-[#F5F5F5] transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── Overlay mobile ─────────────────────────────── */}
      {aberto && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setAberto(false)}
        />
      )}

      {/* ── Drawer mobile ──────────────────────────────── */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-[#111] border-r border-[#2A2A2A] flex flex-col transition-transform duration-300 ${aberto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#555] uppercase tracking-widest mb-0.5">Painel</p>
            <p className="font-bold text-sm gold-text">Start One</p>
          </div>
          <button onClick={() => setAberto(false)} className="p-1 text-[#555] hover:text-[#F5F5F5]">
            <X size={18} />
          </button>
        </div>
        <NavLinks onClick={() => setAberto(false)} />
      </div>

      {/* ── Sidebar desktop ────────────────────────────── */}
      <aside className="hidden md:flex w-56 bg-[#111] border-r border-[#2A2A2A] flex-col min-h-screen">
        <div className="px-6 py-5 border-b border-[#2A2A2A]">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-0.5">Painel</p>
          <p className="font-bold text-sm gold-text">Start One</p>
        </div>
        <NavLinks />
      </aside>
    </>
  )
}
