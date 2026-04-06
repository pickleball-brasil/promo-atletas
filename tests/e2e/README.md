# E2E Playwright - Guia de Arquitetura

## Objetivo
Manter testes estaveis mesmo com alteracoes de layout, estilo e estrutura visual.

## Estrutura
- `tests/e2e/specs/`: cenarios de negocio por funcionalidade (F01, F02, etc.)
- `tests/e2e/pages/`: page objects para interacoes reutilizaveis
- `tests/e2e/support/`: seletores e utilitarios compartilhados

## Boas praticas adotadas
- Preferir `getByTestId` com ids estaveis definidos pela aplicacao
- Usar page objects para encapsular acoplamentos de UI
- Evitar seletores por classe CSS e por hierarquia de DOM
- Nomear specs por funcionalidade para rastrear cobertura dos criterios de aceite
- Executar em pelo menos 2 perfis: desktop e mobile

## Convencoes para novos testes
1. Criar um arquivo de spec por funcionalidade em `tests/e2e/specs/`
2. Reutilizar metodos no page object existente ou criar um novo em `tests/e2e/pages/`
3. Incluir assertions de negocio (texto, comportamento, navegacao), nao de apresentacao
4. Ao criar novo elemento interativo, adicionar `data-testid` na aplicacao

## Execucao
- `pnpm test:e2e`
- `pnpm test:e2e:headed`
- `pnpm test:e2e:ui`