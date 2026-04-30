'use client'

import { useCarrinho, calcularDescontoDecants, calcularDescontoYara } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import { X, Trash2, Plus, Minus, ShoppingBag, Tag } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CarrinhoDrawer() {
  const { itens, aberto, fecharCarrinho, remover, alterarQuantidade, subtotal, desconto, total } = useCarrinho()
  const combo = calcularDescontoDecants(itens)
  const comboYara = calcularDescontoYara(itens)

  // Quantos decants faltam para o próximo combo
  const totalDecants = itens.filter(i => i.isDecant).reduce((a, i) => a + i.quantidade, 0)
  const faltamParaCombo = totalDecants < 3 ? 3 - totalDecants : totalDecants < 5 ? 5 - totalDecants : 0
  const router = useRouter()

  if (!aberto) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={fecharCarrinho}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#111] border-l border-[#2A2A2A] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
          <h2 className="text-lg font-bold text-[#F5F5F5]">
            Seu Carrinho
            {itens.length > 0 && (
              <span className="ml-2 text-sm text-[#888] font-normal">
                ({itens.length} {itens.length === 1 ? 'item' : 'itens'})
              </span>
            )}
          </h2>
          <button
            onClick={fecharCarrinho}
            className="p-1 text-[#888] hover:text-[#C9A84C] transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#888]">
              <ShoppingBag size={48} className="opacity-30" />
              <p className="text-sm">Seu carrinho está vazio</p>
            </div>
          ) : (
            itens.map((item) => (
              <div
                key={item.variacaoId}
                className="flex gap-3 p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]"
              >
                {/* Imagem */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#222] shrink-0">
                  {item.imagem ? (
                    <Image
                      src={item.imagem}
                      alt={item.nomeProduto}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444]">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F5F5F5] truncate">
                    {item.nomeProduto}
                  </p>
                  <p className="text-xs text-[#888] mb-2">{item.nomeVariacao}</p>
                  <p className="text-sm font-bold text-[#C9A84C]">
                    {formatPrice(item.preco)}
                  </p>
                </div>

                {/* Controles */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => remover(item.variacaoId)}
                    className="text-[#555] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alterarQuantidade(item.variacaoId, item.quantidade - 1)}
                      className="w-6 h-6 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(item.variacaoId, item.quantidade + 1)}
                      className="w-6 h-6 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="px-6 py-4 border-t border-[#2A2A2A] space-y-3">

            {/* Barra de progresso do combo */}
            {faltamParaCombo > 0 && (
              <div className="p-3 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/20">
                <p className="text-xs text-[#C9A84C] font-semibold mb-1.5">
                  💧 Adicione +{faltamParaCombo} decant{faltamParaCombo > 1 ? 's' : ''} para ganhar 1 grátis!
                </p>
                <div className="h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalDecants / (totalDecants < 3 ? 3 : 5)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Combo decants ativo */}
            {combo && (
              <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center gap-2">
                <Tag size={14} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-green-400">{combo.descricao} aplicado!</p>
                  <p className="text-xs text-[#888]">Economia: {formatPrice(combo.economia)}</p>
                </div>
              </div>
            )}

            {/* Kit Dia das Mães ativo */}
            {comboYara && (
              <div className="p-3 rounded-xl bg-pink-500/5 border border-pink-500/20 flex items-center gap-2">
                <Tag size={14} className="text-pink-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-pink-400">{comboYara.descricao} aplicado!</p>
                  <p className="text-xs text-[#888]">Economia: {formatPrice(comboYara.economia)}</p>
                </div>
              </div>
            )}

            {/* Valores */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-[#888]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              {desconto() > 0 && (
                <div className="flex items-center justify-between text-xs text-green-400">
                  <span>Desconto combo</span>
                  <span>- {formatPrice(desconto())}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-bold text-[#F5F5F5] pt-1 border-t border-[#2A2A2A]">
                <span>Total</span>
                <span className="text-[#C9A84C] text-base">{formatPrice(total())}</span>
              </div>
            </div>

            <button
              onClick={() => { fecharCarrinho(); router.push('/checkout') }}
              className="btn-gold w-full text-center"
            >
              Finalizar Compra
            </button>
            <button onClick={fecharCarrinho} className="btn-outline-gold w-full text-center text-sm">
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
