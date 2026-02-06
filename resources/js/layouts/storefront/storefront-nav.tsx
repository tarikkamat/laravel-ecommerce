import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import type { SharedData, NavCategory, NavBrand } from '@/types';
import storefront from '@/routes/storefront';
import { useStorefrontSearch } from '@/hooks/use-storefront-search';
import { useStorefrontSearchSuggestions } from '@/hooks/use-storefront-search-suggestions';

type MegaMenuType = 'brands' | 'category' | null;

export function StorefrontNav() {
    const { auth, navCategories, navBrands, cartSummary, storefrontSettings } = usePage<SharedData>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuType>(null);
    const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [mobileCategoryId, setMobileCategoryId] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { search, setSearch, submitSearch } = useStorefrontSearch();
    const suggestions = useStorefrontSearchSuggestions(search);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (cartRef.current && !cartRef.current.contains(target)) {
                setIsCartOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuEnter = (type: MegaMenuType, category?: NavCategory) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveMegaMenu(type);
        if (category) {
            setActiveCategory(category);
        }
    };

    const handleMenuLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
            setActiveCategory(null);
        }, 150);
    };

    const handleMegaMenuEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const cartItemsCount = cartSummary?.itemsCount ?? 0;
    const cartTotals = cartSummary?.totals;
    const cartItems = cartTotals?.items ?? [];
    const siteSettings = storefrontSettings?.site;
    const navSettings = storefrontSettings?.navigation;
    const headerMenu = navSettings?.header_menu ?? [];
    const showHomeLink = navSettings?.show_home_link ?? true;
    const showBrandsMenu = navSettings?.show_brands_menu ?? true;
    const showCategoriesMenu = navSettings?.show_categories_menu ?? true;
    const headerLogoPath = siteSettings?.header_logo_path ? `/storage/${siteSettings.header_logo_path}` : '';
    const headerLogoText = siteSettings?.header_logo_text || 'SUUG';
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileBrandsOpen(false);
        setMobileCategoriesOpen(false);
        setMobileCategoryId(null);
    };

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/80 py-6 shadow-sm backdrop-blur-xl dark:bg-black/80'
                    : 'bg-transparent py-8'
            }`}
        >
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12 mt-5">
                {/* Logo Area */}
                <Link
                    href={storefront.home.index.url()}
                    className="group flex h-[110px] items-center transition-transform hover:scale-105"
                >
                    {headerLogoPath ? (
                        <img
                            src={headerLogoPath}
                            alt={headerLogoText}
                            className="h-[110px] w-[280px] object-contain transition-transform group-hover:rotate-1"
                        />
                    ) : (
                        <div className="flex h-[110px] w-[280px] items-center justify-center rounded-xl bg-[#ec135b] text-white shadow-lg shadow-[#ec135b]/20 transition-transform group-hover:rotate-1">
                            <span className="material-symbols-outlined !text-[32px]">spa</span>
                        </div>
                    )}
                </Link>

                {/* Main Navigation */}
                <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
                    {/* Anasayfa */}
                    {showHomeLink && (
                        <Link
                            href={storefront.home.index.url()}
                            className="group relative px-5 py-2 text-[13px] font-black uppercase tracking-widest text-[#181113] transition-colors hover:text-[#ec135b] dark:text-[#f4f0f2]"
                            onMouseEnter={() => handleMenuEnter(null)}
                        >
                            Anasayfa
                            <span className="absolute bottom-1 left-5 right-5 h-0.5 scale-x-0 bg-[#ec135b] transition-transform duration-300 group-hover:scale-x-100"></span>
                        </Link>
                    )}

                    {/* Markalar - Mega Menu */}
                    {showBrandsMenu && (
                        <div
                            className="relative"
                            onMouseEnter={() => handleMenuEnter('brands')}
                            onMouseLeave={handleMenuLeave}
                        >
                            <Link
                                href={storefront.brands.index.url()}
                                className={`group relative flex items-center gap-1 px-5 py-2 text-[13px] font-black uppercase tracking-widest transition-colors ${
                                    activeMegaMenu === 'brands'
                                        ? 'text-[#ec135b]'
                                        : 'text-[#181113] hover:text-[#ec135b] dark:text-[#f4f0f2]'
                                }`}
                            >
                                Markalar
                                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">
                                    expand_more
                                </span>
                                <span
                                    className={`absolute bottom-1 left-5 right-5 h-0.5 bg-[#ec135b] transition-transform duration-300 ${
                                        activeMegaMenu === 'brands' ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                                ></span>
                            </Link>
                        </div>
                    )}

                    {/* Kategoriler - Her biri Mega Menu */}
                    {showCategoriesMenu &&
                        navCategories?.map((category) => (
                            <div
                                key={category.id}
                                className="relative"
                                onMouseEnter={() => handleMenuEnter('category', category)}
                                onMouseLeave={handleMenuLeave}
                            >
                                <Link
                                    href={`/kategori/${category.slug}`}
                                    className={`group relative flex items-center gap-1 px-5 py-2 text-[13px] font-black uppercase tracking-widest transition-colors ${
                                        activeMegaMenu === 'category' && activeCategory?.id === category.id
                                            ? 'text-[#ec135b]'
                                            : 'text-[#181113] hover:text-[#ec135b] dark:text-[#f4f0f2]'
                                    }`}
                                >
                                    {category.title}
                                    {category.children.length > 0 && (
                                        <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">
                                            expand_more
                                        </span>
                                    )}
                                    <span
                                        className={`absolute bottom-1 left-5 right-5 h-0.5 bg-[#ec135b] transition-transform duration-300 ${
                                            activeMegaMenu === 'category' && activeCategory?.id === category.id
                                                ? 'scale-x-100'
                                                : 'scale-x-0'
                                        }`}
                                    ></span>
                                </Link>
                            </div>
                        ))}

                </nav>

                {/* Utility Controls */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div ref={searchRef} className="relative">
                        <button
                            className="flex size-10 items-center justify-center rounded-full text-[#181113] transition-all hover:bg-[#ec135b]/10 hover:text-[#ec135b] dark:text-[#f4f0f2]"
                            onClick={() => setIsSearchOpen((prev) => !prev)}
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </button>
                        {isSearchOpen && (
                            <div className="absolute right-0 top-12 z-[70] w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                                <div className="border-b border-gray-100 px-4 py-3 text-sm font-bold text-[#181113] dark:border-gray-800 dark:text-white">
                                    Ürün Ara
                                </div>
                                <div className="space-y-3 px-4 py-4">
                                    <div className="relative">
                                        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                                            search
                                        </span>
                                        <input
                                            autoFocus
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            placeholder="Örn. güneş kremi, La Roche"
                                            className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec135b]/30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                        />
                                        {search.trim().length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ec135b]"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    close
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {suggestions.isLoading && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Öneriler yükleniyor...
                                            </p>
                                        )}
                                        {suggestions.error && (
                                            <p className="text-xs text-red-500">{suggestions.error}</p>
                                        )}
                                        {!suggestions.isLoading &&
                                            !suggestions.error &&
                                            search.trim().length >= 2 &&
                                            suggestions.products.length === 0 &&
                                            suggestions.brands.length === 0 && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Öneri bulunamadı.
                                                </p>
                                            )}

                                        {suggestions.products.length > 0 && (
                                            <div>
                                                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    Ürünler
                                                </p>
                                                <div className="space-y-1">
                                                    {suggestions.products.map((product) => (
                                                        <Link
                                                            key={product.id}
                                                            href={storefront.products.show(product.slug).url}
                                                            onClick={() => setIsSearchOpen(false)}
                                                            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-[#181113] transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                                                        >
                                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                                                {product.image ? (
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.title}
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                    />
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-[18px] text-gray-400">
                                                                        photo
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <span className="block truncate">{product.title}</span>
                                                                {product.brand && (
                                                                    <span className="block truncate text-xs text-gray-400">
                                                                        {product.brand}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {suggestions.brands.length > 0 && (
                                            <div>
                                                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    Markalar
                                                </p>
                                                <div className="space-y-1">
                                                    {suggestions.brands.map((brand) => (
                                                        <Link
                                                            key={brand.id}
                                                            href={`/markalar/${brand.slug}/urunler`}
                                                            onClick={() => setIsSearchOpen(false)}
                                                            className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-[#181113] transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                                                        >
                                                            <span className="truncate">{brand.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            submitSearch({
                                                baseUrl: storefront.products.index.url(),
                                                preserveScroll: false,
                                            });
                                            setIsSearchOpen(false);
                                        }}
                                        className="h-10 w-full rounded-full bg-[#ec135b] text-sm font-bold text-white transition-opacity hover:opacity-90"
                                    >
                                        Ara
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account */}
                    {auth.user ? (
                        <Link
                            href={storefront.accounts.index.url()}
                            className="flex size-10 items-center justify-center rounded-full text-[#181113] transition-all hover:bg-[#ec135b]/10 hover:text-[#ec135b] dark:text-[#f4f0f2]"
                        >
                            <span className="material-symbols-outlined text-[22px]">person</span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex size-10 items-center justify-center rounded-full text-[#181113] transition-all hover:bg-[#ec135b]/10 hover:text-[#ec135b] dark:text-[#f4f0f2]"
                        >
                            <span className="material-symbols-outlined text-[22px]">login</span>
                        </Link>
                    )}

                    {/* Shopping Bag */}
                    <div ref={cartRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsCartOpen((prev) => !prev)}
                            className="group relative flex size-11 items-center justify-center rounded-full bg-[#181113] text-white shadow-lg shadow-[#181113]/10 transition-all hover:scale-110 hover:bg-[#ec135b] hover:shadow-[#ec135b]/20 dark:bg-[#f4f0f2] dark:text-[#181113]"
                            aria-expanded={isCartOpen}
                            aria-haspopup="dialog"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                            <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#ec135b] text-[10px] font-black text-white dark:border-[#181113]">
                                {cartItemsCount}
                            </div>
                        </button>

                        <div
                            className={`absolute right-0 top-14 z-[60] w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900 ${
                                isCartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                            }`}
                        >
                            <div className="border-b border-gray-100 px-4 py-3 text-sm font-bold text-[#181113] dark:border-gray-800 dark:text-white">
                                Sepetim ({cartItemsCount})
                            </div>

                            <div className="max-h-72 space-y-3 overflow-auto px-4 py-3">
                                {cartItems.length === 0 ? (
                                    <div className="rounded-xl bg-gray-50 px-3 py-6 text-center text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                                        Sepetiniz bos.
                                    </div>
                                ) : (
                                    cartItems.slice(0, 4).map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                                            <div className="min-w-0">
                                                <div className="truncate font-semibold text-[#181113] dark:text-white">
                                                    {item.title}
                                                </div>
                                                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                                    {item.qty} adet
                                                </div>
                                            </div>
                                            <div className="shrink-0 font-bold text-[#ec135b]">
                                                {Number(item.line_subtotal ?? 0).toFixed(2)} TL
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="space-y-2 border-t border-gray-100 px-4 py-3 text-xs dark:border-gray-800">
                                <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                                    <span>Ara Toplam</span>
                                    <span className="font-semibold">{Number(cartTotals?.subtotal ?? 0).toFixed(2)} TL</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                                    <span>Vergi</span>
                                    <span className="font-semibold">{Number(cartTotals?.tax_total ?? 0).toFixed(2)} TL</span>
                                </div>
                                <div className="flex items-center justify-between text-base font-black text-[#181113] dark:text-white">
                                    <span>Toplam</span>
                                    <span>{Number(cartTotals?.grand_total ?? 0).toFixed(2)} TL</span>
                                </div>

                                <Link
                                    href={storefront.cart.index.url()}
                                    onClick={() => setIsCartOpen(false)}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#181113] px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#ec135b] dark:bg-white dark:text-[#181113] dark:hover:bg-[#ec135b] dark:hover:text-white"
                                >
                                    Sepete Git
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex size-10 items-center justify-center rounded-full text-[#181113] dark:text-[#f4f0f2] lg:hidden"
                        aria-label="Menüyü aç"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50"
                        onClick={closeMobileMenu}
                        aria-label="Menüyü kapat"
                    />
                    <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl dark:bg-[#0f0a0c]">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                            <Link
                                href={storefront.home.index.url()}
                                className="text-lg font-black tracking-wide text-[#181113] dark:text-white"
                                onClick={closeMobileMenu}
                            >
                                {headerLogoText}
                            </Link>
                            <button
                                type="button"
                                onClick={closeMobileMenu}
                                className="flex size-9 items-center justify-center rounded-full text-[#181113] dark:text-white"
                                aria-label="Menüyü kapat"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <div className="space-y-4">
                                {showHomeLink && (
                                    <Link
                                        href={storefront.home.index.url()}
                                        onClick={closeMobileMenu}
                                        className="block text-sm font-bold uppercase tracking-widest text-[#181113] dark:text-white"
                                    >
                                        Anasayfa
                                    </Link>
                                )}

                                {headerMenu.map((item) => (
                                    <Link
                                        key={item.url}
                                        href={item.url}
                                        onClick={closeMobileMenu}
                                        className="block text-sm font-bold uppercase tracking-widest text-[#181113] dark:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {showBrandsMenu && (
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => setMobileBrandsOpen((prev) => !prev)}
                                            className="flex w-full items-center justify-between text-sm font-bold uppercase tracking-widest text-[#181113] dark:text-white"
                                        >
                                            Markalar
                                            <span className="material-symbols-outlined text-[18px]">
                                                {mobileBrandsOpen ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                        {mobileBrandsOpen && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {navBrands?.map((brand) => (
                                                    <Link
                                                        key={brand.id}
                                                        href={`/markalar/${brand.slug}/urunler`}
                                                        onClick={closeMobileMenu}
                                                        className="rounded-lg border border-gray-100 px-3 py-2 text-xs font-semibold text-[#181113] dark:border-gray-800 dark:text-white"
                                                    >
                                                        {brand.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showCategoriesMenu && (
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                                            className="flex w-full items-center justify-between text-sm font-bold uppercase tracking-widest text-[#181113] dark:text-white"
                                        >
                                            Kategoriler
                                            <span className="material-symbols-outlined text-[18px]">
                                                {mobileCategoriesOpen ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                        {mobileCategoriesOpen && (
                                            <div className="space-y-2">
                                                {navCategories?.map((category) => (
                                                    <div key={category.id} className="rounded-lg border border-gray-100 dark:border-gray-800">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setMobileCategoryId((prev) =>
                                                                    prev === category.id ? null : category.id
                                                                )
                                                            }
                                                            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-[#181113] dark:text-white"
                                                        >
                                                            {category.title}
                                                            <span className="material-symbols-outlined text-[18px]">
                                                                {mobileCategoryId === category.id ? 'expand_less' : 'expand_more'}
                                                            </span>
                                                        </button>
                                                        {mobileCategoryId === category.id && (
                                                            <div className="space-y-1 px-3 pb-3">
                                                                <Link
                                                                    href={`/kategori/${category.slug}`}
                                                                    onClick={closeMobileMenu}
                                                                    className="block text-xs font-semibold text-[#ec135b]"
                                                                >
                                                                    Tümünü Gör
                                                                </Link>
                                                                {category.children.map((sub) => (
                                                                    <Link
                                                                        key={sub.id}
                                                                        href={`/kategori/${sub.slug}`}
                                                                        onClick={closeMobileMenu}
                                                                        className="block text-xs text-gray-600 dark:text-gray-300"
                                                                    >
                                                                        {sub.title}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mega Menu - Brands */}
            {showBrandsMenu && (
                <div
                    className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 ${
                        activeMegaMenu === 'brands'
                            ? 'max-h-[500px] opacity-100'
                            : 'pointer-events-none max-h-0 opacity-0'
                    }`}
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMenuLeave}
                >
                    <div className="border-t border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#181113] dark:text-white">
                                    Tüm Markalar
                                </h3>
                                <Link
                                    href={storefront.brands.index.url()}
                                    className="flex items-center gap-1 text-sm font-medium text-[#ec135b] transition-colors hover:text-[#ec135b]/80"
                                >
                                    Tümünü Gör
                                    <span className="material-symbols-outlined text-[18px]">
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>
                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                                {navBrands?.map((brand) => (
                                    <BrandLogoCard key={brand.id} brand={brand} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mega Menu - Category */}
            {showCategoriesMenu && (
                <div
                    className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 ${
                        activeMegaMenu === 'category' && activeCategory && activeCategory.children.length > 0
                            ? 'max-h-[500px] opacity-100'
                            : 'pointer-events-none max-h-0 opacity-0'
                    }`}
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMenuLeave}
                >
                    <div className="border-t border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
                            {activeCategory && (
                                <>
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-[#181113] dark:text-white">
                                            {activeCategory.title}
                                        </h3>
                                        <Link
                                            href={`/kategori/${activeCategory.slug}`}
                                            className="flex items-center gap-1 text-sm font-medium text-[#ec135b] transition-colors hover:text-[#ec135b]/80"
                                        >
                                            Tümünü Gör
                                            <span className="material-symbols-outlined text-[18px]">
                                                arrow_forward
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                        {activeCategory.children.map((subCategory) => (
                                            <div key={subCategory.id} className="space-y-3">
                                                <Link
                                                    href={`/kategori/${subCategory.slug}`}
                                                    className="group block text-sm font-bold text-[#181113] transition-colors hover:text-[#ec135b] dark:text-white"
                                                >
                                                    <span className="border-b-2 border-transparent transition-colors group-hover:border-[#ec135b]">
                                                        {subCategory.title}
                                                    </span>
                                                </Link>
                                                {subCategory.children.length > 0 && (
                                                    <ul className="space-y-2">
                                                        {subCategory.children.map((grandChild) => (
                                                            <li key={grandChild.id}>
                                                                <Link
                                                                    href={`/kategori/${grandChild.slug}`}
                                                                    className="text-sm text-gray-600 transition-colors hover:text-[#ec135b] dark:text-gray-400"
                                                                >
                                                                    {grandChild.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

// Brand Logo Card Component
function BrandLogoCard({ brand }: { brand: NavBrand }) {
    return (
        <Link
            href={`/markalar/${brand.slug}/urunler`}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-[#ec135b]/20 hover:bg-[#ec135b]/5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
            {brand.image ? (
                <div className="flex h-12 w-full items-center justify-center">
                    <img
                        src={brand.image}
                        alt={brand.title}
                        className="max-h-12 max-w-full object-contain grayscale transition-all group-hover:grayscale-0"
                    />
                </div>
            ) : (
                <div className="flex h-12 w-full items-center justify-center">
                    <span className="text-center text-xs font-bold text-gray-400 transition-colors group-hover:text-[#ec135b]">
                        {brand.title}
                    </span>
                </div>
            )}
        </Link>
    );
}
