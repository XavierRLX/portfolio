# Plano de Ação — Início ao Encerramento

## Estratégia
O refresh continuará dividido em fases verificáveis, mas a execução operacional será agrupada em ondas para reduzir burocracia. A ordem das fases continua válida; o orquestrador pode liberar várias fases consecutivas no mesmo ciclo quando o risco estiver controlado.

## Ondas de execução
- **Onda A — Fundação visual:** Fases 1, 2 e 3. Baseline, saneamento estrutural e hero responsivo.
- **Onda B — Conteúdo profissional:** Fases 4, 5 e 6. Projetos, perfil/stack, contato e navegação.
- **Onda C — Qualidade de entrega:** Fases 7 e 8. Motion, performance, acessibilidade e SEO.
- **Onda D — Fechamento:** Fases 9 e 10. QA cross-device, correções finais, release e validação publicada.

O checkpoint obrigatório passa a ocorrer ao final de cada onda, e não necessariamente ao final de cada fase. Findings críticos, regressões ou decisões de redesign interrompem a onda e voltam ao orquestrador.

## Fase 0 — Planejamento e governança
Objetivo: registrar baseline, escopo, identidade visual e método de execução antes de tocar no código.

Critérios de aceite:
- documentação canônica criada;
- branch de trabalho definida;
- nenhuma alteração funcional ou visual realizada.

## Fase 1 — Baseline visual e inventário técnico
Objetivo: capturar o comportamento atual antes de alterar qualquer componente.

A IA executora deve:
- rodar a aplicação localmente;
- registrar screenshots de referência em desktop, tablet e mobile;
- confirmar links e seções existentes;
- listar overflows, cortes, desalinhamentos e comportamentos dependentes de timer;
- registrar arquivos diretamente envolvidos em hero, projetos, sobre, contato e animações.

Gate: não iniciar refatoração antes de a baseline visual estar registrada.

## Fase 2 — Fundação estrutural e semântica
Objetivo: corrigir a base HTML/CSS/JS sem redesenhar o site.

Escopo:
- corrigir anchors aninhados e links inconsistentes;
- remover IDs duplicados;
- usar elementos semânticos adequados para navegação e controles;
- garantir `box-sizing: border-box` global;
- reduzir dependência de estilos inválidos ou frágeis;
- preservar o layout visual tanto quanto possível.

Gate: navegação, links e comportamento existentes continuam funcionais.

## Fase 3 — Hero responsivo
Objetivo: reconstruir a primeira dobra de forma fluida preservando a assinatura visual.

Escopo:
- manter logo `X AVIER`, fundo escuro/azul, React giratório e onda inferior;
- trocar posicionamento rígido por Grid/Flexbox responsivo;
- usar tipografia fluida com `clamp()`;
- impedir overflow horizontal;
- empilhar texto e React de forma natural no mobile;
- tornar a animação não bloqueante;
- remover a necessidade de offsets absolutos por resolução.

Gate visual obrigatório nas viewports definidas em `04-executor-workflow.md`.

## Fase 4 — Projetos em destaque
Objetivo: trocar quantidade por relevância técnica.

Estrutura alvo:
1. AWX / All Wheels Experience
2. Cursos Pugliese / Plataforma-Curso
3. Galerows
4. AI English Coach como projeto opcional de laboratório/open source

Ações:
- retirar do destaque principal projetos introdutórios;
- transformar cards em mini case studies;
- mostrar problema, solução, papel, stack e resultado/capacidade demonstrada;
- fornecer CTAs coerentes: produto, repositório quando público e detalhes técnicos quando aplicável.

Gate: recrutador deve entender em poucos segundos o nível e a amplitude técnica dos três projetos principais.

## Fase 5 — Sobre, experiência e stack
Objetivo: reduzir texto corrido e melhorar escaneabilidade.

Estrutura alvo:
- resumo profissional curto;
- experiência relevante;
- tecnologias agrupadas por Frontend, Backend, Dados, Mobile/Infra e IA;
- currículo como CTA claro.

Gate: conteúdo sem informações obsoletas e consistente com os projetos atuais.

## Fase 6 — Contato e navegação
Objetivo: tornar o fechamento simples e profissional.

Escopo:
- e-mail, LinkedIn e GitHub como canais principais;
- controles reais e acessíveis;
- feedback de copiar contato sem depender de elementos impróprios;
- navegação mobile funcional.

## Fase 7 — Motion, performance e acessibilidade
Objetivo: manter personalidade sem sacrificar UX.

Escopo:
- remover espera artificial do preloader;
- conteúdo deve existir mesmo sem JavaScript;
- usar animações de entrada curtas e progressivas;
- implementar `prefers-reduced-motion`;
- lazy loading onde fizer sentido;
- textos alternativos, foco visível, contraste e navegação por teclado.

## Fase 8 — SEO e apresentação externa
Objetivo: melhorar descoberta e compartilhamento.

Escopo mínimo:
- título profissional;
- meta description;
- Open Graph;
- Twitter Card;
- canonical;
- favicon/theme color;
- JSON-LD `Person` se aplicável.

## Fase 9 — QA visual cross-device
Objetivo: validar o produto completo como usuário final.

Validar:
- desktop largo;
- notebook;
- tablet portrait e landscape;
- celulares estreitos e médios;
- navegação por teclado;
- animações reduzidas;
- links externos;
- ausência de overflow horizontal;
- conteúdo sem cortes ou sobreposições.

Todo finding deve ser registrado antes do fechamento.

## Fase 10 — Release e encerramento
Objetivo: concluir o refresh com evidência.

Checklist final:
- todos os gates anteriores concluídos;
- screenshots finais comparadas com baseline;
- `05-status.md` marcado como concluído;
- README atualizado somente se necessário para refletir o estado final;
- branch revisada e pronta para merge;
- publicação validada após merge/deploy.

## Definição de pronto
O refresh termina somente quando design, conteúdo, responsividade, semântica, acessibilidade básica, performance percebida, SEO e links estiverem validados no site publicado. Build ou ausência de erro de console isoladamente não define conclusão.
