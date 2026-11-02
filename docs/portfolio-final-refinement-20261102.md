# Direção de arte e acabamento — 02/11/2026

## Baseline e autorização

Worktree dedicado `portfolio-artdirection-20261102`, branch `codex/portfolio-artdirection-favicon-20261102`, HEAD inicial `7d8d490`, status limpo. A solicitação de 02/11 autoriza quatro lotes de implementação e commits locais. Substitui a regra histórica de branch do AGENTS.md nesta etapa. Sem push, merge ou deploy; nenhum arquivo do projeto original será alterado.

AGENTS.md e os seis documentos de refresh foram lidos em ordem, seguidos dos documentos de experiência, refinamento premium, backoffice e release. O refresh está encerrado. A versão aprovada/publicada em 29/10 é a baseline, com seis cases em dois carrosséis independentes e empilhados e um único painel de bastidores. Os documentos históricos ficam preservados.

## Lote 1 — diagnóstico

- Inspecionados HTML, CSS ativos, controladores de experiência, carrosséis, navegação, bastidores e cópia, mídia existente e os dois testes de UI/acessibilidade.
- Observados os quatro screenshots fornecidos em `/tmp/portfolio-final-20261102/before/` (1440, 768, 390, 360). Chrome/Playwright abriu o preview deste worktree e registrou `before/live-hero.png`.
- O X raster de 40×40 tem diagonais finas e contraste insuficiente em tamanho de favicon. Header e favicon apontam ao mesmo arquivo legado. Novo master vetorial terá peso deliberado, espaço negativo e silhueta X preservada.
- Hero já possui boa hierarquia e React simétrico. Grade de fundo, órbitas, glow e moldura competem entre si: reduzir a decoração e coordenar a entrada curta, preservando nome, headline, CTAs, onda e React.
- As seis capas reais têm tratamentos diferentes; badges sobrepõem conteúdo. Unificar a lógica de moldura/legenda, dar respiro às mídias e retirar o excesso de caixas e sombras dos cases. Preservar ordem, conteúdo verificável, swipe e teclado.
- Processo mobile introduz uma terceira trilha horizontal sem necessidade. Mostrar os três passos no fluxo vertical melhora leitura e descoberta.
- Cópia de e-mail tem um erro concreto: orienta selecionar um endereço “acima” que não está visível. O fallback também não garante limpeza se `execCommand` lançar exceção; cliques repetidos acumulam timers. Corrigir e testar sucesso, espera, fallback e falha.
- Os screenshots fornecidos têm retrato (e AWX no tablet) ainda não carregados. Isso não comprova falha de asset; capturas finais deverão aguardar decode e visita às seções, e a diferença de captura será identificada.

## Referências consultadas

