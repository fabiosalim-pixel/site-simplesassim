# Auditoria técnica — Site Simples Assim

Data: 2026-06-20 · Escopo: bugs, conflitos e erros que possam quebrar o site ou prejudicar a experiência. **Nenhum arquivo foi alterado — apenas relatório.**

## Verificações automáticas

- `npx tsc --noEmit` → **passa limpo** (0 erros de TypeScript).
- `npx eslint .` → **passa limpo** (0 warnings/erros).
- `npx next build` → não foi possível concluir **neste ambiente** (sandbox bloqueia o download do binário `@next/swc-linux-x64-gnu` — `EAI_AGAIN registry.npmjs.org`). Não é um bug do projeto; rode `npm run build` localmente para o gate final.
- Rota raiz: **existe** `app/page.tsx` → a home NÃO dá 404. ✅

---

## Resumo por severidade

**Críticos (podem perder lead ou vazar dados):**
1. Upload de apólice que falha derruba o lead inteiro (renovação auto).
2. Forms gravam colunas que podem não existir em `leads` → INSERT falha em silêncio.
3. Verificar RLS de SELECT em `leads` e visibilidade do bucket `apolices-leads` (risco de exposição de PII).
4. SQL de migração não está versionado no repositório (apesar do checklist afirmar que está).

**Médios (UX, conversão, SEO, confiança):**
5. Número de WhatsApp placeholder (`5561999999999`) no fallback de erro do form simples.
6. Terceiro número de WhatsApp divergente na Edge Function.
7. Home renderiza em Arial, não Nunito (CSS de fonte quebrado).
8. Bloco `prefers-color-scheme: dark` herdado do boilerplate → risco de texto invisível.
9. Logo distorcida / aspect-ratio incorreto no `next/image` (CLS + distorção no rodapé).
10. SEO técnico: sem `sitemap`, `robots`, `canonical`, `metadataBase`, Open Graph nem dados estruturados.
11. "Política de Privacidade" referenciada no consentimento LGPD não existe (lacuna de compliance).

**Baixos:** validação fraca de telefone/e-mail, menu mobile não fecha ao clicar, UTMs gravadas como `""`, dois rodapés divergentes, ano do rodapé fixado em build, header não fixo.

---

## 1. Captação de lead (ponta a ponta)

### 1.1 — Falha no upload da apólice descarta o lead inteiro — CRÍTICO
**Arquivo:** `components/FormularioAutoQualificado.tsx` (linhas 222–233)
**O que acontece:** no fluxo de renovação, o upload pro bucket `apolices-leads` acontece **antes** do INSERT em `leads`. Se o upload falhar (bucket inexistente, política de storage negando `anon`, timeout, PDF grande), o `throw uploadError` cai no `catch` e o lead **nunca é inserido**. O cliente que tem mais intenção (já mandou apólice) é exatamente o que se perde, e sem deixar rastro no banco.
**Correção sugerida:** inserir o lead primeiro (com os dados de contato + `detalhes`) e tratar o upload como passo secundário/opcional — se o upload falhar, gravar o lead mesmo assim com `apolice_path = null` e um flag tipo `upload_falhou`, e/ou tentar o upload depois. Nunca deixar o upload bloquear a persistência do contato.

### 1.2 — INSERT depende de colunas que podem não existir → falha silenciosa — CRÍTICO
**Arquivos:** `components/FormularioCotacao.tsx` (72–80), `components/FormularioAutoQualificado.tsx` (259–269)
**O que acontece:** os forms inserem `origem`, `utm_source`, `utm_medium`, `utm_campaign`, `canal` e (no de auto) `detalhes` (jsonb) e `apolice_path`. Se qualquer uma dessas colunas não existir na tabela `leads` de produção, o PostgREST devolve erro e o lead é perdido — o usuário só vê "Erro ao enviar. Tente pelo WhatsApp." O `getUtms()` ainda faz spread de `...utms` direto no objeto do INSERT, então a forma do payload depende 100% do schema real.
**Correção sugerida:** confirmar no Supabase que `leads` tem todas essas colunas com os tipos certos (`detalhes jsonb`, `apolice_path text`, `canal text`, `utm_* text`). Versionar esse schema (ver 1.4). Idealmente logar o `error.message`/`error.code` do Supabase (hoje é descartado) para um endpoint/console, para deixar de "falhar em silêncio".

