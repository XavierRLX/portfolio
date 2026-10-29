# Refinamento premium — 2026-10-28

## Baseline e escopo autorizado

- Baseline auditada: `feat/portfolio-experience-20261028`, HEAD `efce7c3`, working tree limpa.
- Branch desta etapa: `codex/portfolio-premium-refinement-20261028`, derivada diretamente desse commit.
- A instrução explícita de 2026-10-28 autoriza nova branch e refinamentos em hero/projetos; substitui, nesta etapa, a restrição histórica à branch `refresh/portfolio-2026`.
- Divergência registrada antes da implementação: `05-status.md` descreve o release de setembro, enquanto o código e `docs/portfolio-experience-2026.md` já apresentam a versão premium de outubro com cinco cases. A versão premium é o baseline aprovado. O histórico do refresh permanece preservado.
- Sem merge, push ou deploy de produção. HTML/CSS/JavaScript e os cinco projetos atuais permanecem.

## Direção visual

Preservar tokens e tipografia existentes: fundo `#080c19`, superfície `#0b101f`, texto `#f6f6fc`, lilás `#9d8bff`, destaque `#c7bcff` e ciano `#75dbe3`. Space Grotesk conduz títulos, Manrope a leitura e DM Mono os detalhes técnicos.

Hero com texto alinhado à esquerda e composição React à direita; no mobile, fluxo vertical compacto. Reduzir copy redundante, alinhar o plano do símbolo e acrescentar duas miniinterfaces gráficas (interface e arquitetura de dados). O React continua como foco visual; os complementos permanecem decorativos, sem controles falsos ou métricas inventadas.

Projetos em trilha horizontal finita: card central com destaque e prévias laterais no mobile, dois cards quando há espaço. Imagens reais e resumo visível; stack e explicação técnica no disclosure nativo. Comparado ao grid vertical, esta composição concentra a exploração em uma única faixa sem esconder o conteúdo técnico.

## Skills e fontes

Pesquisa com `find-skills`, catálogo skills.sh e repositórios oficiais. Aplicadas nesta sessão (fontes lidas, sem adicionar dependências de produção):

- [Frontend Design — Anthropic](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).
- [Playwright CLI — Microsoft](https://github.com/microsoft/playwright-cli/blob/main/skills/playwright-cli/SKILL.md), com automação pelo runtime Playwright já disponível.
- [GSAP core](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-core/SKILL.md) e [ScrollTrigger](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-scrolltrigger/SKILL.md).
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) para reversão automática ao mudar a preferência de movimento.

As skills foram consultadas diretamente nas fontes oficiais, armazenadas em `/tmp/xavier-refinement-skills`. Não foi instalada skill comunitária de procedência desconhecida. Superpowers não é necessário nesta etapa.

## Fases desta etapa

1. Hero: copy, equilíbrio do símbolo, dois elementos gráficos e QA visual.
2. Projetos: carousel nativo, composição compacta, teclado e touch; QA visual/funcional.
3. Validação integrada: sete viewports, movimento reduzido dinâmico, fallback sem JS/CDN, screenshots e testes reproduzíveis.

Evidências e resultados serão registrados após cada fase validada.

## R1 — Hero validado

- Baseline visual capturada antes de alterar código em desktop, tablet e mobile; arquivos `before-*-hero.png` e `before-*-projects.png` em `/tmp/portfolio-refinement-qa/`.
- Copy inicial reduzida de múltiplas linhas de posicionamento e prova a nome/Full Stack + uma frase; headline e CTAs preservados.
- React vetorial com centro e três elipses simétricas, sem perspectiva 3D; rotação discreta de 40 segundos. Moldura e órbitas alinhadas. Duas miniinterfaces em SVG representam interface e arquitetura/dados, sem aumentar requests de imagens.
- GSAP preservado para entrada curta e luz vinculada ao scroll. `gsap.matchMedia()` reverte motion se a preferência mudar durante a sessão. Conteúdo crítico permanece legível durante a entrada; callbacks de reveal pertencem ao contexto e disclosures atualizam ScrollTrigger.
- Matriz real em Chrome/Playwright: 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800. Sem overflow, colisão entre texto/arte ou exceções JS; os dois CTAs estão visíveis na primeira dobra em todas elas.
- Finding corrigido durante QA: os botões quebravam para duas linhas em 360 e 430 px. Agora usam Grid com duas colunas fluidas. A chamada inferior do hero foi removida no mobile, onde competia com o dock.
- Hero em 390 px: altura 1114 → 816 px (−27%); em tablet: 1246 → 1016 px. Screenshots `hero-{largura}.png` e medidas `hero-results.json` no diretório de evidências.
