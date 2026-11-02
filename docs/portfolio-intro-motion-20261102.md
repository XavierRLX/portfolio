# Introdução animada e experiência 3D — 02/11/2026

## Escopo e isolamento
- Base: commit 274203c (refinamento premium aprovado para revisão).
- Branch: feat/portfolio-intro-motion-20261102, no worktree portfolio-artdirection-20261102.
- Sem merge na main, push ou publicação. Servidor local existente na porta 8016, acessível na LAN pelo IP do Mac enquanto ligado.

## Solução
- Intro GSAP: cabeçalho vem do alto, títulos do lado esquerdo, ações de baixo e React/miniinterfaces do lado direito. Entradas usando apenas transform/opacity, com trajetória fora dos limites da viewport e chegada ao layout original, sem mexer nas dimensões.
- Digitação: conteúdo integral continua no HTML, em span que reserva o espaço; uma camada visual aria-hidden recebe caracteres com GSAP. Ao terminar ou mudar para movimento reduzido, o texto original volta imediatamente. Sem JS/GSAP o texto está completo.
- Inicialização 3D: cubo CSS com seis faces e perspectiva real, montado com transform-style: preserve-3d, rotaciona uma única vez e desaparece. Trata-se de uma animação de introdução decorativa e NÃO de medição real do progresso de download; não bloqueia conteúdo, clique ou scroll. Sem biblioteca WebGL e sem aumento da carga principal.
- Revelações ao rolar: regiões existentes .reveal vêm lateralmente de fora da tela ou de baixo e voltam à posição natural. A página mantém scroll vertical nativo. Áreas visuais são clipadas nos limites das seções, sem scroll horizontal global.
- Acessibilidade: animações desativadas com prefers-reduced-motion; a troca dessa preferência durante a execução cancela os efeitos e restaura a descrição. Deep links fora do hero pulam a intro.
- Preservei seis cases, dois carrosséis de três, modal de backoffice e todos os controles existentes.

## Testes
- Playwright Chrome tests/portfolio-ui.cjs: 10 cenários aprovados — larguras 1440, 1280, 1024, 768, 430, 390, 360; JS desligado; GSAP bloqueado; reduced motion e resize.
- Axe tests/portfolio-accessibility.cjs: 8 auditorias aprovadas (main e 3 abas do diálogo, desktop e mobile), sem violações detectadas no conjunto de regras selecionado.
- tests/portfolio-contact.cjs: 4 verificações aprovadas — cópia nativa, fallback, falha e teclado nas etapas de produção.
- Novo tests/portfolio-intro-motion.cjs: hero/typing/cubo em 1440, 390, 360 px e mudança para reduced motion durante a intro. Capturas em /tmp/portfolio-intro-20261102/motion-final; suíte geral em /tmp/portfolio-intro-20261102/qa.
- node --check, git diff --check e disponibilidade do servidor LAN verificados.

## Limitações
- QA automatizado em Chrome local, não equivale a teste físico em Android/iPhone ou a uma medição Lighthouse. Se o CDN GSAP não carregar, a entrada dinâmica não roda, mas todo o conteúdo permanece visível; o cubo CSS roda independentemente em movimento normal.
- A animação 3D é propositalmente curta e decorativa. Não há preloader bloqueante, porcentagens simuladas, sincronização com recursos externos nem dependência Three.js.

## Ajuste posterior — navegação mobile

- Removida a navegação fixa inferior (`mobile-dock`), incluindo o HTML, os estilos e as referências JavaScript.
- O header passa a ser o único ponto de navegação mobile; menu expansível mantém Escape, foco e fechamento após seleção. Sem JavaScript, links aparecem no próprio header em duas linhas, com espaço adequado antes do hero.
- Eliminados o espaço artificial no rodapé e o `scroll-padding-bottom` destinado ao antigo dock.
- Suite Playwright atualizada para navegação pelo header. Validado em 360, 390 e 430 px com JavaScript ligado/desligado sem overflow e sem sobreposição no hero; suíte completa de 10 cenários de interface aprovada. Publicação não autorizada nesta etapa.
