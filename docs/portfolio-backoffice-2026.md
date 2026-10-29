# Engenharia & Backoffice — evolução de 29/10/2026

## Baseline e escopo

- Branch inicial: `codex/portfolio-premium-refinement-20261028`; HEAD `39fa428`, working tree limpa, um único worktree.
- Os quatro commits de refinamento anteriores estão preservados. Baseline conhecido `efce7c3` é ancestral, não ponto de reinício.
- Branch desta etapa: `codex/portfolio-backoffice-cases-20261029`, criada a partir de `39fa428`.
- A solicitação de 29/10 autoriza seis cases, dois grupos e apresentação transversal. Substitui, somente nesta etapa, a curadoria histórica de três/cinco cases e a restrição antiga à branch de setembro. Hero, assinatura visual e arquitetura estática permanecem.
- Sem merge, deploy ou alterações nos projetos/bancos de origem.

## Fases

1. Inspeção somente leitura, curadoria verificável e mídia com dados fictícios.
2. Dois grupos de três cases, carousel responsivo e apresentação acessível de bastidores.
3. QA em navegador real, documentação, evidências e commits.

## Curadoria confirmada na inspeção

| Sistema | Capacidades que podem ser apresentadas | Limites preservados |
| --- | --- | --- |
| BioPlaca | Estabelecimentos, lotes, códigos únicos, QR automático, composição na arte, editor X/Y/tamanho, prévia, PNG, ZIP e manifesto CSV, estoque, vendas, destinos e preparação NFC | Arte/posicionamento e conferências são operados pelo administrador. Conferir download e recebimento físico é manual. NFC é gravado em aplicativo externo; a plataforma fornece URLs e checklist. Não afirmar checkout ou cobrança automáticos. |
| AWX Brasil | Workspace profissional separado da garagem pessoal, estoque, cadastro, gastos, manutenção, resumo financeiro, ciclos de venda e transferência, equipe e autorização por contexto | Implementação profissional em validação; código não significa liberação de produção. Não anunciar DRE, emissão fiscal, conciliação, financiamento, comissão, múltiplas filiais ou gateways adiados. |
| Cursos Pugliese | Admin global; Teacher restrito ao próprio conteúdo; cursos/matérias/módulos/aulas, planos, concessão de acesso, diretório/progresso, turmas e planejamento | Plano organiza a oferta; acesso efetivo ao curso é controlado separadamente. Não apresentar Pix/Asaas adiado como cobrança disponível. Não publicar código privado, identidades, credenciais ou dados reais. |

As conclusões vieram dos componentes, fluxos de servidor, geradores, contratos de autorização e documentação atual dos três repositórios locais. A auditoria detalhada e os renderizadores temporários ficam fora do repositório público, em `/tmp/xavier-backoffice-evidence/`.

## Direção visual e de navegação

Manter fundo `#080c19`, superfície `#0b101f`, lilás `#9d8bff`, ciano `#75dbe3`, tipografia e acabamento aprovados. Os cinco cards existentes evoluem somente o necessário para a nova composição. O sexto é identificado como case transversal, sem simular um novo produto.

- Dois carrosséis independentes e empilhados: **Produtos** (AWX, BioPlaca, Galerows) e **Soluções & Engenharia** (Pugliese, Maria, Backoffice).
- Acima de 1100 px, os três cases de cada faixa cabem integralmente. Os buffers e controles ficam ocultos: não há deslocamento desnecessário nem cards duplicados visíveis.
- Tablet/mobile: cada faixa tem três cases, swipe nativo circular, centro em destaque, vizinhos parciais e controles próprios. Navegar uma faixa não altera a outra.
- A clarificação explícita do usuário em 29/10 define dois carrosséis um abaixo do outro, cada um com três projetos.
- Bastidores: painel modal com abas BioPlaca/AWX/Pugliese, imagens fiéis, descrições curtas e detalhes opcionais. Sem carousel horizontal dentro do painel.
- BioPlaca: sequência controlada pelo visitante, do modelo à composição/exportação; nenhum autoplay que impeça leitura.

## Skills e fontes

