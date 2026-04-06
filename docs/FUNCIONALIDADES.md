# Funcionalidades — Sistema de Promoções

> Cada funcionalidade inclui critérios de aceite no formato **Dado / Quando / Então**.

---

## F01 — Catálogo de Promoções

### Descrição
Listagem paginada de ofertas com suporte a filtros, busca e ordenação.

### Critérios de Aceite

**CA01 — Listagem padrão**
- **Dado** que existam promoções ativas no banco
- **Quando** o visitante acessar `/promocoes`
- **Então** o sistema deve exibir cards com: imagem, título, preço original riscado, preço promocional, badge de desconto e logo da plataforma

**CA02 — Paginação**
- **Dado** que existam mais de 20 promoções ativas
- **Quando** o visitante rolar até o fim da página ou clicar em "Próxima"
- **Então** o sistema deve carregar a próxima página sem recarregar a página inteira

**CA03 — Filtro por categoria**
- **Dado** que existam promoções em mais de uma categoria
- **Quando** o visitante selecionar uma categoria no filtro
- **Então** apenas promoções daquela categoria devem ser exibidas

**CA04 — Ordenação**
- **Dado** que o visitante esteja na listagem
- **Quando** selecionar "Maior desconto"
- **Então** as promoções devem ser reordenadas do maior para o menor percentual de desconto

---

## F02 — Página de Detalhes da Promoção

### Descrição
Página dedicada por promoção com SEO completo e todas as informações da oferta.

### Critérios de Aceite

**CA01 — Conteúdo da página**
- **Dado** que uma promoção ativa exista com slug `tênis-nike-air-max`
- **Quando** o visitante acessar `/promocoes/tênis-nike-air-max`
- **Então** a página deve exibir: título, imagem, descrição completa, preço original, preço promocional, percentual de desconto, plataforma, validade, cupom vinculado (se houver) e botão "Ver oferta"

**CA02 — SEO**
- **Dado** que uma promoção tenha título, imagem e preço
- **Quando** a página for renderizada no servidor
- **Então** o `<head>` deve conter: `<title>`, `description`, OG tags (`og:title`, `og:image`, `og:price`) e schema.org do tipo `Offer`

**CA03 — Promoção expirada**
- **Dado** que a `expiresAt` da promoção seja anterior à data atual
- **Quando** qualquer visitante acessar a página
- **Então** o botão "Ver oferta" deve estar oculto e um aviso "Promoção encerrada" deve ser exibido

---

## F03 — Tracker de Cliques em Links de Afiliado

### Descrição
Rota interna que registra o clique antes de redirecionar o visitante para a plataforma externa.

### Rota: `GET /r/[slug]`

### Critérios de Aceite

**CA01 — Registro e redirecionamento**
- **Dado** que uma promoção ativa tenha o slug `oferta-abc`
- **Quando** o visitante acessar `/r/oferta-abc`
- **Então** o sistema deve:
  1. Registrar um `ClickEvent` com IP (anonimizado), user-agent, referrer e timestamp
  2. Incrementar `clicks` na promoção
  3. Responder com HTTP 302 e header `Location` apontando para o `affiliateUrl`

**CA02 — Link expirado**
- **Dado** que a promoção associada ao slug esteja expirada ou inativa
- **Quando** o visitante tentar acessar a rota de redirect
- **Então** o sistema deve retornar HTTP 410 (Gone) e não redirecionar

**CA03 — Rate limiting**
- **Dado** que um mesmo IP realize mais de 30 requisições por minuto na rota `/r/`
- **Quando** a 31ª requisição chegar
- **Então** o sistema deve retornar HTTP 429 (Too Many Requests)

---

## F04 — Sistema de Cupons

### Descrição
Cadastro, exibição e rastreamento de uso de cupons de desconto.

### Critérios de Aceite

**CA01 — Exibição de cupom**
- **Dado** que um cupom ativo esteja vinculado a uma promoção
- **Quando** o visitante visualizar os detalhes da promoção
- **Então** o sistema deve exibir o código do cupom parcialmente mascarado (ex: `PROM****`) e o botão "Copiar cupom"

**CA02 — Cópia do cupom**
- **Dado** que o cupom esteja ativo e dentro do limite de usos
- **Quando** o visitante clicar em "Copiar cupom"
- **Então** o código completo deve ser copiado para a área de transferência, o botão deve mudar para "Copiado!" por 3 segundos, e o contador de usos deve ser incrementado

**CA03 — Cupom expirado**
- **Dado** que a `expiresAt` do cupom seja anterior à data atual
- **Quando** o visitante visualizar o cupom
- **Então** o botão deve estar desabilitado e exibir "Cupom expirado"

**CA04 — Cupom esgotado**
- **Dado** que `uses >= maxUses` no cupom
- **Quando** o visitante visualizar o cupom
- **Então** o botão deve estar desabilitado e exibir "Cupom esgotado"

