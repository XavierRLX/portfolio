# Status — Portfolio Refresh 2026

Atualizado em: 2026-09-30

## Estado geral
**ONDA C CONCLUÍDA — AGUARDANDO REVISÃO DO ORQUESTRADOR**

As Fases 1, 2 e 3 foram executadas na branch `refresh/portfolio-2026`. A primeira dobra foi mantida com a identidade original, mas o hero deixou de depender de offsets rígidos e timers para exibir conteúdo essencial.

## Baseline Git inicial da Onda A
- Repositório: `XavierRLX/portfolio`
- Branch: `refresh/portfolio-2026`
- HEAD local inicial: `d03a438fa1f8c64916c638f6bc8fa31a241b077a`
- `origin/refresh/portfolio-2026`: mesmo SHA
- Ahead/behind inicial: `0/0`
- Working tree inicial: limpa

## Baseline visual observada antes das alterações
- Desktop 1440/1280: hero dependia de composição rígida; texto e React mudavam de proporção de forma abrupta entre larguras.
- Tablet 1024/768: texto e React ficavam excessivamente pequenos, com grande área vazia vertical.
- Mobile 430: composição ainda dependia de offsets corretivos.
- Mobile 390/360: headline ultrapassava a viewport e havia corte horizontal.
- Preloader ocupava a tela antes de liberar o conteúdo.
- Hero, Sobre e partes da entrada visual dependiam de timers JavaScript.

## Fases
| Fase | Estado | Observação |
|---|---|---|
| 0 — Planejamento e governança | CONCLUÍDA | Documentação canônica preservada |
| 1 — Baseline visual e inventário | CONCLUÍDA | Desktop, tablet e mobile registrados antes da primeira alteração |
| 2 — Fundação estrutural/semântica | CONCLUÍDA | Sem redesign geral |
| 3 — Hero responsivo | CONCLUÍDA | Grid/Flex, containers fluidos e validação real em navegador |
| 4 — Projetos em destaque | CONCLUÍDA | Vitrine reduzida aos três produtos principais |
| 5 — Sobre, experiência e stack | CONCLUÍDA | Perfil atual, experiência compacta e stack agrupada |
| 6 — Contato e navegação | CONCLUÍDA | Canais profissionais e menu mobile acessível |
| 7 — Motion/performance/acessibilidade | CONCLUÍDA | Preloader removido; reduced motion, performance e acessibilidade validados |
| 8 — SEO/apresentação externa | CONCLUÍDA | Metadados, canonical, OG, Twitter e JSON-LD implementados |
| 9 — QA visual cross-device | PENDENTE | Matriz completa posterior |
| 10 — Release e encerramento | PENDENTE | Revisão, merge e publicação |

## Fase 2 — Fundação estrutural
- Header passou a usar `nav`, lista válida e links semânticos.
- Home recebeu destino explícito `#inicio`.
- 20 anchors aninhados nos cards foram removidos.
- IDs duplicados de seções/paginação foram eliminados.
- Wrappers de cards foram alinhados aos destinos já declarados nos CTAs internos.
- `target="_blank"` passou a usar `rel="noopener noreferrer"`.
- Controles de cópia passaram de imagens clicáveis para `button` semântico.
- `box-sizing: border-box` foi estabelecido na base global.

## Fase 3 — Hero responsivo
- Novo `CSS/hero.css` isola a implementação responsiva da primeira dobra.
- Desktop usa Grid com texto à esquerda e React à direita.
- Tablet reorganiza o hero para fluxo vertical sem offsets mágicos.
- Mobile usa container fluido, tipografia com `clamp()` e React proporcional.
- Logo `X AVIER`, fundo azul profundo, identidade roxo/azul, React giratório e onda inferior foram preservados.
- A rotação do React foi dimensionada pelo espaço da coluna para não criar overflow em nenhum ângulo.
- A frase principal deixou de ser revelada por timer; `js/digitando.js` foi removido.
- O conteúdo principal agora existe no DOM mesmo se JavaScript falhar.
- Preloader não bloqueia mais a aplicação por timeout; há fallback CSS caso JavaScript não execute.
- A seção Sobre também deixou de depender do timer de 5 s apenas para aparecer.
- Ícones decorativos da seção de projetos passaram a ter a própria seção como containing block, evitando vazamento visual para o hero.

