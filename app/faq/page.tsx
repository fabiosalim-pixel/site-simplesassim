import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { FAQ_AUTO, FAQ_RESIDENCIAL, FAQ_VIAGEM } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Perguntas frequentes | Simples Assim",
  description:
    "Tire suas dúvidas sobre seguro auto, residencial e viagem. Respostas diretas de um corretor com 24 anos de experiência.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-[#535391] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-[#5CBECB] font-bold text-sm uppercase tracking-widest mb-3">
            Tire suas dúvidas
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Perguntas frequentes
          </h1>
          <p className="text-white/80 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Respostas diretas para as dúvidas mais comuns sobre cada tipo de
            seguro.
          </p>
        </div>
      </section>

      <FAQ titulo="🚗 Seguro Auto" itens={FAQ_AUTO} produto="Seguro Auto" />
      <FAQ
        titulo="🏠 Seguro Residencial"
        itens={FAQ_RESIDENCIAL}
        produto="Seguro Residencial"
      />
      <FAQ titulo="✈️ Seguro Viagem" itens={FAQ_VIAGEM} produto="Seguro Viagem" />

      <Footer />
    </main>
  );
}
