"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export type FaqItem = {
  pergunta: string;
  resposta: string;
};

function ItemFaq({
  item,
  aberto,
  onToggle,
}: {
  item: FaqItem;
  aberto: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-[#e8f7f8] rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={aberto}
      >
        <span className="font-bold text-[#535391] text-sm md:text-base">
          {item.pergunta}
        </span>
        <span
          className={`text-[#5CBECB] text-xl flex-shrink-0 transition-transform ${
            aberto ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {aberto && (
        <div className="px-5 pb-4 text-[#333333]/70 text-sm leading-relaxed">
          {item.resposta}
        </div>
      )}
    </div>
  );
}

export default function FAQ({
  titulo = "Perguntas frequentes",
  itens,
  produto,
}: {
  titulo?: string;
  itens: FaqItem[];
  produto: string;
}) {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    const vaiAbrir = abertoIndex !== i;
    setAbertoIndex(vaiAbrir ? i : null);
    if (vaiAbrir) {
      sendGAEvent("event", "faq_open", {
        produto,
        pergunta: itens[i].pergunta,
      });
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: itens.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  };

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-[#535391] mb-8 text-center">
          {titulo}
        </h2>
        <div className="space-y-3">
          {itens.map((item, i) => (
            <ItemFaq
              key={item.pergunta}
              item={item}
              aberto={abertoIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
