import FormularioCotacao from "@/components/FormularioCotacao";

export default function ContatoEquipe() {
  return (
    <section className="bg-white py-20 px-6 border-t border-[#e8f7f8]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Texto de apoio */}
        <div>
          <p className="text-[#E9854A] font-bold text-xs uppercase tracking-widest mb-3">
            Prefere ajuda?
          </p>
          <h2 className="text-3xl font-black text-[#535391] leading-tight mb-4">
            Fale com a nossa equipe
          </h2>
          <p className="text-[#333333]/70 text-base leading-relaxed mb-6">
            Se preferir, deixe seus dados e um corretor especializado entra em
            contato em até 2 horas úteis para ajudar você a escolher a melhor
            cobertura.
          </p>
          <div className="space-y-3">
            {[
              "Sem compromisso",
              "Seus dados são protegidos (LGPD)",
              "Resposta em até 2 horas úteis",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[#333333]/60 text-sm"
              >
                <span className="text-[#5CBECB] font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Formulário simples (cai como lead no banco) */}
        <FormularioCotacao />
      </div>
    </section>
  );
}
