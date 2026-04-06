# Casos de Uso — Sistema de Promoções

## Atores

| Ator | Descrição |
|------|-----------|
| **Visitante** | Usuário anônimo que navega e consulta promoções/cupons |
| **Administrador** | Usuário autenticado que gerencia o conteúdo do sistema |
| **Sistema de Integração** | Componente que se comunica com APIs externas (ML, Shopee, Amazon) |

---

## UC01 — Visualizar listagem de promoções

**Ator principal:** Visitante  
**Pré-condição:** Existir pelo menos uma promoção ativa cadastrada  
**Pós-condição:** Visitante visualiza a lista de promoções

### Fluxo Principal
1. Visitante acessa a página inicial ou `/promocoes`
2. Sistema busca promoções ativas ordenadas por data de criação (mais recente primeiro)
3. Sistema exibe cards com: imagem, título, preço original, preço promocional, desconto e plataforma
4. Visitante pode navegar entre páginas (paginação)

### Fluxos Alternativos
- **FA01 — Nenhuma promoção ativa:** Sistema exibe mensagem "Nenhuma promoção disponível no momento"
- **FA02 — Visitante aplica filtro por categoria:** Sistema recarrega lista filtrada
- **FA03 — Visitante aplica filtro por plataforma:** Sistema recarrega lista filtrada pela plataforma selecionada
- **FA04 — Visitante ordena por maior desconto:** Sistema reordena e recarrega a lista

---

## UC02 — Buscar promoções por palavra-chave

**Ator principal:** Visitante  
**Pré-condição:** Nenhuma  
**Pós-condição:** Visitante visualiza resultados da busca

### Fluxo Principal
1. Visitante digita termo na barra de busca
2. Sistema realiza busca por título e descrição das promoções ativas
3. Sistema exibe promoções que correspondem ao termo buscado
4. Visitante visualiza o número de resultados encontrados

### Fluxos Alternativos
- **FA01 — Nenhum resultado encontrado:** Sistema exibe mensagem "Nenhuma promoção encontrada para '[termo]'"
- **FA02 — Visitante combina busca com filtros:** Sistema aplica filtros sobre os resultados da busca

---

## UC03 — Visualizar detalhes de uma promoção

**Ator principal:** Visitante  
**Pré-condição:** Promoção deve existir e estar ativa  
**Pós-condição:** Visitante visualiza todos os detalhes da promoção

### Fluxo Principal
1. Visitante clica em um card de promoção
2. Sistema navega para `/promocoes/[slug]`
3. Sistema exibe: título, imagem, descrição completa, preço, desconto, plataforma, validade, cupom vinculado (se houver) e botão de acesso ao link de afiliado

### Fluxos Alternativos
- **FA01 — Promoção expirada:** Sistema exibe aviso de promoção encerrada e oculta o botão de acesso
- **FA02 — Promoção não encontrada:** Sistema redireciona para página 404

---

## UC04 — Acessar link de afiliado

**Ator principal:** Visitante  
**Pré-condição:** Promoção ativa com link de afiliado válido  
**Pós-condição:** Clique registrado e visitante redirecionado para a plataforma

### Fluxo Principal
1. Visitante clica em "Ver oferta" na página da promoção
2. Sistema registra o evento de clique em `/r/[slug]` (IP, user-agent, referrer, timestamp)
3. Sistema incrementa contador de cliques da promoção
4. Sistema redireciona visitante para o link de afiliado externo com HTTP 302

### Fluxos Alternativos
- **FA01 — Link expirado:** Sistema não redireciona e exibe mensagem "Oferta encerrada"
- **FA02 — Link inválido:** Sistema registra erro internamente e exibe mensagem genérica de erro

---

## UC05 — Copiar cupom de desconto

**Ator principal:** Visitante  
**Pré-condição:** Cupom ativo e dentro do limite de usos  
**Pós-condição:** Código do cupom copiado para a área de transferência e uso registrado

### Fluxo Principal
1. Visitante acessa `/cupons` ou visualiza cupom vinculado a uma promoção
2. Visitante clica em "Copiar cupom"
3. Sistema copia o código para a área de transferência via Clipboard API
4. Sistema exibe feedback visual ("Cupom copiado!")
5. Sistema incrementa contador de usos do cupom

### Fluxos Alternativos
- **FA01 — Cupom expirado:** Botão de cópia fica desabilitado e exibe "Cupom expirado"
- **FA02 — Cupom esgotado (limite de usos atingido):** Botão desabilitado com indicação "Cupom esgotado"
- **FA03 — API Clipboard não disponível (browser antigo):** Sistema exibe modal com o código para cópia manual

