import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Imagens do Fragrantica — URLs diretas por ID do perfume
const img = (id: number) => `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`

const produtos = [
  // ─────────── ÁRABES – MASCULINOS ───────────
  {
    nome: 'Rasasi Hawas for Him',
    slug: 'rasasi-hawas-for-him',
    marca: 'Rasasi',
    categoria: 'ARABE' as const,
    genero: 'MASCULINO' as const,
    descricao: 'Aquático e aromático de longa duração. Uma explosão de frescor com frutos e especiarias que evolui para um fundo amadeirado e almiscarado irresistível.',
    notasTopo: 'Maçã, Bergamota, Limão, Canela',
    notasCoracao: 'Notas Aquáticas, Ameixa, Flor de Laranjeira, Cardamomo',
    notasBase: 'Âmbar cinza, Almíscar, Patchouli, Madeira Flutuante',
    imagens: [img(46890)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 25, estoque: 30 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 185, estoque: 8 },
    ]},
  },
  {
    nome: 'Lattafa Fakhar Black',
    slug: 'lattafa-fakhar-black',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'MASCULINO' as const,
    descricao: 'O clone perfeito do YSL Y EDP. Fresco, frutado e levemente picante — uma escolha elegante para o dia a dia com excelente fixação.',
    notasTopo: 'Gengibre, Maçã Verde, Bergamota',
    notasCoracao: 'Artemísia, Cedro, Noz-moscada',
    notasBase: 'Âmbar, Vetiver, Almíscar',
    imagens: [img(70465)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 30 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 165, estoque: 10 },
    ]},
  },
  {
    nome: 'Lattafa Suqraat',
    slug: 'lattafa-suqraat',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'MASCULINO' as const,
    descricao: 'Inspirado no clássico Acqua di Giò Profumo. Aromático e aquático com profundidade, perfeito para o homem sofisticado que busca elegância sem abrir mão da frescura.',
    notasTopo: 'Bergamota, Gengibre',
    notasCoracao: 'Lavanda, Folha de Violeta',
    notasBase: 'Almíscar, Sândalo, Âmbar',
    imagens: [img(75471)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 25 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 160, estoque: 8 },
    ]},
  },
  {
    nome: 'Armaf Club de Nuit Intense Man',
    slug: 'armaf-club-de-nuit-intense-man',
    marca: 'Armaf',
    categoria: 'ARABE' as const,
    genero: 'MASCULINO' as const,
    descricao: 'O lendário clone do Creed Aventus. Defumado, frutado e intensamente masculino. Uma das fragrâncias de maior impacto e projeção por um preço acessível.',
    notasTopo: 'Limão, Abacaxi, Bergamota, Groselha Negra, Maçã',
    notasCoracao: 'Bétula, Jasmim, Rosa',
    notasBase: 'Almíscar, Âmbar cinza, Patchouli, Baunilha',
    imagens: [img(34696)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 28, estoque: 25 },
      { tipo: 'FRASCO' as const, volume: '105ml', preco: 210, estoque: 6 },
    ]},
  },
  {
    nome: 'Lattafa Asad',
    slug: 'lattafa-asad',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'MASCULINO' as const,
    descricao: 'Inspirado no Dior Sauvage Elixir. Ousado e especiado, com uma riqueza oriental inconfundível. O "leão" do mundo das fragrâncias árabes masculinas.',
    notasTopo: 'Pimenta Negra, Tabaco, Abacaxi',
    notasCoracao: 'Patchouli, Café, Íris',
    notasBase: 'Baunilha, Âmbar, Madeira Seca, Benjoim, Ládano',
    imagens: [img(72821)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 28, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 175, estoque: 7 },
    ]},
  },
  {
    nome: 'Jacques Bogart Silver Scent',
    slug: 'jacques-bogart-silver-scent',
    marca: 'Jacques Bogart',
    categoria: 'IMPORTADO' as const,
    genero: 'MASCULINO' as const,
    descricao: 'Um clássico atemporal de projeção surpreendente. Notas orientais amadeiradas com toque cítrico e especiado — elegância europeia a um preço democrático.',
    notasTopo: 'Flor de Laranjeira, Limão',
    notasCoracao: 'Lavanda, Cardamomo, Noz-moscada, Alecrim, Coentro, Gerânio',
    notasBase: 'Lichia, Fava Tonka, Madeira Teca, Vetiver',
    imagens: [img(7794)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 18, estoque: 30 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 130, estoque: 10 },
    ]},
  },
  {
    nome: 'Invictus',
    slug: 'rabanne-invictus',
    marca: 'Rabanne',
    categoria: 'IMPORTADO' as const,
    genero: 'MASCULINO' as const,
    descricao: 'O guerreiro moderno em forma de fragrância. Aquático e fresco com um coração amadeirado, Invictus é o símbolo de força e sedução jovem.',
    notasTopo: 'Toranja, Folha de Mar, Mandarina',
    notasCoracao: 'Guaiac, Jasmim, Folha de Mar',
    notasBase: 'Âmbar cinza, Musgo de Carvalho, Madeira de Cássia',
    imagens: [img(18471)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 35, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 370, estoque: 4 },
    ]},
  },
  {
    nome: '1 Million',
    slug: 'rabanne-1-million',
    marca: 'Rabanne',
    categoria: 'IMPORTADO' as const,
    genero: 'MASCULINO' as const,
    descricao: 'O perfume mais icônico da última geração. Dourado, especiado e irresistível — 1 Million é poder, sedução e estilo concentrados num frasco em formato de barra de ouro.',
    notasTopo: 'Toranja, Tangerina, Menta, Sangue de Boi',
    notasCoracao: 'Rosa, Canela, Especiarias',
    notasBase: 'Couro Dourado, Madeira Dourada, Patchouli, Âmbar',
    imagens: [img(3747)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 38, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 420, estoque: 3 },
    ]},
  },
  {
    nome: '212 VIP Black',
    slug: 'carolina-herrera-212-vip-black',
    marca: 'Carolina Herrera',
    categoria: 'IMPORTADO' as const,
    genero: 'MASCULINO' as const,
    descricao: 'A noite em forma de fragrância. Especiado, intenso e marcante, 212 VIP Black carrega a essência do club mais exclusivo da cidade com notas de absinto, anis e baunilha.',
    notasTopo: 'Absinto, Anis, Funcho',
    notasCoracao: 'Rum, Cedro',
    notasBase: 'Baunilha, Âmbar, Labdano',
    imagens: [img(46093)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 40, estoque: 15 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 445, estoque: 3 },
    ]},
  },

  // ─────────── ÁRABES – UNISSEX ───────────
  {
    nome: 'Afnan 9AM Dive',
    slug: 'afnan-9am-dive',
    marca: 'Afnan',
    categoria: 'ARABE' as const,
    genero: 'UNISSEX' as const,
    descricao: 'Frescor aquático e frutal que mergulha nos sentidos. Inspirado em Acqua di Gio Profondo, é uma viagem ao mar com notas de maçã, limão e madeiras secas.',
    notasTopo: 'Limão, Menta, Groselha Negra, Pimenta Rosa',
    notasCoracao: 'Maçã, Cedro, Incenso',
    notasBase: 'Gengibre, Sândalo, Patchouli, Jasmim',
    imagens: [img(78611)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 25 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 160, estoque: 8 },
    ]},
  },
  {
    nome: "Lattafa Bade'e Al Oud — Oud for Glory",
    slug: 'lattafa-badee-al-oud-for-glory',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'UNISSEX' as const,
    descricao: 'A glória do oud em sua forma mais pura. Uma composição oriental densa e majestosa com açafrão, patchouli e oud em camadas que evoluem por horas na pele.',
    notasTopo: 'Açafrão, Noz-moscada, Lavanda',
    notasCoracao: 'Oud (Agarwood), Patchouli',
    notasBase: 'Oud (Agarwood), Patchouli, Almíscar',
    imagens: [img(64948)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 25, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 180, estoque: 7 },
    ]},
  },
  {
    nome: 'Lattafa Ana Abiyedh Rouge',
    slug: 'lattafa-ana-abiyedh-rouge',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'UNISSEX' as const,
    descricao: 'Doce, amadeirado e envolvente. Uma fragrância oriental com personalidade marcante — pera, caramelo e âmbar numa composição aconchegante e sofisticada.',
    notasTopo: 'Pera Nashi, Kumquat, Bergamota',
    notasCoracao: 'Caramelo, Gerânio',
    notasBase: 'Âmbar cinza, Almíscar, Musgo de Carvalho',
    imagens: [img(63062)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 20, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '60ml', preco: 145, estoque: 8 },
    ]},
  },
  {
    nome: 'Al Haramain Amber Oud Gold Edition',
    slug: 'al-haramain-amber-oud-gold-edition',
    marca: 'Al Haramain',
    categoria: 'ARABE' as const,
    genero: 'UNISSEX' as const,
    descricao: 'Inspirado no Xerjoff Erba Pura. Gourmand e radiante, com projeção impressionante. Frutas tropicais, âmbar e baunilha numa composição luxuosa e viciante.',
    notasTopo: 'Bergamota, Notas Verdes',
    notasCoracao: 'Melão, Abacaxi, Âmbar, Gourmand',
    notasBase: 'Baunilha, Almíscar, Notas Amadeiradas',
    imagens: [img(51816)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 35, estoque: 15 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 295, estoque: 4 },
    ]},
  },

  // ─────────── ÁRABES – FEMININOS ───────────
  {
    nome: 'Lattafa Yara',
    slug: 'lattafa-yara',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'Doce, tropical e irresistível. Yara é uma explosão de frutas exóticas e orquídea sobre um fundo quente de baunilha e almíscar — a favorita entre as femininas.',
    notasTopo: 'Orquídea, Heliotropo, Tangerina',
    notasCoracao: 'Acordo Gourmand, Frutas Tropicais',
    notasBase: 'Baunilha, Almíscar, Sândalo',
    imagens: [img(76880)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 30 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 165, estoque: 10 },
    ]},
  },
  {
    nome: 'Lattafa Yara Candy',
    slug: 'lattafa-yara-candy',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'A versão mais doce e gulosa da família Yara. Morango, balas e groselha negra sobre um coração floral e uma base cremosa de baunilha e âmbar.',
    notasTopo: 'Groselha Negra, Tangerina Verde',
    notasCoracao: 'Bala de Morango, Gardênia',
    notasBase: 'Baunilha, Almíscar, Âmbar, Sândalo',
    imagens: [img(95752)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 25 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 165, estoque: 8 },
    ]},
  },
  {
    nome: 'Lattafa Yara Tous',
    slug: 'lattafa-yara-tous',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'Tropical e floral com coração de coco e maracujá. Yara Tous é a versão mais solar e veraniega da família, perfeita para o dia a dia e clima quente.',
    notasTopo: 'Manga, Coco, Maracujá',
    notasCoracao: 'Jasmim, Flor de Laranjeira, Heliotropo',
    notasBase: 'Baunilha, Almíscar, Cachemir',
    imagens: [img(83320)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 25 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 165, estoque: 8 },
    ]},
  },
  {
    nome: 'Lattafa Fakhar Rose',
    slug: 'lattafa-fakhar-rose',
    marca: 'Lattafa',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'A rosa em toda sua esplendor. Comparado ao L\'Interdit da Givenchy, este floral branco cremoso é luxuoso, envolvente e com fixação impressionante.',
    notasTopo: 'Frutas, Lírio, Romã, Aldeídos',
    notasCoracao: 'Tuberosa, Jasmim, Gardênia, Ylang-Ylang, Rosa, Peônia',
    notasBase: 'Baunilha, Almíscar Branco, Sândalo, Ambroxan',
    imagens: [img(70466)],
    destaque: true,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 22, estoque: 25 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 165, estoque: 8 },
    ]},
  },
  {
    nome: 'Armaf Club de Nuit Woman',
    slug: 'armaf-club-de-nuit-woman',
    marca: 'Armaf',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'O clone perfeito do Chanel Coco Mademoiselle. Cítrico e floral na abertura, evolui para um coração romântico e um fundo sofisticado de patchouli e almíscar.',
    notasTopo: 'Laranja, Bergamota, Toranja, Pêssego',
    notasCoracao: 'Rosa, Jasmim, Gerânio, Lichia',
    notasBase: 'Patchouli, Almíscar, Baunilha, Vetiver',
    imagens: [img(27655)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 25, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '105ml', preco: 195, estoque: 6 },
    ]},
  },
  {
    nome: 'Rasasi Hawas for Her',
    slug: 'rasasi-hawas-for-her',
    marca: 'Rasasi',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'O contraponto feminino do icônico Hawas. Frutal e floral com uma base quente e sensual de pralinê e patchouli — elegância árabe com toque de doçura.',
    notasTopo: 'Romã, Maçã, Toranja',
    notasCoracao: 'Íris, Jasmim Sambac, Cítricos',
    notasBase: 'Pralinê, Patchouli, Vetiver',
    imagens: [img(67146)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 25, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 175, estoque: 6 },
    ]},
  },
  {
    nome: 'Afnan 9AM pour Femme',
    slug: 'afnan-9am-pour-femme',
    marca: 'Afnan',
    categoria: 'ARABE' as const,
    genero: 'FEMININO' as const,
    descricao: 'Fresco e frutal para começar o dia com energia. Cítricos vibrantes e frutas vermelhas sobre um fundo quente de âmbar e almíscar — jovial e feminino.',
    notasTopo: 'Tangerina, Toranja, Bergamota',
    notasCoracao: 'Framboesa, Groselha Negra',
    notasBase: 'Almíscar, Âmbar, Laranja',
    imagens: [img(78541)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 20, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 155, estoque: 8 },
    ]},
  },
  {
    nome: 'Fantasy',
    slug: 'britney-spears-fantasy',
    marca: 'Britney Spears',
    categoria: 'IMPORTADO' as const,
    genero: 'FEMININO' as const,
    descricao: 'Um clássico gourmand dos anos 2000. Frutas exóticas e chocolate branco num frasco icônico — Fantasy é nostalgia, doçura e feminilidade em uma única borrifada.',
    notasTopo: 'Lichia, Marmelo Dourado, Kiwi',
    notasCoracao: 'Jasmim, Chocolate Branco',
    notasBase: 'Orris, Almíscar, Madeiras',
    imagens: [img(600)],
    destaque: false,
    variacoes: { create: [
      { tipo: 'DECANT' as const, volume: '5ml', preco: 20, estoque: 20 },
      { tipo: 'FRASCO' as const, volume: '100ml', preco: 195, estoque: 5 },
    ]},
  },
]

async function main() {
  console.log('🌱 Limpando banco e iniciando seed...')

  await prisma.itemPedido.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.variacao.deleteMany()
  await prisma.produto.deleteMany()

  console.log(`📦 Cadastrando ${produtos.length} perfumes...\n`)

  for (const p of produtos) {
    await prisma.produto.create({ data: p })
    const emoji = p.genero === 'MASCULINO' ? '🔵' : p.genero === 'FEMININO' ? '🩷' : '⚪'
    console.log(`${emoji} ${p.nome} (${p.marca})`)
  }

  console.log(`\n✨ Seed concluído! ${produtos.length} perfumes cadastrados.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