### 1.3 — RLS de leitura e visibilidade do bucket — CRÍTICO (verificar)
**Onde:** Supabase (não visível no repo) + `lib/supabase.ts`
**O que acontece:** a `anon key` vai no bundle do cliente (é o esperado). A segurança depende inteiramente das policies RLS. Dois pontos a confirmar:
- A tabela `leads` **não pode** ter policy de `SELECT` para `anon`. Se tiver, qualquer pessoa com a anon key (pública) lê todos os leads — nome, telefone, e-mail, CPF dentro de `detalhes`. Vazamento de PII.
- O bucket `apolices-leads` **precisa ser privado**. As apólices contêm CPF e dados completos; se o bucket for público ou tiver policy de leitura para `anon`, os PDFs ficam acessíveis por URL.
**Correção sugerida:** garantir que `leads` só tenha a policy `insert_publico` (INSERT, anon, `consentimento_lgpd = true`) e nenhuma de SELECT/UPDATE/DELETE para anon; e que o bucket seja privado, com acesso só via service_role/signed URLs (o CRM lê pelo backend).

### 1.4 — Migração SQL ausente do repositório — CRÍTICO
**Arquivo:** `migrations/` (só contém `checklist-...md`)
**O que acontece:** o checklist afirma "SQL salvo em `migrations/001_create_leads.sql`", mas esse arquivo **não existe** no repo (não há nenhum `.sql`). O schema da tabela `leads`, a policy RLS e a trigger `trg_processar_lead_site`/`processar_lead_site()` não estão versionados. Se a base for recriada ou precisar ser auditada, não há fonte de verdade — e os itens 1.2/1.3 ficam impossíveis de validar pelo código.
**Correção sugerida:** exportar do Supabase e commitar os SQLs reais (tabela + policies + trigger + função + bucket). Sem isso, o "banco único site→CRM" não é reproduzível.

### 1.5 — Evento `gerar_lead` só dispara client-side após sucesso — MÉDIO
**Arquivos:** `FormularioCotacao.tsx` (88–91), `FormularioAutoQualificado.tsx` (273–277)
**O que acontece:** correto que só dispara após o INSERT dar certo (bom — não conta lead falho). Porém: (a) se o usuário tiver bloqueador que impeça o GA carregar, a conversão não é medida embora o lead exista; (b) o param `fluxo` (auto) e `canal` são custom params que precisam estar registrados no GA4 como dimensões personalizadas, senão não aparecem nos relatórios. Não quebra nada, mas pode subnotificar conversão.
**Correção sugerida:** registrar `tipo_seguro`, `canal` e `fluxo` como dimensões personalizadas no GA4 e marcar `gerar_lead` como conversão. Opcional: medir a conversão de forma redundante via trigger no servidor (Measurement Protocol) para não depender só do browser.

---

## 2. Tratamento de erro nos formulários

### 2.1 — Número de WhatsApp placeholder no fallback de erro — MÉDIO
**Arquivo:** `components/FormularioCotacao.tsx` (linha 212)
**O que acontece:** quando o envio falha, o link "Problema técnico? Chame no WhatsApp" aponta para `https://wa.me/5561999999999` — número falso/placeholder. Justamente no momento em que o lead já teve um erro, o caminho de recuperação leva a um número inexistente. Lead perdido em dobro.
**Correção sugerida:** trocar por `5561999867005` (número real usado em todo o resto do site).

### 2.2 — Validação fraca de telefone e e-mail — BAIXO
**Arquivos:** `FormularioCotacao.tsx` (64–66), `FormularioAutoQualificado.tsx` (207–209)
**O que acontece:** telefone só é checado por "não vazio" — aceita `(6` incompleto. E-mail não é validado em JS (não há `<form>`, então não há validação nativa do browser tampouco). Leads com telefone inválido entram no banco e podem não ser contatáveis; e-mail inválido faz o e-mail do lead falhar silenciosamente na Edge Function.
**Correção sugerida:** exigir 10–11 dígitos no telefone (`replace(/\D/g,'').length >= 10`) e validar e-mail com regex simples quando preenchido.

