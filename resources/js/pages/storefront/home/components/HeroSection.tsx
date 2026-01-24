import { Link } from '@inertiajs/react';
import storefront from '@/routes/storefront';

export function HeroSection() {
    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-12">
            <div className="relative h-[450px] w-full overflow-hidden rounded-3xl lg:h-[500px]">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQL5iZqD_1HNJ8A0EJklJjaRIPkQy3OXCzf-8858m7Rh8NDRUhK-QoWOzT-iqbMUDJbgi1_whJ9F_SNC6Inxmp-st6ihH7E1TS0FfnKuoyzfyELiJIzlY4W-u9X6mJ-ousZKM8DprTYpaxcnc6qQAh85LdmrMM9h0Ds6hy0dfWGrypdQVtYveq56fx7n29_JA7lcMsRh1DjeaBarkRgYZdiQuibi3_uhG4FmYYTUbPud7DMKP6ju6pexVZNupba0SvQB4AGF73LAg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-start justify-center px-8 md:px-16">
                    <div className="max-w-2xl text-white">
                        {/* Label */}
                        <div className="mb-6 flex items-center gap-2">
                            <span className="h-px w-8 bg-white"></span>
                            <span className="text-xs font-bold uppercase tracking-widest">
                                New Collection
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-display mb-6 text-5xl font-black leading-[1.1] tracking-tighter md:text-7xl">
                            Radiance,
                            <br />
                            Refined.
                        </h1>

                        {/* Description */}
                        <p className="mb-8 text-lg font-medium leading-relaxed text-white/90 md:text-xl">
                            Pure ingredients, powerful results. Discover our
                            clean beauty formulas crafted for the modern
                            minimalist.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link
                                href={storefront.products.index.url()}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-[#ec135b] px-8 text-base font-bold text-white shadow-lg shadow-[#ec135b]/30 transition-all hover:scale-105 hover:bg-[#ec135b]/90"
                            >
                                Shop Collection
                            </Link>
                            <a
                                href="#"
                                className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                View Journal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
