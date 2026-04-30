import { Star } from 'lucide-react'

const depoimentos = [
  {
    nome: 'Carlos M.',
    cidade: 'São Paulo, SP',
    texto: 'Comprei o Asad e o decant de 1 Million. Os dois chegaram super bem embalados e os perfumes são 100% originais. O Asad durou o dia todo, impressionante!',
    nota: 5,
    perfume: 'Lattafa Asad + Decant 1 Million',
  },
  {
    nome: 'Juliana R.',
    cidade: 'Belo Horizonte, MG',
    texto: 'Adorei o sistema de decants! Testei o Yara antes de comprar o frasco. Superou minhas expectativas e o atendimento foi excelente. Recomendo demais.',
    nota: 5,
    perfume: 'Lattafa Yara',
  },
  {
    nome: 'Rafael T.',
    cidade: 'Rio de Janeiro, RJ',
    texto: 'Já comprei 3 vezes na Start One. O Amber Oud Gold é incrível, a projeção é absurda. Entrega rápida e produto original. Não compro em outro lugar.',
    nota: 5,
    perfume: 'Al Haramain Amber Oud Gold',
  },
  {
    nome: 'Patrícia S.',
    cidade: 'Curitiba, PR',
    texto: 'O Club de Nuit Woman é idêntico ao Coco Mademoiselle, mas paguei muito menos! Vim pela indicação de uma amiga e voltei para comprar mais. Site confiável!',
    nota: 5,
    perfume: 'Armaf Club de Nuit Woman',
  },
  {
    nome: 'Diego F.',
    cidade: 'Porto Alegre, RS',
    texto: 'Fiz um pedido de vários decants para montar minha coleção. Todos chegaram perfeitamente vedados e com o cheiro fiel. Atendimento rápido no WhatsApp também.',
    nota: 5,
    perfume: 'Vários decants',
  },
  {
    nome: 'Amanda L.',
    cidade: 'Fortaleza, CE',
    texto: 'Nunca tinha comprado perfume online mas a Start One me conquistou! A Fakhar Rose é linda demais. Embalagem cuidadosa e chegou antes do prazo.',
    nota: 5,
    perfume: 'Lattafa Fakhar Rose',
  },
]

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < nota ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#333]'}
        />
      ))}
    </div>
  )
}

export default function ProvasSociais() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] font-bold mb-2">
          Depoimentos
        </p>
        <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">
          O que nossos clientes dizem
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-[#888]">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="text-[#C9A84C] fill-[#C9A84C]" />
            ))}
          </div>
          <span>5.0 · mais de 200 avaliações</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {depoimentos.map((d) => (
          <div key={d.nome} className="card-dark p-5 flex flex-col gap-3">
            <Estrelas nota={d.nota} />
            <p className="text-sm text-[#888] leading-relaxed flex-1">
              &ldquo;{d.texto}&rdquo;
            </p>
            <div className="pt-2 border-t border-[#2A2A2A]">
              <p className="text-sm font-bold text-[#F5F5F5]">{d.nome}</p>
              <p className="text-[11px] text-[#555]">{d.cidade} · {d.perfume}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
