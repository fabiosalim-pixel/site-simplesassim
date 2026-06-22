import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade | Simples Assim",
  description: "Como a Simples Assim coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-[#535391] text-white">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            Política de Privacidade
          </h1>
          <p className="text-white/80 text-sm mt-3">
            Última atualização: 21 de junho de 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-[#333333]/90 text-sm leading-relaxed">
          <div className="bg-[#fff8f0] border border-[#f5d9b8] rounded-xl p-5 text-xs text-[#333333]/80">
            ⚠️ Este texto é um modelo padrão, redigido para refletir o que o
            site da Simples Assim coleta hoje. Não substitui orientação
            jurídica. Recomenda-se revisão por um advogado antes de
            considerá-lo definitivo.
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              1. Quem somos
            </h2>
            <p>
              Esta política se aplica ao site da Simples Assim, operado pela
              Via Seguros (corretora de seguros, CNPJ 22.663.893/0001-98,
              SUSEP nº 202018692), responsável pelo tratamento dos dados
              pessoais coletados através deste site, em conformidade com a
              Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              2. Quais dados coletamos
            </h2>
            <p className="mb-3">
              Coletamos os dados que você nos fornece voluntariamente ao
              solicitar uma cotação ou entrar em contato:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Nome completo</li>
              <li>Telefone / WhatsApp</li>
              <li>E-mail</li>
              <li>
                Em cotações de seguro auto: CPF, data de nascimento, estado
                civil, CEP, dados do veículo (placa, modelo, ano, chassi)
              </li>
              <li>
                Em renovações: o arquivo PDF da sua apólice vigente, quando
                anexado
              </li>
              <li>
                Dados de navegação e origem (de qual canal ou anúncio você
                chegou até nós), para entendermos como o site é utilizado
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              3. Para que usamos seus dados
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Preparar e enviar cotações de seguro personalizadas</li>
              <li>Entrar em contato para dar andamento à sua solicitação</li>
              <li>
                Cumprir obrigações legais e regulatórias da atividade de
                corretagem de seguros
              </li>
              <li>
                Entender o desempenho do site e melhorar a experiência de
                quem o visita
              </li>
            </ul>
            <p className="mt-3">
              Não vendemos seus dados pessoais a terceiros. Seus dados podem
              ser compartilhados com seguradoras exclusivamente para fins de
              cotação e contratação do seguro solicitado por você.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              4. Onde seus dados ficam armazenados
            </h2>
            <p>
              Os dados são armazenados em infraestrutura de banco de dados em
              nuvem (Supabase), com controles de acesso restritos. Os
              documentos PDF enviados (como apólices) são guardados em
              armazenamento privado, não acessível publicamente.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              5. Por quanto tempo guardamos seus dados
            </h2>
            <p>
              Mantemos seus dados pelo tempo necessário para prestar o
              serviço de corretagem solicitado e cumprir obrigações legais e
              regulatórias do setor de seguros, que podem exigir guarda de
              registros por período determinado em lei.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              6. Seus direitos
            </h2>
            <p className="mb-3">
              Conforme a LGPD, você tem direito a, entre outros:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Confirmar se tratamos seus dados e acessá-los</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>
                Solicitar a exclusão dos seus dados, quando não houver
                obrigação legal de retenção
              </li>
              <li>Revogar o consentimento dado a qualquer momento</li>
            </ul>
            <p className="mt-3">
              Para exercer esses direitos, entre em contato pelo e-mail{" "}
              <a
                href="mailto:atendimento@simplesassim.com.br"
                className="text-[#5CBECB] underline"
              >
                atendimento@simplesassim.com.br
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              7. Cookies e analytics
            </h2>
            <p>
              Utilizamos o Google Analytics para entender como o site é
              utilizado (páginas visitadas, cliques, origem do acesso). Esses
              dados são tratados de forma agregada e não identificam você
              individualmente para fins de marketing de terceiros.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              8. Alterações nesta política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente. A data da
              última atualização está sempre indicada no topo desta página.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#535391] mb-3">
              9. Contato
            </h2>
            <p>
              Dúvidas sobre esta política ou sobre o tratamento dos seus
              dados podem ser enviadas para{" "}
              <a
                href="mailto:atendimento@simplesassim.com.br"
                className="text-[#5CBECB] underline"
              >
                atendimento@simplesassim.com.br
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
