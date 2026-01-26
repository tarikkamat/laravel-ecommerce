import storefront from '@/routes/storefront';
import brands, { products } from '@/routes/storefront/brands';
import { Link } from '@inertiajs/react';
import { ShieldCheck, Leaf, Award, Truck } from 'lucide-react';

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
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-start justify-center px-8 md:px-16">
                    <div className="max-w-2xl text-white">
                        {/* Label */}
                        <div className="mb-6 flex items-center gap-2">
                            <span className="h-px w-8 bg-white"></span>
                            <span className="text-xs font-bold uppercase tracking-widest">
                                %100 Güvenli Alışveriş
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-display mb-6 text-5xl font-black leading-[1.1] tracking-tighter md:text-7xl">
                            Suug ile
                            <br />
                            Güzelliğe Güven
                        </h1>

                        {/* Description */}
                        <p className="mb-8 text-lg font-medium leading-relaxed text-white/90 md:text-xl">
                            Orijinal ürünler, güvenli ödeme ve hızlı teslimat.
                            Cildinize en iyisini sunmak için titizlikle seçilmiş
                            dünya markalarını keşfedin.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link
                                href={storefront.products.index.url()}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-[#ec135b] px-8 text-base font-bold text-white shadow-lg shadow-[#ec135b]/30 transition-all hover:scale-105 hover:bg-[#ec135b]/90"
                            >
                                Ürünleri Keşfet
                            </Link>
                            <Link
                                href={storefront.brands.index.url()}
                                className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                Markalar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ec135b]/10">
                        <ShieldCheck className="h-6 w-6 text-[#ec135b]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">%100 Orijinal</p>
                        <p className="text-xs text-gray-500">Garantili Ürünler</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ec135b]/10">
                        <Truck className="h-6 w-6 text-[#ec135b]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Hızlı Teslimat</p>
                        <p className="text-xs text-gray-500">1-3 İş Günü</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ec135b]/10">
                        <Leaf className="h-6 w-6 text-[#ec135b]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Doğal İçerik</p>
                        <p className="text-xs text-gray-500">Temiz Formüller</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ec135b]/10">
                        <Award className="h-6 w-6 text-[#ec135b]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Premium Markalar</p>
                        <p className="text-xs text-gray-500">En İyi Seçim</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
