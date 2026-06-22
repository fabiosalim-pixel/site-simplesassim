import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import CtaLink from "@/components/CtaLink";
import WhatsappLink from "@/components/WhatsappLink";

// ─────────────────────────────────────────────────────────────
const WHATSAPP =
  "https://wa.me/5561999867005?text=Ol%C3%A1!%20Quero%20uma%20cota%C3%A7%C3%A3o.";
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Simples Assim — Cotamos com as melhores seguradoras",
  description:
    "Cotamos com as melhores seguradoras do Brasil. Atendimento humano e sem burocracia. Simples Assim.",
};

const MOTIVOS = [
  "Comparamos mais de 40 seguradoras",
  "Cotação sem compromisso, em minutos",
  "Atendimento humano do início ao fim",
  "Suporte completo em caso de sinistro",
];

const STATS = [
  { num: "40+", label: "Seguradoras parceiras" },
  { num: "24 anos", label: "de experiência" },
  { num: "100%", label: "Atendimento humano" },
  { num: "0", label: "Burocracia" },
];

const PRODUTOS = [
  {
    slug: "seguro-auto",
    emoji: "🚗",
    nome: "Seguro Auto",
    desc: "Já tem seguro? Envie sua apólice e compare com 40+ seguradoras.",
  },
  {
    slug: "seguro-residencial",
    emoji: "🏠",
    nome: "Seguro Residencial",
    desc: "Proteja sua casa ou apartamento com a cobertura certa pra você.",
  },
  {
    slug: "seguro-viagem",
    emoji: "✈️",
    nome: "Seguro Viagem",
    desc: "Viaje tranquilo, dentro ou fora do Brasil, com assistência completa.",
  },
];