## Arquivos alterados na Onda A
- `index.html`
- `CSS/style.css`
- `CSS/slide.css`
- `CSS/Loading.css`
- `CSS/hero.css` — novo
- `js/preload.js`
- `js/digitando.js` — removido

## Validação visual obrigatória
| Viewport | Resultado | Observação |
|---|---|---|
| 1440 × 900 | PASS | Composição desktop equilibrada; texto e React em colunas |
| 1280 × 800 | PASS | Sem overflow durante rotação; quebra de headline estável |
| 1024 × 768 | PASS | React e texto mantêm hierarquia sem corte |
| 768 × 1024 | PASS | Fluxo vertical; navegação desktop ainda visível |
| 430 × 932 | PASS | Sem corte horizontal; hero reorganizado |
| 390 × 844 | PASS | Finding original de overflow resolvido |
| 360 × 800 | PASS | Menor viewport validada sem clipping |

A validação usou emulação real de viewport via navegador. Em todas as larguras, `document.documentElement.scrollWidth <= innerWidth`; não foi usado `overflow-x: hidden` para mascarar problemas.

## Validações técnicas
- Console do navegador em 1440 × 900: zero `Runtime.exceptionThrown` e zero entradas de log em nível `error`.
- Teste com JavaScript desabilitado em 1280 × 800: hero e conteúdo essencial continuam visíveis após o fallback CSS.
- Auditoria HTML local: zero IDs duplicados, zero anchors aninhados, zero fragmentos internos sem destino e zero `src` locais ausentes.
- Links externos com `target="_blank"`: todos com `noopener noreferrer`.
- `git diff --check`: PASS antes dos commits.
- Links verificados: AWX `200`, Carteirinha `200`, Jogos da Galera `200`.
- Findings externos: Hamburgueria retorna `404`; Direction Pack retorna `503` no deploy atual.

## Commits da Onda A
- `32bf7bed5d015d61ed2dad4a6edcd3061c479232` — `refactor: establish semantic portfolio structure`
- `5dd5125ab7087ac5d41a368da5e36fe81c208638` — `fix: rebuild responsive hero layout`

## Findings resolvidos
- overflow horizontal conhecido em 390 px;
- offsets rígidos do React por resolução;
- anchors aninhados;
- IDs repetidos;
- wrappers de cards com destinos inconsistentes;
- conteúdo essencial escondido por timers JavaScript.

## Findings e riscos residuais
- O link da Hamburgueria está indisponível (`404`) e não há destino alternativo inequívoco no inventário atual; revisar na curadoria da Onda B.
- O deploy atual do Direction Pack responde `503`; o repositório existe, mas trocar o destino exige decisão de conteúdo da Onda B.
- A navegação mobile continua sem menu dedicado; implementação/acessibilidade pertencem à Fase 6.
- Reduced motion, revisão completa do preloader, performance e motion permanecem para a Onda C/Fase 7.
- Conteúdo, hierarquia e seleção dos projetos continuam legados até a Onda B.
- SEO segue mínimo até a Fase 8.

## Revisão do orquestrador — Onda A
Revisão independente concluída em 2026-09-30:
- comparação Git confirmou 3 commits à frente da baseline, 0 atrás;
- branch local e remota sincronizadas em `686c0345495709409578b293f053c0032864ef48`;
- working tree limpa;
- diff consolidado compatível com o escopo autorizado;
- hero revisado novamente em navegador em 1440 × 900 e 390 × 844 após carregamento;
- identidade visual preservada e overflow mobile não reproduzido;
- menu mobile dedicado e refinamento completo do preloader permanecem como pendências planejadas, sem bloquear a aprovação.

**Onda A aprovada.**

