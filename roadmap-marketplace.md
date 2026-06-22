# Gap analysis & roadmap — de site de captação a marketplace de seguros com autosserviço

Data: 2026-06-20 · Visão: cliente chega → cota → compara → contrata → gere a própria apólice, com mínima intervenção do corretor. **Nenhum arquivo foi alterado — apenas relatório e sugestões.**

> Tese central: para um **corretor solo**, o caminho realista NÃO é construir motor de cálculo, comparador e gateway de pagamento próprios — isso é território de seguradora/insurtech e é regulado. O ganho está em virar uma **camada de orquestração + portal de autosserviço da própria carteira**: usar os cotadores das seguradoras (que você já linka), integrar onde houver API, e **automatizar o trabalho manual que hoje é seu** (qualificação, follow-up, emissão de documentos, renovação, sinistro). O "marketplace" amadurece por cima disso, não no lugar disso.

---

## 1. O que o site faz hoje vs. o ciclo completo

| Etapa do ciclo ideal | Hoje | Quem faz o trabalho | Lacuna |
|---|---|---|---|
| **Chega** (tráfego) | Site SSG + GA4, Google orgânico | Automático | Falta SEO de conteúdo/escala (ver auditorias anteriores) |
| **Cota** | Form de lead → corretor cota manualmente nas seguradoras; em viagem/residencial, links de cotador da própria seguradora (`CalculeVoceMesmo`) | **Manual** (auto/vida/empresarial) | Sem multicálculo próprio; cotação real é trabalho do corretor |
| **Compara** | Visitante compara abrindo cada link de seguradora separadamente | **Cliente faz na unha** / corretor explica | Sem comparador lado a lado |
| **Contrata** | 100% fora do site: WhatsApp/seguradora | **Manual** | Sem contratação/assinatura no site |
| **Paga** | Na seguradora | Seguradora | (correto — corretor não deve tocar no dinheiro; ver §4) |
| **Gere a apólice** (2ª via, sinistro, renovação) | Não existe no site; vai por WhatsApp pro corretor | **Totalmente manual** | Sem área do cliente / portal |
| **Bastidor** | Lead → Supabase → trigger → card no CRM + e-mail (Resend) | Automático até o card; depois manual | Boa base; falta automação pós-lead (nutrição, renovação, follow-up) |

**Resumo:** o site automatiza bem **captura → registro do lead → notificação**. Do "cotar" em diante, é quase tudo manual. O maior consumo de tempo do corretor solo está em (a) cotar e responder lead, (b) renovação, (c) emissão de 2ª via / suporte a sinistro — e nada disso está automatizado.

---

## 2. Blocos que faltam (e quão realista é cada um para um solo)

#### 2.1 — Multicálculo / cotação online — **alto custo, baixa viabilidade própria**
Construir rating engine por ramo é inviável para um solo (cada seguradora tem critérios próprios, e você não é o subscritor). **Caminho viável:** (a) usar os **cotadores das seguradoras** (já feito em viagem/residencial); (b) usar **plataformas de multicálculo de mercado** (TEx/MultiCalculo, Segfy, Quiver, Mapfre/Porto cotador-parceiro, agregadores) que corretores assinam; (c) integrar via **API/Open Insurance** quando as fases avançarem. Não reinvente o motor.

#### 2.2 — Comparador lado a lado — **médio**
Faz sentido como **camada de apresentação** sobre cotações que você já obtém (do multicálculo ou manualmente). Começar simples: uma página que mostra 2–3 opções formatadas que o corretor preenche, em vez de mandar print no WhatsApp. Evoluir para automático conforme a fonte de dados amadurece.

#### 2.3 — Contratação / assinatura digital — **médio**
A proposta/assinatura geralmente acontece **no fluxo da seguradora**. O que cabe ao site: **assinatura de proposta/autorização** via e-signature válida no Brasil (MP 2200-2/ICP-Brasil ou Lei 14.063 para assinatura eletrônica simples/avançada). DocuSign/Clicksign/D4Sign resolvem. Não construa assinatura própria.

#### 2.4 — Pagamento — **não construir** (ver §4)
Corretor **não deve receber/custodiar prêmio**. O pagamento ocorre na seguradora. Integrar gateway próprio para prêmio cria risco regulatório e operacional sem upside. Pagamento no site só faria sentido para serviços acessórios, não para o prêmio.

#### 2.5 — Área do cliente / portal de autosserviço — **alto impacto, viável por etapas**
É o bloco de **maior retorno realista** porque ataca o trabalho manual recorrente (2ª via, status, renovação, sinistro). Pode começar minúsculo (login + "minhas apólices" alimentado pelo CRM) e crescer. Supabase já dá Auth + RLS + Storage — a fundação existe.

