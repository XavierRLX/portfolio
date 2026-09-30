# Portfolio Refresh 2026 — Visão Geral

## Objetivo
Atualizar o portfólio de Renan Xavier para representar o nível técnico atual, mantendo a identidade visual construída originalmente à mão em HTML/CSS/JS.

O projeto não é um redesign completo nem uma troca por template. É uma evolução controlada: preservar o que é reconhecível, corrigir fragilidades técnicas e apresentar menos projetos, porém mais fortes.

## Baseline
- Repositório: `XavierRLX/portfolio`
- Branch de origem: `main`
- Baseline inicial: `e541970b34a5a6ab74c085530975a1106a20a9d9`
- Branch de trabalho: `refresh/portfolio-2026`
- Stack atual: HTML5, CSS3, JavaScript, Swiper.js e AOS.
- Publicação atual: GitHub Pages.

## Diagnóstico resumido
A auditoria inicial encontrou quatro grupos principais de melhoria:
1. Responsividade construída com muitos tamanhos rígidos, posições absolutas, margens negativas e correções por breakpoint.
2. Conteúdo do portfólio ainda destaca projetos de aprendizado que já não representam o nível atual.
3. Estrutura HTML possui problemas semânticos, links inconsistentes, IDs duplicados e controles não acessíveis.
4. Preloader e conteúdo dependem de timers artificiais, piorando percepção de performance e robustez.

## Decisão principal
A primeira versão deste refresh permanece em HTML/CSS/JS. Migração para Next.js ou outra stack fica fora do escopo até o refresh estar concluído e avaliado.

## Resultado esperado
Ao final, o portfólio deve:
- continuar visualmente reconhecível como o portfólio original;
- funcionar bem em desktop, tablet e celular sem overflow horizontal;
- apresentar em destaque AWX, Cursos Pugliese e Galerows;
- comunicar experiência Full Stack, backend, dados, mobile, segurança e IA;
- possuir HTML válido, navegação acessível e animações não bloqueantes;
- ter SEO e metadados básicos profissionais;
- ser fácil de manter sem depender de ajustes manuais por resolução.

## Modelo de trabalho
Existem dois papéis:
- **Orquestrador:** define fase, revisa evidências, controla escopo e decide avanço.
- **IA executora visual:** altera código, abre a aplicação, observa telas em tempo real, testa viewports e entrega evidências.

Nenhuma fase é considerada concluída apenas porque o código compila ou parece correto no diff. Mudanças visuais exigem validação no navegador.
