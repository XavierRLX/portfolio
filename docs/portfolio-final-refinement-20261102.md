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
