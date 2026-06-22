# Auditoria de conversão — Site Simples Assim (máquina de captação de leads)

Data: 2026-06-20 · Foco: transformar visitante (vindo do Google) em lead. **Nenhum arquivo foi alterado — apenas relatório e sugestões.**

> Leitura rápida: o site está bem construído visualmente, mas hoje ele **mede pouco** (só vê o lead final, não o caminho), **pede demais** no formulário de auto, e **não responde as objeções** que o cliente tem antes de cotar. As três alavancas de maior retorno são: (A) instrumentar o funil no GA4, (B) reduzir o atrito do formulário de auto e elevar/medir o WhatsApp, (C) adicionar prova social + FAQ por produto. Detalhes e priorização abaixo.

---

## Placar priorizado (impacto × esforço)

| # | Ação | Impacto | Esforço | Prioridade |
|---|------|---------|---------|------------|
| 1 | Rastrear no GA4: cliques de WhatsApp, cliques "Comprar com seguradora", `form_start`, abandono | Alto | Baixo | **Fazer já** |
| 2 | Botão WhatsApp flutuante fixo (mobile) | Alto | Baixo | **Fazer já** |
| 3 | Reduzir atrito do form de auto (pedir contato primeiro; CPF/CEP opcionais ou no passo 2) | Alto | Médio | **Fazer já** |
| 4 | FAQ por produto (3–6 perguntas) respondendo objeções | Alto | Baixo | **Fazer já** |
| 5 | Prova social: depoimentos + nota/avaliações + logos reais das seguradoras | Alto | Médio | Alta |
| 6 | Home: CTA principal levar direto a um form/WhatsApp (não só rolar a página) | Médio | Baixo | Alta |
| 7 | Seguro-viagem: hoje não capta lead nenhum — adicionar fallback de lead + rastrear saída | Médio | Médio | Alta |
| 8 | Selos de confiança (SUSEP clicável, LGPD/cadeado, foto do corretor) | Médio | Baixo | Alta |
| 9 | Página `/privacidade` + tornar o consentimento um link real | Médio | Baixo | Média |
| 10 | SEO de conteúdo: blog + páginas de intenção de compra | Alto | Alto | Programa contínuo |

---

## 1. O caminho do visitante até virar lead

### Como está o funil hoje
Há **dois caminhos de conversão** muito diferentes, e o site não deixa claro qual é o principal:

- **Caminho formulário** (auto, residencial via "Fale com a equipe").
- **Caminho WhatsApp** (presente no header, hero, rodapé — provavelmente o que mais converte no Brasil).
- **Caminho compra direta** (viagem e residencial → `CalculeVoceMesmo` manda o visitante pro site da seguradora).

#### 1.1 — A home não capta; ela só "empurra" — MÉDIO impacto / baixo esforço
**Arquivo:** `app/page.tsx` (89–104)
O CTA primário da home ("Quero minha cotação") é um `href="#produtos"` que apenas **rola a página** até os cards. Para virar lead a partir da home, o visitante precisa: clicar no CTA → escolher um card de produto → carregar a landing → rolar até o form → preencher → enviar. São **muitos passos e cliques** antes de qualquer captura. Cada etapa é um ponto de fuga.
**Como melhorar:** o CTA primário da home deveria (a) abrir o WhatsApp já com mensagem, ou (b) levar a uma página/seção com formulário curto imediatamente visível. Empurrar para uma lista de produtos é o caminho mais longo possível.

#### 1.2 — Formulário de auto: atrito alto demais para a promessa "em minutos" — ALTO impacto / médio esforço
**Arquivo:** `components/FormularioAutoQualificado.tsx`
O fluxo "seguro novo" pede, antes de converter: tipo de veículo, **chassi** ou placa+modelo+ano, **CPF**, estado civil, **CEP**, tipo de uso, garagem, condutor 18–25, e só então nome/telefone/e-mail/LGPD — ~10 a 12 campos. O fluxo "renovação" exige **upload obrigatório de PDF da apólice**. Isso é um **formulário de proposta**, não de captação. Dois problemas de conversão:
- **CPF cedo no fluxo** é um dos maiores gatilhos de abandono em formulário brasileiro (medo de golpe/privacidade) — e aqui ele aparece antes mesmo de pedir o nome.
- **Upload obrigatório de apólice** trava quem está no celular, na rua, sem o PDF à mão. Hoje, se a pessoa não tem o arquivo, ela simplesmente não converte (não há "envio depois").

