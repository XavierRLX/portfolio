# Portfólio

Site estático de página única com cards de projetos, animações com Swiper/AOS e seção de contato.

## Estrutura
- `index.html`: página principal.
- `CSS/`: estilos (inclui Swiper, animações e loading).
- `js/`: scripts de preload, digitação, cópia e slider (`js/SliderJs` contém o bundle do Swiper).
- `Imagens/`: ícones e imagens usadas na página.

## Rodar localmente
1. Abra `index.html` direto no navegador ou use a extensão Live Server do VS Code.
2. Se preferir via terminal: `npx serve .` e acesse o endereço exibido.

## Publicar no GitHub Pages
1. Suba o código para um repositório GitHub.
2. Em *Settings* → *Pages*, escolha **Deploy from a branch**.
3. Selecione a branch (ex.: `main`) e o diretório `/` (root), salve.
4. Aguarde o build e acesse `https://<seu-usuario>.github.io/<nome-do-repo>/`.

## Observações
- Os caminhos diferenciam maiúsculas/minúsculas (ex.: `CSS/`, `Imagens/`), como no GitHub Pages.
- O arquivo `.nojekyll` impede o processamento do Jekyll e garante que os assets estáticos sejam servidos como estão.
