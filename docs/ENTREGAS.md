# Entregas — Sistema de Promoções

> Plano de entregas orientado a valor, organizado em duas fases principais:
> **Fase 1** cobre toda a camada web com dados mockados (frontend-first) e
> **Fase 2** substitui os mocks pelas camadas server-side reais.

---

## Fase 1 — Web com Dados Mockados

O objetivo desta fase é validar layout, navegação, SEO e experiência do usuário sem depender de banco de dados ou integrações externas.

---

### E01 — Setup do Projeto

**Escopo**
- Inicializar projeto Next.js com App Router, TypeScript strict e Tailwind CSS
- Configurar ESLint, Prettier e path aliases (`@/`)
- Criar estrutura de pastas base: `app/`, `components/`, `lib/`, `mocks/`
- Adicionar arquivo `.env.example` com variáveis necessárias

**Critério de conclusão:** `pnpm dev` sobe sem erros; lint e build passam.

---

### E02 — Dados Mock Globais

**Escopo**
- Criar arquivo `mocks/promotions.ts` com ≥ 10 promoções cobrindo diferentes categorias, plataformas, com e sem cupom, ativas e expiradas
- Criar `mocks/coupons.ts` com ≥ 5 cupons (percentual e fixo)
- Criar `mocks/categories.ts` com categorias base
- Exportar tipos TypeScript (`Promotion`, `Coupon`, `Category`) reutilizados em toda a Fase 1

**Critério de conclusão:** Tipos compilam sem erros; dados são importáveis em qualquer componente.

---

### E03 — Catálogo de Promoções

**Referências:** F01, UC01, RF06  
**Escopo**
- Página `/promocoes` com listagem em grid de cards (imagem, título, preço original riscado, preço promocional, badge de desconto, logo da plataforma)
- Filtro por categoria e plataforma (estado local ou URL search params)
- Ordenação: mais recente · maior desconto · mais clicado
- Paginação client-side (ou load-more) sobre os dados mock
- Estado vazio: mensagem "Nenhuma promoção disponível no momento"

**Critério de conclusão:** Todos os critérios de F01-CA01 a CA04 verificáveis com dados mock.

---

### E04 — Busca por Palavra-chave

**Referências:** F01, UC02, RF06.1  
**Escopo**
- Barra de busca com debounce filtrando título e descrição dos mocks
- Contador de resultados ("X promoções encontradas")
- Estado vazio com mensagem contextualizada ao termo

**Critério de conclusão:** Busca retorna resultados corretos e limpa o estado vazio adequadamente.

---

### E05 — Página de Detalhes da Promoção

**Referências:** F02, UC03, RF08  
**Escopo**
- Rota dinâmica `/promocoes/[slug]`
- Exibição completa: título, imagem, descrição, preços, desconto, plataforma, validade, cupom vinculado (mascarado) e botão "Ver oferta"
- Estado de promoção expirada: aviso + botão oculto
- Meta tags estáticas: `<title>`, `description`, Open Graph (`og:title`, `og:image`, `og:price`) e schema.org `Offer` via `generateMetadata`
- Página 404 para slug inexistente

