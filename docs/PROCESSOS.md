# Processos — Sistema de Promoções

> Mapeamento dos processos operacionais: cadastro manual de promoções por integração e automações disponíveis para busca de promoções e cupons.

---

## Parte 1 — Cadastro de Promoções por Integração

### P01 — Cadastro via MercadoLivre

#### Visão Geral
O administrador busca um produto dentro do painel usando a API oficial do MercadoLivre. O sistema converte o resultado em uma promoção já com o link de afiliado gerado.

#### Pré-condições
- Credenciais OAuth 2.0 configuradas (`ML_CLIENT_ID`, `ML_CLIENT_SECRET`, `ML_AFFILIATE_ID`)
- Token de acesso ativo (renovado automaticamente pelo sistema)

#### Fluxo Passo a Passo

```
Administrador
    │
    ├─ 1. Acessa /admin/promocoes → "Nova promoção"
    │
    ├─ 2. Seleciona fonte: "MercadoLivre"
    │
    ├─ 3. Digita termo de busca (ex: "tênis nike air max")
    │        │
    │        └─ Sistema chama GET /sites/MLB/search?q={termo}
    │           Retorna lista de produtos com preço, imagem e ID
    │
    ├─ 4. Seleciona o produto desejado na lista de resultados
    │        │
    │        └─ Sistema pré-preenche os campos:
    │             • título (item.title)
    │             • imagem (item.thumbnail → versão HD)
    │             • preço original (item.original_price)
    │             • preço promocional (item.price)
    │             • plataforma: "mercadolivre"
    │
    ├─ 5. Sistema gera o link de afiliado:
    │        https://www.mercadolivre.com.br/...?mclics={ML_AFFILIATE_ID}
    │
    ├─ 6. Administrador revisa e complementa:
    │        • descrição da promoção
    │        • categoria
    │        • data de expiração
    │        • cupom vinculado (opcional)
    │
    └─ 7. Confirma → promoção salva com status "ativa"
```

#### Geração do Link de Afiliado
| Campo | Valor |
|-------|-------|
| URL base | `https://www.mercadolivre.com.br/p/{item_id}` |
| Parâmetro de afiliado | `?mclics={ML_AFFILIATE_ID}` |
| Rota de rastreamento interno | `/r/{slug}` → redireciona para a URL acima |

#### Observações
- O token OAuth expira a cada 6 horas; o sistema renova automaticamente antes da expiração usando o `refresh_token`.
- Preços são exibidos em BRL conforme retornado pela API (`currency_id: "BRL"`).
- Produtos sem `original_price` têm desconto calculado como `0%`.

---

### P02 — Cadastro via Shopee

#### Visão Geral
O administrador localiza um produto via Shopee Open Platform API. O sistema gera o deep link de afiliado da Shopee e registra a promoção.

#### Pré-condições
- Credenciais configuradas (`SHOPEE_APP_ID`, `SHOPEE_SECRET`, `SHOPEE_AFFILIATE_ID`)
- Assinatura HMAC-SHA256 gerada automaticamente pelo sistema em cada requisição

#### Fluxo Passo a Passo

```
Administrador
    │
    ├─ 1. Acessa /admin/promocoes → "Nova promoção"
    │
    ├─ 2. Seleciona fonte: "Shopee"
    │
    ├─ 3. Cola a URL do produto Shopee
    │        (ex: https://shopee.com.br/produto-xyz-i.123.456)
    │        │
    │        └─ Sistema extrai shop_id e item_id da URL
    │           Chama GET /api/v2/product/get_item_base_info
    │
    ├─ 4. Sistema pré-preenche os campos:
    │        • título (item.name)
    │        • imagem (item.image.image_url_list[0])
    │        • preço original (item.price_before_discount / 100000)
    │        • preço promocional (item.current_price / 100000)
    │        • plataforma: "shopee"
    │
    ├─ 5. Sistema gera o deep link de afiliado:
    │        Chama POST /api/v2/affiliate/generate_deep_link
    │        Recebe URL trackável com o ID do afiliado embutido
    │
    ├─ 6. Administrador complementa:
    │        • descrição
    │        • categoria
    │        • data de expiração
    │        • cupom Shopee vinculado (opcional)
    │
    └─ 7. Confirma → promoção salva com status "ativa"
```

