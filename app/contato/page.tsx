import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import WhatsappLink from "@/components/WhatsappLink";

export const metadata: Metadata = {
  title: "Contato | Simples Assim",
  description:
    "Fale com a Simples Assim: WhatsApp, e-mail ou atendimento em Brasília/DF. Cotação gratuita e sem burocracia.",
};

const WHATSAPP =
  "https://wa.me/5561999867005?text=Ol%C3%A1!%20Quero%20uma%20cota%C3%A7%C3%A3o.";

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-[#535391] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-[#5CBECB] font-bold text-sm uppercase tracking-widest mb-3">
            Fale com a gente
          </p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            Contato
          </h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Atendimento humano, sem burocracia. Escolha o canal que preferir.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
          <div className="bg-[#f6fcfd] rounded-2xl p-7 border border-[#e8f7f8]">
            <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-2">
              WhatsApp
            </p>
            <p className="text-[#333333] font-bold text-lg mb-4">
              (61) 99986-7005
            </p>
            <WhatsappLink
              href={WHATSAPP}
              origem="pagina_contato"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-[#333333] font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Falar agora →
            </WhatsappLink>
          </div>

          <div className="bg-[#f6fcfd] rounded-2xl p-7 border border-[#e8f7f8]">
            <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-2">
              E-mail
            </p>
            <p className="text-[#333333] font-bold text-lg mb-4 break-all">
              atendimento@simplesassim.com.br
            </p>
            <a
              href="mailto:atendimento@simplesassim.com.br"
              className="inline-flex items-center gap-2 bg-white border-2 border-[#5CBECB] text-[#535391] font-bold px-6 py-3 rounded-xl text-sm transition-all hover:bg-[#5CBECB] hover:text-white"
            >
              Enviar e-mail →
            </a>
          </div>

          <div className="bg-[#f6fcfd] rounded-2xl p-7 border border-[#e8f7f8]">
            <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-2">
              Atendimento
            </p>
            <p className="text-[#333333] font-bold text-lg">
              Segunda a sexta, 9h às 18h
            </p>
            <p className="text-[#333333]/75 text-sm mt-2">
              Fora desse horário, deixe sua mensagem no WhatsApp — respondemos
              no próximo horário útil.
            </p>
          </div>

          <div className="bg-[#f6fcfd] rounded-2xl p-7 border border-[#e8f7f8]">
            <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-2">
              Área de atuação
            </p>
            <p className="text-[#333333] font-bold text-lg">
              Brasília / DF
            </p>
            <p className="text-[#333333]/75 text-sm mt-2">
              Atendimento digital para todo o Brasil.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-10 text-center">
          <p className="text-[#333333]/75 text-sm">
            Via Seguros ·{" "}
            <a
              href="https://www2.susep.gov.br/safe/Corretores/pesquisa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5CBECB] underline"
            >
              SUSEP nº 202018692
            </a>{" "}
            · CNPJ 22.663.893/0001-98
          </p>
        </div>
      </section>
    </main>
  );
}
