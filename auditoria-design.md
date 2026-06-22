# Auditoria de design, atratividade visual e arquitetura de informação — Simples Assim

Data: 2026-06-20 · Foco: identidade visual, hierarquia, copy, navegação e acessibilidade. **Nenhum arquivo foi alterado — apenas relatório e sugestões.**

> Leitura rápida: a base visual é boa — paleta coesa e distintiva, layout limpo, tom de marca simpático. O que mais derruba a percepção de profissionalismo é **execução inconsistente** (home em Arial, logo distorcida no rodapé, números que se contradizem) e um **problema sério de contraste** em quase todos os elementos coloridos (botões laranja/verde, barra de estatísticas, textos com opacidade). Na arquitetura, faltam páginas que dão confiança e SEO (Sobre, Contato, FAQ, Privacidade) e o menu promete 5 produtos mas só 3 existem. Tudo priorizado no fim.

---

## Placar priorizado (impacto × esforço)

| # | Ação | Impacto | Esforço | Prioridade |
|---|------|---------|---------|------------|
| 1 | Corrigir contraste dos botões (laranja/verde) e da barra de estatísticas | Alto | Baixo | **Fazer já** |
| 2 | Padronizar fonte Nunito no site todo (home está em Arial) | Alto | Baixo | **Fazer já** |
| 3 | Corrigir logo distorcida no rodapé | Médio | Baixo | **Fazer já** |
| 4 | Reconciliar dados contraditórios ("10 anos" vs "desde 2004"; "42+" vs "40") | Médio | Baixo | **Fazer já** |
| 5 | Subir contraste dos textos com opacidade (`/50`, `/40`) | Médio | Baixo | Alta |
| 6 | Associar `<label>` aos inputs (`htmlFor`/`id`) | Médio | Baixo | Alta |
| 7 | Criar páginas Sobre, Contato, FAQ, Privacidade | Alto | Médio | Alta |
| 8 | Coerência do menu (5 produtos no menu, só 3 com página) | Médio | Baixo | Alta |
| 9 | Headlines orientadas ao cliente (benefício), não à empresa | Médio | Baixo | Média |
| 10 | Rever ícones emoji vs. ícones próprios (percepção premium) | Médio | Médio | Média |
| 11 | Estados de foco visíveis (teclado) em links/botões | Médio | Baixo | Média |

---

## 1. Identidade visual e consistência de marca

### Pontos fortes
- **Paleta coesa e distintiva.** Roxo `#535391`, turquesa `#5CBECB`, laranja `#E9854A` formam um sistema reconhecível, moderno e mais memorável que o azul-genérico padrão de seguradora. Transmite "acessível + confiável", que casa com o posicionamento "Simples Assim".
- **Layout limpo e respirado.** Containers centrados (`max-w-6xl/5xl`), espaçamentos generosos, cantos arredondados consistentes (`rounded-2xl`), sombras suaves. Visualmente profissional.
- **Nunito** é uma escolha de tipo acertada: arredondada e amigável, reforça o tom da marca.

### Pontos fracos
#### 1.1 — A home renderiza em Arial, não em Nunito — ALTO / baixo
**Arquivos:** `app/globals.css` (22–26), `app/page.tsx`
O `body` tem `font-family: Arial` fixo e a home não aplica a variável da Nunito (só as páginas de produto aplicam). Resultado: **a home — a vitrine — usa outra fonte que as landing pages.** Para o olho do visitante é uma inconsistência sutil porém real de "acabamento". (Também já citado nas auditorias técnica 5.1 e de conversão.)
**Correção:** aplicar `var(--font-nunito)` no `body` do layout, padronizando o site inteiro e removendo o `Arial`.

#### 1.2 — Logo distorcida no rodapé — MÉDIO / baixo
**Arquivos:** `app/[produto]/page.tsx` (324), `public/logo.png` (1081×1081, quadrada)
No rodapé a logo é declarada `width={80} height={24}` sem classe que corrija a proporção → a marca quadrada é **espremida** num retângulo. Logo distorcida é um dos sinais que mais corroem a percepção de profissionalismo num site que vende confiança.
**Correção:** usar dimensões proporcionais ao arquivo (ou exportar uma versão horizontal da logo) e controlar tamanho via CSS (`h-6 w-auto`).

