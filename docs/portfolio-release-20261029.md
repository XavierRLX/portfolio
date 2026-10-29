# Release do portfólio — 29/10/2026

## Autorização e baseline

O proprietário aprovou a avaliação local e autorizou explicitamente colocar a versão em produção. A autorização inclui integrar e publicar a versão aprovada, substituindo a restrição anterior de não fazer merge, push ou deploy nesta etapa.

- Repositório: `XavierRLX/portfolio`.
- Conteúdo aprovado: `d2dcf31451f416264f06a2eebd6de62a9bc7af86`.
- Branch de implementação preservada: `codex/portfolio-backoffice-cases-20261029`.
- `main` local e remota antes do release: `6c926cc25a390ed3c259538fffd4ca15f73cfc84`.
- Working tree limpa; `main` é ancestral do conteúdo aprovado, sem mudanças paralelas ou conflitos.
- GitHub Pages confirmado por API autenticada: build legado, `main`, pasta raiz `/`.
- URL: https://xavierrlx.github.io/portfolio/.

## Gate pré-publicação

- Relatório aprovado em `docs/qa/backoffice-20261029/report.json`: dez cenários Playwright/Chrome e oito auditorias axe sem violações detectadas.
- Sintaxe dos controladores ativos revalidada com `node --check` e diff sem problemas de whitespace.
- Nenhum arquivo de credenciais, `.env` ou chave privada adicionado ao diff de release. Mídia administrativa usa dados fictícios; repositórios de origem não são publicados ou modificados.
- Nenhuma alteração funcional após a aprovação: somente registro documental desta autorização.

## Integração e validação

- Integração concluída: `git merge --ff-only`, de `6c926cc` para `4314baa2bd2fe9d89b3fb3864dc5b01f2c9742c0`.
- Push normal para `origin/main` confirmado; sem force push, conflitos ou exclusão de branches.
- GitHub Pages: build `built`, commit `4314baa`, sem mensagem de erro. Conclusão em 29/10/2026 às 01:05:21, horário de São Paulo.
- HTML e 26 assets referenciados no site retornaram HTTP 200 e SHA-256 idêntico aos arquivos locais da versão publicada. Inclui CSS/JS, imagens administrativas, QR/arte, favicon, imagem OG e currículo PDF.
- A documentação de fechamento não modifica HTML, CSS, JavaScript ou mídia da versão aprovada.

## QA no site publicado

Os testes foram executados contra `https://xavierrlx.github.io/portfolio/`, usando Chrome e Playwright:

- Dez cenários passaram: 1440, 1280, 1024, 768, 430, 390 e 360 px; JavaScript desligado; GSAP bloqueado; movimento reduzido inicial com resize.
- Dois carrosséis independentes/empilhados, swipe circular em ambos os sentidos, pausa de toque, cliques rápidos, teclado, imagens, ausência de overflow, erros de console e assets locais com falha.
- Painel de bastidores: BioPlaca/AWX/Pugliese, quatro etapas de produção, detalhes expansíveis, foco contido, Escape, restauração do fundo e suporte a movimento reduzido.
- Oito auditorias axe (principal e três abas, desktop/mobile) sem violações detectadas nas regras selecionadas.
- Capturas públicas desktop e mobile revisadas visualmente.

Relatório versionado: [produção](qa/production-20261029/report.json). Capturas: [desktop](qa/production-20261029/desktop.png), [bastidores mobile](qa/production-20261029/mobile-backoffice.png). Demais evidências: `/tmp/portfolio-release-20261029/browser/`.

**Release concluído e validado.** A branch de implementação permanece preservada. Nenhum projeto ou banco de origem foi modificado.