Isso é uma decisão de estratégia: **leads qualificados (poucos e bons) vs. volume (muitos e rasos)**. Para uma "máquina de captação" alimentada por Google, normalmente vale capturar o contato primeiro e qualificar depois.
**Como melhorar (em ordem):**
1. **Pedir contato primeiro** (nome + WhatsApp + "novo ou renovação?") e **qualificar no passo seguinte** — assim, mesmo quem desiste do detalhamento já virou lead recuperável.
2. Tornar **CPF e CEP opcionais** (ou movê-los para depois do contato). Chassi idem.
3. No fluxo renovação, permitir **"enviar a apólice depois"** (lead entra sem o PDF; corretor pede no WhatsApp). O upload nunca deveria bloquear a captura — ver também item 1.1 da auditoria técnica (falha de upload hoje descarta o lead inteiro).
4. Mostrar contador/progresso ("Passo 1 de 2") para reduzir a sensação de formulário interminável.

#### 1.3 — Formulário simples (residencial/genérico): bom, com ajustes finos — BAIXO esforço
**Arquivo:** `components/FormularioCotacao.tsx`
4 campos + LGPD em uma tela só — esse é o padrão certo. Ajustes:
- **Tipo de seguro** poderia vir **pré-selecionado** pelo produto da página (na página de residencial, já marcar "Seguro Residencial") — menos um campo a pensar.
- Falta **microcopy de confiança junto ao botão** (ex.: "Sem custo · resposta em até 2h úteis") — você já tem esses selos na coluna ao lado, mas repetir junto ao CTA aumenta cliques.

#### 1.4 — CTAs competindo sem hierarquia clara — MÉDIO / baixo
Em várias telas, o botão laranja (form) e o verde (WhatsApp) aparecem com peso parecido. Não é erro — no Brasil o WhatsApp costuma converter mais — mas convém **decidir o CTA primário por página** e dar destaque a ele, deixando o outro como secundário. Hoje a escolha fica para o visitante, o que dilui.

---

## 2. As 3 landing pages (auto, residencial, viagem)

### 2.1 — Proposta de valor: clara, mas genérica e sem diferenciação — MÉDIO
As três repetem "comparamos 40+ seguradoras / atendimento humano / sem burocracia". É bom, mas **igual ao de todo corretor**. Falta o diferencial específico do Salim (10+ anos, passagem por Bradesco/Icatu/MetLife/Zurich, ENS) — que hoje está **só na home, na seção "Sobre"**, e **não aparece nas landing pages**, que são justamente as páginas que recebem tráfego do Google.
**Como melhorar:** levar uma versão curta da credencial do corretor para cada landing ("Cotação conduzida por Fabio Salim, corretor há 10+ anos, registro SUSEP nº …").

### 2.2 — Prova social: ausente — ALTO / médio
Nenhuma das páginas tem depoimento, nota de avaliação, número de clientes atendidos, nem **logos reais** das seguradoras (há um `TODO` no código aguardando os arquivos das logos; hoje são só "chips" de texto). Prova social é um dos maiores multiplicadores de conversão e está zerada.
**Como melhorar:** 3–5 depoimentos reais (nome + cidade + foto/inicial), estrelas/Google reviews se houver, "X clientes atendidos / X anos", e as **logos reais** das seguradoras parceiras (substituem os chips de texto e dão credibilidade imediata).

### 2.3 — Urgência / motivo para agir agora: inexistente — MÉDIO / baixo
Não há nenhum gatilho de ação imediata. Para seguros há ganchos honestos: "Sua apólice vence? Compare antes de renovar e economize", "Cotação trava o preço de hoje", "Viaja em breve? Contrate até 1 dia antes". Sem inventar escassez falsa.
**Como melhorar:** uma linha de urgência contextual por produto, perto do CTA.

### 2.4 — As perguntas que o cliente faz antes de cotar (FAQ) — ALTO / baixo
Nenhuma página responde às objeções típicas. Isso derruba conversão (a dúvida não respondida vira abandono) **e** desperdiça SEO (FAQ rankeia e gera rich snippets). Perguntas que faltam:
- **Auto:** "Quanto custa?", "Precisa de vistoria?", "Cobre terceiros?", "Como funciona a franquia?", "Tem carro reserva?", "Uber/app é coberto?".
- **Residencial:** "O que está coberto (incêndio, roubo, danos elétricos)?", "Vale para apartamento e aluguel?", "Tem assistência 24h?".
- **Viagem:** "Preciso de seguro para a Europa (Schengen)?", "Cobre COVID?", "Cobre bagagem extraviada?", "Quanto custa por dia?", "Até quando posso contratar antes de viajar?".
**Como melhorar:** bloco de FAQ (accordion) com 4–6 perguntas por produto, em linguagem simples, com marcação `FAQPage` (JSON-LD) para rich results.

