import AdminNav from '../../AdminNav'
import FormProduto from '../FormProduto'

export default function NovoProduto() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-8">Novo Produto</h1>
          <div className="card-dark p-6">
            <FormProduto />
          </div>
        </div>
      </main>
    </div>
  )
}
