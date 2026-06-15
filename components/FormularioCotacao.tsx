"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type FormData = {
  nome: string;
  telefone: string;
  email: string;
  tipo_seguro: string;
  consentimento_lgpd: boolean;
};

const TIPOS_SEGURO = [
  "Seguro Auto",
  "Seguro Residencial",
  "Seguro Viagem",
  "Seguro de Vida",
  "Seguro Empresarial",
  "Outro",
];

function fmtTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return v;
}

function getUtms() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
    canal: p.get("utm_medium") || "Orgânico",
  };
}

export default function FormularioCotacao() {
  const [form, setForm] = useState<FormData>({
    nome: "",
    telefone: "",
    email: "",
    tipo_seguro: "",
    consentimento_lgpd: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [erro, setErro] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "telefone" ? fmtTelefone(value as string) : value,
    }));
  };

  const handleSubmit = async () => {
    // Validação mínima
    if (!form.nome.trim()) return setErro("Informe seu nome.");
    if (!form.telefone.trim()) return setErro("Informe seu telefone.");
    if (!form.consentimento_lgpd) return setErro("Confirme o consentimento para continuar.");
    setErro("");
    setStatus("loading");

    const utms = getUtms();

    const { error } = await supabase.from("leads").insert({
      nome: form.nome.trim(),
      telefone: form.telefone,
      email: form.email.trim() || null,
      tipo_seguro: form.tipo_seguro || null,
      origem: "Site",
      consentimento_lgpd: true,
      ...utms,
    });

    if (error) {
      setStatus("error");
      setErro("Erro ao enviar. Tente pelo WhatsApp.");
      return;
    }

    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f7f8] p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-black text-[#535391] mb-2">
          Recebemos sua solicitação!
        </h3>
        <p className="text-[#333333]/60 text-sm">
          Um corretor entrará em contato em até 2 horas úteis com as melhores opções para você.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      className="bg-white rounded-2xl shadow-sm border border-[#e8f7f8] p-7"
    >
      <h3 className="text-lg font-black text-[#535391] mb-6">
        Solicitar cotação gratuita
      </h3>

      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5">
            Nome completo *
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Seu nome"
            className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:border-[#5CBECB] focus:ring-1 focus:ring-[#5CBECB] transition-colors"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5">
            Telefone / WhatsApp *
          </label>
          <input
            type="tel"
            value={form.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
            placeholder="(61) 99999-9999"
            className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:border-[#5CBECB] focus:ring-1 focus:ring-[#5CBECB] transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5">
            E-mail (opcional)
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="seu@email.com"
            className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:border-[#5CBECB] focus:ring-1 focus:ring-[#5CBECB] transition-colors"
          />
        </div>

        {/* Tipo de seguro */}
        <div>
          <label className="block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5">
            Tipo de seguro
          </label>
          <select
            value={form.tipo_seguro}
            onChange={(e) => handleChange("tipo_seguro", e.target.value)}
            className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:border-[#5CBECB] focus:ring-1 focus:ring-[#5CBECB] transition-colors bg-white"
          >
            <option value="">Selecione...</option>
            {TIPOS_SEGURO.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* LGPD */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="lgpd"
            checked={form.consentimento_lgpd}
            onChange={(e) => handleChange("consentimento_lgpd", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#5CBECB] cursor-pointer flex-shrink-0"
          />
          <label htmlFor="lgpd" className="text-xs text-[#333333]/50 leading-relaxed cursor-pointer">
            Concordo com o uso dos meus dados para contato comercial, conforme a{" "}
            <span className="text-[#5CBECB] underline">Política de Privacidade</span> e a LGPD.
          </label>
        </div>

        {/* Erro */}
        {erro && (
          <p className="text-red-500 text-xs font-medium">{erro}</p>
        )}

        {/* Botão submit */}
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="w-full bg-[#E9854A] hover:bg-[#d9743b] disabled:opacity-60 text-white font-bold py-4 rounded-xl text-base transition-all shadow-sm hover:shadow-md"
        >
          {status === "loading" ? "Enviando..." : "Quero minha cotação gratuita"}
        </button>

        {status === "error" && (
          <p className="text-center text-xs text-[#333333]/40">
            Problema técnico?{" "}
            <a
              href="https://wa.me/5561999999999"
              className="text-[#25D366] font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chame no WhatsApp
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
