import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────
// Link de WhatsApp (já com o número real)
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
  { num: "42+", label: "Seguradoras parceiras" },
  { num: "10 anos", label: "de mercado" },
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

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="Simples Assim"
          width={150}
          height={42}
          priority
          className="h-9 w-auto"
        />
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[#5CBECB] hover:text-[#4aa9b6] transition-colors"
        >
          Fale pelo WhatsApp →
        </a>
      </header>

      {/* ── Hero ── */}
      <section className="bg-[#535391] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Coluna esquerda */}
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
            <p className="text-white/70 text-lg mt-6 max-w-md leading-relaxed">
              Escolha o seguro que você procura, peça sua cotação e deixe o
              resto com a gente.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <a
                href="#produtos"
                className="bg-[#E9854A] hover:bg-[#d9743b] text-white font-bold px-7 py-4 rounded-xl text-center transition-all shadow-sm hover:shadow-md"
              >
                Quero minha cotação
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-7 py-4 rounded-xl text-center transition-all"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          {/* Coluna direita — card "Por que a Simples Assim" */}
          <div className="bg-white/10 rounded-2xl p-7 md:p-8">
            <p className="text-[#5CBECB] font-bold text-sm uppercase tracking-widest mb-5">
              Por que a Simples Assim?
            </p>
            <ul className="space-y-4">
              {MOTIVOS.map((m) => (
                <li key={m} className="flex items-start gap-3">
                  <span className="text-[#E9854A] font-black text-lg leading-none mt-0.5">
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
      <section className="bg-[#5CBECB] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black">{s.num}</div>
              <div className="text-sm text-white/80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Produtos ── */}
      <section id="produtos" className="bg-[#f6fcfd] border-b border-[#e8f7f8]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-black text-[#535391] mb-2">
            Qual seguro você procura?
          </h2>
          <p className="text-[#333333]/60 mb-10">
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
                <p className="text-[#333333]/60 text-sm leading-relaxed mb-4">
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
      <footer className="bg-[#535391] text-white/70">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-white mb-1">
              Simples Assim · Via Seguros
            </p>
            <p>Corretora de seguros · SUSEP nº 202018692</p>
            <p>CNPJ 22.663.893/0001-98 · Brasília/DF</p>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#5CBECB] hover:text-white transition-colors"
          >
            Fale pelo WhatsApp →
          </a>
        </div>
      </footer>
    </main>
  );
}
