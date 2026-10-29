# Renan Xavier — Portfolio Experience 2026

Portfólio autoral de um Desenvolvedor Full Stack. Versão **Experience**, com direção visual editorial, cases reais e navegação orientada a mobile/touch.

> **Status desta etapa:** refinamento premium em `codex/portfolio-premium-refinement-20261028`, derivado de `feat/portfolio-experience-20261028` (`efce7c3`). Pronto para avaliação local após QA; publicação permanece em `main` até aprovação/merge.

## Projetos

- **AWX Brasil:** produto automotivo com Next.js, TypeScript, PostgreSQL/Supabase, RLS e Capacitor.
- **BioPlaca + BioSites:** solução de placas QR/NFC, avaliações e presença digital para comerciantes locais. [Demonstração](https://qr-code-new-link.vercel.app/demo).
- **Galerows:** coleção de jogos sociais mobile com React, TypeScript, Capacitor e multiplayer LAN. [Repositório](https://github.com/XavierRLX/Galerows).
- **Cursos Pugliese:** plataforma educacional full stack com papéis, autorização e segurança. [Site](https://pugliesecursos.com.br/).
- **Maria Thereza:** landing page editorial de Enfermagem e Home Care com vídeo ativado por rolagem. [Site](https://maria-thereza-enfermagem.pages.dev/).

## Arquitetura do portfólio

Mantido em **HTML semântico + CSS moderno + JavaScript**, sem migração de framework desnecessária.

- `index.html`: conteúdo público, cases, navegação e SEO;
- `CSS/experience.css`: design tokens, composição responsiva, sistema de cards e estados reduzidos;
- `js/navigation.js`: menu mobile acessível (Escape, links e clique externo);
- `js/experience.js`: progresso de scroll, navegação ativa, carousel nativo e motion progressivo;
- `js/copiarEcolar.js`: feedback para copiar e-mail;
- `Imagens/`: capturas reais e imagens dos projetos;
- `docs/portfolio-experience-2026.md`: decisões, referências e QA.
- `docs/portfolio-premium-refinement-2026.md`: refinamento do hero/carousel, skills e evidências.
- `tests/portfolio-ui.cjs`: QA real com Playwright em sete viewports e cenários de fallback.

## Princípios de experiência

1. **Conteúdo primeiro.** Informações críticas não dependem de JS, preloaders ou animações.
2. **Menos scroll no mobile.** Carousel finito com card central, vizinhos parciais e swipe nativo; dois cards no desktop, controles de 44 px e detalhes técnicos recolhíveis.
3. **Motion progressivo.** GSAP 3.13 e ScrollTrigger via CDN apenas para aprimorar. Sem dependência funcional nem scroll-jacking.
4. **Acessibilidade.** Foco visível, links semânticos, texto alternativo, controle por teclado e `prefers-reduced-motion`.
5. **Imagens fiéis.** Capturas das páginas públicas e do projeto Galerows real, não imagens geradas como se fossem screenshots.

## Desenvolvimento local

```bash
python3 -m http.server 8016 --bind 127.0.0.1
# http://127.0.0.1:8016
node --check js/experience.js
node --check js/navigation.js
git diff --check
```

Para repetir o QA com Chrome instalado, sem adicionar dependências de produção:

```bash
npm install --prefix /tmp/xavier-playwright playwright@1.62.1
PLAYWRIGHT_MODULE=/tmp/xavier-playwright/node_modules/playwright node tests/portfolio-ui.cjs
```

O servidor precisa estar ativo. `PORTFOLIO_URL` e `QA_OUTPUT` podem substituir a URL e o diretório de evidências; por padrão, screenshots e `results.json` ficam em `/tmp/portfolio-refinement-qa/final`.

Na publicação: validar screenshots, viewport 360–1440 px, navegação mobile, botões, disclosures, links, redução de movimento e carregamento de imagens em diferentes conexões.

Site atual em produção: https://xavierrlx.github.io/portfolio/
