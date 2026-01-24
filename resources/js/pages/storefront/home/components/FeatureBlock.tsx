export function FeatureBlock() {
    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-12">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#2A161C] md:p-12">
                <div className="flex flex-col-reverse items-center gap-12 lg:flex-row">
                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <span className="h-px w-8 bg-[#ec135b]"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#ec135b]">
                                The Science of Suug
                            </span>
                        </div>

                        <h2 className="font-display text-3xl font-bold leading-tight text-[#181113] dark:text-[#f4f0f2] md:text-5xl">
                            Pure ingredients,
                            <br />
                            powerful results.
                        </h2>

                        <p className="max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                            We believe skincare should be simple, effective, and
                            ethically grounded. Our vegan formulas are crafted
                            without compromise, blending potent botanicals with
                            clinical actives for skin that looks as good as it
                            feels.
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#181113] dark:text-[#f4f0f2]">
                                <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    <span className="material-symbols-outlined text-[16px]">
                                        check
                                    </span>
                                </span>
                                Vegan
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#181113] dark:text-[#f4f0f2]">
                                <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    <span className="material-symbols-outlined text-[16px]">
                                        check
                                    </span>
                                </span>
                                Cruelty-Free
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#181113] dark:text-[#f4f0f2]">
                                <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    <span className="material-symbols-outlined text-[16px]">
                                        check
                                    </span>
                                </span>
                                Sustainable
                            </div>
                        </div>

                        {/* Link */}
                        <div className="pt-6">
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 text-base font-bold text-[#181113] underline decoration-2 decoration-[#ec135b] underline-offset-4 transition-colors hover:text-[#ec135b] dark:text-[#f4f0f2]"
                            >
                                Read our philosophy
                                <span className="material-symbols-outlined text-[18px]">
                                    arrow_forward
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="w-full flex-1">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 md:aspect-[4/3]">
                            <img
                                alt="Botanical ingredients like leaves and oils arranged aesthetically"
                                className="h-full w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJo50BSailY9HbGgqOVw8MaZP5gzo4oPejQDy1PakbHcitEux7qqJeEwvCooA-IuvKP_vz7vop9LvGgNN52zLzd3r_In6-smStxMialKb7WywG5CrIma3eCiCT1BDN7nrkKjDTeu3BeEqtXdYGpVUG9_Uj_9yXFMtjop64-3oPGW47zbmJsId82QTxx7vmTlNziRb9EHo_absxx7RI4y6hreYKYzj9qyWfyHlEM1qebXTZC5WnIAwm3VVdunRgwe6eYKYoHes3DzQ"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
