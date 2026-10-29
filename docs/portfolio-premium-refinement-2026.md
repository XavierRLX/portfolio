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

## R2 — Carousel validado

- Escolha: trilha **finita, nativa**, com CSS Scroll Snap; sem duplicar DOM, autoplay, captura de ponteiro ou conversão do scroll vertical em horizontal.
- Até 850 px: card de `min(78vw, 420px)`, snap no centro, vizinhos em escala 0,94 e borda discreta no selecionado. Padding simétrico permite centralizar também primeiro/último. Em telas maiores: dois cards, snap no início e contador de intervalo (ex.: `02–03 / 05`). Não foi adicionado breakpoint corretivo para cada celular.
- Loop infinito foi descartado: com cinco projetos, os limites explícitos preservam ordem, foco, links únicos e semântica. Não há benefício que compense clones e reposicionamentos.
- Botões/summary/CTA com alvos de pelo menos 44 px; área do carousel focável com instruções para leitores de tela, setas e Home/End. Tab centra o card que contém o foco sem reordenar elementos. A região viva atualiza quando a navegação termina.
- Resumos curtos visíveis. Stack e implementação permanecem completas no disclosure HTML; imagens reais em `object-fit: contain`, proporção reservada e carregamento lazy. Dimensões declaradas do Galerows corrigidas para 1200×750.
- QA real em Chrome: botões e Home/End em 1440, 768, 430, 390 e 360 px; primeiro/último e contador corretos, sem overflow ou erros de JS. Desvio máximo medido da centralização: 0,45 px.
- Toque real pelo CDP (`Input.dispatchTouchEvent`) em 390 px: swipe → segundo card, sem mover o scroll vertical; gesto vertical sobre o card mantém o scroll da página. Tab/Enter abre detalhes; Tab seguinte chega ao link e depois ao próximo case. Quatro toques rápidos chegam ao quinto case; resize 390→768 mantém a seleção.
- Capturas `carousel-{largura}-{first,second}.png` e `touch-after-swipe.png` em `/tmp/portfolio-refinement-qa/`. As capturas finais aguardam o decode das imagens lazy, evitando confundir um frame de carregamento com falha de asset.

## Finding R3 — Resize entre composições

O QA adicional encontrou troca involuntária do segundo para o terceiro case ao redimensionar 851→1280 px. O navegador pode executar o novo snap antes do callback de ResizeObserver; a rotina de scroll comparava a nova posição com destinos da geometria antiga. A correção verifica a largura antes de calcular o item próximo, mede novamente e restaura o destino solicitado. Validação dirigida: 390→430→360→700→701→850→851→1280→390, mantendo o segundo case (ou o intervalo 02–03). A matriz integrada será repetida após esta correção.

## R3 — QA integrado concluído

**Resultado: 10/10 cenários aprovados**, após a correção de resize. Chrome real (headless), Playwright 1.62.1, emulação de viewport/toque; screenshots inspecionados visualmente. Não equivale a teste em aparelhos físicos ou Safari, nem a medição Lighthouse/rede móvel de produção.

| Viewport | Resultado | Hero (px) | Trilha fechada (px) |
| --- | --- | ---: | ---: |
| 1440 × 900 | PASS | 860 | 707 |
| 1280 × 800 | PASS | 800 | 695 |
| 1024 × 768 | PASS | 768 | 606 |
| 768 × 1024 | PASS | 1016 | 570 |
| 430 × 932 | PASS | 805 | 513 |
| 390 × 844 | PASS | 816 | 517 |
| 360 × 800 | PASS | 816 | 502 |

A trilha caiu de 1914→707 px no desktop, 1578→570 px no tablet e 574→517 px em 390 px. O hero em 390 px caiu de 1114→816 px. Não foram adicionadas bibliotecas de produção ou imagens raster; os elementos novos são SVG inline. A observação local de CLS inicial ficou entre 0 e 0,0011 (zero nas três larguras de celular); é uma evidência de laboratório local, não uma métrica de campo.

Verificações automatizadas:

- Ida/volta por todos os cases; primeiro/último centralizados e limites dos controles corretos; dois cases e contador de intervalo no desktop.
- Scroll vertical preservado ao usar os controles horizontais. Swipe confiável via eventos de toque do Chrome em **430, 390 e 360 px**; gesto vertical sobre o card continua rolando a página.
- Quatro toques consecutivos sem esperar a animação; setas, Home/End, Tab entre todos os summaries/links e Enter para expandir/recolher.
- Texto e conteúdo expandido dentro dos limites do card; imagens decodificadas em todos os cinco projetos e em todas as sete viewports, lazy loading e `contain` preservados. Alvos de summary/CTA de pelo menos 44 px.
- Alteração de reduced motion durante cada sessão remove os triggers e interrompe a rotação; navegação continua funcionando. Teste adicional com a preferência ativa desde o carregamento.
- Navegação/menu mobile, Escape e retorno de foco; destinos das âncoras, IDs únicos, ausência de links aninhados e proteção dos links externos.
- Sem JS: conteúdo, disclosures e navegação pelo dock disponíveis, controles dependentes de JS ausentes. Sem CDN GSAP: carousel e conteúdo funcionam.
- Resize 390→430→360→700→701→850→851→1280→390 preservando o segundo case. Zero overflow global, falhas de assets locais, exceções JS ou erros de console nos sete cenários normais.
- `node --check` nos scripts ativos e no teste; `git diff --check` aprovados.

O teste posiciona os controles abaixo da área reservada pelo `scroll-padding-top` antes de medir scroll vertical. A checagem de cortes considera os limites reais do conteúdo dentro do card, permitindo o pequeno overflow visível do ícone de disclosure rotacionado. Essas duas correções do harness não exigiram mudanças na interface.

### Evidências e reprodução

- Script versionado: `tests/portfolio-ui.cjs`.
- Resultado JSON versionado: `docs/qa/premium-refinement-20261028.json`.
- Screenshots completos por viewport: `/tmp/portfolio-refinement-qa/final/full-{largura}.png`.
- Hero: `hero-{largura}.png`; carousel: `projects-{largura}-{first,last}.png`; detalhes: `details-{largura}.png`; toque: `touch-{430,390,360}.png`; fallback: `no-js.png`, `no-gsap.png`, `resize-and-reduced.png`, no mesmo diretório.
- Baseline e capturas intermediárias permanecem em `/tmp/portfolio-refinement-qa/`; não foram adicionadas imagens de QA ao bundle do site.

Com servidor ativo:

```bash
python3 -m http.server 8016 --bind 127.0.0.1
```

Em outro terminal, com Google Chrome instalado:

```bash
npm install --prefix /tmp/xavier-playwright playwright@1.62.1
PLAYWRIGHT_MODULE=/tmp/xavier-playwright/node_modules/playwright node tests/portfolio-ui.cjs
```

Pode-se usar `PORTFOLIO_URL` e `QA_OUTPUT` para alterar URL/destino. Nesta sessão, foi utilizado o Playwright já fornecido pelo runtime local, sem instalar dependências no projeto.

### Entrega

- `d0462ca`: hero, copy, SVGs e motion progressivo.
- `5c881b3`: carousel nativo e conteúdo compacto.
- `449ede3`: correção de seleção durante resize.
- Testes, evidências e fechamento documental em commit temático posterior.
- Branch pronta para avaliação local. Nenhum merge, push ou deploy realizado; `main` permanece em `6c926cc` e a branch de referência em `efce7c3`.
