import { Package, Heart, CreditCard, Settings, ChevronRight, LogOut, User } from 'lucide-react';
import type { User as UserType } from '@/types';
import { Link } from '@inertiajs/react';

type AccountSidebarProps = {
    user: UserType;
};

export function AccountSidebar({ user }: AccountSidebarProps) {
    const menuItems = [
        { icon: Package, label: 'Siparişlerim', href: '#', count: 0 },
        { icon: Heart, label: 'Favorilerim', href: '#', count: 0 },
        { icon: CreditCard, label: 'Ödemelerim', href: '#' },
        { icon: Settings, label: 'Ayarlar', href: '#' },
    ];

    return (
        <div className="space-y-4">
            {/* User Info - More Minimal */}
            <div className="flex items-center gap-3 px-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ec135b]/5 text-lg font-bold text-[#ec135b]">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
            </div>

            {/* Menu - More Minimal */}
            <div className="space-y-1">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-gray-400 group-hover:text-[#ec135b]" />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                {item.label}
                            </span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-400" />
                    </a>
                ))}
                
                <div className="my-2 h-px bg-gray-100 dark:bg-gray-800 mx-3" />

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-red-50 dark:hover:bg-red-950/20 group"
                >
                    <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-red-600 dark:text-gray-400 dark:group-hover:text-red-400">
                        Çıkış Yap
                    </span>
                </Link>
            </div>
        </div>
    );
}
