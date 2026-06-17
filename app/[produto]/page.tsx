// app/[produto]/page.tsx
// Template SSG de landing page — Simples Assim
// Uso: cada produto é uma config em PRODUTOS. Adicionar produto = adicionar objeto ao map.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FormularioCotacao from "@/components/FormularioCotacao";
import FormularioAutoQualificado from "@/components/FormularioAutoQualificado";
import CalculeVoceMesmo from "@/components/CalculeVoceMesmo";
import SiteHeader from "@/components/SiteHeader";
import Image from "next/image";

/* ─── CONFIGURAÇÃO DE PRODUTOS ─────────────────────────────────────────── */

type ProdutoConfig = {
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  beneficios: string[];
  whatsappMensagem: string;
  metaTitle: string;
  metaDescription: string;
  // true quando a página tem uma ação principal própria (ex: calculadora),
  // e o WhatsApp deve aparecer apenas como opção discreta no hero.
  ctaSecundaria?: boolean;
};

const PRODUTOS: Record<string, ProdutoConfig> = {
  "seguro-auto": {
    slug: "seguro-auto",
    titulo: "Seguro Auto",
    subtitulo: "Compare e contrate em minutos",
    descricao:
      "Cotamos nas principais seguradoras do Brasil e você escolhe a melhor cobertura para o seu perfil.",
    icone: "🚗",
    beneficios: [
      "Comparamos mais de 40 seguradoras",
      "Cotação sem compromisso em minutos",
      "Atendimento humano do início ao fim",
      "Suporte completo em caso de sinistro",
    ],
    whatsappMensagem: "Olá! Quero uma cotação de Seguro Auto.",
    metaTitle: "Seguro Auto | Simples Assim — Cotação em minutos",
    metaDescription:
      "Compare seguro auto nas melhores seguradoras com um corretor especializado. Cotação rápida, sem burocracia.",
  },
  "seguro-residencial": {
    slug: "seguro-residencial",
    titulo: "Seguro Residencial",
    subtitulo: "Proteja seu lar com o melhor custo-benefício",
    descricao:
      "Casa, apartamento ou sítio — encontramos a cobertura certa para o seu imóvel.",
    icone: "🏠",
    beneficios: [
      "Coberturas para incêndio, roubo e danos elétricos",
      "Assistência 24h incluída",
      "Parcelamento facilitado",
      "Atendimento personalizado",
    ],
    whatsappMensagem: "Olá! Quero uma cotação de Seguro Residencial.",
    metaTitle: "Seguro Residencial | Simples Assim — Proteja seu lar",
    metaDescription:
      "Seguro residencial com as melhores coberturas e atendimento humano. Cotação rápida e sem burocracia.",
  },
  "seguro-viagem": {
    slug: "seguro-viagem",
    titulo: "Seguro Viagem",
    subtitulo: "Viaje tranquilo para qualquer destino",
    descricao:
      "Cobertura médica, bagagem e cancelamento para viagens nacionais e internacionais.",
    icone: "✈️",
    beneficios: [
      "Cobertura médica internacional",
      "Mais de 60 coberturas para você viajar tranquilo",
      "Assistência 24h em português",
      "Proteção de bagagem",
      "Cancelamento de viagem",
    ],
    whatsappMensagem: "Olá! Quero uma cotação de Seguro Viagem.",
    metaTitle: "Seguro Viagem | Simples Assim — Viaje com tranquilidade",
    metaDescription:
      "Seguro viagem nacional e internacional com as melhores coberturas. Cotação imediata.",
    ctaSecundaria: true,
  },
};

/* ─── GERAÇÃO ESTÁTICA DE ROTAS ─────────────────────────────────────────── */

export async function generateStaticParams() {
  return Object.keys(PRODUTOS).map((slug) => ({ produto: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ produto: string }>;
}): Promise<Metadata> {
  const { produto } = await params;
  const config = PRODUTOS[produto];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
  };
}

/* ─── COMPONENTES INTERNOS ──────────────────────────────────────────────── */

