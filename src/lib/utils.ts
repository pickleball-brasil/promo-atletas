export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateDiscount(originalPrice: number, promoPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
}
