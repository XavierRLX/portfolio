# Portfolio Experience 2026 — Design, conteúdo, motion e QA

## Baseline e isolamento

- Repositório: `XavierRLX/portfolio`.
- Baseline atual escolhido: `motion/portfolio-premium`, commit `8721bc2`; aproveitada a exploração visual anterior.
- Branch desta etapa: `feat/portfolio-experience-20261028`.
- `main` e GitHub Pages **não alterados** nesta etapa.
- O refresh de setembro está encerrado e segue como histórico canônico em `docs/portfolio-refresh/`. Este documento inaugura uma evolução visual posterior.

## Direção visual aprovada para implementação

- Preservar marca X AVIER, React em rotação, base azul profunda/roxo e transição orgânica de seções.
- Evoluir para apresentação editorial: tipografia Space Grotesk + Manrope + DM Mono; contraste, espaço negativo e acentos discretos em lilás/ciano.
- Projetos organizados por importância, com AWX destacado, BioPlaca/BioSites, Galerows, Cursos Pugliese e Maria Thereza.
- Cards contêm problema, tecnologias, diferenciais técnicos opcionais (`details`) e CTA coerente; sem números de negócio inventados.
- Desktop: grid assimétrico e cards em duas colunas. Mobile: trilha horizontal com scroll-snap nativo, swipe e botões. Seção de princípios também é explorável por swipe.
- Sobre compacto, com retrato e stack recolhível; contato direto e rodapé reduzido.

## Assets — proveniência

- `Imagens/awx_preview.jpg`: captura já presente no portfólio.
- `Imagens/bioplaca_real.jpg`: screenshot da rota pública `https://qr-code-new-link.vercel.app/demo`.
- `Imagens/pugliese_real.jpg`: screenshot da home pública `https://pugliesecursos.com.br/`.
- `Imagens/maria_real.jpg`: screenshot da home pública `https://maria-thereza-enfermagem.pages.dev/`.
- `Imagens/galerows_preview.jpg`: screenshot da landing do Galerows servida localmente no repo existente; mockup exibido é da aplicação.
- `Imagens/renan_perfil.jpeg`: retrato já presente no repositório.

As capturas são imagens reais; não divulgar a interface pública como acesso a funcionalidades privadas, nem apresentar mockups como screenshots diretas de áreas autenticadas.

## Skills e referências adotadas

- Skills oficiais `greensock/gsap-skills`: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`. Referência: https://github.com/greensock/gsap-skills.
- Web APIs nativas: CSS Scroll Snap, IntersectionObserver, requestAnimationFrame, HTML details/summary e prefers-reduced-motion.
- QA visual: Playwright (navegador Chrome real) com viewports desktop, tablet, mobile e viewport reduzida.
- Superpowers não é dependência de runtime e não foi usado para gerar componentes.
- Não adotar WebGL/Three.js ou pinning agressivo sem caso de uso mensurável; dispositivos mobile devem manter rolagem, touch e autonomia.

## Decisões técnicas

1. **Sem reescrita em React.** O portfólio é estático, conteúdo fixo, baixo custo operacional e sem justificativa para hydration.
2. **Sem scroll-jacking.** Scroll vertical nativo; ScrollTrigger apenas para progressão de revelações/parallax leve.
3. **Sem efeitos na renderização crítica.** Toda a interface está no HTML mesmo sem JavaScript/GSAP. A falha do CDN não oculta conteúdo.
4. **Controle do toque.** Scroll Snap horizontal, event listeners passivos, `touch-action: manipulation` em ações, e botões alternativos.
5. **Ler antes de expandir.** `details` conserva o contexto técnico disponível sem transformar cada projeto em um painel enorme.
6. **Animações contidas.** Apenas transform/opacity, sem animar layout; `prefers-reduced-motion` desliga o efeito contínuo.

## Plano de validação

- Larguras: 1440 × 900, 768 × 1024, 390 × 844 e 360 × 800.
- Checks: sem overflow global; 5 projetos; imagens reais decodificam; zero erros de JS; IDs/anchors válidos; links externos seguros.
- Acessibilidade: menu mobile, Escape, carousel por botões, details por teclado, reduced motion, conteúdo com JS desabilitado.
- Visual: hero desktop e mobile, card AWX, sobre, contato, contraste, captura final real.
- Publicação somente após revisão humana da branch e aprovação para integrar `main`.

## Próximas evoluções opcionais

- Página individual de case técnico para 2–3 projetos, só se houver conteúdo suficiente.
- Medição Lighthouse/Core Web Vitals em Preview com cache e rede móvel reais.
- Vídeos ou motion-covers próprios dos projetos, somente quando substituírem informação estática com benefício claro.

## Evidência de QA — 2026-10-28

QA local executado via Playwright + Chrome real (headless), com revisão visual por screenshot de página completa.

| Cenário | Resultado |
| --- | --- |
| Desktop 1440 × 900 | PASS — 1440 px scrollWidth, sem overflow |
| Tablet 768 × 1024 | PASS — 768 px scrollWidth |
| Mobile 390 × 844 | PASS — 390 px scrollWidth, carousel com CSS snap nativo |
| Mobile estreito 360 × 800 | PASS — 360 px scrollWidth, sem cortes |
| Projetos | PASS — 5 casos, todas as imagens decodificadas |
| Âncoras internas | PASS — todos os destinos existem |
| IDs e links externos | PASS — zero IDs duplicados; noopener em todos os links externos com target blank |
| Menu mobile | PASS — abre e fecha, Escape funciona |
| Carousel | PASS — botão avança de 01/05 para 02/05 |
| Falhas de JavaScript | PASS — zero exceções detectadas |
| JavaScript desligado | PASS — hero e cinco projetos acessíveis, dock mobile visível e sem overflow |
| Movimento reduzido | PASS — CSS de animações reduz para 0.01ms e scroll-behavior auto |

Evidências visuais locais: /tmp/portfolio-qa/final-{desktop,tablet,mobile,narrow}.png.
Os arquivos de QA foram mantidos somente no computador local; não há segredos nem credenciais nas capturas publicadas.

Nota: métricas de carregamento web, auditoria Lighthouse detalhada e comparação entre navegadores devem ser confirmadas antes do release de produção. Esta inspeção demonstra qualidade funcional e visual, não métricas de negócio.