function Hero({ config }: { config: ProdutoConfig }) {
  const whatsappUrl = `https://wa.me/5561999867005?text=${encodeURIComponent(
    config.whatsappMensagem
  )}`;
  const heroPadding = config.ctaSecundaria ? "py-10 md:py-12" : "py-20";

  return (
    <section className="bg-[#535391] text-white">
      <div className={`max-w-5xl mx-auto px-6 ${heroPadding} grid md:grid-cols-2 gap-8 md:gap-12 items-center`}>
        {/* Texto */}
        <div>
          <span className="inline-block text-4xl mb-3">{config.icone}</span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
            {config.titulo}
          </h1>
          <p className="text-xl text-[#5CBECB] font-semibold mb-4">
            {config.subtitulo}
          </p>
          <p className="text-white/80 text-base leading-relaxed mb-6">
            {config.descricao}
          </p>

          {/* CTA WhatsApp — posição 1 (hero) */}
          {config.ctaSecundaria ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold underline transition-colors"
            >
              Prefere falar com um corretor antes? Fale no WhatsApp →
            </a>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-7 py-4 rounded-full text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Quero minha cotação agora
            </a>
          )}
        </div>

        {/* Benefícios */}
        <div className={`bg-white/10 rounded-2xl backdrop-blur-sm ${config.ctaSecundaria ? "p-5" : "p-7"}`}>
          <p className="text-[#5CBECB] font-bold text-sm uppercase tracking-widest mb-4">
            Por que a Simples Assim?
          </p>
          <ul className={config.ctaSecundaria ? "space-y-2.5" : "space-y-4"}>
            {config.beneficios.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-white/90">
                <span className="text-[#E9854A] font-black text-lg leading-none mt-0.5">
                  ✓
                </span>
                <span className="text-base">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CredibilidadeBar() {
  const numeros = [
    { valor: "42+", label: "Seguradoras parceiras" },
    { valor: "10 anos", label: "de mercado" },
    { valor: "100%", label: "Atendimento humano" },
    { valor: "0", label: "Burocracia" },
  ];

  return (
    <section className="bg-[#5CBECB]">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {numeros.map((n, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl font-black text-white">{n.valor}</div>
            <div className="text-white/80 text-sm mt-1">{n.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Seção do formulário ────────────────────────────────────────────────
// A landing page de seguro-auto usa o formulário qualificado (com upload
// obrigatório de apólice no fluxo de renovação). As demais landing pages
// continuam com o formulário simples, até montarmos o fluxo específico
// de cada produto.
function SecaoFormulario({ slug }: { slug: string }) {
  const isAuto = slug === "seguro-auto";

  return (
    <section className="bg-[#f7fafa] py-20 px-6" id="cotacao">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Texto de apoio */}
        <div>
          <h2 className="text-3xl font-black text-[#535391] leading-tight mb-4">
            {isAuto
              ? "Já tem seguro? Compare antes de renovar."
              : "Prefere que a gente entre em contato?"}
          </h2>
          <p className="text-[#333333]/70 text-base leading-relaxed mb-6">
            {isAuto
              ? "Envie sua apólice atual e um corretor especializado retorna em até 2 horas úteis com opções melhores para o seu perfil."
              : "Preencha o formulário e um corretor especializado entra em contato com você em até 2 horas úteis com as melhores opções."}
          </p>
          <div className="space-y-3">
            {[
              "Sem compromisso",
              "Seus dados são protegidos (LGPD)",
              "Resposta em até 2 horas úteis",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[#333333]/60 text-sm">
                <span className="text-[#5CBECB] font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Formulário — componente client */}
        {isAuto ? <FormularioAutoQualificado /> : <FormularioCotacao />}
      </div>
    </section>
  );
}

function Rodape({ config }: { config: ProdutoConfig }) {
  const whatsappUrl = `https://wa.me/5561999867005?text=${encodeURIComponent(
    config.whatsappMensagem
  )}`;

  return (
    <footer className="bg-[#535391] text-white">
      {/* CTA WhatsApp — posição 3 (rodapé) */}
      <div className="border-b border-white/10 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xl font-bold">
            Ainda com dúvidas? Fale direto com um corretor.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-7 py-4 rounded-full text-base transition-all whitespace-nowrap"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      {/* Dados legais */}
      <div className="py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-white/50 text-xs">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Simples Assim" width={80} height={24} />
          </div>
          <p>Via Seguros · SUSEP nº 202018692 · CNPJ 22.663.893/0001-98 · Todos os direitos reservados © {new Date().getFullYear()}</p>
          <p>Corretor responsável: Fabio Salim · SUSEP nº 202018692</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ produto: string }>;
}) {
  const { produto } = await params;
  const config = PRODUTOS[produto];

  if (!config) notFound();

  return (
    <main className="min-h-screen font-[family-name:var(--font-nunito)]">
      <SiteHeader />
      <Hero config={config} />
      {produto !== "seguro-viagem" && <CredibilidadeBar />}
      {produto === "seguro-viagem" ? (
        <CalculeVoceMesmo />
      ) : (
        <SecaoFormulario slug={produto} />
      )}
      <Rodape config={config} />
    </main>
  );
}
