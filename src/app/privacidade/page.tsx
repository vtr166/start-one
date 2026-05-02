import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Start One Imports',
  description: 'Saiba como a Start One Imports coleta, usa e protege seus dados pessoais.',
}

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Política de Privacidade</h1>
      <p className="text-sm text-[#555] mb-10">Última atualização: maio de 2025</p>

      <div className="prose prose-invert max-w-none space-y-8 text-sm text-[#888] leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">1. Quem somos</h2>
          <p>
            Start One Imports é uma loja virtual especializada em perfumes árabes e importados originais.
            Responsável pelo tratamento dos seus dados: <strong className="text-[#CCC]">Victor Alves</strong> — contato via
            Instagram <strong className="text-[#CCC]">@start_oneoficial</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">2. Dados coletados</h2>
          <p>Coletamos os seguintes dados ao realizar uma compra ou entrar em contato:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Número de telefone / WhatsApp</li>
            <li>CPF (para emissão de nota fiscal)</li>
            <li>Endereço de entrega (CEP, rua, número, complemento, cidade, estado)</li>
            <li>Dados de pagamento (processados pelo Mercado Pago — não armazenamos dados de cartão)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">3. Finalidade do uso</h2>
          <p>Seus dados são utilizados exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Processar e entregar seu pedido</li>
            <li>Enviar confirmação de pagamento e rastreamento</li>
            <li>Comunicar promoções e novidades (com sua autorização)</li>
            <li>Cumprir obrigações legais e fiscais</li>
            <li>Melhorar nossos produtos e serviços</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">4. Compartilhamento de dados</h2>
          <p>Seus dados <strong className="text-[#CCC]">não são vendidos</strong> a terceiros. Podemos compartilhar com:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong className="text-[#CCC]">Mercado Pago</strong> — para processamento de pagamentos</li>
            <li><strong className="text-[#CCC]">Melhor Envio / Correios</strong> — para entrega do pedido</li>
            <li><strong className="text-[#CCC]">Resend</strong> — para envio de e-mails transacionais</li>
            <li>Autoridades competentes, quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">5. Cookies e rastreamento</h2>
          <p>
            Utilizamos cookies para manter sua sessão de compra, analisar o tráfego (Google Analytics) e
            veicular anúncios relevantes (Meta Pixel). Você pode recusar os cookies não essenciais a qualquer
            momento nas configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">6. Seus direitos (LGPD)</h2>
          <p>Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Confirmar a existência de tratamento dos seus dados</li>
            <li>Acessar, corrigir ou atualizar seus dados</li>
            <li>Solicitar a exclusão dos seus dados</li>
            <li>Revogar o consentimento a qualquer momento</li>
          </ul>
          <p className="mt-3">
            Para exercer esses direitos, entre em contato pelo Instagram{' '}
            <strong className="text-[#C9A84C]">@start_oneoficial</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">7. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado,
            perda ou alteração. O banco de dados é hospedado na plataforma Neon (PostgreSQL) com criptografia
            em trânsito e em repouso.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">8. Retenção de dados</h2>
          <p>
            Seus dados são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política
            e obrigações legais. Você pode solicitar a exclusão a qualquer momento, salvo quando a retenção
            for exigida por lei.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">9. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Alterações relevantes serão comunicadas pelo
            site ou por e-mail. O uso continuado da loja após as alterações indica sua concordância.
          </p>
        </section>

        <div className="pt-4 border-t border-[#2A2A2A]">
          <p className="text-xs text-[#444]">
            Start One Imports · Perfumes Árabes e Importados · <strong className="text-[#555]">@start_oneoficial</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