### 2.3 — Duplo envio: ok, com ressalva menor — BAIXO
**Arquivos:** ambos os forms
**O que acontece:** os botões ficam `disabled` enquanto `status === "loading"`, o que evita o clique duplo na prática. O botão do `FormularioCotacao` não tem `type="button"`, mas como não está dentro de `<form>`, não há submit implícito — inofensivo.
**Correção sugerida:** nenhuma ação obrigatória; opcionalmente adicionar `type="button"` por clareza.

---

## 3. Variáveis de ambiente / segredos no client

### 3.1 — Sem vazamento de segredo no bundle — OK ✅
`.env.local` contém apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ambos públicos por design). O `RESEND_API_KEY` está só na Edge Function via `Deno.env.get` (server-side). Nenhuma `service_role` key no front. **Nada a corrigir aqui** — só manter a disciplina e confirmar os itens 1.3 (RLS) que são a real fronteira de segurança.

### 3.2 — Terceiro número de WhatsApp divergente na Edge Function — MÉDIO
**Arquivo:** `supabase/functions/notify-lead/index.ts` (linha 72)
**O que acontece:** o e-mail enviado ao lead tem botão "Chamar no WhatsApp" apontando para `5561981174515` — número diferente do `5561999867005` usado no site inteiro. O cliente pode acabar num número errado/sem atendimento.
**Correção sugerida:** padronizar para `5561999867005` (ou confirmar qual é o número de atendimento correto e unificar em todos os pontos, incluindo 2.1).

---

## 4. Performance e Core Web Vitals

### 4.1 — Logo com aspect-ratio incorreto no `next/image` — MÉDIO
**Arquivos:** `components/SiteHeader.tsx` (68–75), `app/[produto]/page.tsx` (324)
**O que acontece:** `public/logo.png` é **1081×1081 (quadrada)**, mas é declarada como `width={150} height={42}` no header e `width={80} height={24}` no rodapé. No header a classe `h-9 w-auto` corrige a exibição, mas a proporção declarada (≈3.57:1 vs 1:1 real) gera warning do Next e pode causar reserva de espaço errada (CLS). No **rodapé** não há classe de tamanho sobrescrevendo → a logo quadrada é espremida em 80×24 e fica **distorcida**.
**Correção sugerida:** usar `width`/`height` proporcionais ao arquivo real (ex.: `64×64`) e controlar o tamanho final por CSS, ou recortar/exportar uma versão da logo já no aspect-ratio horizontal pretendido. No rodapé, adicionar classe de altura (`h-6 w-auto`).

### 4.2 — Logo de 93 KB / 1081px para uso pequeno — BAIXO
**Arquivo:** `public/logo.png`
**O que acontece:** PNG de 1081×1081 (~93 KB) servido para renderizar a ~36 px. O `next/image` redimensiona, mas vale ter um asset-fonte mais enxuto.
**Correção sugerida:** exportar a logo em resolução adequada (ex.: 2x do maior uso) e/ou WebP. Ganho marginal, mas fácil.

### 4.3 — GA via `@next/third-parties` — OK ✅
Carregamento adiado, padrão recomendado. Supabase-js no client é aceitável para o volume do form. Sem JS pesado desnecessário. LCP provável: logo (com `priority`) ou o `<h1>` do hero — ambos baratos.

---

## 5. Tipografia / CSS quebrado

### 5.1 — Home renderiza em Arial, não em Nunito — MÉDIO
**Arquivos:** `app/globals.css` (8–13, 22–26), `app/layout.tsx` (25–27), `app/page.tsx` (68)
**O que acontece:** o `@theme inline` referencia `--font-geist-sans`/`--font-geist-mono` (sobra do template create-next-app) que **não existem** — a fonte carregada é Nunito (`--font-nunito`). O `body` tem `font-family: Arial, Helvetica, sans-serif` fixo. A página de produto aplica `font-[family-name:var(--font-nunito)]` no `<main>`, mas a **home (`app/page.tsx`) não aplica** — então a home inteira sai em Arial, apesar de baixar os 7 pesos da Nunito. Tipografia inconsistente entre home e landing pages + download de fonte desperdiçado.
**Correção sugerida:** definir a Nunito como fonte base do `body` (ex.: aplicar `var(--font-nunito)` no `<body>` do layout) e remover as variáveis `--font-geist-*` mortas. Assim a home e as landings ficam coerentes e o webfont não é carregado à toa.

