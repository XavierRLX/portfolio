# Renan Xavier — Portfolio Experience 2026

Portfólio autoral de um Desenvolvedor Full Stack. Versão **Experience**, com direção visual editorial, cases reais e navegação orientada a mobile/touch.

> **Status desta etapa:** implementação em branch isolada `feat/portfolio-experience-20261028`. A publicação via GitHub Pages permanece em `main` até aprovação/merge.

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

## Princípios de experiência

1. **Conteúdo primeiro.** Informações críticas não dependem de JS, preloaders ou animações.
2. **Menos scroll no mobile.** Cards exploráveis por swipe + botões de avançar/voltar; detalhes técnicos em disclosures nativos.
3. **Motion progressivo.** GSAP 3.13 e ScrollTrigger via CDN apenas para aprimorar. Sem dependência funcional nem scroll-jacking.
4. **Acessibilidade.** Foco visível, links semânticos, texto alternativo, controle por teclado e `prefers-reduced-motion`.
5. **Imagens fiéis.** Capturas das páginas públicas e do projeto Galerows real, não imagens geradas como se fossem screenshots.

## Desenvolvimento local

```bash
python3 -m http.server 8000
# http://localhost:8000
node --check js/experience.js
node --check js/navigation.js
git diff --check
```

Na publicação: validar screenshots, viewport 360–1440 px, navegação mobile, botões, disclosures, links, redução de movimento e carregamento de imagens em diferentes conexões.

Site atual em produção: https://xavierrlx.github.io/portfolio/