**Critério de conclusão:** Validação via [Open Graph Debugger](https://developers.facebook.com/tools/debug/) e Rich Results Test do Google com dados mock.

---

### E06 — Rota de Redirect de Afiliado (Mock)

**Referências:** F03, UC04, RF03.3  
**Escopo**
- Rota `GET /r/[slug]` implementada como Route Handler
- Com mock: redireciona para `affiliateUrl` do mock com HTTP 302
- Promoção expirada ou inexistente retorna HTTP 410
- Clique ainda **não** é persistido nesta fase (log apenas em console)

**Critério de conclusão:** Redirecionamento funciona; 410 é retornado para slugs expirados.

---

### E07 — Sistema de Cupons (UI)

**Referências:** F04, UC05, RF02  
**Escopo**
- Página `/cupons` com listagem de cupons ativos (código mascarado, desconto, loja, validade)
- Botão "Copiar cupom" via Clipboard API com feedback visual
- Exibição de cupom vinculado na página de detalhes da promoção
- Estado de cupom expirado/esgotado com botão desabilitado

**Critério de conclusão:** Cópia funciona em desktop e mobile; estado expirado é visualmente claro.

---

### E08 — Estrutura do Painel Admin (UI)

**Referências:** RF07  
**Escopo**
- Layout protegido `/admin` com sidebar e header
- Página de placeholder de login (`/admin/login`) — sem autenticação real nesta fase, apenas navegação mock
- Dashboard com métricas estáticas (cards fixos): total de cliques, cupons mais usados, plataformas populares
- Páginas de listagem mock: Promoções, Cupons, Categorias com tabela e botões de ação
- Formulários de criação/edição com validação de campos via `react-hook-form` + `zod` (sem persistência)

**Critério de conclusão:** Todas as rotas `/admin/*` renderizam sem erro; formulários validam campos obrigatórios.

---

### E09 — SEO Estático e Performance Base

**Referências:** RF08  
**Escopo**
- `sitemap.xml` estático gerado a partir dos mocks via `app/sitemap.ts`
- `robots.txt` via `app/robots.ts`
- Imagens via `next/image` com dimensões e `alt` em todos os cards
- Auditoria Lighthouse: alvo LCP < 2s, CLS < 0,1 em ambiente local

**Critério de conclusão:** Sitemap válido; Lighthouse Performance ≥ 85 em mobile simulado.

---

## Fase 2 — Camadas Server-side

O objetivo desta fase é substituir os mocks por persistência real, autenticação, rastreamento, cache e integrações externas.

---

### E10 — Modelagem de Banco de Dados

**Referências:** RF01, RF02, RF03, RF05  
**Escopo**
- Configurar Prisma com PostgreSQL
- Schema com entidades: `Promotion`, `Coupon`, `Category`, `ClickEvent`, `User`
- Migrations iniciais e seed com os dados dos mocks da Fase 1
- Índices em `slug`, `status`, `expiresAt`, `category`

**Critério de conclusão:** `prisma migrate dev` aplica sem erros; seed popula o banco com dados consistentes.

---

### E11 — API Routes — Promoções

**Referências:** RF01, RF06  
**Escopo**
- `GET /api/promotions` — listagem paginada com cursor, filtros e ordenação
- `GET /api/promotions/[slug]` — detalhes por slug
- `POST /api/promotions` — criação (admin)
- `PUT /api/promotions/[id]` — edição (admin)
- `DELETE /api/promotions/[id]` — remoção lógica (admin)
- Validação de todos os inputs com `zod`
- Substituição dos mocks nas páginas da Fase 1 pelas chamadas reais

**Critério de conclusão:** Testes com `vitest` cobrem criação, listagem, filtro e expiração automática.

---

### E12 — API Routes — Cupons e Categorias

**Referências:** RF02, RF05  
**Escopo**
- CRUD completo para `Coupon` e `Category` (rotas admin protegidas)
- `POST /api/coupons/[id]/copy` — incrementa contador de usos
- Validação de limite de usos e data de expiração antes de registrar cópia
- Substituição dos mocks de cupons e categorias

**Critério de conclusão:** Cópia de cupom persiste no banco; limite de usos bloqueia novas cópias.

---

### E13 — Tracker de Cliques com Rate Limiting

**Referências:** F03, RF03.5, RNF02.2  
**Escopo**
- `ClickEvent` persistido via Prisma a cada rota `/r/[slug]` acessada
- IP anonimizado (hash SHA-256 do IP + salt)
- Rate limiting: 30 req/min por IP com resposta HTTP 429; implementação via `@upstash/ratelimit` + Redis ou middleware Next.js
- Incremento atômico do contador `clicks` na promoção

**Critério de conclusão:** Cliques aparecem no banco; 31ª requisição do mesmo IP retorna 429 em teste de carga simples.

---

### E14 — Autenticação do Painel Admin

**Referências:** RF07.1, RNF02.4  
**Escopo**
- Configurar NextAuth.js com provider Credentials (e-mail + senha com bcrypt)
- Middleware de proteção de todas as rotas `/admin/*`
- Role `admin` verificada em cada API route protegida
- CSRF protection habilitado por padrão pelo NextAuth

**Critério de conclusão:** Acesso direto a `/admin/dashboard` sem sessão redireciona para `/admin/login`.

---

### E15 — Dashboard Admin com Métricas Reais

**Referências:** RF07.2  
**Escopo**
- Queries agregadas: total de cliques (por período), cupons mais copiados, plataformas mais ativas, top 5 promoções
- Gráfico de cliques por dia (últimos 30 dias)
- Substituição dos cards estáticos do E08 pelas métricas reais

**Critério de conclusão:** Dashboard exibe dados coerentes com o banco após execução do seed.

---

### E16 — Sitemap e Robots Dinâmicos

**Referências:** RF08.2  
**Escopo**
- `app/sitemap.ts` consultando banco para gerar URLs de todas as promoções ativas
- `app/robots.ts` com regras de crawl para admin bloqueado
- Revalidação com `next revalidate` para manter sitemap atualizado

**Critério de conclusão:** Sitemap contém todas as promoções ativas após inserção de nova promoção via admin.

---

### E17 — Integração MercadoLivre

**Referências:** RF04.1  
**Escopo**
- OAuth 2.0 com renovação automática de token (refresh antes da expiração)
- Busca de produtos via `/sites/MLB/search` com conversão para `Promotion`
- Geração de link de afiliado com ID do parceiro
- Credenciais exclusivamente em variáveis de ambiente

**Critério de conclusão:** Busca por termo retorna produto; promoção criada via admin com link de afiliado válido.

---

### E18 — Integração Shopee

**Referências:** RF04.2  
**Escopo**
- Autenticação via Shopee Open Platform API
- Geração de deep links de afiliado
- Endpoint de webhook para receber atualizações de preço

**Critério de conclusão:** Webhook recebe payload de atualização e altera `price` da promoção no banco.

---

### E19 — Integração Amazon (PA-API 5.0)

**Referências:** RF04.3  
**Escopo**
- Busca e importação de produtos com tag de afiliado
- Cron job (Vercel Cron ou externo) para atualização periódica de preços
- Cache Redis das respostas da PA-API (TTL configurável)

**Critério de conclusão:** Cron executa sem erros; preços desatualizados são corrigidos após execução.

---

### E20 — Cache Redis

**Referências:** RNF01.3  
**Escopo**
- Cache das respostas de listagem paginada com TTL de 60s
- Cache das páginas de detalhes por slug com TTL de 5min
- Invalidação de cache ao editar/desativar promoção via painel admin

**Critério de conclusão:** Segunda requisição à listagem responde a partir do cache (header `X-Cache: HIT`).

---

### E21 — Importação em Lote via CSV

**Referências:** RF01.5  
**Escopo**
- Upload de arquivo CSV no painel admin
- Parser validando campos obrigatórios com `zod`
- Relatório de linhas importadas e erros por linha

**Critério de conclusão:** CSV de 50 itens é importado; linhas com erro são sinalizadas sem cancelar o restante.

---

### E22 — Testes Automatizados

**Referências:** RNF04.2, RNF04.3  
**Escopo**
- Vitest: cobertura de funções críticas (cálculo de desconto, expiração, rate limiting, validações zod)
- Playwright: fluxos E2E — clique em afiliado, cópia de cupom, login admin, criação de promoção
- CI com GitHub Actions: lint + build + testes a cada PR

**Critério de conclusão:** Pipeline verde; cobertura unitária ≥ 80% nas funções de negócio.

#### Plano de Automacao Playwright por Funcionalidade

| Funcionalidade | Suite E2E | Tipo de Teste | Momento |
|---|---|---|---|
| F01 — Catalogo de Promocoes | `f01-catalogo.spec.ts` | listagem, filtros, ordenacao, paginacao | Fase 1 |
| F02 — Detalhes da Promocao | `f02-detalhes.spec.ts` | renderizacao de conteudo, expiracao, navegacao | Fase 1 |
| F03 — Tracker de Afiliado | `f03-tracker.spec.ts` | redirect 302, status 410, protecao de rota | Fase 2 |
| F04 — Sistema de Cupons | `f04-cupons.spec.ts` | copia de cupom, estado expirado/esgotado | Fase 1/2 |
| F05 — Integracao MercadoLivre | `f05-ml-integracao.spec.ts` | fluxo admin de busca/importacao com mocks de API | Fase 2 |
| F06 — Integracao Shopee | `f06-shopee-integracao.spec.ts` | geracao de deep link e validacao webhook | Fase 2 |
| F07 — Painel Admin | `f07-admin.spec.ts` | autenticacao, protecao de rotas, CRUD | Fase 2 |
| F08 — SEO e Sitemap | `f08-seo.spec.ts` | sitemap, robots e metatags principais | Fase 1/2 |
| F09 — Categorias | `f09-categorias.spec.ts` | filtro e CRUD de categorias no admin | Fase 2 |

#### Boas praticas de escalabilidade para Playwright

- Padrao Page Object por dominio (catalogo, detalhes, admin, cupons)
- Seletores estaveis via `data-testid` (evitar seletores por classe)
- Testes orientados a comportamento de negocio, nao a layout
- Execucao em multiplos perfis (desktop e mobile)
- Fixtures reutilizaveis para setup e autenticacao
- Mocks de rede para integracoes externas em ambiente de teste

---

### E23 — Deploy e CI/CD

**Referências:** RNF05.1  
**Escopo**
- Deploy contínuo via Vercel (preview por PR + produção na `main`)
- Variáveis de ambiente configuradas no Vercel Dashboard (nunca no repositório)
- Vercel Cron habilitado para jobs de expiração e atualização de preços
- HTTPS obrigatório (gerenciado pela Vercel)

**Critério de conclusão:** Merge na `main` desencadeia deploy automático; preview gerado em cada PR.

---

## Resumo das Fases

| # | Entrega | Fase |
|---|---------|------|
| E01 | Setup do Projeto | 1 |
| E02 | Dados Mock Globais | 1 |
| E03 | Catálogo de Promoções | 1 |
| E04 | Busca por Palavra-chave | 1 |
| E05 | Página de Detalhes da Promoção | 1 |
| E06 | Rota de Redirect de Afiliado (Mock) | 1 |
| E07 | Sistema de Cupons (UI) | 1 |
| E08 | Estrutura do Painel Admin (UI) | 1 |
| E09 | SEO Estático e Performance Base | 1 |
| E10 | Modelagem de Banco de Dados | 2 |
| E11 | API Routes — Promoções | 2 |
| E12 | API Routes — Cupons e Categorias | 2 |
| E13 | Tracker de Cliques com Rate Limiting | 2 |
| E14 | Autenticação do Painel Admin | 2 |
| E15 | Dashboard Admin com Métricas Reais | 2 |
| E16 | Sitemap e Robots Dinâmicos | 2 |
| E17 | Integração MercadoLivre | 2 |
| E18 | Integração Shopee | 2 |
| E19 | Integração Amazon (PA-API 5.0) | 2 |
| E20 | Cache Redis | 2 |
| E21 | Importação em Lote via CSV | 2 |
| E22 | Testes Automatizados | 2 |
| E23 | Deploy e CI/CD | 2 |