### 5.2 — Bloco `prefers-color-scheme: dark` herdado do boilerplate — MÉDIO
**Arquivo:** `app/globals.css` (15–20)
**O que acontece:** em dispositivos com modo escuro, `--background` vira `#0a0a0a` e `--foreground` vira `#ededed`, aplicados no `body`. As seções têm `bg-white`/cores explícitas, mas qualquer texto que **não** tenha cor explícita herda `#ededed` (quase branco) sobre fundo branco → risco de texto invisível em mobile no modo escuro. É um bloco de boilerplate sem relação com o design real (que é claro).
**Correção sugerida:** remover o bloco `@media (prefers-color-scheme: dark)` (e as vars `--background/--foreground` se não forem usadas pelo design), travando o site no tema claro pretendido.

---

## 6. SEO técnico

### 6.1 — Sem sitemap, robots, canonical nem metadataBase — MÉDIO
**Arquivos:** `app/` (faltam `sitemap.ts`/`robots.ts`), `app/layout.tsx`, `app/[produto]/page.tsx`
**O que acontece:** sendo o Google o canal nº 1, faltam itens básicos: não há `app/sitemap.ts` nem `app/robots.ts`, não há `metadataBase` (necessário para resolver canonical/OG absolutos) e nenhuma página define `alternates.canonical`. Sem canonical + com o domínio provisório `site-simplesassim.vercel.app` indexável, o Google pode indexar a URL da Vercel e depois competir com `simplesassim.com.br` (conteúdo duplicado / diluição).
**Correção sugerida:** adicionar `app/sitemap.ts` (home + 3 produtos), `app/robots.ts` apontando para o sitemap, `metadataBase: new URL('https://simplesassim.com.br')` no layout e `alternates: { canonical: '/<slug>' }` por página. Enquanto o domínio final não está no ar, bloquear indexação do preview da Vercel.

### 6.2 — Sem Open Graph / Twitter cards — MÉDIO
**Arquivos:** `app/layout.tsx`, `app/[produto]/page.tsx`
**O que acontece:** nenhuma tag `openGraph`/`twitter` nem imagem de compartilhamento. Como a estratégia empurra muito o WhatsApp, todo link compartilhado aparece **sem preview** (sem título/imagem), o que reduz cliques.
**Correção sugerida:** adicionar `openGraph` (title, description, url, image) no metadata do layout e por produto, com uma imagem 1200×630 em `public/`.

### 6.3 — Sem dados estruturados (Schema.org) — MÉDIO
**Arquivos:** `app/layout.tsx` / páginas
**O que acontece:** não há JSON-LD. Para um corretor local em Brasília captando via Google, `InsuranceAgency`/`LocalBusiness` (NAP, SUSEP, telefone, área atendida) ajuda em rich results e SEO local.
**Correção sugerida:** incluir um `<script type="application/ld+json">` com `InsuranceAgency` (nome, telefone, endereço/área, `sameAs`, identificador SUSEP) no layout, alinhado ao Perfil do Google Negócios.

### 6.4 — `generateMetadata` retorna `{}` para slug inexistente — BAIXO
**Arquivo:** `app/[produto]/page.tsx` (149)
**O que acontece:** para slug inválido o metadata fica vazio e a página chama `notFound()` (404 correto), mas sem title. Cosmético.
**Correção sugerida:** opcional — definir um title genérico de 404 via `app/not-found.tsx`.

---

## 7. Responsividade mobile / UX

