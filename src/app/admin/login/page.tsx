'use client'

import { useState, useTransition } from 'react'
import { fazerLogin } from './actions'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/admin'

  const [erro, setErro]         = useState('')
  const [ver, setVer]           = useState(false)
  const [isPending, start]      = useTransition()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = await fazerLogin(fd)
      if (res?.erro) setErro(res.erro)
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-4">
            <Lock size={28} className="text-[#C9A84C]" />
          </div>
          <h1 className="text-xl font-bold text-[#F5F5F5]">Painel Admin</h1>
          <p className="text-sm text-[#555] mt-1">Start One Imports</p>
        </div>

        <form onSubmit={submit} className="card-dark p-6 space-y-4">
          <div>
            <label className="block text-xs text-[#888] mb-1.5 font-semibold uppercase tracking-wider">
              Senha
            </label>
            <div className="relative">
              <input
                name="senha"
                type={ver ? 'text' : 'password'}
                required
                autoFocus
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#333] focus:outline-none focus:border-[#C9A84C] transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setVer(v => !v)}
                className="absolute right-3 top-3.5 text-[#555] hover:text-[#888] transition-colors"
              >
                {ver ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <input type="hidden" name="redirect" value={redirect} />

          {erro && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-gold w-full flex items-center justify-center gap-2 py-3 text-sm"
          >
            {isPending
              ? <><Loader2 size={15} className="animate-spin" /> Entrando...</>
              : 'Entrar no painel'
            }
          </button>
        </form>

        <p className="text-center text-[10px] text-[#333] mt-6">
          Acesso restrito · Start One Imports
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
