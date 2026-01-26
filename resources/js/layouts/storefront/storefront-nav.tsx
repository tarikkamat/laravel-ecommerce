import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import type { SharedData, NavCategory, NavBrand } from '@/types';
import storefront from '@/routes/storefront';

type MegaMenuType = 'brands' | 'category' | null;

export function StorefrontNav() {
    const { auth, navCategories, navBrands } = usePage<SharedData>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuType>(null);
    const [activeCategory, setActiveCategory] = useState<NavCategory | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/80 py-3 shadow-sm backdrop-blur-xl dark:bg-black/80'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
                {/* Logo Area */}
                <Link
                    href={storefront.home.index.url()}
                    className="group flex items-center gap-2.5 transition-transform hover:scale-105"
                >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#ec135b] text-white shadow-lg shadow-[#ec135b]/20 transition-transform group-hover:rotate-12">
                        <span className="material-symbols-outlined !text-[24px]">spa</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="text-xl font-black tracking-tighter text-[#181113] dark:text-[#f4f0f2]">
                            SUUG
                        </h1>
                        <span className="text-[8px] font-bold tracking-[0.2em] text-[#ec135b]">
                            BEAUTY
                        </span>
                    </div>
                </Link>

                {/* Main Navigation */}
                <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
                    {/* Anasayfa */}
                    <Link
                        href={storefront.home.index.url()}
                        className="group relative px-5 py-2 text-[13px] font-black uppercase tracking-widest text-[#181113] transition-colors hover:text-[#ec135b] dark:text-[#f4f0f2]"
                        onMouseEnter={() => handleMenuEnter(null)}
                    >
                        Anasayfa
                        <span className="absolute bottom-1 left-5 right-5 h-0.5 scale-x-0 bg-[#ec135b] transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>

                    {/* Markalar - Mega Menu */}
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

                    {/* Kategoriler - Her biri Mega Menu */}
                    {navCategories?.map((category) => (
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
                    <button className="flex size-10 items-center justify-center rounded-full text-[#181113] transition-all hover:bg-[#ec135b]/10 hover:text-[#ec135b] dark:text-[#f4f0f2]">
                        <span className="material-symbols-outlined text-[22px]">search</span>
                    </button>

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
                    <button className="group relative flex size-11 items-center justify-center rounded-full bg-[#181113] text-white shadow-lg shadow-[#181113]/10 transition-all hover:scale-110 hover:bg-[#ec135b] hover:shadow-[#ec135b]/20 dark:bg-[#f4f0f2] dark:text-[#181113]">
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#ec135b] text-[10px] font-black text-white dark:border-[#181113]">
                            0
                        </div>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button className="flex size-10 items-center justify-center rounded-full text-[#181113] dark:text-[#f4f0f2] lg:hidden">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>

            {/* Mega Menu - Brands */}
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

            {/* Mega Menu - Category */}
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
