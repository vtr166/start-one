import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ItemCarrinho = {
  variacaoId: string
  produtoId: string
  nomeProduto: string
  nomeVariacao: string
  preco: number
  quantidade: number
  imagem: string
  isDecant?: boolean
}

export type DescontoCombo = {
  tipo: 'COMBO_3X2' | 'COMBO_5X3'
  descricao: string
  economia: number
}

// Calcula o desconto de combo para decants
// Regra: expande cada item por quantidade, ordena por preço crescente
// 3 decants → o mais barato é grátis
// 5 decants → os 2 mais baratos são grátis
// Múltiplos combos se tiver 6, 9, 10 decants etc.
// Desconto fixo do Kit Dia das Mães — 2× Yara EDP = R$ 429,90
const PRECO_KIT_YARA = 429.90
const SLUG_YARA = 'lattafa-yara'

export function calcularDescontoYara(itens: ItemCarrinho[]): DescontoCombo | null {
  const yaras = itens.filter(
    (i) => !i.isDecant && i.nomeProduto.toLowerCase().includes('yara') && !i.nomeProduto.toLowerCase().includes('candy') && !i.nomeProduto.toLowerCase().includes('tous')
  )
  const totalYara = yaras.reduce((a, i) => a + i.quantidade, 0)
  if (totalYara < 2) return null

  const combosYara = Math.floor(totalYara / 2)
  const precoUnitario = yaras[0]?.preco ?? 249.90
  const precoNormal = combosYara * 2 * precoUnitario
  const precoCombo = combosYara * PRECO_KIT_YARA
  const economia = precoNormal - precoCombo

  return {
    tipo: 'COMBO_3X2',
    descricao: combosYara > 1 ? `${combosYara}× Kit Dia das Mães (2 Yaras)` : '🌸 Kit Dia das Mães — 2 Yaras',
    economia,
  }
}

export function calcularDescontoDecants(itens: ItemCarrinho[]): DescontoCombo | null {
  // Expande itens de decant individualmente
  const decants: number[] = []
  for (const item of itens) {
    if (item.isDecant) {
      for (let i = 0; i < item.quantidade; i++) {
        decants.push(item.preco)
      }
    }
  }

  const total = decants.length
  if (total < 4) return null

  decants.sort((a, b) => a - b) // menor primeiro (serão grátis)

  // Quantos combos 6 Ganhe 2 cabem?
  const combos6 = Math.floor(total / 6)
  // No que sobra, quantos combos 4 Ganhe 1 cabem?
  const restante6 = total - combos6 * 6
  const combos4 = Math.floor(restante6 / 4)

  // Grátis: os mais baratos
  const gratis = combos6 * 2 + combos4 * 1

  // Economia: soma dos 'gratis' mais baratos
  let economia = 0
  for (let i = 0; i < gratis; i++) {
    economia += decants[i]
  }

  if (economia === 0) return null

  const descricao =
    combos6 > 0 && combos4 > 0
      ? `${combos6}× Combo 6 Pague 4 + ${combos4}× Combo 4 Pague 3`
      : combos6 > 0
      ? combos6 > 1 ? `${combos6}× Combo 6 Pague 4` : 'Combo 6 Pague 4'
      : combos4 > 1 ? `${combos4}× Combo 4 Pague 3` : 'Combo 4 Pague 3'

  return {
    tipo: combos6 > 0 ? 'COMBO_5X3' : 'COMBO_3X2',
    descricao,
    economia,
  }
}

type CarrinhoStore = {
  itens: ItemCarrinho[]
  aberto: boolean
  abrirCarrinho: () => void
  fecharCarrinho: () => void
  adicionar: (item: ItemCarrinho) => void
  remover: (variacaoId: string) => void
  alterarQuantidade: (variacaoId: string, quantidade: number) => void
  limpar: () => void
  subtotal: () => number
  desconto: () => number
  total: () => number
  totalItens: () => number
}

export const useCarrinho = create<CarrinhoStore>()(
  persist(
    (set, get) => ({
      itens: [],
      aberto: false,

      abrirCarrinho: () => set({ aberto: true }),
      fecharCarrinho: () => set({ aberto: false }),

      adicionar: (novoItem) => {
        const itens = get().itens
        const existente = itens.find((i) => i.variacaoId === novoItem.variacaoId)
        if (existente) {
          set({
            itens: itens.map((i) =>
              i.variacaoId === novoItem.variacaoId
                ? { ...i, quantidade: i.quantidade + novoItem.quantidade }
                : i
            ),
          })
        } else {
          set({ itens: [...itens, novoItem] })
        }
        set({ aberto: true })
      },

      remover: (variacaoId) =>
        set({ itens: get().itens.filter((i) => i.variacaoId !== variacaoId) }),

      alterarQuantidade: (variacaoId, quantidade) => {
        if (quantidade <= 0) { get().remover(variacaoId); return }
        set({ itens: get().itens.map((i) => i.variacaoId === variacaoId ? { ...i, quantidade } : i) })
      },

      limpar: () => set({ itens: [] }),

      subtotal: () => get().itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0),

      desconto: () => {
        const decant = calcularDescontoDecants(get().itens)?.economia ?? 0
        const yara = calcularDescontoYara(get().itens)?.economia ?? 0
        return decant + yara
      },

      total: () => Math.max(0, get().subtotal() - get().desconto()),

      totalItens: () => get().itens.reduce((acc, i) => acc + i.quantidade, 0),
    }),
    {
      name: 'startone-carrinho',
      // Não persiste o estado do drawer — ele nunca deve reabrir sozinho entre sessões
      partialize: (state) => ({ itens: state.itens }),
    }
  )
)