#### 2.6 — Integração com seguradoras — **dependente de terceiros**
Hoje: links de cotador. Médio prazo: APIs de parceiros/multicálculo. Longo prazo: **Open Insurance** — mas atenção ao timing: o Opin **perdeu ritmo em 2025**; especialistas apontam **2026 como ano de virada** e impactos práticos só a partir de **2027**. Ou seja: planeje para Opin, mas **não dependa dele no curto prazo**.

---

## 3. O que dá para automatizar JÁ com o que existe (Supabase + CRM + leads) — quick wins

Estes reduzem trabalho manual com baixo esforço, sem nenhum bloco novo de marketplace:

1. **Renovação automatizada** — você já guarda apólice (PDF) e dados no lead/CRM. Job agendado que, X dias antes do vencimento, cria tarefa no CRM + dispara e-mail/WhatsApp template "sua apólice vence em 30 dias, quer que eu compare?". **Maior economia de tempo recorrente do corretor solo.**
2. **Follow-up de lead automático** — sequência de e-mails (Resend, que já está integrado) D+0/D+2/D+5 para lead que não respondeu. Hoje o follow-up é manual e leads esfriam.
3. **Confirmação + qualificação automática** — o lead de auto já manda `detalhes` (CPF, veículo, etc.) e a apólice. Dá para gerar um **resumo pronto** do lead no CRM (e até pré-preencher o multicálculo), poupando re-digitação.
4. **Status do lead por link** — em vez de o cliente ligar "e a minha cotação?", um link com status (recebido → cotando → proposta pronta) alimentado pelo CRM. Reduz mensagens de WhatsApp.
5. **Roteamento por produto** — auto/residencial/viagem já caem com `tipo_seguro`; usar isso para automações distintas (ex.: viagem é urgente → resposta imediata).
6. **Biblioteca de respostas/templates** — FAQ e respostas padrão (cobertura, franquia, documentos) viram e-mail/WhatsApp template disparável do CRM.
7. **Medição do funil** (da auditoria de conversão) — pré-requisito para saber onde automatizar primeiro.

> Todos os 7 usam **só** Supabase (tabelas, trigger, Storage, cron/Edge Functions), Resend e o CRM existente. Zero dependência de seguradora.

---

## 4. Riscos regulatórios e operacionais que afetam a arquitetura

> Baseado no marco SUSEP atual; o setor está em **consolidação regulatória** (Consulta Pública SUSEP nº 5/2025 unifica 13 resoluções de corretagem) — vale acompanhar, mas os princípios abaixo são estáveis.

1. **Só corretor/representante registrado intermedia, e só seguradora autorizada subscreve.** O site pode cotar/apresentar/intermediar sob o registro SUSEP do Fabio (nº 202018692), mas **não pode "vender" seguro como se fosse seguradora**. A arquitetura deve deixar claro que o site é canal de corretagem, não emissor.
2. **Não custodiar prêmio.** O corretor não recebe/segura o dinheiro do prêmio — isso vai para a seguradora. **Não construir gateway de pagamento de prêmio próprio.** Isso simplifica muito a arquitetura (sem PCI, sem fluxo financeiro regulado).
3. **Comissionamento e transparência (Resolução CNSP 400 / Circular SUSEP 601).** Regras de distribuição e divulgação de informação de produto: o comparador/cotação precisa apresentar informação fiel do produto e respeitar regras de comissionamento. Afeta como você exibe preços/coberturas.
4. **LGPD — dados pessoais e sensíveis.** Você já coleta CPF e **apólices em PDF** (dados sensíveis). Arquitetura precisa de: bucket **privado** (já apontado), RLS estrita, retenção/expurgo, base legal e **Política de Privacidade real** (hoje o link é morto). Um portal do cliente eleva o nível de exigência (autenticação forte, controle de acesso por titular).
5. **Assinatura eletrônica válida.** Se for assinar proposta/autorização no site, usar e-signature reconhecida (ICP-Brasil ou Lei 14.063). Não inventar assinatura própria.
6. **Open Insurance como oportunidade, não dependência.** Consentimento/compartilhamento de dados via Opin pode no futuro alimentar cotação/comparação — mas cronograma incerto (virada em 2026, prática a partir de 2027). Arquitetar de forma que o Opin **entre como mais uma fonte** quando estiver maduro, sem travar o roadmap nele.
7. **Operacional do solo: ponto único de falha.** Quanto mais o site automatiza, mais o cliente espera resposta. Garantir que automações tenham fallback humano claro (WhatsApp) e que nada dependa de o corretor estar online 24/7. Definir SLA realista e comunicá-lo (você já promete "2h úteis").

---

