# Status — Portfolio Refresh 2026

Atualizado em: 2026-09-30

## Estado geral
**PLANEJAMENTO CONCLUÍDO — ONDA A AUTORIZADA**

Nenhum arquivo funcional, CSS, JavaScript, imagem ou conteúdo do site foi alterado nesta etapa. Somente documentação de governança foi preparada na branch de refresh.

## Baseline
- Repositório: `XavierRLX/portfolio`
- Base: `main`
- Commit base: `e541970b34a5a6ab74c085530975a1106a20a9d9`
- Branch de trabalho: `refresh/portfolio-2026`
- Site atual auditado em desktop e viewport mobile de 390 px.

## Fases
| Fase | Estado | Observação |
|---|---|---|
| 0 — Planejamento e governança | CONCLUÍDA | Documentação criada |
| 1 — Baseline visual e inventário | AUTORIZADA | Início da Onda A |
| 2 — Fundação estrutural/semântica | AUTORIZADA | Executar após registrar baseline |
| 3 — Hero responsivo | AUTORIZADA | Fechamento da Onda A; validação visual obrigatória |
| 4 — Projetos em destaque | PENDENTE | AWX, Cursos Pugliese, Galerows |
| 5 — Sobre, experiência e stack | PENDENTE | Atualização de posicionamento |
| 6 — Contato e navegação | PENDENTE | Acessibilidade e mobile |
| 7 — Motion/performance/acessibilidade | PENDENTE | Remover timers bloqueantes |
| 8 — SEO/apresentação externa | PENDENTE | Metadados profissionais |
| 9 — QA visual cross-device | PENDENTE | Matriz completa |
| 10 — Release e encerramento | PENDENTE | Revisão, merge e publicação |

## Findings já conhecidos
- overflow horizontal no hero em mobile de 390 px;
- hero depende de dimensões/posições rígidas e diversos breakpoints corretivos;
- conteúdo principal ainda enfatiza projetos introdutórios;
- HTML possui anchors aninhados, links inconsistentes e IDs repetidos;
- preloader bloqueia a interface por aproximadamente 2 s;
- seção Sobre depende de timer de aproximadamente 5 s;
- textos do hero dependem de timers para aparecer;
- SEO atual é mínimo.

## Próximo passo autorizado
Executar a **ONDA A — Fundação visual**, cobrindo as Fases 1, 2 e 3 no mesmo ciclo.

A IA executora deve:
1. confirmar branch, HEAD, origem e working tree;
2. subir o site local e registrar a baseline visual antes da primeira alteração;
3. inventariar problemas e arquivos relevantes;
4. executar a Fase 2, corrigindo base estrutural/semântica sem redesign;
5. executar a Fase 3, reconstruindo o hero de forma responsiva preservando a identidade definida;
6. validar visualmente durante a implementação, não apenas ao final;
7. testar todas as viewports mínimas;
8. atualizar este documento com commits, evidências, findings e estado final;
9. parar ao fim da Onda A e devolver relatório ao orquestrador.

A executora **não precisa parar entre as Fases 1, 2 e 3**. Deve parar antecipadamente somente se encontrar divergência de baseline, regressão grave que exija decisão de design, necessidade de mudança de stack/escopo ou impossibilidade técnica relevante.

## Critério para avançar
O orquestrador revisa o relatório completo da Onda A. Se os critérios estiverem atendidos, libera a Onda B (Fases 4, 5 e 6) em um único ciclo.
