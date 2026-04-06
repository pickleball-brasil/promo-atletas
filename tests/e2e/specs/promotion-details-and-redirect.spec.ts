import { expect, test } from '@playwright/test';

import { selectors } from '../support/selectors';

test.describe('F02 - Detalhes da Promocao', () => {
  test('deve renderizar conteudo completo da promocao ativa', async ({ page }) => {
    await page.goto('/promocoes/tenis-nike-air-max-90');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tenis Nike Air Max 90');
    await expect(page.getByText('Descricao')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver oferta' })).toBeVisible();
    await expect(page.getByTestId(selectors.promotionDetails.couponCode)).toContainText('RUN15OFF');
    await page.getByTestId(selectors.promotionDetails.couponCopy).click();
    await expect(page.getByTestId(selectors.promotionDetails.couponCopy)).toContainText('Copiado!');
    await expect(page.getByTestId(selectors.promotionDetails.finalPrice)).toContainText('Valor final estimado');
    await expect(page.getByTestId(selectors.promotionDetails.finalPriceNote)).toContainText(
      'use o botao Ver oferta desta pagina',
    );
  });

  test('deve exibir estado de promocao encerrada para item expirado', async ({ page }) => {
    await page.goto('/promocoes/bermuda-corrida-leve');

    await expect(page.getByText('Promocao encerrada')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver oferta' })).toHaveCount(0);
  });

  test('deve retornar 404 para slug inexistente', async ({ page }) => {
    const response = await page.goto('/promocoes/slug-inexistente-123');

    expect(response?.status()).toBe(404);
  });
});

test.describe('F03 - Redirect de Afiliado', () => {
  test('deve retornar 302 para promocao ativa', async ({ request }) => {
    const response = await request.fetch('/r/tenis-nike-air-max-90', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(302);
    expect(response.headers()['location']).toContain('mercadolivre.com.br');
  });

  test('deve retornar 410 para promocao expirada/inativa', async ({ request }) => {
    const response = await request.fetch('/r/bermuda-corrida-leve', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(410);
  });

  test('deve retornar 410 para slug inexistente', async ({ request }) => {
    const response = await request.fetch('/r/nao-existe-123', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(410);
  });
});