import { expect, test } from '@playwright/test';

import { PromotionsPage } from '../pages/promotions.page';
import { selectors } from '../support/selectors';

test.describe('F01 - Catalogo de Promocoes', () => {
  test('deve renderizar cards com informacoes principais', async ({ page }) => {
    const promotionsPage = new PromotionsPage(page);

    await promotionsPage.goto();

    await expect(promotionsPage.cards.first()).toBeVisible();
    await expect(
      promotionsPage.cards.first().getByTestId(selectors.promotionCard.title),
    ).toBeVisible();
    await expect(
      promotionsPage.cards.first().getByTestId(selectors.promotionCard.discount),
    ).toBeVisible();
    await expect(
      promotionsPage.cards.first().getByTestId(selectors.promotionCard.platform),
    ).toBeVisible();
    await expect(
      promotionsPage.cards.first().getByTestId(selectors.promotionCard.promoPrice),
    ).toBeVisible();
    const firstCouponCode = page.getByTestId(selectors.promotionCard.couponCode).first();
    await expect(firstCouponCode).toBeVisible();

    const firstCouponCopyButton = page.getByTestId(selectors.promotionCard.couponCopy).first();
    await firstCouponCopyButton.click();
    await expect(firstCouponCopyButton).toContainText('Copiado!');
  });

  test('deve filtrar por categoria', async ({ page }) => {
    const promotionsPage = new PromotionsPage(page);

    await promotionsPage.goto();
    await promotionsPage.openFiltersIfCollapsed();
    await promotionsPage.selectCategory('Calcados');

    await expect(promotionsPage.cards).toHaveCount(1);
    await expect(
      promotionsPage.cards.first().getByTestId(selectors.promotionCard.title),
    ).toContainText('Tenis Nike Air Max 90');
  });

  test('deve ordenar por maior desconto', async ({ page }) => {
    const promotionsPage = new PromotionsPage(page);

    await promotionsPage.goto();
    await promotionsPage.openFiltersIfCollapsed();
    await promotionsPage.selectSort('Maior desconto');

    const first = await promotionsPage.firstCardDiscountValue();
    const second = await promotionsPage.secondCardDiscountValue();

    expect(first).toBeGreaterThanOrEqual(second);
  });

  test('deve carregar mais itens ao clicar em Carregar mais', async ({ page }) => {
    const promotionsPage = new PromotionsPage(page);

    await promotionsPage.goto();

    await expect(promotionsPage.cards).toHaveCount(8);
    await promotionsPage.loadMore();
    await expect(promotionsPage.cards).toHaveCount(10);
  });
});

test.describe('F01/F04 - Busca e Estado Vazio', () => {
  test('deve filtrar resultados por palavra-chave', async ({ page }) => {
    const promotionsPage = new PromotionsPage(page);

    await promotionsPage.goto();
    await promotionsPage.openFiltersIfCollapsed();
    await promotionsPage.search('smartwatch');

    await expect(promotionsPage.cards).toHaveCount(1);
    await expect(
      promotionsPage.cards.first().getByTestId(selectors.promotionCard.title),
    ).toContainText('Smartwatch GPS para Treino');
  });

  test('deve exibir estado vazio contextual quando nao encontra resultados', async ({ page }) => {
    const promotionsPage = new PromotionsPage(page);

    await promotionsPage.goto();
    await promotionsPage.openFiltersIfCollapsed();
    await promotionsPage.search('termo-inexistente-xyz');

    await expect(page.getByTestId(selectors.promotionsPage.emptyState)).toContainText(
      'Nenhuma promocao encontrada para "termo-inexistente-xyz".',
    );
  });
});