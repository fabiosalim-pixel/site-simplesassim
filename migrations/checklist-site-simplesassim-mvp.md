# Checklist — Site Simples Assim (MVP de captação)

**Objetivo da v1:** validar o template + o fluxo de lead + a medição, com UM produto, recebendo tráfego do Google.

**Critério de "pronto" (não expandir antes disso):** uma landing page gerada pelo template, recebendo tráfego do Google, com lead caindo no CRM com origem rastreada e e-mail automático disparando.

---

## Decisões travadas (não relitigar durante a execução)

- [ ] Banco único: o site escreve no Supabase, o CRM lê. Sem CRM/suíte de marketing externa.
- [ ] Template orientado a dados: produto = configuração, não página feita à mão.
- [ ] Páginas de marketing estáticas/SSG (indexáveis pelo Google). Só o formulário é React interativo.
- [ ] Deduplicação de cliente desde o dia 1 (`norm_doc` / `findOrCreateCliente`). Lead nunca cria cliente duplicado.
- [ ] Meta/Instagram/Facebook fora do MVP — Google é o canal nº 1.
- [ ] Automação do site roda server-side (Supabase + Vercel + Resend), NÃO pelos conectores MCP.

---

## Fase 0 — Preparação

- [ ] Escolher a abordagem de SSG (gerar estáticas a partir do template; formulário como trecho React).
- [ ] Criar pasta `migrations/` versionada no Git para os SQL deste projeto.
- [ ] Spike isolado: um `INSERT` simples no Supabase a partir de um form de teste, confirmando que grava. Só depois desenhar o template em cima.

## Fase 1 — Banco

- [ ] Criar tabela `leads` na **base de TESTE** (campos: nome, telefone, email, tipo_seguro, origem, canal, utm_source, utm_medium, utm_campaign, criado_em, consentimento_lgpd).
- [ ] Validar inserção e leitura na teste.
- [ ] Aplicar o mesmo SQL na **base de PRODUÇÃO**.

## Fase 2 — Template da landing page

- [ ] Construir UM template SSG orientado a config (slug, título, oferta, campos do form, UTM padrão).
- [ ] Garantir que o template gera HTML indexável (title, meta description, conteúdo no HTML).
- [ ] Rodapé com SUSEP / identificação da corretora em todas as páginas.
- [ ] Preparar a primeira página com o produto que você definir depois (placeholder por enquanto).

## Fase 3 — Captação

- [ ] Formulário curto (nome, telefone, tipo de seguro) gravando na tabela `leads`.
- [ ] Capturar os parâmetros UTM da URL e gravar junto (origem = "Site").
- [ ] Checkbox de consentimento LGPD obrigatório no envio.
- [ ] Botão de WhatsApp (`wa.me`) com mensagem pré-preenchida como CTA alternativo.

## Fase 4 — Integração com o CRM

- [ ] Confirmar que o lead inserido aparece sozinho em "Cotações e Leads" no pipeline.
- [ ] Garantir que a promoção do lead reutiliza `norm_doc` / `findOrCreateCliente` (sem duplicar cliente).
- [ ] Conferir que origem e canal chegam visíveis no card.

## Fase 5 — Automação

- [ ] Trigger no Supabase ao inserir lead → resposta automática ao lead via Resend.
- [ ] Mesmo trigger → notificação para você (e-mail).
- [ ] Testar ponta a ponta com um lead de teste real.

## Fase 6 — Medição (foco Google)

- [ ] Instalar GA4 + tag de conversão nas páginas.
- [ ] Marcar o envio do formulário como evento de conversão.
- [ ] Perfil do Google Negócios apontando para o site, com dados (NAP) consistentes.

## Fase 7 — Publicar e medir

- [ ] Publicar em www.simplesassim.com.br.
- [ ] Subir UMA campanha pequena (Google) apontando para a página, com UTMs.
- [ ] Medir conversão por 1–2 semanas antes de qualquer expansão.

---

## Guardrails de processo

- [ ] Uma frente por vez — não mexer no visual do CRM enquanto constrói o site.
- [ ] SQL sempre na teste antes da produção, sempre especificando a base.
- [ ] Não replicar para outros produtos antes do critério de "pronto" ser atingido e medido.

## Explicitamente fora do MVP

API oficial do WhatsApp · integração real com Instagram/Facebook · sequências de nutrição · blog/conteúdo · portal de autosserviço (v4 do CRM) · todas as páginas de produto de uma vez.