// TODO: substituir por logos reais quando Salim enviar os arquivos
// (ver tarefa no Asana — pendência de logos das seguradoras parceiras)
const SEGURADORAS = [
  "Porto Seguro",
  "HDI Seguros",
  "Tokio Marine",
  "Allianz",
  "Mapfre",
  "Yelum",
  "Itaú Seguros",
  "Bradesco Seguros",
  "Sul América",
  "Liberty Seguros",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="bg-[#535391] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <p className="text-[#5CBECB] font-bold text-sm uppercase tracking-widest mb-4">
              Corretora de seguros
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Cotamos com as melhores seguradoras.
            </h1>
            <p className="text-xl md:text-2xl font-bold text-[#5CBECB] mt-4">
              Atendimento humano e sem burocracia. Simples Assim&nbsp;;)
            </p>
            <p className="text-white/80 text-lg mt-6 max-w-md leading-relaxed">
              Escolha o seguro que você procura, peça sua cotação e deixe o
              resto com a gente.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <CtaLink
                href="#produtos"
                origem="home_hero"
                className="bg-[#B85A22] hover:bg-[#A04E1D] text-white font-bold px-7 py-4 rounded-xl text-center transition-all shadow-sm hover:shadow-md"
              >
                Quero minha cotação
              </CtaLink>
              <WhatsappLink
                href={WHATSAPP}
                origem="home_hero"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-[#333333] font-bold px-7 py-4 rounded-xl text-center transition-all"
              >
                Falar no WhatsApp
              </WhatsappLink>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-7 md:p-8">
            <p className="text-[#5CBECB] font-bold text-sm uppercase tracking-widest mb-5">
              Por que a Simples Assim?
            </p>
            <ul className="space-y-4">
              {MOTIVOS.map((m) => (
                <li key={m} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-[#5CBECB] font-black text-lg leading-none mt-0.5">
                    ✓
                  </span>
                  <span className="text-white/90">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Barra de estatísticas ── */}
      <section className="bg-[#5CBECB] text-[#2d2d5c]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black">{s.num}</div>
              <div className="text-sm text-[#2d2d5c]/80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sobre ── */}
      <section id="sobre" className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-[#B85A22] font-bold text-xs uppercase tracking-widest mb-3">
              Quem está por trás
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-[#535391] mb-5">
              Sobre a Simples Assim
            </h2>
            <p className="text-[#333333]/70 leading-relaxed mb-4">
              A Simples Assim é a porta digital da Via Seguros, corretora de
              seguros que atua no mercado desde 2004 sob a responsabilidade
              técnica de Fabio Salim Guimarães Marques, formado pela Escola
              Nacional de Seguros (ENS).
            </p>
            <p className="text-[#333333]/70 leading-relaxed">
              Antes de fundar a corretora, construiu sua experiência em
              seguradoras como Bradesco Seguros, Icatu Seguros, Metlife, HSBC
              Seguros e Zurich-Santander Seguros — bagagem que hoje orienta
              cada cotação que fazemos para você.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="bg-[#f6fcfd] rounded-2xl p-6 border border-[#e8f7f8]">
              <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-1.5">
                Missão
              </p>
              <p className="text-[#333333]/70 text-sm leading-relaxed">
                Prestar os melhores serviços de proteção pessoal e
                patrimonial, com agilidade e custos competitivos.
              </p>
            </div>
            <div className="bg-[#f6fcfd] rounded-2xl p-6 border border-[#e8f7f8]">
              <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-1.5">
                Visão
              </p>
              <p className="text-[#333333]/70 text-sm leading-relaxed">
                Ser referência em seguros, planos de saúde e consórcios em
                Brasília.
              </p>
            </div>
            <div className="bg-[#f6fcfd] rounded-2xl p-6 border border-[#e8f7f8]">
              <p className="text-xs font-bold text-[#5CBECB] uppercase tracking-widest mb-1.5">
                Valores
              </p>
              <p className="text-[#333333]/70 text-sm leading-relaxed">
                Atendimento humano, transparência e o melhor custo-benefício
                para cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Seguradoras parceiras ── */}
      <section className="bg-[#f6fcfd] border-y border-[#e8f7f8]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="text-xl md:text-2xl font-black text-[#535391] text-center mb-2">
            Seguradoras parceiras
          </h2>
          <p className="text-[#333333]/75 text-center text-sm mb-8">
            Comparamos cotações entre as principais seguradoras do Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {SEGURADORAS.map((s) => (
              <span
                key={s}
                className="bg-white border border-[#e8f7f8] rounded-full px-5 py-2 text-sm font-semibold text-[#535391] shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produtos ── */}
      <section id="produtos" className="bg-white border-b border-[#e8f7f8]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-black text-[#535391] mb-2">
            Qual seguro você procura?
          </h2>
          <p className="text-[#333333]/75 mb-10">
            Mais produtos chegando em breve.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUTOS.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group bg-white rounded-2xl border border-[#e8f7f8] p-7 shadow-sm hover:shadow-md hover:border-[#5CBECB] transition-all"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-black text-[#535391] mb-2">
                  {p.nome}
                </h3>
                <p className="text-[#333333]/75 text-sm leading-relaxed mb-4">
                  {p.desc}
                </p>
                <span className="text-[#5CBECB] font-semibold text-sm group-hover:text-[#4aa9b6]">
                  Pedir cotação →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rodapé ── */}
      <footer className="bg-[#535391] text-white/85">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-white mb-1">
              Simples Assim · Via Seguros
            </p>
            <p>
              Corretora de seguros ·{" "}
              <a
                href="https://www2.susep.gov.br/safe/Corretores/pesquisa"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                SUSEP nº 202018692
              </a>
            </p>
            <p>CNPJ 22.663.893/0001-98 · Brasília/DF</p>
            <p className="mt-2">Tel/WhatsApp: (61) 99986-7005</p>
          </div>
          <WhatsappLink
            href={WHATSAPP}
            origem="home_rodape"
            className="text-sm font-semibold text-[#5CBECB] hover:text-white transition-colors"
          >
            Fale pelo WhatsApp →
          </WhatsappLink>
        </div>
      </footer>
    </main>
  );
}