## Onda B — Baseline inicial
- Branch: `refresh/portfolio-2026`.
- HEAD local inicial: `ad7d4ce77012a3a8c6a68235fa0b930ff05ce30b`.
- `origin/refresh/portfolio-2026`: mesmo SHA.
- Ahead/behind inicial: `0/0`.
- Working tree inicial: limpa.
- Documentação canônica `AGENTS.md` e `docs/portfolio-refresh/00–06` relida integralmente antes das alterações.

## Fase 4 — Projetos em destaque
A vitrine legada com sliders e categorias `Sites`, `Ferramentas` e `Games` foi substituída por três case studies estáticos e responsivos:

1. **AWX / All Wheels Experience** — projeto autoral de gestão automotiva, com Next.js/React/TypeScript, Supabase/PostgreSQL, Auth, RLS, RPCs e Capacitor. O case destaca manutenção, custos, FIPE e compartilhamento/transferência sem expor o repositório privado. CTA público validado em `https://www.awxbrasil.com.br/`.
2. **Cursos Pugliese** — produto full stack com papéis admin/teacher/student, Supabase Auth SSR, autorização server-side, RLS, RPCs transacionais, conteúdo acadêmico, progresso, planos, entitlements e turmas. Não há CTA de código nem exposição de ambiente privado.
3. **Galerows** — produto consumer/mobile para jogos sociais, com React, TypeScript, Vite, Vitest e Capacitor. CTAs públicos para o produto e repositório GitHub.

Projetos introdutórios e legados deixaram a vitrine, incluindo Calculadora, Relógio Digital, Lista de Compras, exercícios JavaScript, Android/Guanabara, Vingadores, Bootstrap, Xavierburger, Hamburgueria e Direction Pack. Com isso, os findings `404` da Hamburgueria e `503` do Direction Pack deixam de afetar a experiência publicada.

Foram capturados screenshots reais dos produtos públicos AWX e Galerows para os cards. Nenhum mockup de funcionalidade foi fabricado.

## Fase 5 — Perfil profissional
- Hero manteve a estrutura aprovada da Onda A e recebeu apenas nova copy: `Desenvolvedor Full Stack` e descrição end-to-end curta.
- Sobre foi reduzido para dois parágrafos, removendo o tempo exato de experiência e texto autobiográfico longo.
- Experiência NUCLEP passou a uma apresentação compacta com C#/.NET, SQL Server, sistemas corporativos, manutenção/evolução e contato com requisitos/usuários.
- Stack foi reorganizada por função: Frontend, Backend, Dados, Mobile/Infra e IA — prática em projetos.
- A categoria IA comunica uso prático de LLMs, RAG, embeddings, pgvector e agentes sem afirmar especialização profissional.
- CTA do currículo foi preservado. O PDF existe, é válido e tem uma página; o nome físico `Curriculo_Renan_Analista_25.pdf` permanece como finding de nomenclatura legada para revisão futura, sem alterar o PDF nesta onda.

## Fase 6 — Contato e navegação
- Contato passou a priorizar E-mail, LinkedIn e GitHub.
- Telefone e Instagram saíram do CTA profissional principal.
- E-mail possui `mailto:` e botão real de cópia com feedback em `aria-live`.
- Criado `js/navigation.js` para menu mobile progressivamente aprimorado.
- Botão mobile usa `aria-expanded` e `aria-controls`, abre/fecha por clique, fecha após escolher seção, fecha com `Escape` devolvendo foco e fecha ao clicar fora.
- Sem JavaScript, os links da navegação continuam visíveis no mobile; com JavaScript, passam ao dropdown acessível.
- Foco de teclado visível foi adicionado aos links e botões novos.

