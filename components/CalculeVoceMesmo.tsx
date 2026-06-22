"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export type Seguradora = {
  nome: string;
  blurb: string;
  link: string;
};

const WHATSAPP_NUMERO = "5561999867005";

export default function CalculeVoceMesmo({
  seguradoras,
  produtoLabel,
}: {
  seguradoras: Seguradora[];
  produtoLabel: string; // ex: "seguro viagem", "seguro residencial"
}) {
  const [ativa, setAtiva] = useState(0);
  const seguradora = seguradoras[ativa];

  const whatsappNaoEncontrou =
    `https://wa.me/${WHATSAPP_NUMERO}?text=` +
    encodeURIComponent(
      `Olá! Não encontrei o ${produtoLabel} que eu procurava no site. Podem me ajudar?`
    );

  return (
    <section className="bg-[#f7fafa] py-20 px-6 scroll-mt-20" id="cotacao">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-[#535391] leading-tight mb-4">
          Calcule você mesmo
        </h2>
        <p className="text-[#333333]/70 text-base leading-relaxed">
          Prefere comprar direto? Escolha a seguradora abaixo e finalize sua
          compra com total segurança, sem precisar preencher formulário.
        </p>
      </div>

      {/* Abas */}
      <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mb-6">
        {seguradoras.map((s, i) => (
          <button
            key={s.nome}
            type="button"
            onClick={() => {
              setAtiva(i);
              sendGAEvent("event", "select_seguradora", {
                seguradora: s.nome,
                produto: produtoLabel,
              });
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
              ativa === i
                ? "bg-[#5CBECB] border-[#5CBECB] text-white"
                : "bg-white border-[#e0e0e0] text-[#333333]/70 hover:border-[#5CBECB]"
            }`}
          >
            {s.nome}
          </button>
        ))}
      </div>

      {/* Card da seguradora ativa */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#e8f7f8] shadow-sm p-8 text-center">
        <h3 className="text-xl font-bold text-[#535391] mb-3">
          {seguradora.nome}
        </h3>
        <p className="text-[#333333]/70 text-sm leading-relaxed mb-7">
          {seguradora.blurb}
        </p>
        <a
          href={seguradora.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendGAEvent("event", "comprar_seguradora_click", {
              seguradora: seguradora.nome,
              produto: produtoLabel,
            })
          }
          className="inline-flex items-center gap-2 bg-[#B85A22] hover:bg-[#A04E1D] text-white font-bold px-7 py-4 rounded-xl text-base transition-all shadow-sm hover:shadow-md"
        >
          Comprar com a {seguradora.nome} →
        </a>
        <p className="text-[#333333]/40 text-xs mt-4">
          Você será direcionado ao site da seguradora para finalizar a compra.
        </p>
      </div>

      {/* Não encontrou */}
      <div className="max-w-xl mx-auto text-center mt-10 pt-8 border-t border-[#e8f7f8]">
        <p className="text-[#535391] font-bold mb-1">
          Não encontrou o que procurava?
        </p>
        <p className="text-[#333333]/60 text-sm mb-4">
          Fale com a gente — não tenha receio ou dúvida.
        </p>
        <a
          href={whatsappNaoEncontrou}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendGAEvent("event", "whatsapp_click", {
              origem: "calcule_voce_mesmo_nao_encontrou",
              produto: produtoLabel,
            })
          }
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-[#1a1a1a] font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Falar no WhatsApp →
        </a>
      </div>
    </section>
  );
}