#### Geração do Link de Afiliado
| Campo | Valor |
|-------|-------|
| Endpoint | `POST /api/v2/affiliate/generate_deep_link` |
| Payload | `{ "url": "<url_produto>", "sub_id": "<SHOPEE_AFFILIATE_ID>" }` |
| Resultado | Deep link rastreável com comissão atribuída ao afiliado |
| Rota interna | `/r/{slug}` → redireciona para o deep link |

#### Recebimento de Atualizações de Preço (Webhook)
- A Shopee notifica o sistema via `POST /api/webhooks/shopee` quando o preço de um produto vinculado muda.
- O sistema valida a assinatura do payload (HMAC-SHA256) e atualiza `price` e `originalPrice` da promoção correspondente.
- Se o novo preço for superior ao `originalPrice` registrado, o sistema desativa a promoção automaticamente.

---

### P03 — Cadastro Manual (Plataformas Genéricas)

Para plataformas sem integração direta (ex: Amazon no modo manual, Magalu, Kabum), o administrador preenche todos os campos manualmente.

#### Fluxo
1. Acessa `/admin/promocoes` → "Nova promoção"
2. Seleciona fonte: "Manual / Outra plataforma"
3. Preenche todos os campos obrigatórios:
   - Título, descrição, imagem (upload ou URL), preço original, preço promocional
   - Nome da plataforma, link de afiliado (URL completa já com parâmetros do programa)
   - Categoria, data de expiração
4. Sistema calcula o percentual de desconto automaticamente
5. Confirma → promoção salva

---

## Parte 2 — Automações

### A01 — Busca Periódica de Promoções no MercadoLivre

#### Objetivo
Importar automaticamente produtos em promoção sem intervenção manual, usando termos e categorias pré-configurados.

#### Configuração
O administrador define no painel uma lista de **termos de busca monitorados** (ex: "tênis esportivo", "bermuda academia") e um **intervalo de execução**.

#### Fluxo da Automação

```
Cron job → dispara conforme intervalo configurado
    │
    ├─ Para cada termo monitorado:
    │     │
    │     ├─ Chama GET /sites/MLB/search?q={termo}&sort=price_asc&discount=10-100
    │     │
    │     ├─ Filtra resultados:
    │     │     • desconto ≥ limiar configurado (padrão: 15%)
    │     │     • produto não cadastrado ainda (verifica por item_id)
    │     │     • preço dentro da faixa configurada
    │     │
    │     ├─ Para cada produto aprovado no filtro:
    │     │     • Gera link de afiliado
    │     │     • Cria promoção com status "pendente de revisão" ou "ativa" (configurável)
    │     │     • Dispara notificação para o admin (e-mail ou webhook interno)
    │     │
    │     └─ Resposta cacheada no Redis por 15min para evitar chamadas duplicadas
    │
    └─ Registra log da execução (qtd buscada, importada, erros)
```

#### Parâmetros Configuráveis pelo Admin
| Parâmetro | Descrição | Padrão |
|-----------|-----------|--------|
| `termos` | Lista de palavras-chave monitoradas | — |
| `desconto_minimo` | % de desconto mínimo para importar | 15% |
| `preco_maximo` | Faixa de preço máximo | sem limite |
| `status_ao_importar` | `ativa` ou `pendente_revisao` | `pendente_revisao` |
| `intervalo` | Frequência do cron (cron expression) | `0 */6 * * *` (6h) |

---

### A02 — Busca Periódica de Promoções na Shopee

#### Objetivo
Monitorar categorias ou coleções da Shopee e importar novos produtos em promoção automaticamente.

#### Fluxo da Automação

```
Cron job → dispara conforme intervalo configurado
    │
    ├─ Para cada categoria/coleção monitorada:
    │     │
    │     ├─ Chama GET /api/v2/search/item/search_items (com filtro de desconto)
    │     │
    │     ├─ Filtra resultados:
    │     │     • desconto ≥ limiar configurado
    │     │     • item_id ainda não cadastrado
    │     │
    │     ├─ Para cada produto aprovado:
    │     │     • Gera deep link de afiliado via API Shopee
    │     │     • Cria promoção no banco
    │     │     • Notifica admin se configurado
    │     │
    │     └─ Cache Redis por 10min por categoria
    │
    └─ Log da execução registrado
```

