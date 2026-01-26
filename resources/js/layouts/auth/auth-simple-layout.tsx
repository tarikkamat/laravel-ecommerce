import AppLogoIcon from '@/components/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-[#fafafa] p-6 dark:bg-black md:p-10">
            <div className="w-full max-w-[400px]">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-10">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#ec135b] text-white shadow-lg shadow-[#ec135b]/20">
                            <span className="material-symbols-outlined !text-[28px]">
                                spa
                            </span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
                        SUUG BEAUTY
                    </p>
                </div>
            </div>
        </div>
    );
}
