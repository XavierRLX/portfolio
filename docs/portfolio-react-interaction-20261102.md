# React cinético — hero interativo

## Direção visual
- O átomo React é a única interação decorativa do hero. Três níveis de impulso aumentam a escala do núcleo e o giro contínuo, enquanto os dois painéis recuam e a órbita se expande discretamente.
- Impulsos: 1 → 1,12× / 3× velocidade; 2 → 1,21× / 7×; 3 → 1,28× / 16×. No terceiro nível, a rotação completa leva aproximadamente 3 segundos (em vez de 48 segundos no modo original). Quatro segundos sem interação reiniciam o modo normal com transição suave. Cliques subsequentes no limite renovam o tempo, sem aceleração descontrolada.
- A marca React continua SVG existente; nenhuma imagem externa foi gerada. O botão real, focável, ativa por toque, Enter ou Espaço, com descrição e estado anunciado a leitor de telas.
- O botão começa disabled no HTML. Se o CDN GSAP ou JavaScript não carregar, o React mantém a rotação CSS original, mas não oferece uma falsa interação.
- Em prefers-reduced-motion, toque muda apenas a escala instantânea e reposiciona painéis; a rotação é interrompida. Alterações da preferência durante a sessão são tratadas com GSAP matchMedia e limpeza.
- Quando o hero sai da viewport ou a aba fica oculta, o GSAP pausa a rotação, retomando sem reiniciar o ângulo. Não altera layout nem navegação dos dois carrosséis.

## Base técnica e referências
- GSAP core e performance: um tween de rotação contínua com ajuste de timeScale, em vez de reiniciar uma animação a cada clique; transform e opacity em vez de width, height, top ou left. Referências: https://github.com/greensock/gsap-skills/blob/main/skills/gsap-core/SKILL.md e https://github.com/greensock/gsap-skills/blob/main/skills/gsap-performance/SKILL.md.
- Princípio de direção visual: interatividade com resposta clara e poucos elementos, sem Three.js neste caso. O React é uma SVG leve, e o efeito cinético não requer WebGL.
- Os níveis permanecem dentro da composição em 360, 390 e 1440 px, sem overflow global, e preservam as informações do hero.

## QA
- tests/portfolio-react-interaction.cjs: clique e Enter, limite de 3 níveis, timeScale real, reset após inatividade, movimento reduzido e mudança de preferência, ausência de GSAP e de JavaScript.
- Suite geral tests/portfolio-ui.cjs, auditoria axe tests/portfolio-accessibility.cjs, testes tests/portfolio-intro-motion.cjs e tests/portfolio-contact.cjs, preservando resultados pré-existentes. Evidências em /tmp/portfolio-react-interaction-20261102.
- Alterações isoladas na branch feat/portfolio-react-interaction-20261102, sem merge, push nem publicação da main.
