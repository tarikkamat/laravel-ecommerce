import { Link, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Leaf, Award, Truck } from 'lucide-react';
import type { SharedData } from '@/types';

export function HeroSection() {
    const { storefrontSettings } = usePage<SharedData>().props;
    const heroSlides = storefrontSettings?.home?.hero_slides ?? [];
    const autoplayMs = storefrontSettings?.home?.hero_autoplay_ms ?? 6000;
    const [activeIndex, setActiveIndex] = useState(0);

    const slides = useMemo(() => heroSlides.filter((slide) => slide.image_path), [heroSlides]);
    const safeIndex = slides.length > 0 ? activeIndex % slides.length : 0;

    const resolveImageUrl = useCallback((value: string) => {
        if (!value) return '';
        if (value.startsWith('http')) return value;
        return value.startsWith('/storage/') ? value : `/storage/${value}`;
    }, []);

    useEffect(() => {
        if (slides.length <= 1 || autoplayMs <= 0) return;
        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, autoplayMs);
        return () => window.clearInterval(timer);
    }, [slides.length, autoplayMs]);

    useEffect(() => {
        if (slides.length === 0) {
            setActiveIndex(0);
        } else if (activeIndex >= slides.length) {
            setActiveIndex(0);
        }
    }, [slides.length, activeIndex]);

    if (slides.length === 0) {
        return null;
    }

    const activeSlide = slides[safeIndex];

    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-12">
            <div className="relative h-[450px] w-full overflow-hidden rounded-3xl lg:h-[500px]">
                {/* Background Slides */}
                {slides.map((slide, index) => (
                    <div
                        key={`${slide.image_path}-${index}`}
                        className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 ${
                            index === safeIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                            backgroundImage: `url('${resolveImageUrl(slide.image_path)}')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                ))}

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-start justify-center px-8 md:px-16">
                    <div className="max-w-2xl text-white">
                        {/* Label */}
                        {activeSlide.eyebrow && (
                            <div className="mb-6 flex items-center gap-2">
                                <span className="h-px w-8 bg-white"></span>
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {activeSlide.eyebrow}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="font-display mb-6 whitespace-pre-line text-5xl font-black leading-[1.1] tracking-tighter md:text-7xl">
                            {activeSlide.title ?? ''}
                        </h1>

                        {/* Description */}
                        {activeSlide.subtitle && (
                            <p className="mb-8 text-lg font-medium leading-relaxed text-white/90 md:text-xl">
                                {activeSlide.subtitle}
                            </p>
                        )}

                        {/* CTA Buttons */}
                        {activeSlide.buttons &&
                            activeSlide.buttons.filter((button) => button.label && button.url).length > 0 && (
                            <div className="flex flex-col gap-4 sm:flex-row">
                                {activeSlide.buttons
                                    .filter((button) => button.label && button.url)
                                    .map((button, index) => (
                                    <Link
                                        key={`${button.label}-${index}`}
                                        href={button.url}
                                        className={
                                            button.variant === 'secondary'
                                                ? 'inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20'
                                                : 'inline-flex h-12 items-center justify-center rounded-full bg-[#ec135b] px-8 text-base font-bold text-white shadow-lg shadow-[#ec135b]/30 transition-all hover:scale-105 hover:bg-[#ec135b]/90'
                                        }
                                    >
                                        {button.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {slides.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={`hero-dot-${index}`}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2 w-8 rounded-full transition-colors ${
                                    index === safeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
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