#### 1.3 — Peso tipográfico sem hierarquia — BAIXO / baixo
Quase todos os títulos usam `font-black` (900). Quando tudo é "extra-bold", nada se destaca de fato e o texto fica "gritado". Falta uma escala (ex.: `font-extrabold` para H1, `font-bold` para H2, `font-semibold` para apoios).
**Correção:** definir uma escala tipográfica com 3–4 pesos por nível.

#### 1.4 — Ícones emoji como linguagem visual principal — MÉDIO / médio
🚗🏠✈️ como ícones de produto e ✓ como bullets são simpáticos, mas emojis (a) renderizam diferente em cada SO, (b) podem passar "informal demais" para quem avalia se vai confiar dinheiro/sinistro a esse corretor. É um trade-off de marca.
**Correção:** considerar um set de ícones próprios (mesma família, traço consistente) mantendo a leveza, ou manter emoji mas compensar com sinais de confiança mais fortes (selos, SUSEP, depoimentos).

---

## 2. Hierarquia visual e clareza (o teste dos 5 segundos)

### Pontos fortes
- **A home passa no teste dos 5s:** "Corretora de seguros" + "Cotamos com as melhores seguradoras" + dois CTAs deixam claro o que é e o que fazer. Bom.
- As landing pages têm hero forte com nome do produto + ícone + benefícios em card lateral — leitura imediata.
- A barra de estatísticas (42+/10 anos/100%/0) é um recurso de credibilidade rápido e bem posicionado logo após o hero.

### Pontos fracos
#### 2.1 — Barra de estatísticas com contraste insuficiente — MÉDIO / baixo
**Arquivo:** `app/page.tsx` (126–135), `CredibilidadeBar` em `app/[produto]/page.tsx` (235–246)
Texto branco sobre o turquesa `#5CBECB` tem contraste **2,17:1**, e os sublabels em `branco/80%` caem para **~1,87:1** — bem abaixo do mínimo WCAG AA (4,5:1 para texto normal; 3:1 para grande). Na prática: os números "credibilizadores" ficam difíceis de ler, justo onde você quer impacto.
**Correção:** usar o roxo `#535391` como cor do texto sobre o fundo turquesa (contraste sobe para ~3,2:1+), ou escurecer o fundo. Para os números grandes, texto roxo escuro lê muito melhor.

#### 2.2 — Excesso de texto em baixa opacidade enfraquece a hierarquia — MÉDIO / baixo
Boa parte do corpo usa `text-[#333]/60` e `/50`. Esteticamente fica "clean", mas reduz contraste (ver seção 5) **e** achata a hierarquia: título forte → corpo apagado, sem nível intermediário. O olho cansa e a leitura perde firmeza.
**Correção:** corpo principal em `#333` cheio (ou `/80`), reservando opacidades baixas só para legendas/fine print.

#### 2.3 — CTAs sem hierarquia clara entre si — MÉDIO / baixo
Laranja (form) e verde (WhatsApp) competem com peso parecido em várias telas. Já tratado na auditoria de conversão (1.4); do ponto de vista visual, convém um CTA primário dominante e um secundário "fantasma"/outline.

---

## 3. Copy e proposta de valor

### Pontos fortes
- **Tom humano e na marca:** "Atendimento humano e sem burocracia. Simples Assim ;)" é simpático e diferenciado. Microcopy de apoio ("Sem compromisso", "Resposta em até 2 horas úteis") é tranquilizadora e concreta.
- Linguagem clara, sem jargão de seguro — alinhada ao público.

### Pontos fracos
#### 3.1 — Headlines centradas na empresa, não no cliente — MÉDIO / baixo
"Cotamos com as melhores seguradoras" fala do que **vocês** fazem. Headlines de maior conversão falam do **resultado do cliente**: "Pague menos no seu seguro auto sem perder cobertura", "Proteja sua casa a partir de R$X/mês". O benefício precisa vir antes do processo.
**Correção:** reescrever H1 de cada landing em torno do ganho do cliente (economia, proteção, tranquilidade).

#### 3.2 — Proposta de valor genérica e repetida — MÉDIO / baixo
"40+ seguradoras / atendimento humano / sem burocracia" se repete nas três páginas e é igual ao discurso de qualquer corretor. O diferencial real (Fabio Salim, 10+ anos, ENS, passagem por Bradesco/Icatu/MetLife/Zurich) está **só na home**.
**Correção:** levar a credencial do corretor para as landings e transformar genérico em específico ("conduzido por um corretor com 20+ anos de mercado", desde que o número seja reconciliado — ver 3.3).

