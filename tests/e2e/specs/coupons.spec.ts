import { expect, test } from '@playwright/test';

import { selectors } from '../support/selectors';

test.describe('F04 - Sistema de Cupons', () => {
  test('deve listar cupons e permitir copia para cupom ativo', async ({
    page,
  }) => {
    await page.goto('/cupons');

    await expect(page.getByTestId(selectors.couponsPage.title)).toBeVisible();
    await expect(page.getByTestId(selectors.couponsPage.card).first()).toBeVisible();
    await expect(page.getByTestId(selectors.couponsPage.code).first()).not.toBeEmpty();

    const firstCopyButton = page
      .getByTestId(selectors.couponsPage.copyButton)
      .filter({ hasNotText: 'Cupom expirado' })
      .filter({ hasNotText: 'Cupom esgotado' })
      .first();

    await firstCopyButton.click();
    await expect(firstCopyButton).toContainText('Copiado!');
  });

  test('deve exibir estados desabilitados para cupons expirados ou esgotados', async ({ page }) => {
    await page.goto('/cupons');

    const expiredOrExhaustedButton = page
      .getByTestId(selectors.couponsPage.copyButton)
      .filter({ hasText: /Cupom expirado|Cupom esgotado/ })
      .first();

    await expect(expiredOrExhaustedButton).toBeDisabled();
  });
});