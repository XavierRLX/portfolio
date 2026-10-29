# Registro de Decisões — Portfolio Refresh 2026

## DEC-001 — Evoluir, não substituir
**Status:** aceita

O portfólio será atualizado sobre a identidade existente. Não será substituído por template genérico nem redesenhado do zero.

## DEC-002 — Manter HTML/CSS/JS nesta etapa
**Status:** aceita

Não haverá migração para Next.js/React durante o refresh inicial. A migração só poderá ser reavaliada após conclusão e validação da versão atualizada.

## DEC-003 — Preservar assinatura visual do hero
**Status:** aceita

Devem permanecer: logo `X AVIER`, paleta azul/roxo, fundo escuro, React giratório e onda de transição.

## DEC-004 — Responsividade por layout fluido
**Status:** aceita

A correção responsiva não deve ser feita acumulando novos remendos por breakpoint. A base será refeita com fluxo natural, Grid/Flexbox, containers fluidos e tipografia responsiva.

## DEC-005 — Validação visual por IA executora
**Status:** aceita

Mudanças de layout e responsividade serão implementadas por uma IA com acesso ao navegador/tela em tempo real. Revisão de código isolada não encerra uma fase visual.

## DEC-006 — Reduzir vitrine para projetos fortes
**Status:** aceita

Projetos principais: AWX, Cursos Pugliese e Galerows. AI English Coach pode entrar como laboratório/open source. Projetos introdutórios permanecem no GitHub, mas deixam a vitrine principal.

## DEC-007 — Separar orquestração de execução
**Status:** aceita

O chat orquestrador define escopo, libera ondas de execução e revisa evidências. A IA executora altera código e valida visualmente. Dentro de uma onda autorizada, a executora pode avançar por fases contíguas sem nova aprovação; não avança para a onda seguinte automaticamente.

## DEC-008 — Preloader não pode bloquear conteúdo
**Status:** aceita

O efeito visual de entrada pode continuar, mas conteúdo essencial não deve ficar escondido aguardando timers.

## DEC-009 — Execução agrupada em ondas
**Status:** aceita

Para reduzir overhead, as fases serão executadas em quatro ondas: A (1–3), B (4–6), C (7–8) e D (9–10). O checkpoint obrigatório ocorre ao final da onda, salvo finding crítico ou decisão fora de escopo.

## DEC-010 — Refinamento posterior ao release de setembro
**Status:** aceita por solicitação explícita de 2026-10-28

O baseline aprovado desta etapa é `feat/portfolio-experience-20261028` / `efce7c3`, com cinco cases, documentado em `docs/portfolio-experience-2026.md`. O trabalho ocorre em `codex/portfolio-premium-refinement-20261028`, preservando HTML/CSS/JS e identidade. A restrição histórica à branch do refresh não se aplica a esta autorização posterior. Não publicar nem integrar em `main` nesta etapa.

O carousel passa a usar scroll-snap nativo e finito: um case central com vizinhos parciais até 850 px; dois cases em telas maiores. Sem clones, autoplay ou conversão do scroll vertical em horizontal. Decisões, skills e QA: `docs/portfolio-premium-refinement-2026.md`.

## DEC-011 — Seis cases e bastidores verificados
**Status:** aceita por solicitação explícita de 2026-10-29

Evoluir a partir de `39fa428` em `codex/portfolio-backoffice-cases-20261029`. Produtos: AWX, BioPlaca, Galerows; Soluções & Engenharia: Pugliese, Maria e case transversal de Backoffice. As interfaces administrativas usam componentes reais com dados fictícios, capturados offline, sem publicar código privado ou consultar bancos. O fluxo BioPlaca distingue composição/exportação automática de operação física e NFC manual. Sem merge ou deploy.

## DEC-012 — Dois cards e retorno circular
**Status:** aceita após ajuste explícito do usuário em 2026-10-29

O pedido acompanhado de screenshot substitui a apresentação desktop de três cards e o carousel finito da DEC-010 nesta etapa. Exibir dois cards maiores acima de 1100 px, em pares sobrepostos dentro de cada grupo de três. No mobile/tablet, manter centro destacado e vizinhos parciais. O loop usa scroll-snap nativo e buffers visuais inertes, sem duplicar a navegação assistiva. Reposicionar somente após o snap, entre quadros equivalentes. Sem autoplay ou scroll-jacking. Validar as duas fronteiras com touch, teclado, cliques rápidos e movimento reduzido.

## Como usar este arquivo
Adicionar novas decisões somente quando houver escolha relevante de produto, arquitetura, design ou processo. Não registrar detalhes triviais de implementação.
