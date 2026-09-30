# Workflow da IA Executora Visual

## Papel
A IA executora é responsável por implementar a fase ou onda aprovada pelo orquestrador e validar o resultado olhando a aplicação real em navegador.

Ela não decide sozinha mudanças de escopo, migração de stack ou redesign amplo.

## Antes de começar qualquer fase ou onda
1. Ler `AGENTS.md` e todos os documentos de `docs/portfolio-refresh/`.
2. Confirmar branch `refresh/portfolio-2026`.
3. Confirmar working tree limpa.
4. Registrar HEAD e origem.
5. Ler `05-status.md` e executar somente a fase ou onda autorizada. Pode avançar entre fases contíguas pertencentes à mesma onda sem pedir nova aprovação, desde que não exista finding crítico ou mudança de escopo.
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

## Evidência esperada por onda
Ao terminar a onda autorizada, devolver ao orquestrador:
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
Preferir commits por mudança coesa. Uma onda pode conter vários commits; não é necessário parar após cada commit ou fase.

Exemplos:
- `refactor: establish semantic portfolio structure`
- `fix: rebuild responsive hero layout`
- `feat: present current featured projects`
- `refactor: update professional profile and stack`
- `perf: remove blocking portfolio preload`
- `seo: add portfolio social metadata`

Não misturar conteúdo, SEO e refatoração estrutural no mesmo commit sem necessidade.

## Atualização de status
Antes de encerrar a onda, atualizar `05-status.md` com:
- fases concluídas;
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
- Não declarar uma onda concluída com finding visual crítico conhecido ainda aberto.
- Pode corrigir regressões encontradas dentro da própria onda sem solicitar autorização adicional, desde que a correção permaneça dentro do escopo aprovado.