### 2.5 — Seguro-viagem não capta lead nenhum — MÉDIO / médio
**Arquivo:** `app/[produto]/page.tsx` (354–364) + `CalculeVoceMesmo.tsx`
A página de viagem renderiza **só** o `CalculeVoceMesmo` (links diretos para Porto/Tokio/SulAmérica/Allianz) e **não** o `ContatoEquipe`/formulário. Ou seja: quem não compra sozinho e vai embora **não vira lead** e **não é medido**. Você perde o contato e a informação. (Residencial tem o `CalculeVoceMesmo` **e** o `ContatoEquipe` — viagem deveria ter o mesmo fallback.)
**Como melhorar:** adicionar o bloco "Prefere que a gente cote pra você?" (FormularioCotacao) também em viagem, e rastrear os cliques de saída para a seguradora (item 3).

### 2.6 — Diferença de densidade entre as páginas
Auto tem barra de credibilidade + formulário pesado; residencial/viagem têm calculadora enxuta. Não é erro, mas a **experiência é inconsistente** entre produtos. Vale padronizar a estrutura: Hero → prova social → benefícios → (calculadora e/ou form) → FAQ → CTA WhatsApp.

---

## 3. Tracking GA4 — o funil hoje é praticamente cego

### 3.1 — Só o lead final é medido — ALTO / baixo
**Arquivos:** `FormularioCotacao.tsx` (88–91), `FormularioAutoQualificado.tsx` (273–277)
O único evento customizado é `gerar_lead`, disparado **após** o INSERT. Você enxerga "quantos converteram", mas **não onde os outros desistiram**. Não dá para responder "o visitante para no hero, no meio do form, ou no CPF?". O funil visita → interesse → lead **não é mensurável** hoje.

### 3.2 — Eventos que faltam (todos via `sendGAEvent`, baixo esforço)
- **`cta_click`** — cliques nos botões "Quero minha cotação" / "Calcule você mesmo" (mede interesse, topo do funil).
- **`whatsapp_click`** — **crítico.** O WhatsApp é provavelmente seu maior canal de conversão e hoje é **100% invisível** no GA4. Sem isso, você subestima a conversão real e não sabe qual página/posição gera contato.
- **`form_start`** — primeiro foco/interação no formulário (separa "viu o form" de "começou a preencher").
- **`form_step`** (auto) — escolha renovação/novo e avanço de etapa, para achar onde o form de auto sangra.
- **`file_upload`** (auto renovação) — sucesso/falha do upload (você suspeita que o upload trava gente — meça).
- **`select_seguradora`** + **`comprar_seguradora_click`** — cliques nas abas e no botão "Comprar com a seguradora" (`CalculeVoceMesmo`). Em viagem/residencial essas saídas são uma **conversão de negócio** e hoje são invisíveis (link externo, sem evento).
- **`scroll_depth`** / seções vistas — onde a atenção morre.

### 3.3 — Marcar conversões e registrar dimensões — baixo
Marcar `gerar_lead` (e `whatsapp_click`, `comprar_seguradora_click`) como **conversões** no GA4, e registrar `tipo_seguro`, `canal`, `fluxo` como **dimensões personalizadas** (senão os parâmetros não aparecem nos relatórios). Sem isso, dá para contar leads mas não cruzar por produto/canal.

### 3.4 — Confiabilidade da medição — médio
Como o `gerar_lead` é client-side, bloqueadores/erros de rede subnotificam. Considerar medição redundante no servidor (Measurement Protocol) disparada pela trigger do Supabase — assim o número de leads do GA bate com o do CRM.

> Resultado esperado: com 3.1–3.3 você passa de "sei quantos leads" para "**sei onde perco cada visitante**", que é o pré-requisito para otimizar qualquer outra coisa desta lista.

---

## 4. Captação orgânica via Google (canal primário)

### 4.1 — Conteúdo fino demais para ranquear em intenção de compra — ALTO / alto (programa)
Hoje existem **4 páginas** (home + 3 produtos), todas curtas e transacionais. O Google premia profundidade e cobertura de intenção. Faltam páginas para as buscas que realmente antecedem a compra de seguro:
- **Intenção comercial local:** "corretora de seguros em Brasília", "seguro auto Brasília/DF", "seguro residencial Brasília". O negócio é local (Brasília/DF) e o site quase não explora isso — SEO local é o caminho mais barato de ranqueamento.
- **Intenção de comparação/decisão:** "vale a pena seguro viagem para a Europa", "seguro auto para Uber compensa", "quanto custa seguro residencial de apartamento".
- **Cauda longa informacional que vira lead:** "o que cobre o seguro residencial", "seguro viagem cobre COVID", "como funciona a franquia do seguro auto", "documentos para contratar seguro auto".

