"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { sendGAEvent } from "@next/third-parties/google";

type Fluxo = "renovacao" | "novo" | null;
type Bool3 = boolean | null;

const ESTADOS_CIVIS = [
  "Solteiro(a)",
  "Casado(a)",
  "Divorciado(a)",
  "Viúvo(a)",
  "União Estável",
];

function fmtTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return v;
}

function fmtCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function fmtCEP(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function fmtPlaca(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
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

// ── Componentes de apoio ──────────────────────────────────

function ToggleSimNao({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Bool3;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5">
        {label} *
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
            value === true
              ? "bg-[#5CBECB] border-[#5CBECB] text-white"
              : "bg-white border-[#e0e0e0] text-[#333333]/70 hover:border-[#5CBECB]"
          }`}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
            value === false
              ? "bg-[#5CBECB] border-[#5CBECB] text-white"
              : "bg-white border-[#e0e0e0] text-[#333333]/70 hover:border-[#5CBECB]"
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );
}

function ToggleOpcoes<T extends string>({
  label,
  opcoes,
  value,
  onChange,
}: {
  label: string;
  opcoes: T[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5">
        {label} *
      </label>
      <div className="flex gap-2 flex-wrap">
        {opcoes.map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => onChange(op)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
              value === op
                ? "bg-[#5CBECB] border-[#5CBECB] text-white"
                : "bg-white border-[#e0e0e0] text-[#333333]/70 hover:border-[#5CBECB]"
            }`}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-[#e0e0e0] rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:border-[#5CBECB] focus:ring-1 focus:ring-[#5CBECB] transition-colors";
const labelClass =
  "block text-xs font-semibold text-[#333333]/60 uppercase tracking-wide mb-1.5";

// ── Componente principal ──────────────────────────────────

export default function FormularioAutoQualificado() {
  const [fluxo, setFluxo] = useState<Fluxo>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [erro, setErro] = useState("");

  // contato (comum aos dois fluxos)
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [lgpd, setLgpd] = useState(false);

  // renovação
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [teveSinistro, setTeveSinistro] = useState<Bool3>(null);
  const [alterouDados, setAlterouDados] = useState<Bool3>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // seguro novo
  const [tipoVeiculo, setTipoVeiculo] = useState<"Zero KM" | "Usado" | null>(null);
  const [chassi, setChassi] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cpf, setCpf] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [cep, setCep] = useState("");
  const [tipoUso, setTipoUso] = useState<"Particular" | "Uber/App" | null>(null);
  const [temGaragem, setTemGaragem] = useState<Bool3>(null);
  const [condutor1825, setCondutor1825] = useState<Bool3>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErro("Envie a apólice em formato PDF.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErro("O arquivo deve ter até 10MB.");
      return;
    }
    setErro("");
    setArquivo(f);
  };

  const validar = (): string | null => {
    if (fluxo === "renovacao") {
      if (!arquivo) return "Anexe o PDF da sua apólice vigente.";
      if (teveSinistro === null) return "Informe se teve sinistro na última vigência.";
      if (alterouDados === null)
        return "Informe se houve alteração de estado civil, endereço ou condutor.";
    } else {
      if (!tipoVeiculo) return "Informe se o carro é Zero KM ou Usado.";
      if (tipoVeiculo === "Zero KM" && !chassi.trim())
        return "Informe o chassi do veículo.";
      if (tipoVeiculo === "Usado" && (!placa.trim() || !modelo.trim() || !ano.trim()))
        return "Informe placa, modelo e ano do veículo.";
      if (!cpf.trim()) return "Informe o CPF do condutor principal.";
      if (!estadoCivil) return "Informe o estado civil.";
      if (!cep.trim()) return "Informe o CEP de pernoite.";
      if (!tipoUso) return "Informe o tipo de utilização do veículo.";
      if (temGaragem === null) return "Informe se há garagem disponível.";
      if (condutor1825 === null)
        return "Informe se há condutores entre 18 e 25 anos.";
    }
    if (!nome.trim()) return "Informe seu nome.";
    if (!telefone.trim()) return "Informe seu telefone.";
    if (!lgpd) return "Confirme o consentimento para continuar.";
    return null;
  };

  const handleSubmit = async () => {
    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }
    setErro("");
    setStatus("loading");

    try {
      // PASSO 1 — gravar o lead PRIMEIRO (sem depender do upload).
      // Se o upload falhar lá na frente, o lead já está salvo de qualquer forma.
      const detalhes: Record<string, unknown> =
        fluxo === "renovacao"
          ? {
              fluxo,
              teve_sinistro: teveSinistro,
              alterou_dados: alterouDados,
            }
          : {
              fluxo,
              tipo_veiculo: tipoVeiculo,
              chassi: tipoVeiculo === "Zero KM" ? chassi.trim() : null,
              placa: tipoVeiculo === "Usado" ? placa.trim() : null,
              modelo: tipoVeiculo === "Usado" ? modelo.trim() : null,
              ano: tipoVeiculo === "Usado" ? ano.trim() : null,
              cpf_condutor: cpf.trim(),
              estado_civil: estadoCivil,
              cep_pernoite: cep.trim(),
              tipo_utilizacao: tipoUso,
              tem_garagem: temGaragem,
              condutor_18_25: condutor1825,
            };

      const utms = getUtms();

      const { data: leadInserido, error: leadError } = await supabase
        .from("leads")
        .insert({
          nome: nome.trim(),
          telefone,
          email: email.trim() || null,
          tipo_seguro: "Seguro Auto",
          origem: "Site",
          consentimento_lgpd: true,
          apolice_path: null,
          detalhes,
          ...utms,
        })
        .select("id")
        .single();

      if (leadError) throw leadError;

      // PASSO 2 — upload do PDF é secundário. Se falhar, o lead já existe;
      // só registramos a falha em "detalhes" e seguimos sem derrubar o envio.
      if (fluxo === "renovacao" && arquivo && leadInserido) {
        const nomeSeguro = arquivo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${nomeSeguro}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("apolices-leads")
          .upload(path, arquivo, { contentType: "application/pdf" });

        if (uploadError) {
          // Não interrompe o fluxo: o lead já foi salvo no Passo 1.
          sendGAEvent("event", "file_upload", { resultado: "falha" });
          await supabase
            .from("leads")
            .update({
              detalhes: { ...detalhes, upload_apolice_falhou: true },
            })
            .eq("id", leadInserido.id);
        } else {
          sendGAEvent("event", "file_upload", { resultado: "sucesso" });
          const apolicePath = uploadData?.path ?? path;
          await supabase
            .from("leads")
            .update({ apolice_path: apolicePath })
            .eq("id", leadInserido.id);
        }
      }

      sendGAEvent("event", "gerar_lead", {
        tipo_seguro: "Seguro Auto",
        canal: (utms as { canal?: string }).canal || "Orgânico",
        fluxo,
      });

      setStatus("success");
    } catch (err) {
      console.error("Erro ao enviar lead:", err);
      setStatus("error");
      setErro("Erro ao enviar. Tente pelo WhatsApp.");
    }
  };

  // ── Sucesso ──
  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f7f8] p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-black text-[#535391] mb-2">
          Recebemos sua solicitação!
        </h3>
        <p className="text-[#333333]/60 text-sm">
          {fluxo === "renovacao"
            ? "Vamos analisar sua apólice atual e te mostrar opções melhores em até 2 horas úteis."
            : "Um corretor entrará em contato em até 2 horas úteis com as melhores opções para o seu perfil."}
        </p>
      </div>
    );
  }

  // ── Passo inicial ──
  if (fluxo === null) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f7f8] p-7">
        <p className="text-[#E9854A] font-bold text-xs uppercase tracking-widest mb-2">
          Cotação qualificada
        </p>
        <h3 className="text-xl font-black text-[#535391] mb-2">
          Você já tem seguro auto?
        </h3>
        <p className="text-[#333333]/60 text-sm mb-6">
          A resposta muda as próximas perguntas — assim você cai direto no
          fluxo certo para o seu caso.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              setFluxo("renovacao");
              sendGAEvent("event", "form_start", { formulario: "auto_qualificado" });
              sendGAEvent("event", "form_step", { etapa: "fluxo_renovacao" });
            }}
            className="flex-1 text-left border-2 border-[#e0e0e0] rounded-2xl p-5 transition-all hover:border-[#5CBECB] hover:shadow-md"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-black text-[#535391]">Sim, já tenho seguro</div>
            <div className="text-xs text-[#333333]/50 mt-1">
              Envie sua apólice atual e compare com outras seguradoras
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setFluxo("novo");
              sendGAEvent("event", "form_start", { formulario: "auto_qualificado" });
              sendGAEvent("event", "form_step", { etapa: "fluxo_novo" });
            }}
            className="flex-1 text-left border-2 border-[#e0e0e0] rounded-2xl p-5 transition-all hover:border-[#5CBECB] hover:shadow-md"
          >
            <div className="text-2xl mb-2">🚗</div>
            <div className="font-black text-[#535391]">Não, é meu primeiro seguro</div>
            <div className="text-xs text-[#333333]/50 mt-1">
              Vamos cotar um seguro novo do zero
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── Fluxos (renovação ou novo) ──
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8f7f8] p-7">
      <button
        type="button"
        onClick={() => setFluxo(null)}
        className="text-xs text-[#5CBECB] font-semibold underline mb-5"
      >
        ← Trocar resposta
      </button>

      <h3 className="text-lg font-black text-[#535391] mb-6">
        {fluxo === "renovacao" ? "Comparar minha renovação" : "Cotar seguro novo"}
      </h3>

      <div className="space-y-4">
        {fluxo === "renovacao" ? (
          <>
            {/* Upload da apólice */}
            <div>
              <label className={labelClass}>Apólice vigente em PDF *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {arquivo ? (
                <div className="flex items-center justify-between border border-[#5CBECB] bg-[#f6fcfd] rounded-xl px-4 py-3">
                  <span className="text-sm text-[#333333] truncate">📎 {arquivo.name}</span>
                  <button
                    type="button"
                    onClick={() => setArquivo(null)}
                    className="text-[#333333]/40 hover:text-red-500 text-sm font-bold ml-3"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#e0e0e0] rounded-xl px-4 py-5 text-sm text-[#333333]/60 hover:border-[#5CBECB] transition-colors text-center"
                >
                  Toque para anexar o PDF da apólice
                  <div className="text-xs text-[#333333]/40 mt-1">Até 10MB</div>
                </button>
              )}
            </div>

            <ToggleSimNao
              label="Teve sinistro na última vigência?"
              value={teveSinistro}
              onChange={setTeveSinistro}
            />
            <ToggleSimNao
              label="Mudou estado civil, endereço ou condutor principal?"
              value={alterouDados}
              onChange={setAlterouDados}
            />
          </>
        ) : (
          <>
            <ToggleOpcoes
              label="O carro é"
              opcoes={["Zero KM", "Usado"] as const}
              value={tipoVeiculo}
              onChange={setTipoVeiculo}
            />

            {tipoVeiculo === "Zero KM" && (
              <div>
                <label className={labelClass}>Chassi *</label>
                <input
                  type="text"
                  value={chassi}
                  onChange={(e) => setChassi(e.target.value.toUpperCase())}
                  placeholder="Número do chassi"
                  className={inputClass}
                />
              </div>
            )}

            {tipoVeiculo === "Usado" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Placa *</label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(fmtPlaca(e.target.value))}
                    placeholder="ABC1D23"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Modelo *</label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: Onix LT"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ano *</label>
                  <input
                    type="text"
                    value={ano}
                    onChange={(e) => setAno(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="2022"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>CPF do condutor principal *</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(fmtCPF(e.target.value))}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Estado civil *</label>
              <select
                value={estadoCivil}
                onChange={(e) => setEstadoCivil(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value="">Selecione...</option>
                {ESTADOS_CIVIS.map((ec) => (
                  <option key={ec} value={ec}>{ec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>CEP de pernoite *</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(fmtCEP(e.target.value))}
                placeholder="71915-500"
                className={inputClass}
              />
            </div>

            <ToggleOpcoes
              label="Tipo de utilização"
              opcoes={["Particular", "Uber/App"] as const}
              value={tipoUso}
              onChange={setTipoUso}
            />
            <ToggleSimNao
              label="Tem garagem em casa ou no trabalho?"
              value={temGaragem}
              onChange={setTemGaragem}
            />
            <ToggleSimNao
              label="Algum condutor entre 18 e 25 anos?"
              value={condutor1825}
              onChange={setCondutor1825}
            />
          </>
        )}

        {/* Contato — comum aos dois fluxos */}
        <div className="pt-2 border-t border-[#e8f7f8]">
          <p className="text-xs font-bold text-[#535391] uppercase tracking-wide mb-3 mt-3">
            Quem vamos contatar?
          </p>
        </div>

        <div>
          <label className={labelClass}>Nome completo *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Telefone / WhatsApp *</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(fmtTelefone(e.target.value))}
            placeholder="(61) 99999-9999"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>E-mail (opcional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className={inputClass}
          />
        </div>

        {/* LGPD */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="lgpd-auto"
            checked={lgpd}
            onChange={(e) => setLgpd(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#5CBECB] cursor-pointer flex-shrink-0"
          />
          <label htmlFor="lgpd-auto" className="text-xs text-[#333333]/50 leading-relaxed cursor-pointer">
            Concordo com o uso dos meus dados para contato comercial, conforme a{" "}
            <span className="text-[#5CBECB] underline">Política de Privacidade</span> e a LGPD.
          </label>
        </div>

        {erro && <p className="text-red-500 text-xs font-medium">{erro}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="w-full bg-[#E9854A] hover:bg-[#d9743b] disabled:opacity-60 text-white font-bold py-4 rounded-xl text-base transition-all shadow-sm hover:shadow-md"
        >
          {status === "loading"
            ? "Enviando..."
            : fluxo === "renovacao"
            ? "Comparar minha renovação"
            : "Quero cotar meu seguro novo"}
        </button>

        {status === "error" && (
          <p className="text-center text-xs text-[#333333]/40">
            Problema técnico?{" "}
            <a
              href="https://wa.me/5561999867005"
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
