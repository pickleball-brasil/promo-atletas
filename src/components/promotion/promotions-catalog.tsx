'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { categories, promotions } from '@/mocks';
import { testIds } from '@/lib/test-ids';
import type { Platform } from '@/types/domain';

import { PromotionCard } from './promotion-card';

const ITEMS_PER_PAGE = 8;

type SortOption = 'latest' | 'discount' | 'clicks';

const platformOptions: Array<{ value: Platform | 'all'; label: string }> = [
  { value: 'all', label: 'Todas as plataformas' },
  { value: 'mercadolivre', label: 'MercadoLivre' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'generic', label: 'Parceiros' },
];

export function PromotionsCatalog() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  const filtered = useMemo(() => {
    const activePromotions = promotions.filter((promotion) => promotion.isActive);
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return activePromotions.filter((promotion) => {
      const categoryMatch =
        selectedCategory === 'all' || promotion.categoryId === selectedCategory;
      const platformMatch =
        selectedPlatform === 'all' || promotion.platform === selectedPlatform;
      const textMatch =
        normalizedTerm.length === 0 ||
        promotion.title.toLowerCase().includes(normalizedTerm) ||
        promotion.description.toLowerCase().includes(normalizedTerm);

      return categoryMatch && platformMatch && textMatch;
    });
  }, [searchTerm, selectedCategory, selectedPlatform]);

  const sorted = useMemo(() => {
    const copy = [...filtered];

    if (sortBy === 'discount') {
      return copy.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    if (sortBy === 'clicks') {
      return copy.sort((a, b) => b.clicks - a.clicks);
    }

    return copy.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filtered, sortBy]);

  const visiblePromotions = sorted.slice(0, visibleCount);
  const canLoadMore = visibleCount < sorted.length;
  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedCategory !== 'all' ||
    selectedPlatform !== 'all' ||
    sortBy !== 'latest';

  const handleFiltersChange = (callback: () => void) => {
    callback();
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setSortBy('latest');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <section className="space-y-5" data-testid="promotions-catalog-root">

      {/* Barra superior: toggle mobile + busca */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">

        {/* Cabeçalho do painel — toggle mobile */}
        <div className="flex items-center gap-3 px-4 py-3 sm:hidden">
          <button
            type="button"
            onClick={() => setIsFiltersOpen((open) => !open)}
            data-testid={testIds.promotionsPage.filtersToggle}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            <SlidersHorizontal size={15} aria-hidden />
            Filtros
            {hasActiveFilters && (
              <span className="size-2 rounded-full bg-brand-500" aria-label="Filtros ativos" />
            )}
          </button>
          <span className="ml-auto text-sm text-neutral-500">{sorted.length} resultados</span>
        </div>

        {/* Painel de filtros */}
        <div className={`${isFiltersOpen ? 'block' : 'hidden sm:block'} border-t border-neutral-100 p-4 sm:border-t-0`}>

          {/* Linha 1: busca */}
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input
              type="search"
              value={searchTerm}
              data-testid={testIds.promotionsPage.searchInput}
              onChange={(event) => handleFiltersChange(() => setSearchTerm(event.target.value))}
              placeholder="Buscar por título ou descrição…"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm text-neutral-700 outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Linha 2: selects + limpar */}
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="min-w-[140px] flex-1 space-y-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">Categoria</span>
              <select
                value={selectedCategory}
                data-testid={testIds.promotionsPage.categorySelect}
                onChange={(event) => handleFiltersChange(() => setSelectedCategory(event.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="all">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[140px] flex-1 space-y-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">Plataforma</span>
              <select
                value={selectedPlatform}
                data-testid={testIds.promotionsPage.platformSelect}
                onChange={(event) => handleFiltersChange(() => setSelectedPlatform(event.target.value as Platform | 'all'))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                {platformOptions.map((platform) => (
                  <option key={platform.value} value={platform.value}>{platform.label}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[130px] flex-1 space-y-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400">Ordenar por</span>
              <select
                value={sortBy}
                data-testid={testIds.promotionsPage.sortSelect}
                onChange={(event) => handleFiltersChange(() => setSortBy(event.target.value as SortOption))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="latest">Mais recente</option>
                <option value="discount">Maior desconto</option>
                <option value="clicks">Mais clicado</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              data-testid={testIds.promotionsPage.clearFilters}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-semibold text-neutral-500 transition hover:border-danger-500 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={14} aria-hidden />
              Limpar
            </button>
          </div>
        </div>
      </div>

      <p data-testid={testIds.promotionsPage.resultsCount} className="hidden text-sm text-neutral-400 sm:block">
        {sorted.length} promoc{sorted.length === 1 ? 'ao encontrada' : 'oes encontradas'}
      </p>

      {sorted.length === 0 ? (
        <div
          data-testid={testIds.promotionsPage.emptyState}
          className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-400"
        >
          {searchTerm.trim().length > 0
            ? `Nenhuma promocao encontrada para "${searchTerm.trim()}".`
            : 'Nenhuma promocao disponivel no momento.'}
        </div>
      ) : (
        <>
          <div
            data-testid={testIds.promotionsPage.list}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visiblePromotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>

          {canLoadMore ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + ITEMS_PER_PAGE)}
                data-testid={testIds.promotionsPage.loadMore}
                className="w-full max-w-sm rounded-xl border border-brand-500 px-5 py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50"
              >
                Carregar mais
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}