'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X, Grid3x3, List, Dumbbell, Tag, ShoppingBag, ArrowUpDown, ChevronDown } from 'lucide-react';

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
  { value: 'musculacao', label: 'Musculação' },
  { value: 'crossfit', label: 'Crossfit' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'ciclismo', label: 'Ciclismo' },
  { value: 'futebol', label: 'Futebol' },
  { value: 'tenis', label: 'Tênis' },
  { value: 'natacao', label: 'Natação' },
];

export function PromotionsCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get('q') ?? '';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window === 'undefined') return 'grid';
    const saved = localStorage.getItem('promo-atletas:view-mode');
    return saved === 'list' ? 'list' : 'grid';
  });

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
    setSelectedCategory('all');
    setSelectedSport('all');
    setSelectedPlatform('all');
    setSortBy('latest');
    setVisibleCount(ITEMS_PER_PAGE);
    router.replace('/promocoes');
  };

  return (
    <section className="space-y-4" data-testid="promotions-catalog-root">

      {/* Barra de filtros compacta */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Selects — mobile em 2 colunas com tamanhos iguais */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:w-auto">
            <Dumbbell size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-brand-500" aria-hidden />
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <select
              value={selectedSport}
              onChange={(event) => handleFiltersChange(() => setSelectedSport(event.target.value as Sport | 'all'))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-1.5 pl-6 pr-6 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 sm:w-auto"
            >
              {sportOptions.map((sport) => (
                <option key={sport.value} value={sport.value}>{sport.label}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <Tag size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-brand-500" aria-hidden />
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <select
              value={selectedCategory}
              data-testid={testIds.promotionsPage.categorySelect}
              onChange={(event) => handleFiltersChange(() => setSelectedCategory(event.target.value))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-1.5 pl-6 pr-6 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 sm:w-auto"
            >
              <option value="all">Categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <ShoppingBag size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-brand-500" aria-hidden />
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <select
              value={selectedPlatform}
              data-testid={testIds.promotionsPage.platformSelect}
              onChange={(event) => handleFiltersChange(() => setSelectedPlatform(event.target.value as Platform | 'all'))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-1.5 pl-6 pr-6 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 sm:w-auto"
            >
              {platformOptions.map((platform) => (
                <option key={platform.value} value={platform.value}>{platform.label}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <ArrowUpDown size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-brand-500" aria-hidden />
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <select
              value={sortBy}
              data-testid={testIds.promotionsPage.sortSelect}
              onChange={(event) => handleFiltersChange(() => setSortBy(event.target.value as SortOption))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-1.5 pl-6 pr-6 text-xs text-neutral-600 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 sm:w-auto"
            >
              <option value="latest">Mais recente</option>
              <option value="discount">Maior desconto</option>
              <option value="clicks">Mais clicado</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              data-testid={testIds.promotionsPage.clearFilters}
              className="col-span-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-500 transition hover:border-danger-500 hover:text-danger-500 sm:w-auto"
            >
              <X size={12} aria-hidden />
              Limpar
            </button>
          )}
        </div>

        {/* Resultados + view toggle — empurrados para a direita */}
        <div className="ml-auto flex items-center gap-2">
          <span data-testid={testIds.promotionsPage.resultsCount} className="hidden text-xs text-neutral-400 sm:block">{sorted.length} resultado{sorted.length !== 1 ? 's' : ''}</span>
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              title="Visualizar em grid"
              className={`inline-flex items-center justify-center rounded-md p-1.5 transition ${
                viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Grid3x3 size={14} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              title="Visualizar em lista"
              className={`inline-flex items-center justify-center rounded-md p-1.5 transition ${
                viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <List size={14} aria-hidden />
            </button>
          </div>
        </div>

      </div>

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
                <PromotionCard key={promotion.id} promotion={promotion} priority={index < 4} compact />
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