## 5. Roadmap em fases (impacto no negócio × esforço, realista para solo)

### Fase 0 — Fundação (semanas) · pré-requisito de tudo
Fechar as pendências já mapeadas que sustentam qualquer evolução: medição de funil no GA4, bucket de apólices privado + RLS, Política de Privacidade real, versionar o SQL, corrigir o caminho de perda de lead no upload. **Sem isso, automatizar em cima é construir sobre base trincada.**

### Fase 1 — Curto prazo: automatizar o trabalho manual atual (1–3 meses) · **maior ROI**
Foco: tirar tarefa repetitiva das costas do corretor com o stack atual.
- Renovação automatizada (alerta + tarefa + template).
- Sequência de follow-up de lead (Resend).
- Resumo/qualificação automática do lead no CRM + status por link.
- FAQ no site + biblioteca de templates de resposta.
- Seguro-viagem com captura de lead de fallback (hoje não capta).
**Impacto:** alto (tempo do corretor) · **Esforço:** baixo-médio · usa só o que já existe.

### Fase 2 — Médio prazo: cotação assistida e contratação digital (3–9 meses)
Foco: encurtar o "cotar → contratar" sem virar seguradora.
- Adotar uma **plataforma de multicálculo** de mercado e integrá-la ao fluxo (pré-preencher com os `detalhes` do lead).
- **Comparador de apresentação**: página que mostra 2–3 opções formatadas (corretor publica; cliente vê lado a lado em vez de print no WhatsApp).
- **Assinatura digital** de proposta/autorização (Clicksign/DocuSign/D4Sign).
- Páginas Sobre/Contato/FAQ e SEO de conteúdo (das auditorias anteriores) rodando para alimentar o topo do funil.
**Impacto:** alto · **Esforço:** médio · alguma dependência de fornecedores.

### Fase 3 — Médio-longo: portal de autosserviço da carteira (6–18 meses)
Foco: o bloco de maior valor recorrente.
- **Área do cliente** (Supabase Auth + RLS): login, "minhas apólices", 2ª via (Storage), status de sinistro, botão de renovação.
- Notificações proativas (vencimento, documentos pendentes).
- Self-service para os pedidos que hoje viram WhatsApp manual.
**Impacto:** alto (retém cliente + corta suporte manual) · **Esforço:** médio-alto · construído por etapas, começando por "minhas apólices" read-only.

### Fase 4 — Longo prazo: marketplace orquestrado e Open Insurance (18+ meses)
Foco: a visão completa, quando volume e fontes de dados justificarem.
- Cotação/comparação cada vez mais automática conforme APIs de seguradoras/Opin amadurecem (lembrar: prática a partir de ~2027).
- Expansão de ramos (vida, empresarial, saúde, consórcio — alinhado à "Visão" do próprio site).
- Eventual figura de **representante de seguros**/parcerias para escalar distribuição.
**Impacto:** transformacional · **Esforço:** alto · **dependente de terceiros e regulação** — não antecipar.

---

## Princípios para não errar a mão

- **Compre, não construa**, motor de cálculo, assinatura e pagamento — são caros, regulados e não são seu diferencial.
- **Seu diferencial é o atendimento humano + a relação** — automatize o trabalho chato, preserve o toque humano onde ele converte (WhatsApp, sinistro).
- **Cada fase tem que se pagar em tempo economizado ou lead a mais** antes de avançar — disciplina que o próprio checklist do MVP já adota ("não expandir antes de medir").
- **Privacidade e registro SUSEP são a fundação**, não um detalhe a resolver depois — quanto mais autosserviço, mais isso pesa.

---

## Fontes (regulação)

- [SUSEP — consulta pública sobre atuação de corretores (nº 5/2025)](https://www.gov.br/susep/pt-br/central-de-conteudos/noticias/2025/setembro/susep-abre-consulta-publica-sobre-atuacao-de-corretores-de-seguros-e-autorreguladoras)
- [Madrona — Consulta Pública da SUSEP: modernização das regras de corretores](https://madronaadvogados.com.br/publicacoes/conhecimento-em-foco/consulta-publica-da-susep-modernizacao-e-consolidacao-na-regulamentacao-de-corretores-de-seguros/)
- [SUSEP — Open Insurance (página oficial)](https://www.gov.br/susep/pt-br/assuntos/open-insurance)
- [Fenacor — 2026 será decisivo para destravar o Opin](https://www.fenacor.org.br/noticias/estudo-2026-sera-decisivo-para-destravar-opin)
- [Camara-e.net — 2026 como ano da aplicação prática do Open Insurance](https://camara-e.net/especialistas-veem-2026-como-o-ano-da-aplicacao-pratica-do-open-insurance-no-brasil/)