## Validação visual — Onda B
| Viewport | Resultado | Observação |
|---|---|---|
| 1440 × 900 | PASS | Hero equilibrado; cases em duas colunas; perfil, stack e contato com hierarquia clara |
| 1280 × 800 | PASS | Sem overflow; composição desktop preservada |
| 1024 × 768 | PASS | Hero e cases intermediários sem corte ou deformação |
| 768 × 1024 | PASS | Cases passam para uma coluna; header e conteúdo permanecem legíveis |
| 430 × 932 | PASS | Menu mobile ativo; hero, cards, stack e contato no fluxo natural |
| 390 × 844 | PASS | Cards e CTAs sem clipping; menu mobile validado aberto e fechado |
| 360 × 800 | PASS | Menor viewport sem texto cortado ou overflow horizontal |

Em todas as sete larguras, `document.documentElement.scrollWidth <= innerWidth`. A validação foi feita na aplicação real com emulação de viewport pelo navegador; não foi usado `overflow-x: hidden` para mascarar problemas.

## Validação funcional — Onda B
- Navegação `Home`, `Projetos`, `Sobre` e `Contato`: PASS; todos os fragments existem e os cliques atualizam o hash corretamente.
- Menu mobile: PASS para abrir, fechar após navegação e fechar por `Escape` com retorno de foco.
- Copiar e-mail: PASS com interação real no navegador e feedback `E-mail copiado.` / `Copiado`.
- Currículo: arquivo local existente, PDF válido, 1 página, 130216 bytes.
- Links: AWX `200`, Galerows web `200`, Galerows GitHub `200`, GitHub pessoal `200`. LinkedIn retornou `999` ao probe automatizado, comportamento de proteção anti-bot do serviço; URL usada é a mesma referência pública já existente no portfólio.
- Console em 1440 × 900: zero `Runtime.exceptionThrown` e zero logs em nível `error`.
- Auditoria HTML local: zero IDs duplicados, zero anchors aninhados, zero fragmentos sem destino, zero assets locais ausentes e zero `_blank` sem `noopener noreferrer`.
- `git diff --check`: PASS.

## Arquivos funcionais da Onda B
- `index.html`
- `CSS/content.css` — novo
- `js/navigation.js` — novo
- `js/copiarEcolar.js`
- `Imagens/awx_preview.png` — screenshot real do produto público
- `Imagens/galerows_preview.png` — screenshot real do produto público

## Commit funcional da Onda B
- `e01e44917eae66a52f870ae442645a38d5cbdd69` — `feat: present current professional portfolio`

## Findings e riscos residuais após Onda B
- O arquivo do currículo continua com nome legado `Curriculo_Renan_Analista_25.pdf`; o conteúdo não foi alterado nesta onda.
- A resposta HTTP automatizada do LinkedIn é `999`; o destino deve continuar sujeito a validação manual/publicada por causa da proteção anti-bot do serviço.
- CSS e arquivos de Swiper legados permanecem fisicamente no repositório, porém deixaram de ser referenciados pela página principal; limpeza ampla não é necessária para a Onda B.
- Preloader completo, `prefers-reduced-motion`, auditoria de performance e SEO permanecem deliberadamente para a Onda C.

## Revisão do orquestrador — Onda B
Revisão independente concluída em 2026-09-30:
- comparação Git confirmou 2 commits à frente da baseline da Onda B, 0 atrás;
- branch local e remota sincronizadas em `8c73f2abad1f9c8c6a62850011fce176f5ccdf9f`;
- working tree limpa;
- diff consolidado compatível com as Fases 4, 5 e 6;
- exatamente 3 case studies principais presentes na página;
- revisão visual independente realizada em desktop e mobile nas seções Hero, Projetos, Sobre/Stack e Contato;
- em 390 px, `document.documentElement.scrollWidth === innerWidth`;
- menu mobile revalidado: `aria-expanded` muda `false → true → false` e `Escape` devolve o foco ao botão;
- findings de Hamburgueria e Direction Pack deixaram de impactar o portfólio porque os projetos foram removidos da vitrine;
- nome legado do PDF, resposta automatizada `999` do LinkedIn e assets Swiper não referenciados permanecem como riscos residuais não bloqueantes.

**Onda B aprovada.**