- [Textura](https://textura.agency/): hierarquia de apresentação e separação de trabalhos/serviços. Consulta ao conteúdo público; nenhuma composição copiada.
- [GetLayers](https://www.getlayers.ai/): catálogo de referências e identificação de Showcase Equator; não usar templates ou assets do catálogo.
- [Design DNA](https://github.com/zanwei/design-dna): princípio de explicitar tokens, composição e motion separadamente. Mantidos os tokens do portfólio; sem instalar pacote.
- [GSAP core](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-core/SKILL.md), [timeline](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-timeline/SKILL.md), [ScrollTrigger](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-scrolltrigger/SKILL.md) e [performance](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-performance/SKILL.md): referências oficiais para sequência curta, transform/opacity, contexto e reduced motion. Nenhuma dependência nova de runtime.

## Validação por lote

Resultados de implementação, QA e limites serão registrados após observação real no navegador.

## Lote 2 — hero e cases

- Hero mantém headline, nome/Full Stack, dois CTAs, onda e React vetorial simétrico. Removidas moldura, órbita interna e luz com parallax; grade reduzida a linhas verticais quase imperceptíveis. Rotação de 48 s e gradiente ciano/lilás controlado. Entrada de texto de 480 ms, arte de 650 ms, sem ocultar leitura.
- Capas com molduras tonais, legendas fora do conteúdo das screenshots e enquadramento `contain`. Removidos grandes fundos/sombras dos cards; alinhamento por Flex/Grid, detalhes e CTAs alinhados por faixa, sem alturas fixas de texto.
- Mesmos seis cases e dois carrosséis, com controladores preservados.
- Chrome real em 1440/768/390/360: zero overflow global e exceções. Capturas em `/tmp/portfolio-final-20261102/lot2/`; desktop/mobile inspecionados. Mídias carregadas antes da captura.
- [Showcase Equator](https://www.getlayers.ai/layer/showcase-equator): página pública consultada. Prompt premium inacessível sem assinatura; não adquirido. Descartado o scroll fixado por incompatibilidade com a navegação nativa solicitada.
- Teste existente dirigido: 1440/390 + sem JS, sem CDN e reduced motion/resize passaram (5 cenários), incluindo os dois carrosséis, toque, teclado, modal e foco. Evidências em `lot2/qa/`.

## Lote 3 — processo, bastidores e contato

- Processo deixou de ser uma terceira trilha de swipe no celular. Agora são três passos verticais com exemplos verificáveis: BioPlaca, Cursos Pugliese e Galerows.
- Painel de bastidores permanece único e mantém as abas BioPlaca/AWX/Pugliese. A navegação das quatro etapas de produção aceita setas, Home e End, além de clique; alterações de estilo são discretas.
- Contato exibe o e-mail como link selecionável e preserva envio por mailto. Cópia só informa sucesso após confirmação da Clipboard API ou fallback; textarea temporário é removido mesmo em erro, foco original é restaurado, clique simultâneo é bloqueado e timer anterior é cancelado. Falha mantém mensagem útil visível.
- No mobile, scroll-padding-bottom:110px e scroll instantâneo na navegação por foco mantêm os CTAs acima do dock fixo. O primeiro teste independente detectou a sobreposição e a correção foi confirmada pela suíte completa.

## Lote 4 — marca X AVIER e favicon

- Novo Imagens/xavier-mark.svg com X vetorial transparente e dois traços mais legíveis; cabeçalho usa esse arquivo sem alterar o nome AVIER.
- Novo Imagens/xavier-favicon.svg com X equivalente, fundo azul escuro arredondado e borda discreta. Convergência de gradientes lilás/ciano preserva a assinatura original.
- PNGs rasterizados a partir do mesmo SVG em Chrome, nas dimensões de 16×16 (favicon-16.png), 32×32 (favicon-32.png) e 180×180 (apple-touch-icon.png). Incluídos no head com tipos e sizes. Todas as cinco URLs responderam HTTP 200 no preview local; SVGs validados com xmllint e dimensões PNG verificadas com sips.
- Nenhum manifest PWA criado: o site estático não precisa de instalação nesta etapa. O arquivo antigo xavier.ico.png é preservado como referência histórica, sem referência no HTML ativo.

## QA final — evidência local

- Chrome real + Playwright: 10 cenários aprovados com 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844 e 360×800, além de JavaScript desligado, CDN GSAP bloqueada e movimento reduzido com mudança de breakpoint.
- Dois carrosséis (3+3), navegação por toque/teclado, modal, abas, etapas, scroll vertical, foco, imagens e ausência de overflow e de exceções foram cobertos pela suíte tests/portfolio-ui.cjs. Relatório e capturas em /tmp/portfolio-final-20261102/qa-final/.
- Oito auditorias axe passaram, em main e três abas do diálogo, a 1440 e 390 px, sem violações detectadas nas regras selecionadas; não é certificação de acessibilidade.
- Scripts JS: node --check aprovado; git diff --check aprovado. As imagens e o HTML foram revisados em navegador real, com captura após carregar mídias lazy.
- Capturas iniciais: /tmp/portfolio-final-20261102/before/; capturas finais: /tmp/portfolio-final-20261102/after/ (sem adicionar imagens de QA ao bundle).
- Limites: teste automatizado de Chrome não equivale a Safari e dispositivos físicos; Lighthouse e condições de rede móvel reais não foram aferidos. O Codex concluiu o lote visual e alcançou limite de uso no segundo lote; o fechamento, favicon e testes posteriores foram executados via Remote Desktop Commander.
- Entrega apenas na branch isolada codex/portfolio-artdirection-favicon-20261102. Sem merge, push, alteração de produção ou dos sistemas apresentados.

## Regressões específicas adicionais

- Novo teste versionado tests/portfolio-contact.cjs: 4 verificações aprovadas em Chrome — cópia via Clipboard API, fallback quando a API falha, mensagem correta quando ambos os mecanismos falham e navegação por teclado Home/End nas quatro etapas de produção. Sem testes dependentes de banco ou autenticação real.
- Capturas finais de sete viewports conferidas com fontes e imagens decodificadas, sem overflow ou exceções. Favicon atualizado e endereço de e-mail visível no contato.