### 7.1 — Menu mobile não fecha ao navegar — BAIXO
**Arquivo:** `components/SiteHeader.tsx` (101–129)
**O que acontece:** o menu hambúrguer usa `<details>` puro (sem JS). Ao clicar num link âncora (ex.: `/#sobre`), o `<details>` continua aberto, cobrindo o conteúdo até o usuário fechar manualmente. Idem dropdown "Compre Aqui".
**Correção sugerida:** fechar o `<details>` no clique do item (pequeno handler client, ou converter o header num client component com estado), ou ao menos `onClick` que remova o atributo `open`.

### 7.2 — Header não é fixo/sticky — BAIXO
**Arquivo:** `components/SiteHeader.tsx` (65)
**O que acontece:** `relative z-50` — o header rola para fora. Em páginas longas o usuário perde o acesso rápido ao menu/WhatsApp. Não é bug, é oportunidade de conversão.
**Correção sugerida:** considerar `sticky top-0` no header.

### 7.3 — Âncoras com offset coberto pelo header — BAIXO
**Arquivos:** `app/[produto]/page.tsx` (`SecaoFormulario` id `cotacao`, 258), `CalculeVoceMesmo.tsx` (30, tem `scroll-mt-20`)
**O que acontece:** `CalculeVoceMesmo` já tem `scroll-mt-20`, mas a `SecaoFormulario` (id `cotacao` do seguro-auto) não — se o header virar sticky, a âncora encosta no topo sem respiro. Hoje, com header não-fixo, é irrelevante.
**Correção sugerida:** padronizar `scroll-mt-20` nas seções alvo de âncora caso o header vire sticky.

---

## 8. LGPD / confiança / consistência

### 8.1 — "Política de Privacidade" não existe — MÉDIO
**Arquivos:** `FormularioCotacao.tsx` (190), `FormularioAutoQualificado.tsx` (572)
**O que acontece:** o consentimento LGPD cita "conforme a **Política de Privacidade**" como se fosse um link, mas é um `<span>` sem destino e **não há página de política** no site (`/privacidade` inexistente). Consentimento que referencia um documento inexistente é frágil do ponto de vista de LGPD, e o "link" não clicável frustra quem tenta ler.
**Correção sugerida:** criar uma página `/privacidade` com a política real e transformar o `<span>` em `<Link href="/privacidade">`. Bônus: linkar no rodapé.

### 8.2 — Dois rodapés divergentes — BAIXO
**Arquivos:** `app/page.tsx` (249–268) vs `app/[produto]/page.tsx` `Rodape` (293–331)
**O que acontece:** a home tem um rodapé próprio (sem logo, sem ano, layout diferente) e as landings têm outro (`Rodape`, com logo e `© {ano}`). Conteúdo legal parecido, mas estrutura e dados inconsistentes (a home, por ex., não tem link de privacidade nem logo).
**Correção sugerida:** extrair um único componente de rodapé compartilhado para garantir consistência de dados legais e links.

### 8.3 — Ano do rodapé fixado em build — BAIXO
**Arquivo:** `app/[produto]/page.tsx` (326)
**O que acontece:** `new Date().getFullYear()` roda em build (SSG). Se o site não for re-deployado, o "©" pode ficar defasado na virada de ano.
**Correção sugerida:** aceitável; se quiser garantir, renderizar o ano client-side ou revalidar periodicamente.

### 8.4 — UTMs gravadas como string vazia — BAIXO
**Arquivos:** `FormularioCotacao.tsx` (32–41), `FormularioAutoQualificado.tsx` (44–53)
**O que acontece:** quando não há UTM na URL, grava `""` em vez de `null` em `utm_source/medium/campaign`. Sujeira leve nos dados; relatórios precisam tratar `""` e `null`.
**Correção sugerida:** gravar `null` quando ausente (`p.get('utm_source') || null`).

---

## Itens que estão corretos (não exigem ação)

- Rota raiz `app/page.tsx` presente — sem 404 na home. ✅
- `generateStaticParams` + `notFound()` para slug inválido — roteamento dinâmico correto. ✅
- TypeScript e ESLint limpos. ✅
- `consentimento_lgpd: true` enviado pelos dois forms — compatível com a policy RLS de insert. ✅
- Sem segredos de servidor no bundle do client. ✅
- Botões desabilitados durante envio — proteção básica contra duplo clique. ✅
- GA carregado de forma diferida via `@next/third-parties`. ✅
