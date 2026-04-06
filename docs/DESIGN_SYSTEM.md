# Design System — Sistema de Promoções

> Referência de design para o projeto: tokens, tipografia, paleta de cores, espaçamentos e organização de componentes. Todos os valores são configurados em `tailwind.config.ts` e consumidos via classes Tailwind em toda a aplicação.

---

## 1. Estrutura de Arquivos

```
promo-atletas/
├── tailwind.config.ts          ← tokens globais (cores, fontes, espaçamento)
├── app/
│   └── globals.css             ← variáveis CSS e reset base
├── components/
│   ├── ui/                     ← componentes primitivos (Button, Badge, Card...)
│   ├── layout/                 ← estrutura de página (Header, Footer, Sidebar...)
│   ├── promotion/              ← componentes de domínio (PromotionCard, PriceTag...)
│   ├── coupon/                 ← componentes de cupom (CouponCard, CopyButton...)
│   └── admin/                  ← componentes exclusivos do painel admin
└── lib/
    └── design-tokens.ts        ← constantes exportáveis (para uso fora do Tailwind)
```

---

## 2. Paleta de Cores

### Cores de Marca

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-500` | `#FF6B00` | Cor primária — CTAs, badges de desconto, destaques |
| `brand-400` | `#FF8C38` | Hover de elementos primários |
| `brand-600` | `#E05A00` | Active / pressed de elementos primários |
| `brand-50`  | `#FFF4EC` | Fundos suaves, banners de alerta leve |

### Cores Neutras

| Token | Hex | Uso |
|-------|-----|-----|
| `neutral-900` | `#111111` | Títulos principais |
| `neutral-700` | `#374151` | Corpo de texto |
| `neutral-500` | `#6B7280` | Textos secundários, placeholders |
| `neutral-300` | `#D1D5DB` | Bordas, divisores |
| `neutral-100` | `#F3F4F6` | Fundos de cards, áreas de input |
| `neutral-50`  | `#F9FAFB` | Background de página |

### Cores Semânticas

| Token | Hex | Uso |
|-------|-----|-----|
| `success-500` | `#16A34A` | Cupom válido, promoção ativa |
| `success-50`  | `#F0FDF4` | Fundo de estado de sucesso |
| `danger-500`  | `#DC2626` | Promoção expirada, erro |
| `danger-50`   | `#FEF2F2` | Fundo de estado de erro |
| `warning-500` | `#D97706` | Cupom próximo do vencimento |
| `warning-50`  | `#FFFBEB` | Fundo de alerta |

### Configuração em `tailwind.config.ts`

```ts
theme: {
  extend: {
    colors: {
      brand: {
        50:  '#FFF4EC',
        400: '#FF8C38',
        500: '#FF6B00',
        600: '#E05A00',
      },
      neutral: {
        50:  '#F9FAFB',
        100: '#F3F4F6',
        300: '#D1D5DB',
        500: '#6B7280',
        700: '#374151',
        900: '#111111',
      },
      success: { 50: '#F0FDF4', 500: '#16A34A' },
      danger:  { 50: '#FEF2F2', 500: '#DC2626' },
      warning: { 50: '#FFFBEB', 500: '#D97706' },
    },
  },
}
```

---

## 3. Tipografia

### Fontes

| Papel | Família | Variante | Uso |
|-------|---------|----------|-----|
| **Display** | Inter | 700–800 | Títulos de página, hero |
| **Body** | Inter | 400–500 | Parágrafos, descrições |
| **Mono** | JetBrains Mono | 500 | Códigos de cupom |

Carregadas via `next/font/google` em `app/layout.tsx`.

### Escala Tipográfica

| Token Tailwind | Tamanho | Line-height | Uso |
|----------------|---------|-------------|-----|
| `text-xs`      | 12px    | 16px        | Labels, badges, meta info |
| `text-sm`      | 14px    | 20px        | Legendas, textos de suporte |
| `text-base`    | 16px    | 24px        | Corpo padrão |
| `text-lg`      | 18px    | 28px        | Subtítulos de card |
| `text-xl`      | 20px    | 28px        | Títulos de seção |
| `text-2xl`     | 24px    | 32px        | Títulos de página (mobile) |
| `text-3xl`     | 30px    | 36px        | Títulos de página (desktop) |
| `text-4xl`     | 36px    | 40px        | Hero / destaque principal |

### Pesos

| Classe | Peso | Uso |
|--------|------|-----|
| `font-normal` | 400 | Corpo de texto |
| `font-medium` | 500 | Labels, botões secundários |
| `font-semibold` | 600 | Títulos de card, preços |
| `font-bold` | 700 | Títulos de seção, CTAs |
| `font-extrabold` | 800 | Títulos hero |

---

## 4. Espaçamento e Grid

Tailwind usa escala base de 4px (`1 unit = 4px`). Preferir múltiplos de 4.