#### 3.3 — Dados que se contradizem — MÉDIO / baixo
**Arquivos:** `app/page.tsx` (STATS "10 anos" vs Sobre "atua… desde 2004"); "42+" (stats) vs "mais de 40 seguradoras" (MOTIVOS)
- "**10 anos** de mercado" briga com "**desde 2004**" (que daria ~22 anos). Um dos dois está errado e ambos aparecem na mesma página.
- "**42+** seguradoras" vs "mais de **40**" — pequeno, mas é descuido de precisão num site cuja venda é confiança.
**Correção:** definir os números corretos e usar **uma** fonte de verdade (ex.: constantes reaproveitadas) para não divergir entre seções.

---

## 4. Estrutura e navegação (arquitetura de informação)

### Pontos fortes
- Hierarquia rasa e previsível: home + 3 produtos. Logo linka para a home. Âncoras Início/Sobre/Seguros funcionam.
- Template orientado a config (produto = objeto) é uma arquitetura saudável para escalar páginas.

### Pontos fracos
#### 4.1 — Páginas que faltam (confiança + SEO) — ALTO / médio
Não existem páginas dedicadas de **Sobre**, **Contato**, **FAQ** nem **Política de Privacidade**:
- **Sobre** existe só como seção da home — perde-se como destino indexável e como página de confiança ("quem é o corretor").
- **Contato** não existe (só WhatsApp/forms espalhados) — falta endereço, horário, mapa, e-mail, área de atuação (Brasília/DF), que ajudam SEO local e credibilidade.
- **FAQ** não existe — perde objeção respondida (conversão) e rich snippets (SEO). Já recomendado na auditoria de conversão.
- **Política de Privacidade** é citada no consentimento LGPD mas a página não existe (link morto). Lacuna de confiança e compliance.
- **Área do cliente / autosserviço** está fora do MVP (ok, é visão de longo prazo) — mas vale já deixar um ponto de entrada "2ª via / sinistro / minha apólice → WhatsApp" para não frustrar quem é cliente.
**Correção:** criar Sobre, Contato e FAQ como rotas próprias (reaproveitando o estilo existente) e a página `/privacidade`. Linká-las no rodapé.

#### 4.2 — Menu promete 5 produtos, só 3 têm página — MÉDIO / baixo
**Arquivo:** `components/SiteHeader.tsx` (10–24)
O dropdown "Compre Aqui" lista Auto, Empresarial, Residencial, Viagem, Vida — mas **Empresarial e Vida** abrem o WhatsApp, enquanto os outros 3 vão para páginas. O comportamento ao clicar é imprevisível (ora navega, ora abre app externo), e mistura dois tipos de destino sem sinalização.
**Correção:** ou criar páginas mínimas para Vida e Empresarial (mesmo template), ou sinalizar visualmente quais itens vão para o WhatsApp (ícone/《via WhatsApp》). Consistência de expectativa no clique.

#### 4.3 — Dois rodapés diferentes — BAIXO / baixo
Home e páginas de produto têm rodapés com estrutura e dados distintos (já citado na auditoria técnica 8.2). Inconsistência de navegação e de informação legal.
**Correção:** um único componente de rodapé com navegação completa (Sobre, Contato, FAQ, Privacidade, WhatsApp) e dados legais idênticos.

#### 4.4 — Menu mobile não fecha ao navegar — BAIXO / baixo
`<details>` puro permanece aberto após o clique (auditoria técnica 7.1). Atrapalha o fluxo entre seções no celular.

---

## 5. Acessibilidade básica

> Razões de contraste calculadas a partir das cores do código (WCAG: AA exige 4,5:1 para texto normal, 3:1 para texto grande/negrito ≥ ~24px).

