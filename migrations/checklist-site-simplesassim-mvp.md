# Checklist — Site Simples Assim (MVP de captação)

**Objetivo da v1:** validar o template + o fluxo de lead + a medição, com UM produto, recebendo tráfego do Google.

**Critério de "pronto" (não expandir antes disso):** uma landing page gerada pelo template, recebendo tráfego do Google, com lead caindo no CRM com origem rastreada e e-mail automático disparando.

---

## Decisões travadas (não relitigar durante a execução)

- [x] Banco único: o site escreve no Supabase, o CRM lê. Sem CRM/suíte de marketing externa.
- [x] Template orientado a dados: produto = configuração, não página feita à mão.
- [x] Páginas de marketing estáticas/SSG (indexáveis pelo Google). Só o formulário é React interativo.
- [x] Deduplicação de cliente desde o dia 1 (`norm_doc` / `findOrCreateCliente`). Lead nunca cria cliente duplicado.
- [x] Meta/Instagram/Facebook fora do MVP — Google é o canal nº 1.
- [x] Automação do site roda server-side (Supabase + Vercel + Resend), NÃO pelos conectores MCP.

---

## Fase 0 — Preparação ✅

- [x] Escolher a abordagem de SSG — Next.js 16 (App Router) na Vercel.
- [x] Criar pasta `migrations/` versionada no Git.
- [x] Spike isolado: INSERT no Supabase confirmado antes de construir o template.
- [x] Repositório `site-simplesassim` criado no GitHub (fabiosalim-pixel).

## Fase 1 — Banco ✅

- [x] Tabela `leads` criada na base de TESTE.
- [x] Validação de inserção e leitura na teste.
- [x] Tabela `leads` aplicada na base de PRODUÇÃO.
- [x] Policy RLS `insert_publico` — só anon, só com consentimento_lgpd = true.
- [x] SQL salvo em `migrations/001_create_leads.sql`.

## Fase 2 — Template da landing page ✅

- [x] Template SSG orientado a config em `app/[produto]/page.tsx`.
- [x] HTML indexável (title, meta description por produto).
- [x] Identidade visual: turquesa #5CBECB, roxo #535391, laranja #E9854A, Nunito Sans.
- [x] Logo com fundo transparente em `public/logo.png`.
- [x] Rodapé com SUSEP e identificação da corretora.
- [x] 3 produtos configurados: seguro-auto, seguro-residencial, seguro-viagem.

## Fase 3 — Captação ✅

- [x] Formulário em `components/FormularioCotacao.tsx` gravando na tabela `leads`.
- [x] Captura de UTMs da URL gravando junto com o lead.
- [x] Checkbox LGPD obrigatório — validado no banco (policy RLS) e no frontend.
- [x] Botão WhatsApp em 3 posições: hero (topo), rodapé (embaixo).
- [x] Número de WhatsApp real configurado.

## Fase 4 — Integração com o CRM ✅

- [x] Lead inserido aparece na tabela `leads` do Supabase de produção.
- [x] Origem e canal chegam junto com o lead.
- [x] Captação testada ponta a ponta: lead de teste confirmado no banco.

## Fase 5 — Automação ⏳

- [ ] Trigger no Supabase ao inserir lead → e-mail automático ao lead via Resend.
- [ ] Mesmo trigger → notificação para o corretor.
- [ ] Testar ponta a ponta com lead real.

## Fase 6 — Medição (foco Google) ⏳

- [ ] Instalar GA4 + tag de conversão nas páginas.
- [ ] Marcar o envio do formulário como evento de conversão.
- [ ] Perfil do Google Negócios apontando para o site, com dados (NAP) consistentes.

## Fase 7 — Publicar e medir ⏳

- [x] Publicar em site-simplesassim.vercel.app (URL provisória).
- [ ] Apontar domínio www.simplesassim.com.br para a Vercel.
- [ ] Subir UMA campanha pequena (Google) com UTMs.
- [ ] Medir conversão por 1–2 semanas antes de qualquer expansão.

---

## Guardrails de processo

- [x] Uma frente por vez — CRM e site em sessões separadas.
- [x] SQL sempre na teste antes da produção.
- [ ] Não replicar para outros produtos antes do critério de "pronto" ser atingido e medido.

## Explicitamente fora do MVP

API oficial do WhatsApp · integração real com Instagram/Facebook · sequências de nutrição · blog/conteúdo · portal de autosserviço (v4 do CRM) · todas as páginas de produto de uma vez.

---

## Próximas sessões

1. **Fase 5** — E-mail automático ao lead (Resend + Supabase Edge Function)
2. **Fase 6** — GA4 + tag de conversão
3. **Fase 7** — Apontar domínio simplesassim.com.br + primeira campanha Google