| Uso | Classe | Valor |
|-----|--------|-------|
| Gap mínimo interno | `p-2` | 8px |
| Padding de card | `p-4` | 16px |
| Padding de seção | `px-6 py-8` | 24px / 32px |
| Gap entre cards | `gap-4` ou `gap-6` | 16px / 24px |
| Largura máxima do conteúdo | `max-w-7xl mx-auto` | 1280px |
| Padding lateral em mobile | `px-4` | 16px |

### Grid de Cards
- **Mobile:** 1 coluna (`grid-cols-1`)
- **Tablet:** 2 colunas (`sm:grid-cols-2`)
- **Desktop:** 3 ou 4 colunas (`lg:grid-cols-3 xl:grid-cols-4`)

---

## 5. Bordas, Sombras e Radii

| Token | Classe | Valor | Uso |
|-------|--------|-------|-----|
| Raio padrão de card | `rounded-xl` | 12px | Cards de promoção |
| Raio de botão | `rounded-lg` | 8px | Botões |
| Raio de badge | `rounded-full` | 9999px | Badge de desconto, status |
| Raio de input | `rounded-md` | 6px | Campos de formulário |
| Sombra de card | `shadow-sm` | sutil | Estado padrão |
| Sombra de card hover | `shadow-md` | média | Hover |
| Sombra de modal | `shadow-xl` | forte | Modais, dropdowns |
| Borda padrão | `border border-neutral-300` | 1px | Cards, inputs |

---

## 6. Componentes UI Primitivos (`components/ui/`)

Cada componente recebe `className` como prop para sobrescrita pontual via `clsx` ou `cn()`.

### Button

```
Variantes: primary | secondary | ghost | danger
Tamanhos:  sm | md | lg
Estados:   default | hover | active | disabled | loading
```

| Variante | Aparência |
|----------|-----------|
| `primary` | `bg-brand-500 text-white hover:bg-brand-400` |
| `secondary` | `border border-brand-500 text-brand-500 hover:bg-brand-50` |
| `ghost` | `text-neutral-700 hover:bg-neutral-100` |
| `danger` | `bg-danger-500 text-white hover:bg-red-700` |

### Badge

```
Variantes: discount | platform | status | category
```

| Variante | Exemplo visual | Uso |
|----------|----------------|-----|
| `discount` | bg laranja, texto branco | "−40%" nos cards |
| `platform` | bg neutro, ícone + nome | "MercadoLivre", "Shopee" |
| `status` | bg semântica | "Ativa", "Expirada", "Pendente" |
| `category` | bg neutro suave | "Calçados", "Eletrônicos" |

### Card

```
Variantes: promotion | coupon | metric (admin)
```

Estrutura interna do `PromotionCard`:

```
┌─────────────────────────────┐
│  [Badge desconto] [Badge plataforma]
│                             │
│  [Imagem do produto]        │
│                             │
│  Título da promoção         │
│  ~~R$ 399,90~~  R$ 199,90  │
│  [Ver oferta →]             │
└─────────────────────────────┘
```

### Input / Select / Textarea

- Border `neutral-300`, focus `ring-2 ring-brand-500`
- Label acima do campo, `text-sm font-medium text-neutral-700`
- Mensagem de erro abaixo, `text-xs text-danger-500`

### Modal / Dialog

- Overlay: `bg-black/50 backdrop-blur-sm`
- Container: `bg-white rounded-2xl shadow-xl max-w-lg w-full`
- Animação: fade-in + slide-up suave

---

## 7. Tokens de Ícones

Usar a biblioteca **Lucide React**. Tamanhos padrão:

| Contexto | Tamanho |
|----------|---------|
| Inline em texto | 16px (`size-4`) |
| Botões e inputs | 20px (`size-5`) |
| Ícones de feature / card | 24px (`size-6`) |
| Ícones hero / ilustração | 48px+ |

---

## 8. Identidade Visual por Plataforma

Usar cores oficiais como badge ou indicador de origem da promoção:

| Plataforma | Cor | HEX |
|------------|-----|-----|
| MercadoLivre | Amarelo ML | `#FFE600` (texto preto) |
| Shopee | Laranja Shopee | `#EE4D2D` (texto branco) |
| Amazon | Azul Amazon | `#146EB4` (texto branco) |
| Genérico | Neutro | `neutral-500` |

---

## 9. Modo Escuro (futuro)

Usar a estratégia `class` do Tailwind (`darkMode: 'class'`). Os tokens já devem contemplar variantes `dark:` nos componentes desde o início para facilitar a adição futura sem refatoração.

---

## 10. Utilitário `cn()`

Usar `clsx` + `tailwind-merge` para compor classes condicionais sem conflitos:

```ts
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Uso em componentes:

```tsx
<button className={cn('rounded-lg px-4 py-2', variant === 'primary' && 'bg-brand-500 text-white', className)}>
```
