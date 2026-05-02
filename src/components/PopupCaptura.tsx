'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, Gift } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'

export default function PopupCaptura() {
  const [aberto, setAberto] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [nome, setNome] = useState('')
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    // Não mostra se já fechou nessa sessão
    if (sessionStorage.getItem('popup_fechado')) return
    // Mostra após 30 segundos
    const timer = setTimeout(() => setAberto(true), 30_000)
    return () => clearTimeout(timer)
  }, [])

  function fechar() {
    setAberto(false)
    sessionStorage.setItem('popup_fechado', '1')
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const num = whatsapp.replace(/\D/g, '')
    if (num.length < 10) return

    // Envia para WhatsApp do lojista via link
    const texto = `Olá! Sou ${nome || 'cliente'} e quero o desconto de 10% na Start One Imports! Meu WhatsApp: ${num}`
    const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`
    window.open(waLink, '_blank')

    // Salva no localStorage para recuperação de carrinho
    localStorage.setItem('cliente_whatsapp', num)
    localStorage.setItem('cliente_nome', nome)

    setEnviado(true)
    setTimeout(fechar, 3000)
  }

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-[#111] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
        {/* Faixa dourada */}
        <div className="h-1.5 bg-gradient-to-r from-[#8B6A1F] via-[#C9A84C] to-[#8B6A1F]" />

        <div className="p-6">
          <button
            onClick={fechar}
            className="absolute top-4 right-4 text-[#555] hover:text-[#888] transition-colors"
          >
            <X size={18} />
          </button>

          {/* Ícone */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
              <Gift size={26} className="text-[#C9A84C]" />
            </div>
          </div>

          {enviado ? (
            <div className="text-center py-2">
              <p className="text-green-400 font-bold mb-1">Pronto! 🎉</p>
              <p className="text-xs text-[#888]">Seu desconto foi solicitado. Entraremos em contato pelo WhatsApp!</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-5">
                <p className="text-xs tracking-widest uppercase text-[#C9A84C] font-bold mb-1">Oferta exclusiva</p>
                <h2 className="text-xl font-black text-[#F5F5F5] mb-2">
                  10% OFF na sua<br />primeira compra
                </h2>
                <p className="text-xs text-[#888] leading-relaxed">
                  Deixe seu WhatsApp e receba o cupom + novidades em primeira mão
                </p>
              </div>

              <form onSubmit={enviar} className="space-y-3">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
                <div className="relative">
                  <MessageCircle size={15} className="absolute left-3 top-3.5 text-[#555]" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="(00) 00000-0000"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    required
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
                <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-3 text-sm">
                  <MessageCircle size={16} />
                  Quero meu desconto!
                </button>
              </form>

              <button onClick={fechar} className="w-full text-center text-[10px] text-[#444] hover:text-[#666] mt-3 transition-colors">
                Não, obrigado
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