### 4.2 — Estratégia de blog/conteúdo — ALTO / alto
Não há blog nem qualquer conteúdo (consistente com o checklist, que deixou conteúdo fora do MVP). Para o Google ser canal nº 1 de forma sustentável, um programa de conteúdo é o motor:
- **Formato pilar + cluster:** uma página-pilar por produto ("Guia do Seguro Auto") + artigos de cauda longa linkando para ela e para o formulário.
- **Cada artigo com CTA de captação** (form curto ou WhatsApp) — conteúdo que não converte é tráfego desperdiçado.
- **Cadência realista p/ corretor solo:** 1–2 artigos por mês, priorizando palavras de maior intenção comercial primeiro.
- **SEO local:** Perfil do Google Negócios consistente (NAP) apontando pro site, página com endereço/área de atuação e `LocalBusiness`/`InsuranceAgency` em JSON-LD (ver auditoria técnica 6.3).

### 4.3 — Fundamentos técnicos de SEO (pré-requisito) — MÉDIO / baixo
Repetindo da auditoria técnica porque afetam diretamente a captação orgânica: faltam **sitemap, robots, canonical, metadataBase e Open Graph**. Sem canonical e com o domínio `vercel.app` indexável, você corre o risco de competir consigo mesmo. Resolver isso é barato e destrava a indexação do conteúdo novo.

### 4.4 — FAQ como SEO — ALTO / baixo
O bloco de FAQ do item 2.4 é dois-em-um: responde objeção (conversão) **e** captura buscas de pergunta no Google com `FAQPage` schema. Melhor relação impacto/esforço da parte de SEO.

---

## 5. Confiança e credibilidade

### 5.1 — Dados do corretor: existem, mas escondidos — MÉDIO / baixo
SUSEP (nº 202018692), CNPJ e a trajetória do Fabio (10+ anos, ENS, Bradesco/Icatu/MetLife/Zurich) são ótimos sinais de confiança — mas estão **só na home** (Sobre) e no rodapé. As landing pages, que recebem o tráfego, mostram só o número SUSEP no rodapé.
**Como melhorar:** levar um selo curto de credencial do corretor para o topo/meio de cada landing; tornar o número SUSEP **verificável** (link para a consulta pública SUSEP) — isso aumenta confiança de forma desproporcional ao esforço.

### 5.2 — Sem depoimentos / avaliações — ALTO / médio
Já citado em 2.2. É a lacuna de confiança mais cara. Mesmo 3 depoimentos reais com nome e cidade movem a agulha. Se houver avaliações no Google, exibir a nota.

### 5.3 — Sem selos de segurança / parceria — MÉDIO / baixo
Não há logos reais das seguradoras (só texto), nem selo de "site seguro/LGPD", nem indicação visual de cadeado/dados protegidos perto do formulário. Em página que pede CPF, isso pesa.
**Como melhorar:** logos reais das seguradoras (já pendente no código), microsselo "🔒 Seus dados protegidos — LGPD" ao lado do botão de envio, e o badge SUSEP clicável.

### 5.4 — LGPD: consentimento aponta para política inexistente — MÉDIO / baixo
**Arquivos:** `FormularioCotacao.tsx` (190), `FormularioAutoQualificado.tsx` (572)
O texto "conforme a **Política de Privacidade**" aparece como link, mas é um `<span>` morto e **não há página `/privacidade`**. Além do risco de compliance (já citado na auditoria técnica 8.1), do ponto de vista de **confiança** isso enfraquece: o usuário atento percebe que o "link" não leva a lugar nenhum.
**Como melhorar:** criar `/privacidade` e transformar o texto em link real; linkar também no rodapé. Reforça confiança e fecha a lacuna LGPD.

### 5.5 — Falta rosto humano — BAIXO / baixo
A proposta é "atendimento humano", mas não há **foto do corretor** em lugar nenhum. Uma foto real do Fabio (na seção Sobre e/ou perto do form) materializa a promessa de "humano" e aumenta confiança.

---

## Sequência sugerida de execução

**Sprint 1 (rápido, alto retorno):** instrumentar GA4 (3.1–3.3) · botão WhatsApp flutuante · FAQ por produto (2.4/4.4) · microcopy de confiança + SUSEP clicável + selo LGPD · corrigir número de WhatsApp placeholder.

**Sprint 2 (conversão estrutural):** reduzir atrito do form de auto (contato primeiro, CPF/CEP opcionais, "apólice depois") · fallback de lead em viagem · CTA da home indo direto à captura · credencial do corretor nas landings.

**Sprint 3 (confiança + orgânico):** coletar e publicar depoimentos · logos reais das seguradoras · página `/privacidade` · fundamentos de SEO (sitemap/robots/canonical/OG/JSON-LD) · iniciar programa de conteúdo (pilar + cluster, SEO local).

> Observação de método: nada disso deveria ser decidido só no "achismo". O item 1 (GA4) vem primeiro de propósito — depois de 2–3 semanas medindo, os dados dizem qual gargalo atacar e quais hipóteses deste relatório se confirmam.