## Onda C — Baseline inicial
- Branch: `refresh/portfolio-2026`.
- HEAD/origin inicial: `a5abc32d81fac65752b3ef6507b4b61ac3aaf0b8`.
- Ahead/behind inicial: `0/0`.
- Working tree inicial: limpa.
- `AGENTS.md` e `docs/portfolio-refresh/00–06` foram relidos integralmente antes da primeira alteração.

## Fase 7 — Motion
- O preloader foi removido por completo: markup, `CSS/Loading.css` e `js/preload.js`. Não havia recurso real que exigisse espera antes da UI.
- Foram preservados o React giratório e as entradas curtas do hero em movimento normal.
- `CSS/Animações.css` foi reduzido aos keyframes efetivamente usados; animações legadas de preload, vibração, tremor, pisca e digitação foram removidas.
- `prefers-reduced-motion: reduce` desativa rotação contínua do React e animações de entrada, muda o scroll para `auto` e remove transições não essenciais.
- Emulação real de reduced motion em 1440 × 900 e 390 × 844 confirmou `animation-name: none`, conteúdo visível e menu mobile funcional.

## Fase 7 — Performance
- Inventário confirmou que Swiper não era mais referenciado por `index.html` nem pelos arquivos carregados.
- Removidos com evidência de não uso: `CSS/slide.css`, `CSS/swiper-bundle.min.css`, `js/SliderJs/script.js`, `js/SliderJs/swiper-bundle.min.js` e o source map CSS legado.
- `CSS/style.css` foi reduzido à base global efetivamente utilizada, eliminando seletores de projetos/Sobre/contato já substituídos na Onda B.
- CSS local carregado caiu de 30.669 para 18.176 bytes (-12.493; ~40,7%). JS local carregado caiu de 3.044 para 2.839 bytes ao remover o script de preload.
- Os dois screenshots de projetos foram redimensionados de 1280 × 720 PNG para 960 × 540 JPEG com inspeção visual: 554.538 → 214.563 bytes (~61,3% menor).
- AWX, Galerows e foto profissional recebem dimensões intrínsecas; imagens abaixo da primeira dobra usam `loading="lazy"` e `decoding="async"`. O React do hero permanece eager.
- Google Fonts deixou de usar dois `@import` seriais dentro do CSS e passou a um único stylesheet no `<head>`, com `preconnect` para `fonts.googleapis.com` e `fonts.gstatic.com`.
- Medição local pós-ajuste em 1440 × 900 observou 193.552 bytes de transferência inicial de recursos listados pelo navegador; Galerows e foto profissional não foram solicitados na primeira dobra por lazy loading.

## Fase 7 — Acessibilidade
- Adicionado skip link `Pular para o conteúdo` e landmark `main` único.
- O heading principal agora é `h1` em `Renan Xavier.`; a hierarquia segue por `h2`, `h3` e `h4` sem saltos estruturais relevantes.
- Logo deixou de usar `h1` decorativo. Hero usa introdução textual + `h1` sem alterar a composição visual.
- Todas as 5 imagens possuem `alt`; imagens decorativas do logo/React usam `alt=""` e screenshots/foto usam descrições factuais.
- Foco continua explícito em links/botões; o menu mobile mantém botão de 44 × 44 px, `aria-expanded`, `aria-controls` e label dinâmico.
- Teste real de teclado: primeiro `Tab` alcança skip link; `Enter` move foco para o `main`; no mobile `Enter` abre o menu, `Tab` chega a `Home` e `Escape` fecha o menu devolvendo foco ao botão.
- Cor pequena de eyebrow foi ajustada para `#b45bea`, mantendo a paleta e elevando contraste sobre o fundo escuro para ~5,13:1. Foco ciano sobre azul profundo fica acima de 9:1.
- Menu, copiar e-mail, currículo e CTAs continuam acessíveis por elementos nativos.

