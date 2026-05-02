'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, Image, Percent, LogOut, Boxes } from 'lucide-react'

const links = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/pedidos',    label: 'Pedidos',     icon: ShoppingBag },
  { href: '/admin/produtos',   label: 'Produtos',    icon: Package },
  { href: '/admin/estoque',    label: 'Estoque',     icon: Boxes },
  { href: '/admin/banners',    label: 'Banners',     icon: Image },
  { href: '/admin/promocoes',  label: 'Promoções',   icon: Percent },
  { href: '/admin/cupons',     label: 'Cupons',      icon: Tag },
  { href: '/admin/afiliados',  label: 'Afiliados',   icon: Users },
]

export default function AdminNav() {
  const path = usePathname()

  return (
    <aside className="w-56 bg-[#111] border-r border-[#2A2A2A] flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-[#2A2A2A]">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-0.5">Painel</p>
        <p className="font-bold text-sm gold-text">Start One</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const ativo = path === href || (href !== '/admin' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
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

      <div className="px-3 py-4 border-t border-[#2A2A2A]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-[#F5F5F5] transition-colors"
        >
          <LogOut size={16} />
          Ver loja
        </Link>
      </div>
    </aside>
  )
}