---

## F05 — Integração com MercadoLivre

### Descrição
Autenticação OAuth 2.0 e importação de produtos como promoções.

### Critérios de Aceite

**CA01 — Autenticação**
- **Dado** que as variáveis `ML_CLIENT_ID` e `ML_CLIENT_SECRET` estejam configuradas
- **Quando** o administrador iniciar a conexão com ML
- **Então** o sistema deve redirecionar para o fluxo OAuth do MercadoLivre e armazenar o token de acesso de forma segura

**CA02 — Busca de produtos**
- **Dado** que o token OAuth seja válido
- **Quando** o administrador buscar por "tênis Nike" no painel de integração
- **Então** o sistema deve retornar produtos da API ML com: título, imagem, preço e URL do produto

**CA03 — Importação de produto**
- **Dado** que o administrador selecione um produto da busca
- **Quando** confirmar a importação
- **Então** o sistema deve gerar o link de afiliado com `ML_AFFILIATE_ID` e pré-preencher o formulário de nova promoção

**CA04 — Renovação de token**
- **Dado** que o access token ML tenha expirado
- **Quando** qualquer requisição à API ML for realizada
- **Então** o sistema deve usar o refresh token para obter novo access token automaticamente, sem intervenção do administrador

---

## F06 — Integração com Shopee

### Descrição
Geração de deep links de afiliado e recebimento de atualizações via webhook.

### Critérios de Aceite

**CA01 — Geração de deep link**
- **Dado** que as credenciais Shopee estejam configuradas
- **Quando** o administrador informar a URL de um produto Shopee
- **Então** o sistema deve gerar o deep link de afiliado com o `SHOPEE_AFFILIATE_ID`

**CA02 — Webhook de atualização de preço**
- **Dado** que a Shopee envie uma notificação de mudança de preço via webhook
- **Quando** o sistema receber a requisição em `/api/integracoes/shopee/webhook`
- **Então** o sistema deve verificar a assinatura HMAC do payload, atualizar o preço da promoção correspondente e manter log da alteração

---

## F07 — Painel Administrativo

### Descrição
Interface de gestão completa para administradores autenticados.

### Critérios de Aceite

**CA01 — Proteção de rotas**
- **Dado** que um usuário não autenticado tente acessar qualquer rota `/admin/*`
- **Quando** a requisição chegar ao servidor
- **Então** o sistema deve redirecionar para `/admin/login`

**CA02 — CRUD de promoções**
- **Dado** que o administrador esteja autenticado
- **Quando** acessar `/admin/promocoes`
- **Então** deve ver a lista completa de promoções (ativas e inativas) com ações: editar, ativar/desativar e excluir

**CA03 — Importação CSV**
- **Dado** que o administrador faça upload de um CSV válido
- **Quando** confirmar a importação
- **Então** o sistema deve importar todas as linhas válidas e exibir relatório detalhado com sucessos e falhas

**CA04 — Dashboard de métricas**
- **Dado** que existam cliques e usos de cupom registrados
- **Quando** o administrador acessar `/admin/dashboard`
- **Então** deve ver: gráfico de cliques por dia (últimos 30 dias), ranking de promoções mais clicadas, ranking de cupons mais usados e distribuição por plataforma

---

## F08 — SEO e Sitemap

### Descrição
Otimização para mecanismos de busca com geração dinâmica de sitemap e meta tags.

### Critérios de Aceite

**CA01 — Sitemap dinâmico**
- **Dado** que existam promoções e categorias ativas
- **Quando** um crawler acessar `/sitemap.xml`
- **Então** o arquivo deve listar URLs de todas as promoções ativas, categorias e páginas estáticas com `lastmod` e `priority` corretos

**CA02 — Robots.txt**
- **Dado** que o sistema esteja em produção
- **Quando** um crawler acessar `/robots.txt`
- **Então** o arquivo deve bloquear `/admin/` e `/api/` e permitir o restante

**CA03 — Schema.org**
- **Dado** que uma promoção tenha preço definido
- **Quando** a página de detalhes for renderizada
- **Então** o HTML deve incluir JSON-LD com tipo `Offer` contendo: name, price, priceCurrency, availability e url

---

## F09 — Gestão de Categorias

### Descrição
CRUD de categorias para organização das promoções.

### Critérios de Aceite

**CA01 — Criação de categoria**
- **Dado** que o administrador crie uma categoria "Eletrônicos"
- **Quando** confirmar o cadastro
- **Então** o sistema deve gerar o slug `eletronicos`, persistir no banco e disponibilizar imediatamente nos filtros e no formulário de promoções

**CA02 — Exclusão com promoções vinculadas**
- **Dado** que uma categoria tenha promoções ativas vinculadas
- **Quando** o administrador tentar excluí-la
- **Então** o sistema deve bloquear a exclusão e exibir: "Esta categoria possui X promoções ativas. Mova-as antes de excluir."
