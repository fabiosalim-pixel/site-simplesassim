"use client";

import { useState } from "react";

type Seguradora = {
  nome: string;
  blurb: string;
  link: string;
};

const SEGURADORAS_VIAGEM: Seguradora[] = [
  {
    nome: "Porto Seguro",
    blurb:
      "Uma das maiores seguradoras do Brasil, com ampla rede de assistência no Brasil e no exterior.",
    link: "http://www.porto.vc/VIAGEM_32566J_b21a49dff0044a6290a21b3e2468061b",
  },
  {
    nome: "Tokio Marine",
    blurb:
      "Seguradora com tradição global em seguro viagem, cobertura médica e assistência 24h.",
    link: "https://servicos.tokiomarine.com.br/sva/view/digital/seguro-viagem/broker/29ECFE91-4FBA-E5FD-8560-D11D60F9EEF0",
  },
  {
    nome: "SulAmérica",
    blurb:
      "Cobertura nacional e internacional, com planos para diferentes perfis de viagem.",
    link: "https://portal.sulamericaseguros.com.br/seguroviagem?idLink=CSUZV5Z",
  },
  {
    nome: "Allianz",
    blurb:
      "Seguradora com presença internacional e assistência robusta para viagens ao exterior.",
    link: "https://parceiros.allianztravel.com.br/allianzbroker/ALLIANZ?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3ODE3Mjc4NDMsImV4cCI6MTgxNzcyNzg0NCwiaWF0IjoxNzgxNzI3ODQ0LCJVc2VyIjoiYXpicm9rZXIiLCJCcm9rZXJDb2RlIjoiNDAxMjI3NCJ9.TZMeSZPEKgKIW6xX5pmISGBS4Ok8OvADJ6qXiXWyLI8",
  },
];

const WHATSAPP_NAO_ENCONTROU =
  "https://wa.me/5561999867005?text=" +
  encodeURIComponent(
    "Olá! Não encontrei o seguro viagem que eu procurava no site. Podem me ajudar?"
  );

export default function CalculeVoceMesmo() {
  const [ativa, setAtiva] = useState(0);
  const seguradora = SEGURADORAS_VIAGEM[ativa];

  return (
    <section className="bg-[#f7fafa] py-20 px-6" id="cotacao">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-black text-[#535391] leading-tight mb-4">
          Calcule você mesmo
        </h2>
        <p className="text-[#333333]/70 text-base leading-relaxed">
          Prefere comprar direto? Escolha a seguradora abaixo e finalize sua
          compra com total segurança, sem precisar preencher formulário.
        </p>
      </div>

      {/* Abas */}
      <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mb-6">
        {SEGURADORAS_VIAGEM.map((s, i) => (
          <button
            key={s.nome}
            type="button"
            onClick={() => setAtiva(i)}
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
        <h3 className="text-xl font-black text-[#535391] mb-3">
          {seguradora.nome}
        </h3>
        <p className="text-[#333333]/70 text-sm leading-relaxed mb-7">
          {seguradora.blurb}
        </p>
        <a
          href={seguradora.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#E9854A] hover:bg-[#d9743b] text-white font-bold px-7 py-4 rounded-xl text-base transition-all shadow-sm hover:shadow-md"
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
          href={WHATSAPP_NAO_ENCONTROU}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Falar no WhatsApp →
        </a>
      </div>
    </section>
  );
}
