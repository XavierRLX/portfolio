# Renan Xavier — Portfolio Experience 2026

Portfólio autoral de um Desenvolvedor Full Stack. Versão **Experience**, com direção visual editorial, cases reais e navegação orientada a mobile/touch.

> **Status:** publicado no [GitHub Pages](https://xavierrlx.github.io/portfolio/) em 29/10/2026, após aprovação visual. Versão premium com seis cases e dois carrosséis independentes. Release e QA público em `docs/portfolio-release-20261029.md`.

## Projetos

- **AWX Brasil:** produto automotivo com Next.js, TypeScript, PostgreSQL/Supabase, RLS e Capacitor.
- **BioPlaca + BioSites:** solução de placas QR/NFC, avaliações e presença digital para comerciantes locais. [Demonstração](https://qr-code-new-link.vercel.app/demo).
- **Galerows:** coleção de jogos sociais mobile com React, TypeScript, Capacitor e multiplayer LAN. [Repositório](https://github.com/XavierRLX/Galerows).
- **Cursos Pugliese:** plataforma educacional full stack com papéis, autorização e segurança. [Site](https://pugliesecursos.com.br/).
- **Maria Thereza:** landing page editorial de Enfermagem e Home Care com vídeo ativado por rolagem. [Site](https://maria-thereza-enfermagem.pages.dev/).

- **Engenharia & Backoffice:** case transversal com interfaces administrativas BioPlaca, AWX e Pugliese; componentes reais com dados fictícios, capturados offline. Inclui o fluxo de QR → composição da placa → exportação.

## Arquitetura do portfólio

Mantido em **HTML semântico + CSS moderno + JavaScript**, sem migração de framework desnecessária.

- `index.html`: conteúdo público, cases, navegação e SEO;
- `CSS/experience.css`: design tokens, composição responsiva, sistema de cards e estados reduzidos;
- `js/navigation.js`: menu mobile acessível (Escape, links e clique externo);
- `js/experience.js`: progresso de scroll, navegação ativa e motion progressivo;
- `js/projects.js`: carousel circular nativo, seis cases e dois grupos;
- `js/backoffice.js` + `CSS/backoffice.css`: apresentação modal, abas e sequência de produção;
- `js/copiarEcolar.js`: feedback para copiar e-mail;
- `Imagens/`: capturas reais e imagens dos projetos;
- `docs/portfolio-experience-2026.md`: decisões, referências e QA.
- `docs/portfolio-premium-refinement-2026.md`: refinamento do hero/carousel, skills e evidências.
- `docs/portfolio-backoffice-2026.md`: curadoria verificada, origem da mídia, decisões e QA desta etapa;
- `tests/portfolio-ui.cjs`: QA real com Playwright em sete viewports e cenários de fallback;
- `tests/portfolio-accessibility.cjs`: auditoria opcional com axe nas três abas e no conteúdo principal.

## Princípios de experiência

1. **Conteúdo primeiro.** Informações críticas não dependem de JS, preloaders ou animações.
2. **Menos scroll no mobile.** Dois carrosséis empilhados, cada um com três cases. Desktop mostra os três cards por faixa; mobile/tablet usam swipe circular, card central, vizinhos parciais e controles próprios. Buffers visuais inertes mantêm somente seis cases acessíveis.
3. **Motion progressivo.** GSAP 3.13 e ScrollTrigger via CDN apenas para aprimorar. Sem dependência funcional nem scroll-jacking.
4. **Acessibilidade.** Foco visível, links semânticos, texto alternativo, controle por teclado e `prefers-reduced-motion`.
5. **Imagens fiéis.** Capturas das páginas públicas, do Galerows e demonstrações administrativas com componentes reais/dados fictícios. Origem e limitações identificadas no case.

## Desenvolvimento local

```bash
python3 -m http.server 8016 --bind 127.0.0.1
# http://127.0.0.1:8016
node --check js/experience.js
node --check js/navigation.js
node --check js/projects.js
node --check js/backoffice.js
git diff --check
```

Para repetir o QA com Chrome instalado, sem adicionar dependências de produção:

```bash
npm install --prefix /tmp/xavier-playwright playwright@1.62.1 @axe-core/playwright@4.14.0
PLAYWRIGHT_MODULE=/tmp/xavier-playwright/node_modules/playwright node tests/portfolio-ui.cjs
PLAYWRIGHT_MODULE=/tmp/xavier-playwright/node_modules/playwright AXE_MODULE=/tmp/xavier-playwright/node_modules/@axe-core/playwright node tests/portfolio-accessibility.cjs
```

O servidor precisa estar ativo. `PORTFOLIO_URL` e `QA_OUTPUT` podem substituir a URL e o diretório de evidências; por padrão, screenshots e `results.json` ficam em `/tmp/portfolio-backoffice-qa/stacked-final`.

Na publicação: validar screenshots, viewport 360–1440 px, navegação mobile, botões, disclosures, links, redução de movimento e carregamento de imagens em diferentes conexões.

Site atual em produção: https://xavierrlx.github.io/portfolio/