| Combinação | Contraste | AA normal | AA grande |
|---|---|---|---|
| Branco sobre roxo `#535391` | **6,97:1** | ✅ | ✅ |
| `#333` sobre branco | **12,63:1** | ✅ | ✅ |
| Turquesa `#5CBECB` sobre roxo | 3,21:1 | ❌ | ✅ |
| Branco sobre turquesa `#5CBECB` | **2,17:1** | ❌ | ❌ |
| Branco sobre laranja `#E9854A` (CTA) | **2,65:1** | ❌ | ❌ |
| Branco sobre verde WhatsApp `#25D366` | **1,98:1** | ❌ | ❌ |
| `#333`/60% sobre branco | 3,69:1 | ❌ | ✅ |
| `#333`/50% sobre branco | 2,85:1 | ❌ | ❌ |
| `#333`/40% sobre branco | 2,24:1 | ❌ | ❌ |

#### 5.1 — Botões primários falham contraste — ALTO / baixo
Texto branco sobre o laranja do CTA dá **2,65:1** e sobre o verde do WhatsApp **1,98:1** — ambos abaixo do mínimo, **inclusive para texto grande**. Como são os botões mais importantes do site, isso afeta legibilidade para todos (não só baixa visão) e a percepção de qualidade.
**Correção:** escurecer os tons (ex.: laranja para algo como `#C25A1E`, que cruza 4,5:1 com branco) **ou** usar texto escuro nos botões claros. Mesma lógica para a barra de estatísticas (5.2 abaixo).

#### 5.2 — Barra turquesa e sublabels — MÉDIO / baixo
Branco sobre `#5CBECB` (2,17:1) e branco/80% sobre turquesa (~1,87:1). Trocar para texto roxo escuro resolve. (Ver 2.1.)

#### 5.3 — Corpo de texto em opacidade baixa falha — MÉDIO / baixo
`#333/50%` (2,85:1) e `/40%` (2,24:1) são usados em legendas, fine print e textos de apoio — ilegíveis para parte dos usuários. `/60%` (3,69:1) passa só como texto grande.
**Correção:** mínimo `#333/70%` (4,95:1 ✅) para qualquer texto pequeno; reservar `/40` apenas para elementos decorativos.

#### 5.4 — Labels não associados aos inputs — MÉDIO / baixo
**Arquivos:** `FormularioCotacao.tsx`, `FormularioAutoQualificado.tsx`
Os `<label>` dos campos não usam `htmlFor`/`id` (exceto o checkbox LGPD). Sem associação programática, leitores de tela não anunciam o rótulo ao focar o campo, e clicar no label não foca o input.
**Correção:** dar `id` a cada input e `htmlFor` correspondente no label (ou aninhar o input dentro do label).

#### 5.5 — Foco de teclado pouco visível — MÉDIO / baixo
Inputs têm `focus:ring` (bom), mas links e botões não têm estilo de foco explícito — usuários de teclado podem não enxergar onde estão. O menu via `<details>` é navegável por teclado (ok).
**Correção:** adicionar `focus-visible:` (anel/contorno) em links e botões.

#### 5.6 — Pontos menores
- `alt` da logo presente e correto (✅). Emojis decorativos (✓, ícones) não têm `aria-hidden` — leitores de tela os verbalizam ("marca de seleção…"); marcar como decorativos limpa a experiência.
- "Política de Privacidade" é um `<span>`, não um link/elemento focável (ver 4.1).
- `lang="pt-BR"` definido no `<html>` (✅).

---

## Síntese: fortes vs. fracos

**Fortes:** paleta de marca distintiva e profissional · layout limpo e consistente · tom de copy humano e diferenciado · teste dos 5 segundos aprovado na home · arquitetura de template escalável.

**Fracos (em ordem de retorno):** contraste reprovado nos elementos coloridos mais importantes · execução inconsistente (fonte na home, logo no rodapé, números contraditórios) · textos de apoio apagados demais · arquitetura incompleta (faltam Sobre/Contato/FAQ/Privacidade) · menu que promete mais do que entrega · acessibilidade de formulário (labels/foco).

## Sequência sugerida
**Sprint 1 (acabamento, alto retorno e baixo custo):** contraste de botões + barra de estatísticas · fonte Nunito global · logo do rodapé · reconciliar números · labels e foco de teclado.
**Sprint 2 (arquitetura):** criar Sobre, Contato, FAQ e Privacidade · unificar rodapé · resolver coerência do menu.
**Sprint 3 (refino de marca):** escala tipográfica · headlines orientadas a benefício · avaliar ícones próprios vs. emoji · sistema de design documentado (tokens de cor/tipo) para manter consistência conforme o site cresce.
