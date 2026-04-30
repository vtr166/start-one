'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { deletarProduto } from '../actions'

export default function DeletarProduto({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    startTransition(async () => {
      await deletarProduto(id)
      router.push('/admin/produtos')
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-400/30 text-red-400 text-sm hover:bg-red-400/10 transition-colors"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      Excluir
    </button>
  )
}
