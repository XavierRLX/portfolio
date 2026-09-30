# Workflow da IA Executora Visual

## Papel
A IA executora é responsável por implementar uma fase aprovada pelo orquestrador e validar o resultado olhando a aplicação real em navegador.

Ela não decide sozinha mudanças de escopo, migração de stack ou redesign amplo.

## Antes de começar qualquer fase
1. Ler `AGENTS.md` e todos os documentos de `docs/portfolio-refresh/`.
2. Confirmar branch `refresh/portfolio-2026`.
3. Confirmar working tree limpa.
4. Registrar HEAD e origem.
5. Ler `05-status.md` e executar somente o próximo passo autorizado.
6. Se houver divergência de baseline ou alterações desconhecidas, parar e reportar.

## Loop obrigatório para mudanças visuais
1. Abrir a aplicação local.
2. Capturar/observar o estado atual da seção.
3. Fazer uma mudança pequena.
4. Recarregar a tela real.
5. Comparar com objetivo visual e verificar regressões.
6. Repetir até satisfazer os critérios da fase.
7. Validar todas as viewports mínimas.
8. Revisar diff antes de commit.

Não aprovar responsividade apenas lendo CSS.

## Viewports mínimas
Validar, no mínimo:
- 1440 × 900 — desktop largo;
- 1280 × 800 — notebook/desktop comum;
- 1024 × 768 — tablet landscape / janela intermediária;
- 768 × 1024 — tablet portrait;
- 430 × 932 — celular grande;
- 390 × 844 — celular comum;
- 360 × 800 — celular estreito.

Se surgir bug entre breakpoints, testar também a largura exata onde ele ocorre.

## O que verificar em todas as viewports
- nenhum overflow horizontal;
- texto sem corte ou sobreposição;
- React sem invadir conteúdo essencial;
- onda sem criar lacunas ou faixas estranhas;
- menu/navegação utilizável;
- cards legíveis;
- CTAs clicáveis e com área adequada;
- imagens sem deformação;
- espaçamento consistente;
- foco de teclado visível;
- conteúdo essencial visível com animações desativadas.

## Evidência esperada por fase
Ao terminar, devolver ao orquestrador:
- baseline inicial da fase: branch, HEAD, working tree;
- arquivos alterados;
- resumo objetivo das mudanças;
- viewports testadas;
- problemas encontrados e como foram resolvidos;
- validações executadas;
- riscos ou pendências;
- commit criado e estado final do working tree;
- screenshots ou descrição visual comparativa quando aplicável.

## Commits
Preferir um commit por fase ou subfase coesa.

Exemplos:
- `refactor: establish semantic portfolio structure`
- `fix: rebuild responsive hero layout`
- `feat: present current featured projects`
- `refactor: update professional profile and stack`
- `perf: remove blocking portfolio preload`
- `seo: add portfolio social metadata`

Não misturar conteúdo, SEO e refatoração estrutural no mesmo commit sem necessidade.

## Atualização de status
Antes de encerrar a fase, atualizar `05-status.md` com:
- fase concluída;
- commit;
- evidências relevantes;
- pendências;
- próximo passo exato.

## Restrições
- Não fazer push para `main`.
- Não mergear sem autorização do orquestrador.
- Não trocar stack por preferência pessoal.
- Não remover elementos de identidade obrigatórios.
- Não esconder bugs com `overflow-x: hidden` sem corrigir a causa.
- Não usar screenshots como substituto de acessibilidade/semântica.
- Não declarar uma fase concluída com finding visual conhecido ainda aberto.