---

## UC06 — Administrador faz login no painel

**Ator principal:** Administrador  
**Pré-condição:** Usuário cadastrado com role `admin`  
**Pós-condição:** Administrador autenticado com acesso ao painel

### Fluxo Principal
1. Administrador acessa `/admin`
2. Sistema detecta ausência de sessão e redireciona para `/admin/login`
3. Administrador insere e-mail e senha
4. NextAuth.js valida as credenciais
5. Sistema cria sessão segura e redireciona para `/admin/dashboard`

### Fluxos Alternativos
- **FA01 — Credenciais inválidas:** Sistema exibe "E-mail ou senha incorretos" sem revelar qual campo está errado
- **FA02 — Usuário sem role admin:** Sistema nega acesso e exibe mensagem de permissão insuficiente

---

## UC07 — Administrador cadastra uma promoção manualmente

**Ator principal:** Administrador  
**Pré-condição:** Autenticado como admin  
**Pós-condição:** Nova promoção criada e disponível para visitantes

### Fluxo Principal
1. Administrador acessa `/admin/promocoes/nova`
2. Sistema exibe formulário com campos obrigatórios e opcionais
3. Administrador preenche: título, URL da imagem, preço original, preço promocional, link de afiliado, plataforma, categoria e validade
4. Sistema valida os dados com Zod
5. Administrador confirma o cadastro
6. Sistema gera slug único a partir do título
7. Sistema persiste a promoção no banco e exibe confirmação

### Fluxos Alternativos
- **FA01 — Dados inválidos:** Sistema destaca campos com erro e exibe mensagem específica por campo
- **FA02 — Slug duplicado:** Sistema gera variação automática do slug (ex: `produto-2`)
- **FA03 — Administrador cancela:** Sistema descarta o formulário sem salvar

---

## UC08 — Administrador importa promoções via CSV

**Ator principal:** Administrador  
**Pré-condição:** Autenticado como admin; arquivo CSV no formato esperado  
**Pós-condição:** Promoções válidas importadas; erros reportados

### Fluxo Principal
1. Administrador acessa `/admin/promocoes/importar`
2. Administrador faz upload do arquivo CSV
3. Sistema valida o formato e as colunas obrigatórias
4. Sistema exibe preview das linhas que serão importadas
5. Administrador confirma a importação
6. Sistema persiste os registros válidos e exibe relatório: X importados, Y com erro

### Fluxos Alternativos
- **FA01 — Arquivo com formato inválido:** Sistema rejeita o arquivo e exibe template de exemplo para download
- **FA02 — Linhas com dados inválidos:** Sistema importa as linhas válidas, lista as inválidas com o motivo

---

## UC09 — Sistema integra produto do MercadoLivre

**Ator principal:** Sistema de Integração / Administrador  
**Pré-condição:** Credenciais ML configuradas e token OAuth válido  
**Pós-condição:** Produto importado como promoção com link de afiliado gerado

### Fluxo Principal
1. Administrador busca por termo em `/admin/integracoes/mercadolivre`
2. Sistema envia requisição à API ML com as credenciais OAuth
3. API retorna lista de produtos
4. Administrador seleciona o produto desejado
5. Sistema gera link de afiliado com o `ML_AFFILIATE_ID`
6. Sistema pré-preenche formulário de nova promoção com os dados do produto
7. Administrador revisa e confirma o cadastro

### Fluxos Alternativos
- **FA01 — Token expirado:** Sistema renova automaticamente o token antes de retentar
- **FA02 — API ML indisponível:** Sistema exibe mensagem de erro e registra log; não bloqueia demais funcionalidades

---

## UC10 — Administrador visualiza métricas do dashboard

**Ator principal:** Administrador  
**Pré-condição:** Autenticado como admin  
**Pós-condição:** Administrador visualiza métricas atuais do sistema

### Fluxo Principal
1. Administrador acessa `/admin/dashboard`
2. Sistema consulta banco e exibe:
   - Total de cliques nos últimos 7 e 30 dias
   - Top 5 promoções mais clicadas
   - Top 5 cupons mais copiados
   - Distribuição de acessos por plataforma
   - Total de promoções ativas vs expiradas

### Fluxos Alternativos
- **FA01 — Sem dados:** Sistema exibe estado vazio com orientação para cadastrar promoções