## Fase 8 — SEO e apresentação externa
- Title: `Renan Xavier — Desenvolvedor Full Stack`.
- Meta description factual, `robots=index, follow` e `theme-color=#070335` adicionados.
- URL canônica confirmada por GitHub Pages e por HTTP 200: `https://xavierrlx.github.io/portfolio/`.
- Open Graph implementado com type, locale, title, description, url e imagem absoluta.
- Twitter Card `summary_large_image` com title, description e imagem absoluta.
- Criado `Imagens/portfolio-og.png` (1200 × 630) a partir de screenshot real do hero aprovado; nenhuma funcionalidade fictícia foi representada.
- JSON-LD `Person` válido contém somente nome, cargo, URL pública, GitHub e LinkedIn.
- Favicon foi declarado corretamente como PNG.
- O LinkedIn permanece com a URL pública existente; probe automatizado continua retornando HTTP 999 por proteção anti-bot.

## Currículo
- O arquivo foi renomeado para `Imagens/Curriculo_Renan_Xavier.pdf` e o link atualizado.
- SHA-256 antes/depois permaneceu idêntico (`5cc51abdd91a4f976523568a9b380447b76c735cd0d94af9b4642d6cb6990844`), comprovando que o conteúdo do PDF não foi modificado.
- PDF validado: 1 página, 130216 bytes.

## Validação visual — Onda C
| Viewport | Resultado | Observação |
|---|---|---|
| 1440 × 900 | PASS | Hero e composição desktop preservados |
| 1280 × 800 | PASS | Sem regressão ou overflow |
| 1024 × 768 | PASS | Hero e conteúdo intermediário estáveis |
| 768 × 1024 | PASS | Tablet portrait preservado |
| 430 × 932 | PASS | Menu mobile e hero sem clipping |
| 390 × 844 | PASS | Sem overflow horizontal |
| 360 × 800 | PASS | Menor viewport continua íntegra |

Em todas as sete viewports, `document.documentElement.scrollWidth <= innerWidth`. Reduced motion também foi capturado visualmente em desktop/mobile sem regressão de layout.

## Validação funcional/técnica — Onda C
- Console: zero `Runtime.exceptionThrown` e zero logs em nível `error`.
- Auditoria HTML: zero IDs duplicados, zero anchors aninhados, zero fragments internos sem destino, zero assets locais ausentes e zero `_blank` sem `noopener noreferrer`.
- Navegação mobile: abrir/fechar, seleção de seção e `Escape` com retorno de foco — PASS.
- Copiar e-mail — PASS com feedback `E-mail copiado.` / `Copiado`.
- JavaScript desabilitado em 390 × 844: hero, projetos, Sobre e Contato permanecem no DOM e visíveis; menu básico fica exposto, toggle progressivo some e não há overflow.
- SEO DOM: uma description, um canonical, um conjunto OG, um conjunto Twitter e um JSON-LD sintaticamente válido; URLs públicas absolutas onde exigidas; OG local existe.
- Links: canonical `200`, AWX `200`, Galerows web `200`, Galerows GitHub `200`, GitHub pessoal `200`; LinkedIn `999` automatizado conforme limitação conhecida.
- `git diff --check`: PASS antes do commit funcional.

## Commit funcional da Onda C
- `f48248fb82a44884e32e09dabb203f246ee137fe` — `perf: streamline portfolio delivery and metadata`.

## Findings e riscos residuais após Onda C
- LinkedIn continua não validável por probe HTTP comum devido ao `999`; sintaxe/href permanecem corretos e o link não foi removido.
- A imagem OG passa a existir na URL pública absoluta somente após o release da branch atual em Pages; o asset local foi validado em 1200 × 630.
- `_config.yml` e imagens históricas não referenciadas foram mantidos por cautela; não foi feita limpeza ampla fora do escopo comprovado.
- Lighthouse não foi instalado nem usado como gate; as evidências principais são inventário real de recursos, tamanho dos assets, browser runtime e validação visual.
- QA final publicado, comparação cross-device final e release permanecem para a Onda D.

## Próximo passo
**PARAR após esta Onda C.**

O próximo ciclo é a **ONDA D — Fechamento (Fases 9 e 10)**, somente após aprovação explícita do orquestrador.

Nenhum merge em `main` foi realizado ou autorizado neste fechamento.
