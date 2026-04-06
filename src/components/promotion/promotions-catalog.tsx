'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Grid3x3, List } from 'lucide-react';

import { categories, promotions } from '@/mocks';
import { testIds } from '@/lib/test-ids';
import type { Platform, Sport } from '@/types/domain';

import { PromotionCard } from './promotion-card';
import { PromotionsList } from './promotions-list';

const ITEMS_PER_PAGE = 8;

type SortOption = 'latest' | 'discount' | 'clicks';

const platformOptions: Array<{ value: Platform | 'all'; label: string }> = [
  { value: 'all', label: 'Todas as plataformas' },
  { value: 'mercadolivre', label: 'MercadoLivre' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'generic', label: 'Parceiros' },
];

const sportOptions: Array<{ value: Sport | 'all'; label: string }> = [
  { value: 'all', label: 'Todos os esportes' },
  { value: 'corrida', label: 'Corrida' },
  { value: 'musculacao', label: 'Musculacao' },
  { value: 'crossfit', label: 'Crossfit' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'ciclismo', label: 'Ciclismo' },
  { value: 'futebol', label: 'Futebol' },
  { value: 'tenis', label: 'Tenis' },
  { value: 'natacao', label: 'Natacao' },
];

export function PromotionsCatalog() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('promo-atletas:view-mode') as 'grid' | 'list' | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference to localStorage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('promo-atletas:view-mode', mode);
  };

  const filtered = useMemo(() => {
    const activePromotions = promotions.filter((promotion) => promotion.isActive);
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return activePromotions.filter((promotion) => {
      const categoryMatch =
        selectedCategory === 'all' || promotion.categoryId === selectedCategory;
      const sportMatch = selectedSport === 'all' || promotion.sport === selectedSport;
      const platformMatch =
        selectedPlatform === 'all' || promotion.platform === selectedPlatform;
      const textMatch =
        normalizedTerm.length === 0 ||
        promotion.title.toLowerCase().includes(normalizedTerm) ||
        promotion.description.toLowerCase().includes(normalizedTerm);

      return categoryMatch && sportMatch && platformMatch && textMatch;
    });
  }, [searchTerm, selectedCategory, selectedSport, selectedPlatform]);

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
    selectedSport !== 'all' ||
    selectedPlatform !== 'all' ||
    sortBy !== 'latest';

  const handleFiltersChange = (callback: () => void) => {
    callback();
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSport('all');
    setSelectedPlatform('all');
    setSortBy('latest');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <section className="space-y-5" data-testid="promotions-catalog-root">

      {/* Barra superior: toggle mobile + busca */}
      <div className="rounded-2xl bg-white shadow-sm">

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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center">
              <div className="relative lg:min-w-0 lg:flex-[2]">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" aria-hidden />
                <input
                  type="search"
                  value={searchTerm}
                  data-testid={testIds.promotionsPage.searchInput}
                  onChange={(event) => handleFiltersChange(() => setSearchTerm(event.target.value))}
                  placeholder="Buscar por título ou descrição…"
                  className="w-full rounded-xl border border-brand-500/70 bg-brand-50/30 py-3 pl-10 pr-4 text-sm font-medium text-neutral-700 outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <select
                value={selectedCategory}
                data-testid={testIds.promotionsPage.categorySelect}
                onChange={(event) => handleFiltersChange(() => setSelectedCategory(event.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 lg:w-[170px] lg:flex-none"
              >
                <option value="all">Categoria: todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                value={selectedPlatform}
                data-testid={testIds.promotionsPage.platformSelect}
                onChange={(event) => handleFiltersChange(() => setSelectedPlatform(event.target.value as Platform | 'all'))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 lg:w-[155px] lg:flex-none"
              >
                {platformOptions.map((platform) => (
                  <option key={platform.value} value={platform.value}>{platform.label}</option>
                ))}
              </select>

              <select
                value={selectedSport}
                onChange={(event) => handleFiltersChange(() => setSelectedSport(event.target.value as Sport | 'all'))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 lg:w-[150px] lg:flex-none"
              >
                {sportOptions.map((sport) => (
                  <option key={sport.value} value={sport.value}>{sport.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                data-testid={testIds.promotionsPage.sortSelect}
                onChange={(event) => handleFiltersChange(() => setSortBy(event.target.value as SortOption))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 lg:w-[150px] lg:flex-none"
              >
                <option value="latest">Mais recente</option>
                <option value="discount">Maior desconto</option>
                <option value="clicks">Mais clicado</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                data-testid={testIds.promotionsPage.clearFilters}
                className="inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-500 transition hover:border-danger-500 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto lg:flex-none"
              >
                <X size={14} aria-hidden />
                Limpar
              </button>
            </div>

            {/* View mode toggle */}
            <div className="hidden sm:flex gap-1.5 justify-end sm:justify-start">
              <button
                type="button"
                onClick={() => handleViewModeChange('grid')}
                title="Visualizar em grid"
                className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-brand-500 text-white'
                    : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Grid3x3 size={16} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('list')}
                title="Visualizar em lista"
                className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <List size={16} aria-hidden />
              </button>
            </div>
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
          {/* Grid mode: única renderização para mobile e desktop */}
          {viewMode === 'grid' ? (
            <div
              data-testid={testIds.promotionsPage.list}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visiblePromotions.map((promotion, index) => (
                <PromotionCard key={promotion.id} promotion={promotion} priority={index < 4} />
              ))}
            </div>
          ) : (
            <>
              {/* Lista em desktop, grid em mobile */}
              <div className="sm:hidden">
                <div
                  data-testid={testIds.promotionsPage.list}
                  className="grid grid-cols-1 gap-4"
                >
                  {visiblePromotions.map((promotion, index) => (
                    <PromotionCard key={promotion.id} promotion={promotion} priority={index < 4} />
                  ))}
                </div>
              </div>
              <div className="hidden sm:block">
                <PromotionsList promotions={visiblePromotions} />
              </div>
            </>
          )}

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