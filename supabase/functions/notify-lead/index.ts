import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const CORRETOR_EMAIL = Deno.env.get("CORRETOR_EMAIL") ?? "atendimento@simplesassim.com.br";

serve(async (req) => {
  try {
    const payload = await req.json();
    const lead = payload.record;

    if (!lead) {
      return new Response(JSON.stringify({ error: "Sem dados do lead" }), { status: 400 });
    }

    const { nome, telefone, email, tipo_seguro, origem } = lead;

    // E-mail para o CORRETOR
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Simples Assim <noreply@simplesassim.com.br>",
        to: [CORRETOR_EMAIL],
        subject: `🔔 Novo lead: ${nome} — ${tipo_seguro ?? "Seguro"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <div style="background: #535391; padding: 24px; border-radius: 12px 12px 0 0;">
              <h2 style="color: #5CBECB; margin: 0;">Novo lead recebido</h2>
            </div>
            <div style="background: #f7fafa; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e8f7f8;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Nome</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${nome}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Telefone</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${telefone ?? "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">E-mail</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${email ?? "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Produto</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${tipo_seguro ?? "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Origem</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${origem ?? "—"}</td></tr>
              </table>
              <a href="https://wa.me/55${(telefone ?? "").replace(/\D/g, "")}" 
                style="display: inline-block; margin-top: 16px; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Chamar no WhatsApp
              </a>
            </div>
            <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 16px;">Simples Assim · simplesassim.com.br</p>
          </div>
        `,
      }),
    });

    // E-mail para o LEAD (só se tiver e-mail)
    if (email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Simples Assim <noreply@simplesassim.com.br>",
          to: [email],
          subject: `${nome}, recebemos sua solicitação! 🎉`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <div style="background: #535391; padding: 24px; border-radius: 12px 12px 0 0;">
                <h2 style="color: #5CBECB; margin: 0;">Olá, ${nome}!</h2>
              </div>
              <div style="background: #f7fafa; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e8f7f8;">
                <p style="color: #333; line-height: 1.6;">Recebemos sua solicitação de cotação de <strong>${tipo_seguro ?? "seguro"}</strong> e um corretor especializado entrará em contato com você em até <strong>2 horas úteis</strong>.</p>
                <p style="color: #333; line-height: 1.6;">Se preferir falar agora, é só chamar no WhatsApp:</p>
                <a href="https://wa.me/5561981174515" 
                  style="display: inline-block; margin-top: 8px; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Chamar no WhatsApp
                </a>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
                <p style="color: #aaa; font-size: 12px;">Simples Assim · Soluções inteligentes em seguros<br>simplesassim.com.br</p>
              </div>
            </div>
          `,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