#### Parâmetros Configuráveis
| Parâmetro | Descrição | Padrão |
|-----------|-----------|--------|
| `categorias` | IDs de categorias Shopee monitoradas | — |
| `desconto_minimo` | % mínimo de desconto | 20% |
| `status_ao_importar` | `ativa` ou `pendente_revisao` | `pendente_revisao` |
| `intervalo` | Frequência do cron | `0 */8 * * *` (8h) |

---

### A03 — Atualização Automática de Preços

#### Objetivo
Garantir que os preços exibidos no site reflitam os preços atuais das plataformas, evitando promoções desatualizadas.

#### Fontes de Atualização

| Fonte | Mecanismo |
|-------|-----------|
| MercadoLivre | Cron re-consulta a API por `item_id` a cada 4h |
| Shopee | Webhook push da plataforma (evento `SHOP_UPDATE`) |

#### Fluxo (MercadoLivre)

```
Cron job a cada 4 horas
    │
    ├─ Busca todas as promoções ML ativas no banco
    │
    ├─ Para cada promoção (em lotes de 20):
    │     │
    │     ├─ Chama GET /items/{item_id}
    │     │
    │     ├─ Compara preço retornado com o registrado
    │     │
    │     ├─ Se preço subiu ou promoção acabou:
    │     │     → Marca promoção como "expirada"
    │     │
    │     └─ Se preço caiu mais:
    │           → Atualiza preço e recalcula desconto
    │
    └─ Log da execução (qtd verificada, atualizada, expirada)
```

---

### A04 — Expiração Automática de Promoções e Cupons

#### Objetivo
Marcar automaticamente como inativas as promoções e cupons que ultrapassaram a data de expiração.

#### Fluxo

```
Cron job diário (ex: 00:05)
    │
    ├─ UPDATE promotions SET status = 'expirada'
    │    WHERE expires_at < NOW() AND status = 'ativa'
    │
    ├─ UPDATE coupons SET status = 'inválido'
    │    WHERE (expires_at < NOW() OR uses >= max_uses)
    │    AND status = 'ativo'
    │
    └─ Invalida cache Redis das chaves afetadas
```

---

### A05 — Importação em Lote via CSV

#### Objetivo
Permitir cadastro de múltiplas promoções de uma vez, útil para promoções manuais de plataformas sem API (ex: Kabum, Magalu).

#### Fluxo

```
Administrador
    │
    ├─ Acessa /admin/promocoes → "Importar CSV"
    │
    ├─ Faz upload do arquivo CSV
    │     Campos obrigatórios: titulo, preco_original, preco_promocional,
    │                          plataforma, link_afiliado, categoria, expira_em
    │
    ├─ Sistema valida cada linha com Zod
    │     • Linha inválida: registra erro sem interromper a importação
    │     • Linha válida: cria promoção com status configurável
    │
    ├─ Exibe relatório final:
    │     • X promoções importadas com sucesso
    │     • Y linhas com erro (detalhes por linha)
    │
    └─ Download disponível do relatório de erros em CSV
```

#### Formato do CSV
```csv
titulo,descricao,preco_original,preco_promocional,plataforma,link_afiliado,categoria,expira_em
Tênis Nike Air Max,Confortável e estiloso,399.90,199.90,shopee,https://...,calcados,2026-06-30
```

---

### A06 — Notificação ao Admin após Importação Automática

#### Objetivo
Manter o administrador informado sobre novas promoções importadas automaticamente, especialmente quando o status é `pendente_revisao`.

#### Canais Disponíveis
| Canal | Gatilho |
|-------|---------|
| E-mail | Resumo diário das importações do dia |
| Webhook interno | Notificação imediata por promoção importada |
| Dashboard admin | Contador de "Promoções pendentes de revisão" |

---

## Resumo dos Processos

| Código | Processo | Tipo |
|--------|----------|------|
| P01 | Cadastro via MercadoLivre | Manual assistido pela API |
| P02 | Cadastro via Shopee | Manual assistido pela API |
| P03 | Cadastro Manual (plataformas genéricas) | Manual |
| A01 | Busca periódica de promoções no MercadoLivre | Automatizado (cron) |
| A02 | Busca periódica de promoções na Shopee | Automatizado (cron) |
| A03 | Atualização automática de preços | Automatizado (cron + webhook) |
| A04 | Expiração automática de promoções e cupons | Automatizado (cron) |
| A05 | Importação em lote via CSV | Manual em lote |
| A06 | Notificação ao admin após importação | Automatizado (event-driven) |
