export function TestimonialSection() {
    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-12">
            <div className="w-full overflow-hidden rounded-3xl bg-[#ec135b]/5 py-12 dark:bg-[#2A161C]">
                <div className="mx-auto max-w-4xl px-6 text-center">
                {/* Star Rating */}
                <div className="mb-6 flex justify-center gap-1 text-[#ec135b]">
                    <span className="material-symbols-outlined fill-current">
                        star
                    </span>
                    <span className="material-symbols-outlined fill-current">
                        star
                    </span>
                    <span className="material-symbols-outlined fill-current">
                        star
                    </span>
                    <span className="material-symbols-outlined fill-current">
                        star
                    </span>
                    <span className="material-symbols-outlined fill-current">
                        star
                    </span>
                </div>

                {/* Quote */}
                <blockquote className="mb-8 text-2xl font-semibold leading-relaxed text-[#181113] dark:text-[#f4f0f2] md:text-3xl">
                    "Suug has completely transformed my routine. The Velvet
                    Serum is a game-changer—my skin has never felt this
                    hydrated and glowy."
                </blockquote>

                {/* Author */}
                <cite className="not-italic text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
                    — SARAH JENKINS, VERIFIED BUYER
                </cite>

                {/* Brand Logos */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 transition-opacity hover:opacity-100 hover:grayscale-0 md:gap-16 dark:text-white">
                    <span className="font-serif text-xl font-black">VOGUE</span>
                    <span className="font-serif text-xl font-black">ELLE</span>
                    <span className="font-serif text-xl font-black">
                        Allure
                    </span>
                    <span className="font-serif text-xl font-black">
                        Harper's BAZAAR
                    </span>
                </div>
            </div>
        </div>
    </section>
);
}
