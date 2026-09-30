# AGENTS.md

## Projeto atual
Este repositório está passando por uma atualização profissional do portfólio pessoal de Renan Xavier.

A atualização deve evoluir o site existente, não substituí-lo por um template genérico. A identidade visual original é um requisito de produto.

## Leitura obrigatória antes de alterar código
Leia, nesta ordem:
1. `docs/portfolio-refresh/00-overview.md`
2. `docs/portfolio-refresh/01-action-plan.md`
3. `docs/portfolio-refresh/02-visual-identity.md`
4. `docs/portfolio-refresh/03-content-strategy.md`
5. `docs/portfolio-refresh/04-executor-workflow.md`
6. `docs/portfolio-refresh/05-status.md`

## Regras de execução
- Trabalhar na branch `refresh/portfolio-2026` até decisão explícita de merge.
- Não migrar para Next.js, React ou outro framework durante este refresh sem decisão documentada.
- Preservar logo `X AVIER`, paleta azul/roxo, fundo escuro, onda de transição e o React giratório como assinatura visual.
- Não tentar corrigir responsividade apenas acumulando novos breakpoints e valores absolutos. Priorizar layout fluido com Grid/Flexbox, `clamp()`, `min()`, `max-width` e `aspect-ratio`.
- Não bloquear conteúdo por timers de preload/animação.
- Não fazer refatorações amplas fora da fase em execução.
- Uma fase por vez; validar antes de avançar.
- A IA executora deve observar o resultado real em navegador durante mudanças visuais e responsivas.
- Atualizar `docs/portfolio-refresh/05-status.md` ao concluir cada fase.
- Commits devem ser pequenos, temáticos e descrever a fase concluída.

## Fontes de verdade
- Escopo e sequência: `01-action-plan.md`.
- Decisões visuais: `02-visual-identity.md`.
- Projetos e conteúdo: `03-content-strategy.md`.
- Método da IA executora: `04-executor-workflow.md`.
- Estado atual, pendências e próximo passo: `05-status.md`.

Se código, documentação e comportamento visual divergirem, interrompa a fase e registre a divergência antes de continuar.
