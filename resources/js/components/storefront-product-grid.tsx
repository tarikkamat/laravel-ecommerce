import { Link, router, usePage } from '@inertiajs/react';
import type { Product, PaginatedData } from '@/types';
import { StorefrontProductCard } from '@/components/storefront-product-card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type StorefrontProductGridProps = {
    products: PaginatedData<Product>;
    sort?: string;
    categories?: CategoryNode[];
    brands?: BrandNode[];
    filters?: {
        categories?: string[];
        brands?: string[];
        price_min?: string | null;
        price_max?: string | null;
    };
    priceRange?: {
        min: number;
        max: number;
    };
    emptyTitle?: string;
    emptyDescription?: string;
    emptyCtaHref?: string;
    emptyCtaLabel?: string;
};

type CategoryNode = {
    id: number;
    title: string;
    slug: string;
    children: CategoryNode[];
};

type BrandNode = {
    id: number;
    title: string;
    slug: string;
};

type CategoryTreeProps = {
    categories: CategoryNode[];
    selected: string[];
    onToggle: (category: CategoryNode, checked: boolean) => void;
    query?: string;
    level?: number;
};

export function StorefrontProductGrid({
    products,
    sort = 'default',
    categories = [],
    brands = [],
    filters,
    priceRange,
    emptyTitle = 'Henüz ürün bulunmuyor',
    emptyDescription = 'Listelenecek ürün bulunamadı.',
    emptyCtaHref = '/',
    emptyCtaLabel = 'Ana Sayfaya Dön',
}: StorefrontProductGridProps) {
    const pageUrl = usePage().url;
    const pathname = pageUrl.split('?')[0] || pageUrl;
    const initialMin = filters?.price_min ? Number(filters.price_min) : priceRange?.min ?? 0;
    const initialMax = filters?.price_max ? Number(filters.price_max) : priceRange?.max ?? 0;
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        filters?.categories?.length ? filters.categories : []
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        filters?.brands?.length ? filters.brands : []
    );
    const [priceValues, setPriceValues] = useState<[number, number]>([
        initialMin,
        initialMax,
    ]);
    const [categorySearch, setCategorySearch] = useState('');
    const [brandSearch, setBrandSearch] = useState('');

    useEffect(() => {
        setSelectedCategories(filters?.categories?.length ? filters.categories : []);
        setSelectedBrands(filters?.brands?.length ? filters.brands : []);
        const nextMin = filters?.price_min ? Number(filters.price_min) : priceRange?.min ?? 0;
        const nextMax = filters?.price_max ? Number(filters.price_max) : priceRange?.max ?? 0;
        setPriceValues([nextMin, nextMax]);
    }, [filters?.categories, filters?.brands, filters?.price_min, filters?.price_max, priceRange?.min, priceRange?.max]);

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.visit(url, { preserveScroll: true });
    };

    const buildQuery = (nextSort: string) => {
        const query: Record<string, string> = {};

        if (nextSort !== 'default') {
            query.sort = nextSort;
        }

        if (selectedCategories.length > 0) {
            query.categories = selectedCategories.join(',');
        }

        if (selectedBrands.length > 0) {
            query.brands = selectedBrands.join(',');
        }

        const [minValue, maxValue] = priceValues;

        if (priceRange && minValue > priceRange.min) {
            query.price_min = String(minValue);
        }

        if (priceRange && maxValue < priceRange.max) {
            query.price_max = String(maxValue);
        }

        return query;
    };

    const handleSortChange = (value: string) => {
        router.get(pathname, buildQuery(value), { preserveScroll: true });
    };

    const handleApplyFilters = () => {
        router.get(pathname, buildQuery(sort), { preserveScroll: true });
    };

    const collectDescendantSlugs = (nodes: CategoryNode[]): string[] => {
        const slugs: string[] = [];
        nodes.forEach((node) => {
            slugs.push(node.slug);
            if (node.children.length > 0) {
                slugs.push(...collectDescendantSlugs(node.children));
            }
        });
        return slugs;
    };

    const handleToggleCategory = (category: CategoryNode, checked: boolean) => {
        const descendants = collectDescendantSlugs(category.children);
        if (checked) {
            setSelectedCategories((prev) =>
                Array.from(new Set([...prev, category.slug, ...descendants]))
            );
            return;
        }

        setSelectedCategories((prev) =>
            prev.filter((value) => value !== category.slug && !descendants.includes(value))
        );
    };

    if (products.data.length === 0) {
        return (
            <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-20 dark:bg-gray-800/50">
                    <span className="material-symbols-outlined mb-4 text-[64px] text-gray-300 dark:text-gray-600">
                        inventory_2
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-[#181113] dark:text-[#f4f0f2]">
                        {emptyTitle}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{emptyDescription}</p>
                    <Link
                        href={emptyCtaHref}
                        className="mt-6 rounded-lg bg-[#ec135b] px-6 py-3 font-bold text-white hover:bg-[#ec135b]/90"
                    >
                        {emptyCtaLabel}
                    </Link>
                </div>
            </div>
        );
    }

    const previousLink = products.links[0]?.url ?? null;
    const nextLink = products.links[products.links.length - 1]?.url ?? null;

    return (
        <section className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Filters Column */}
                <aside className="lg:col-span-3">
                    <div className="space-y-4">
                        {/* Categories Filter */}
                        {categories.length > 0 && (
                            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Kategoriler
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {selectedCategories.length} seçildi
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={categorySearch}
                                    onChange={(event) => setCategorySearch(event.target.value)}
                                    placeholder="Kategori ara"
                                    className="mb-3 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec135b]/30 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                                />
                                <CategoryTree
                                    categories={categories}
                                    selected={selectedCategories}
                                    onToggle={handleToggleCategory}
                                    query={categorySearch}
                                />
                            </div>
                        )}

                        {/* Brands Filter */}
                        {brands.length > 0 && (
                            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Markalar
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {selectedBrands.length} seçildi
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={brandSearch}
                                    onChange={(event) => setBrandSearch(event.target.value)}
                                    placeholder="Marka ara"
                                    className="mb-3 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec135b]/30 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                                />
                                <BrandList
                                    brands={brands}
                                    selected={selectedBrands}
                                    onToggle={(brand, checked) => {
                                        if (checked) {
                                            setSelectedBrands((prev) => [...prev, brand.slug]);
                                        } else {
                                            setSelectedBrands((prev) =>
                                                prev.filter((slug) => slug !== brand.slug)
                                            );
                                        }
                                    }}
                                    query={brandSearch}
                                />
                            </div>
                        )}

                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Fiyat Aralığı
                                </span>
                                <span className="text-xs text-gray-400">
                                    ₺{priceValues[0]} - ₺{priceValues[1]}
                                </span>
                            </div>
                            <Slider
                                min={priceRange?.min ?? 0}
                                max={priceRange?.max ?? 0}
                                step={1}
                                value={priceValues}
                                onValueChange={(value) =>
                                    setPriceValues([value[0] ?? 0, value[1] ?? 0])
                                }
                            />
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                                <span>₺{priceRange?.min ?? 0}</span>
                                <span>₺{priceRange?.max ?? 0}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className="h-11 w-full rounded-full bg-[#181113] px-6 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 dark:bg-[#f4f0f2] dark:text-[#181113]"
                        >
                            Filtrele
                        </button>
                    </div>
                </aside>

                {/* Products Column */}
                <div className="lg:col-span-9">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-[#181113] dark:text-[#f4f0f2]">
                                {products.total}
                            </span>{' '}
                            ürün bulundu
                            {products.from && products.to && (
                                <span className="ml-2">
                                    ({products.from}-{products.to} arası gösteriliyor)
                                </span>
                            )}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Sırala:
                            </span>
                            <Select defaultValue={sort} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sıralama seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Varsayılan</SelectItem>
                                    <SelectItem value="price_asc">Fiyat: Düşükten Yükseğe</SelectItem>
                                    <SelectItem value="price_desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                                    <SelectItem value="newest">En Yeniler</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                        {products.data.map((product) => (
                            <StorefrontProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(previousLink)}
                                disabled={products.current_page === 1}
                                className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#ec135b] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    chevron_left
                                </span>
                            </button>

                            {products.links.slice(1, -1).map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(link.url)}
                                    disabled={link.active || !link.url}
                                    className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                        link.active
                                            ? 'bg-[#ec135b] text-white'
                                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#ec135b] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}

                            <button
                                onClick={() => handlePageChange(nextLink)}
                                disabled={products.current_page === products.last_page}
                                className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#ec135b] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function CategoryTree({ categories, selected, onToggle, query = '', level = 0 }: CategoryTreeProps) {
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const normalizedQuery = query.trim().toLowerCase();

    useEffect(() => {
        if (level === 0) {
            setExpandedIds(new Set(categories.map((category) => category.id)));
        }
    }, [categories, level]);

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const hasMatch = (node: CategoryNode): boolean => {
        if (node.title.toLowerCase().includes(normalizedQuery)) return true;
        return node.children.some(hasMatch);
    };

    const filteredCategories = categories.filter((category) => {
        if (!normalizedQuery) return true;
        return hasMatch(category);
    });

    return (
        <div className={level > 0 ? 'ml-4 border-l border-gray-100 pl-3 dark:border-gray-800' : ''}>
            {filteredCategories.map((category) => {
                const hasChildren = category.children && category.children.length > 0;
                const isExpanded = expandedIds.has(category.id);
                const checked = selected.includes(category.slug);

                return (
                    <div key={category.id}>
                        <div className="flex items-center gap-2 py-1.5">
                            {hasChildren ? (
                                <button
                                    type="button"
                                    onClick={() => toggleExpand(category.id)}
                                    className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            ) : (
                                <span className="w-5" />
                            )}

                            <label className="flex flex-1 items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-[#ec135b]/40 dark:border-gray-800 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => onToggle(category, event.target.checked)}
                                    className="size-4 rounded border-gray-300 text-[#ec135b] focus:ring-[#ec135b]/30"
                                />
                                {category.title}
                            </label>
                        </div>

                        {hasChildren && isExpanded && (
                            <CategoryTree
                                categories={category.children}
                                selected={selected}
                                onToggle={onToggle}
                                query={query}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

type BrandListProps = {
    brands: BrandNode[];
    selected: string[];
    onToggle: (brand: BrandNode, checked: boolean) => void;
    query?: string;
};

function BrandList({ brands, selected, onToggle, query = '' }: BrandListProps) {
    const normalizedQuery = query.trim().toLowerCase();

    const filteredBrands = brands.filter((brand) => {
        if (!normalizedQuery) return true;
        return brand.title.toLowerCase().includes(normalizedQuery);
    });

    return (
        <div className="max-h-[300px] space-y-1.5 overflow-y-auto">
            {filteredBrands.map((brand) => {
                const checked = selected.includes(brand.slug);

                return (
                    <label
                        key={brand.id}
                        className="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-[#ec135b]/40 dark:border-gray-800 dark:text-gray-200"
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => onToggle(brand, event.target.checked)}
                            className="size-4 rounded border-gray-300 text-[#ec135b] focus:ring-[#ec135b]/30"
                        />
                        {brand.title}
                    </label>
                );
            })}
        </div>
    );
}
