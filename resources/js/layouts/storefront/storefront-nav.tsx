import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import storefront from '@/routes/storefront';

export function StorefrontNav() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="glass-nav fixed left-0 right-0 top-0 z-50 transition-colors duration-300">
            <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-12">
                {/* Logo */}
                <Link href="#" className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#ec135b]/10 text-[#ec135b] dark:bg-[#ec135b]/20">
                        <span className="material-symbols-outlined !text-[24px]">
                            spa
                        </span>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-[#181113] dark:text-[#f4f0f2]">
                        Suug
                    </h1>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        href="#"
                        className="text-sm font-semibold transition-colors hover:text-[#ec135b]"
                    >
                        Shop
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-semibold transition-colors hover:text-[#ec135b]"
                    >
                        Categories
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-semibold transition-colors hover:text-[#ec135b]"
                    >
                        Brands
                    </Link>
                    <a
                        href="#"
                        className="text-sm font-semibold transition-colors hover:text-[#ec135b]"
                    >
                        About
                    </a>
                </nav>

                {/* Utility Icons */}
                <div className="flex items-center gap-2">
                    <button className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/20 dark:hover:bg-black/20">
                        <span className="material-symbols-outlined text-[20px]">
                            search
                        </span>
                    </button>
                    {auth.user ? (
                        <Link
                            href={storefront.accounts.index.url()}
                            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/20 dark:hover:bg-black/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                account_circle
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/20 dark:hover:bg-black/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                account_circle
                            </span>
                        </Link>
                    )}
                    <button className="group relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/20 dark:hover:bg-black/20">
                        <span className="material-symbols-outlined text-[20px]">
                            shopping_bag
                        </span>
                        <span className="absolute right-2 top-2 size-2 rounded-full bg-[#ec135b] ring-2 ring-white dark:ring-black"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
