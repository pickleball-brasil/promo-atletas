# Requisitos do Sistema de Promoções

## Visão Geral

Sistema web de agregação de promoções com links de afiliado e cupons de desconto, integrando múltiplas plataformas de e-commerce (MercadoLivre, Shopee, Amazon, entre outras).

---

## Requisitos Funcionais

### RF01 — Gestão de Promoções
- RF01.1 — O sistema deve permitir cadastrar, editar, ativar/desativar e excluir promoções
- RF01.2 — Cada promoção deve conter: título, descrição, imagem, preço original, preço promocional, plataforma de origem, link de afiliado, categoria, validade e status
- RF01.3 — O sistema deve calcular e exibir automaticamente o percentual de desconto
- RF01.4 — Promoções expiradas devem ser marcadas automaticamente como inativas
- RF01.5 — O sistema deve suportar importação em lote de promoções via CSV

### RF02 — Gestão de Cupons
- RF02.1 — O sistema deve permitir cadastrar, editar e desativar cupons de desconto
- RF02.2 — Cada cupom deve conter: código, tipo de desconto (percentual ou fixo), valor, loja, validade, limite de usos e status
- RF02.3 — Um cupom pode ser vinculado a uma ou mais promoções
- RF02.4 — O sistema deve registrar o número de vezes que um cupom foi copiado/utilizado
- RF02.5 — Cupons expirados ou esgotados devem ser marcados automaticamente como inválidos

### RF03 — Links de Afiliado
- RF03.1 — O sistema deve gerar links de afiliado para MercadoLivre, Shopee e Amazon
- RF03.2 — O sistema deve suportar links manuais para plataformas não integradas
- RF03.3 — Todos os links externos devem passar pela rota interna `/r/[slug]` para rastreamento
- RF03.4 — Links devem suportar data de expiração
- RF03.5 — O sistema deve registrar cada clique em link de afiliado (IP, user-agent, referrer, timestamp)

### RF04 — Integrações com Plataformas

#### RF04.1 — MercadoLivre
- Autenticação via OAuth 2.0 com renovação automática de token
- Busca de produtos via API oficial (`/sites/MLB/search`)
- Conversão automática de produto buscado em promoção cadastrada
- Geração de link de afiliado com ID do parceiro

#### RF04.2 — Shopee
- Autenticação via Shopee Open Platform API
- Geração de deep links de afiliado
- Recebimento de atualizações de preço via webhook

#### RF04.3 — Amazon (PA-API 5.0)
- Busca e importação de produtos com tag de afiliado
- Atualização periódica de preços via cron

#### RF04.4 — Plataformas Genéricas
- Suporte a cadastro manual de links de qualquer loja
- Padrão plugável (Strategy Pattern) para adição de novas integrações

### RF05 — Categorias
- RF05.1 — O sistema deve permitir criar, editar e excluir categorias
- RF05.2 — Cada promoção deve pertencer a pelo menos uma categoria
- RF05.3 — O sistema deve exibir promoções filtradas por categoria

### RF06 — Busca e Filtros
- RF06.1 — O usuário deve poder buscar promoções por palavra-chave
- RF06.2 — O usuário deve poder filtrar por: categoria, plataforma, faixa de preço e percentual de desconto
- RF06.3 — O usuário deve poder ordenar por: mais recente, maior desconto, mais clicado

### RF07 — Painel Administrativo
- RF07.1 — O painel deve ser acessível somente a usuários autenticados com role `admin`
- RF07.2 — O painel deve exibir dashboard com métricas: total de cliques, cupons mais usados, plataformas mais populares, promoções mais acessadas
- RF07.3 — O painel deve permitir gerenciar promoções, cupons, categorias e configurações de integração

### RF08 — SEO e Performance
- RF08.1 — Cada promoção deve ter página dedicada com URL amigável (`/promocoes/[slug]`)
- RF08.2 — O sistema deve gerar `sitemap.xml` e `robots.txt` dinâmicos
- RF08.3 — Meta tags (Open Graph, Twitter Card, schema.org/Offer) devem ser geradas por página
- RF08.4 — Imagens devem ser otimizadas via `next/image`

---

## Requisitos Não Funcionais

### RNF01 — Desempenho
- RNF01.1 — A listagem de promoções deve carregar em menos de 2 segundos (LCP)
- RNF01.2 — Paginação server-side com cursor para conjuntos grandes de dados
- RNF01.3 — Cache de respostas de APIs externas com Redis (TTL configurável por plataforma)

### RNF02 — Segurança
- RNF02.1 — Credenciais de APIs armazenadas exclusivamente em variáveis de ambiente
- RNF02.2 — Rate limiting nas rotas de API pública
- RNF02.3 — Validação de todos os inputs com `zod` antes de persistir no banco
- RNF02.4 — Autenticação do painel admin com NextAuth.js (sessão segura, CSRF protection)
- RNF02.5 — HTTPS obrigatório em produção

### RNF03 — Escalabilidade
- RNF03.1 — Arquitetura stateless para suportar deploy em múltiplas instâncias
- RNF03.2 — Padrão plugável para integrações facilitando adição de novas plataformas sem refatoração

### RNF04 — Manutenibilidade
- RNF04.1 — TypeScript em modo strict em todo o projeto
- RNF04.2 — Cobertura de testes unitários para funções de negócio críticas (Vitest)
- RNF04.3 — Testes end-to-end para fluxos críticos: clique em afiliado, cópia de cupom, login admin (Playwright)

### RNF05 — Disponibilidade
- RNF05.1 — Deploy contínuo via Vercel (frontend + API routes)
- RNF05.2 — Banco de dados em serviço gerenciado (Railway ou Supabase) com backups automáticos

---

## Restrições Técnicas

| Item | Escolha | Justificativa |
|------|---------|---------------|
| Framework | Next.js 14+ (App Router) | SSR/SSG nativo, API Routes, otimização de imagem |
| Linguagem | TypeScript (strict) | Segurança de tipos, manutenibilidade |
| ORM | Prisma + PostgreSQL | Type-safe queries, migrations versionadas |
| Autenticação | NextAuth.js | Integração nativa com Next.js, suporte OAuth |
| Estilização | Tailwind CSS | Desenvolvimento rápido, bundle otimizado |
| Validação | Zod | Schema-first, integração com TypeScript |
| Deploy | Vercel | Edge network, CD automático por branch |

---

## Variáveis de Ambiente Necessárias

```env
# Banco
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# MercadoLivre
ML_CLIENT_ID=
ML_CLIENT_SECRET=
ML_AFFILIATE_ID=

# Shopee
SHOPEE_APP_ID=
SHOPEE_SECRET=
SHOPEE_AFFILIATE_ID=

# Amazon PA-API 5.0
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=
AMAZON_HOST=webservices.amazon.com.br

# Admin
ADMIN_EMAIL=

# Cache (opcional)
REDIS_URL=
```
