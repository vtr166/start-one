import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const existente = await prisma.cupom.findUnique({ where: { codigo: 'KITDESCOBERTA' } })
  if (existente) {
    console.log('⚠️  Cupom KITDESCOBERTA já existe:', existente)
    return
  }

  const cupom = await prisma.cupom.create({
    data: {
      codigo:     'KITDESCOBERTA',
      tipo:       'FIXO',
      valor:      15.10,          // R$105 - R$15,10 = R$89,90
      minPedido:  89.90,          // mínimo: 3 decants
      maxUsos:    null,           // ilimitado
      ativo:      true,
      descricao:  'Kit Descoberta — 3 decants por R$89,90',
    },
  })

  console.log('✅ Cupom criado:', cupom)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
