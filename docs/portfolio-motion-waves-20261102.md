# Motion, carrosséis e ondas — revisão de 02/11/2026

## Diagnóstico da regressão

- A abertura anterior usava exclusivamente GSAP em `intro-motion.js` e `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; sem CDN ela não era executada. Em medições do Chrome local, o título já se aproximava da posição final em menos de 1 segundo, e a digitação ficava quase completa em aproximadamente 1,5 segundo.
- A preferência de movimento reduzido desativava corretamente os movimentos; isso deve continuar sendo respeitado, sem opção de forçar movimento.
- A nova intro é um aprimoramento nativo e independente do CDN, executado antes dos scripts remotos. O texto completo permanece no HTML e a digitação apenas substitui sua representação visual, sem mudanças de layout ou duplicação para leitores de tela.

## Implementação

- **Abertura confiável:** Web Animations API (transform e opacity) para header, título, CTAs e ilustração. Tempo de chegada maior e consistente, sem bloquear conteúdo; texto visual digitado usando requestAnimationFrame por aproximadamente 2,6 segundos, com conteúdo original restaurado ao terminar. Suporta interrupção imediata ao ativar reduced motion, deep links e aba inicialmente oculta.
- **Slides/cases:** módulo `js/project-motion.js`, orquestrado com GSAP: desktop revela os três cards de cada carrossel em cascata; no mobile cada novo card visível apresenta imagem com pequena aproximação lateral e texto por opacidade. Não se animam o contêiner de scroll, as cartas clonadas, os links focados nem o transform de escala da navegação. Scroll e controles continuam nativos.
- **Ondas:** quatro divisas SVG (hero → projetos, projetos → processo, processo → sobre, sobre → contato). Cada uma usa camadas de caminho longo e repetido, deslizando lentamente em sentidos opostos para um movimento de água. O preenchimento é a cor da seção seguinte; há uma crista ciano muito discreta. Movimento CSS de `transform` (18 s / 27 s), sem canvas, vídeo ou Three.js.
- **Responsividade:** SVGs dimensionados por largura real, sem overflow, com altura reduzida e menor brilho de crista no mobile. A rotação do React, os seis cases, dois carrosséis e o modal de bastidores foram preservados.
- **Acessibilidade e falhas:** conteúdo permanece visível sem JavaScript/GSAP; wave e animações de projeto são estáticas com prefers-reduced-motion. Cópia de texto, navegação de teclado, swipe e foco têm testes mantidos.

## Skills e escolhas

- GSAP Core (greensock/gsap-skills/gsap-core) para `fromTo`, contextos de media query e limpeza;
- GSAP ScrollTrigger para revelações de seções existentes, sem pinning nem scroll-jacking;
- GSAP Performance para deslocamentos por `transform`, texto por opacidade, direção de entrada com `stagger`, e mínimo de elementos animados simultaneamente;
- GSAP Timeline para composição das duas fases dentro do card, com timelines curtas.
- WAAPI é intencionalmente usado apenas na abertura, antes da disponibilidade do CDN. Nenhum framework, plugin premium ou dependência foi instalado.

## QA

- `tests/portfolio-entrances-waves.cjs`: verifica a digitação real com e sem GSAP, quatro divisores no DOM visível, movimento de caminhos SVG, entrada desktop/mobile nos cards e reduced motion.
- `tests/portfolio-ui.cjs`: mede clipping após a animação terminar. Adicionado padding interno ao marcador '+' das descrições técnicas para permanecer dentro do card durante a rotação.
- Demais suítes preservadas: acessibilidade axe, hero 3D/typing/reduced-motion, interação cinética do React e contato.
- Evidências: `/tmp/portfolio-waves-20261102/`. Publicação remota e merge na `main` não autorizados nesta etapa.

## Limites

Validação automatizada ocorre no Chrome conectado. Dispositivos físicos Android/iOS, Safari real, rede móvel e Lighthouse não são inferidos a partir desses testes.

## Resultado final verificado

- 10/10 cenários de `tests/portfolio-ui.cjs` aprovados, incluindo 360, 390, 430, 768, 1024, 1280, 1440 px, sem JS, sem CDN e movimento reduzido.
- 8/8 auditorias `axe` aprovadas para o conteúdo principal e as três abas de bastidores em desktop e mobile.
- `tests/portfolio-intro-motion.cjs`: abertura, digitação, cubo 3D e mudança dinâmica para reduced motion aprovados.
- `tests/portfolio-react-interaction.cjs`: três níveis, retorno automático, teclado, no-JS/no-CDN e reduced motion aprovados.
- `tests/portfolio-contact.cjs`: 4 cenários de cópia e navegação por teclado aprovados.
- `tests/portfolio-entrances-waves.cjs`: desktop/mobile, quatro ondas nos pais corretos, drift SVG real, entrada dinâmica por slide e fallback sem GSAP aprovados.
- `node --check`, `git diff --check` e disponibilidade HTTP 200 no preview local confirmados.
- Os movimentos foram medidos em Chrome real. Não se atribui a mesma garantia a Safari ou aparelhos físicos sem testes próprios.
