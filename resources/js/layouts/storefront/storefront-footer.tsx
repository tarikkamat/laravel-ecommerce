import { Link } from '@inertiajs/react';
import storefront from '@/routes/storefront';

export function StorefrontFooter() {
    return (
        <footer className="border-t border-gray-100 bg-white py-12 dark:border-white/5 dark:bg-[#1a0c10]">
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#ec135b] text-white">
                                <span className="material-symbols-outlined !text-[24px]">
                                    spa
                                </span>
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight text-[#181113] dark:text-[#f4f0f2]">
                                Suug
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Elevating your daily ritual with clean, conscious
                            beauty essentials designed for the modern lifestyle.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-gray-400 transition-colors hover:text-[#ec135b]"
                            >
                                <span className="sr-only">Instagram</span>
                                <svg
                                    aria-hidden="true"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        clipRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.123 3.33c.636-.247 1.363-.416 2.427-.465C7.552 2.012 7.906 2 10.315 2h2zm-2.094 2C9.551 4.008 9.232 4.009 8.23 4.053l-.36.019c-1.09.055-1.677.26-2.074.413-.42.164-.72.36-1.03.67-.31.31-.506.61-.67 1.03-.165.428-.359.993-.413 2.073l-.018.36c-.044.97-.044 1.258.001 2.583l.017.359c.055 1.09.26 1.677.413 2.074.164.42.36.72.67 1.03.31.31.61.506 1.03.67.428.165.993.359 2.073.413l.36.018c.97.044 1.258.044 2.583-.001l.359-.017c1.09-.055 1.677-.26 2.074-.413.42-.164.72-.36 1.03-.67.31-.31.506-.61.67-1.03.165-.428.359-.993.413-2.073l.018-.36c.044-.97.044-1.258-.001-2.583l-.017-.359c-.055-1.09-.26-1.677-.413-2.074-.164-.42-.36-.72-.67-1.03-.31-.31-.61-.506-1.03-.67-.428-.165-.993-.359-2.073-.413l-.36-.018c-.97-.044-1.258-.044-2.583.001zM12.315 7a5.315 5.315 0 110 10.63 5.315 5.315 0 010-10.63zm0 1.8a3.515 3.515 0 100 7.03 3.515 3.515 0 000-7.03zm5.568-4.116a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 transition-colors hover:text-[#ec135b]"
                            >
                                <span className="sr-only">Twitter</span>
                                <svg
                                    aria-hidden="true"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#181113] dark:text-[#f4f0f2]">
                            Shop
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <Link
                                    href={storefront.products.index.url()}
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={storefront.categories.index.url()}
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={storefront.brands.index.url()}
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Brands
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Gift Cards
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#181113] dark:text-[#f4f0f2]">
                            Company
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Our Story
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Sustainability
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-[#ec135b]"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-1">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#181113] dark:text-[#f4f0f2]">
                            Stay in the loop
                        </h3>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            Sign up for 10% off your first order and exclusive
                            access to new drops.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                className="h-10 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-[#181113] outline-none focus:border-[#ec135b] focus:ring-1 focus:ring-[#ec135b] dark:border-white/20 dark:text-[#f4f0f2] placeholder:text-gray-400"
                                placeholder="Enter your email"
                                type="email"
                            />
                            <button
                                className="h-10 w-full rounded-lg bg-[#181113] text-sm font-bold text-white transition-colors hover:bg-[#ec135b] dark:bg-white dark:text-[#181113] dark:hover:bg-gray-200"
                                type="submit"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-xs text-gray-400 dark:border-white/5 sm:flex-row">
                    <p>© 2024 Suug Cosmetics. All rights reserved.</p>
                    <div className="mt-4 flex gap-6 sm:mt-0">
                        <a href="#" className="hover:text-[#ec135b]">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-[#ec135b]">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
