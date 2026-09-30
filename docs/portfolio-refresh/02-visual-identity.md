# Identidade Visual — O que preservar e o que pode evoluir

## Princípio
O refresh deve parecer uma evolução do portfólio existente, não um site novo sem relação com o original.

## Elementos obrigatórios a preservar
- Logotipo `X AVIER` como assinatura visual.
- Base escura com predominância de azul profundo.
- Roxo/azul como cor de destaque.
- React giratório no hero como elemento central de identidade.
- Transição em forma de onda entre o hero e a seção seguinte.
- Sensação de movimento e tecnologia, porém com menos ruído visual.

## Elementos que podem ser simplificados ou removidos
- Ícones decorativos flutuantes de HTML/CSS/JavaScript e `</>` podem ser reduzidos ou removidos se competirem com o conteúdo.
- Animações redundantes podem ser removidas.
- Slider pode ser mantido, simplificado ou substituído se prejudicar leitura ou mobile.
- Preloader bloqueante deve sair; a identidade deve ser preservada por animações de entrada, não por espera artificial.

## Hero desejado
Desktop:
- texto à esquerda;
- React à direita;
- leitura imediata do nome, função e stack principal;
- CTA para projetos e GitHub/LinkedIn;
- onda fechando a primeira dobra.

Mobile:
- logo no topo;
- texto completo sem corte;
- React abaixo ou em posição que não invada texto;
- nenhum elemento deve depender de `left`, `top` ou margem percentual específica para parecer correto;
- CTA alcançável sem zoom ou scroll lateral.

## Tom visual
O portfólio deve comunicar produto e engenharia, não apenas aprendizado de frontend. A estética pode continuar criativa, mas a hierarquia deve ser madura e limpa.

## Restrições técnicas de layout
Evitar como solução principal:
- larguras fixas grandes;
- `position: absolute` para estruturar conteúdo textual;
- margens negativas extensas;
- breakpoints usados para reposicionar manualmente o mesmo elemento;
- `!important` para corrigir responsividade.

Preferir:
- container central com `max-width`;
- Grid/Flexbox;
- `clamp()` para tipografia e espaçamento;
- `min()`, `max()` e unidades relativas;
- `aspect-ratio` para mídia;
- fluxo natural do documento;
- media queries apenas para mudanças reais de composição.

## Animação
- O React pode continuar girando continuamente em velocidade discreta.
- Entradas de texto devem ser rápidas e não impedir leitura.
- Sem JavaScript, todo conteúdo essencial deve permanecer visível.
- Com `prefers-reduced-motion: reduce`, movimentos contínuos e transições relevantes devem ser reduzidos/desativados.

## Critério de preservação
Se uma versão ficar tecnicamente melhor, mas perder a impressão de "este é o portfólio do Xavier", ela não está pronta.
