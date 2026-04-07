import { expect, type Locator, type Page } from '@playwright/test';

import { selectors } from '../support/selectors';

export class PromotionsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/promocoes');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByTestId(selectors.promotionsPage.title)).toBeVisible();
  }

  get cards(): Locator {
    return this.page.getByTestId(selectors.promotionCard.container);
  }

  async search(term: string) {
    // O input do nav (desktop) fica oculto no mobile; usa o primeiro visível
    const navInput = this.page.getByTestId(selectors.promotionsPage.searchInput).first();
    const isVisible = await navInput.isVisible();
    if (isVisible) {
      await navInput.fill(term);
    } else {
      // mobile: abre filtros e usa o input mobile
      await this.openFiltersIfCollapsed();
      await this.page.getByTestId('promotions-search-input-mobile').fill(term);
    }
  }

  async selectCategory(label: string) {
    await this.page.getByTestId(selectors.promotionsPage.categorySelect).selectOption({ label });
  }

  async selectPlatform(label: string) {
    await this.page.getByTestId(selectors.promotionsPage.platformSelect).selectOption({ label });
  }

  async selectSort(label: string) {
    await this.page.getByTestId(selectors.promotionsPage.sortSelect).selectOption({ label });
  }

  async loadMore() {
    await this.page.getByTestId(selectors.promotionsPage.loadMore).click();
  }

  async openFiltersIfCollapsed() {
    const toggle = this.page.getByTestId(selectors.promotionsPage.filtersToggle);
    if (await toggle.isVisible()) {
      await toggle.click();
    }
  }

  async firstCardDiscountValue(): Promise<number> {
    const text =
      (await this.cards
        .first()
        .getByTestId(selectors.promotionCard.discount)
        .innerText()) || '0%';

    return Number(text.replace(/[^0-9]/g, ''));
  }

  async secondCardDiscountValue(): Promise<number> {
    const text =
      (await this.cards
        .nth(1)
        .getByTestId(selectors.promotionCard.discount)
        .innerText()) || '0%';

    return Number(text.replace(/[^0-9]/g, ''));
  }
}