Reutilizadas `find-skills`, [Frontend Design (Anthropic)](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md), [Playwright CLI (Microsoft)](https://github.com/microsoft/playwright-cli/blob/main/skills/playwright-cli/SKILL.md), [GSAP Core](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-core/SKILL.md) e [ScrollTrigger](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-scrolltrigger/SKILL.md). Acrescentadas [GSAP Timeline](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-timeline/SKILL.md), [Web Design Guidelines (Vercel)](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) e skill Supabase instalada, aplicada à leitura dos controles de acesso. Sem alterações de Supabase nesta etapa.

Referências de interação: [tabs WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) e [`dialog` nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). Fontes das skills consultadas diretamente; não são dependências do site.

Os resultados por fase e a matriz de verificação ficam registrados abaixo.

## B1 — Inspeção e mídia concluídas

Foram inspecionados os três projetos locais sem iniciar seus servidores, ler credenciais, executar migrations ou alterar registros. Alterações locais preexistentes foram preservadas. Capturas de baseline da seção atual: `/tmp/portfolio-backoffice-qa/before-projects-{390,1440}.png`.

As quatro imagens administrativas em `Imagens/backoffice/` são **demonstrações com dados fictícios**, obtidas renderizando os componentes reais dos projetos em um harness offline. O núcleo das telas é o componente existente; a moldura de navegação foi simplificada para a captura. Links/imagens Next foram adaptados somente no harness temporário; dados/contexto foram fornecidos por fixtures locais, sem autenticação nem conexão ao Supabase. Fontes locais de captura usam fallback Arial. Nenhum código privado, bundle desse harness ou dado real é publicado pelo portfólio.

- BioPlaca: editor real de modelos, posição/tamanho do QR e prévia final; 1440×1165.
- AWX: painel profissional real com métricas e atalhos existentes; 1440×1077. Todos os valores são fictícios, sem representar resultado comercial ou produção liberada.
- Pugliese: dashboards Admin (1440×1112) e Teacher (1440×1186), com cursos/alunos fictícios.
- Os quatro WebP somam cerca de 291 kB. Miniaturas separadas de 640 px evitam carregar as imagens maiores no card de capa.

`plate-model.webp` deriva da arte-base existente. `plate-generated.webp` é uma prévia otimizada do PNG composto pelas funções originais de geração, executadas offline com código de amostra e URL `https://example.com/r/K8P4MX?src=qr`. `demo-qr.png` usa a mesma URL fictícia. A rota real de exportação e seus guards não foram chamados ou alterados. Os dois PNG originais e, depois, os arquivos públicos `demo-qr.png` e `plate-generated.webp` foram lidos pelo Apple Vision e retornaram o payload esperado; não é validação de impressão ou de NFC físico.

Proveniência, capturas originais, renderizadores temporários e verificação do QR estão em `/tmp/xavier-backoffice-evidence/`, fora do site público.

## B2 — Implementação e smoke

- Duas instâncias do mesmo controlador modular, cada uma com três cases, controles, contador e seleção próprios. Os grupos permanecem no fluxo vertical, um abaixo do outro.
- Os três cards ficam visíveis por faixa acima de 1100 px. Até essa largura, cada trilha usa snap central e vizinhos menores. Sem captura de gestos, autoplay ou conversão de scroll vertical.
- O retorno circular mobile/tablet usa buffers visuais inertes antes/depois dos três cards originais de cada faixa. Os buffers não têm links, botões, IDs ou participação na árvore de acessibilidade. Após soltar o toque e concluir o snap, a trilha retorna à posição equivalente dos originais, sem transição de escala. Uma pausa com o dedo apoiado não dispara reposicionamento. São somente seis cases navegáveis no total.
- `js/projects.js` preserva a seleção de cada faixa ao trocar entre card central e composição completa de três cards.
- O sexto case usa três miniaturas dos componentes reais e é identificado como demonstração transversal. O botão abre `dialog` nativo, com fundo inerte, três abas, foco controlado, Escape e retorno ao contexto original.
- Sem JavaScript, o CTA é uma âncora para a mesma apresentação inline; as três áreas e as quatro etapas ficam legíveis. Não há cópia alternativa de conteúdo para manter.
- A automação BioPlaca aparece antes do editor completo: quatro etapas controladas pelo visitante. Editor real e decisões técnicas são expansíveis. NFC manual e valores fictícios são identificados explicitamente.
- Trocas de aba/etapa usam entrada curta GSAP, sem esperar animação para mudar conteúdo/ARIA; preferência reduzida interrompe e limpa o efeito. Sem GSAP, as operações continuam imediatas.
- Smoke Chrome em 1440, 768, 390 e 360: seis cases, abertura/troca das abas/fechamento, foco de retorno e zero overflow/exceções. Axe inicial em 1440 e 390 (aba BioPlaca) não detectou violações WCAG A/AA; a auditoria final cobrirá as três abas.
- Refinamento após observação real: a captura grande do editor foi movida para disclosure, dando prioridade ao fluxo automático de produção. Imagens administrativas completas usam `contain` e link para ampliar; nenhum dado privado ou código de backend é enviado ao browser do portfólio.

### Correções de interação após QA

- Nos cards centralizados, detalhes e CTA usam 48 px de altura mínima: mesmo reduzidos a 94%, seus alvos físicos continuam acima de 44 px.

- Scroll padding do painel acompanha a altura real da navegação fixa; o dock mobile também recebe espaço de rolagem para não cobrir CTAs focados.
- Tab/Shift+Tab retornam entre os extremos do diálogo, evitando que o Chrome transfira foco para sua interface. A página fica fixada na posição anterior durante a apresentação: isso também impede movimento de fundo provocado por foco programático em telas estreitas. Escape continua nativo, e o fechamento devolve foco e posição ao sexto case.
- A atualização dos ScrollTriggers responde somente aos detalhes dos seis cards originais. Expandir uma captura dentro do diálogo não altera a geometria da página e não precisa recalcular esse contexto de scroll.
- Transições de aba e etapa são interrompidas e limpas ao ativar movimento reduzido.
