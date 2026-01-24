import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Image as ImageIcon,
    LayoutGrid,
    Package,
    Percent,
    Tag,
    User,
    Layers,
    Leaf,
    List,
    Plus,
} from 'lucide-react';
import AppLogo from './app-logo';
import { useCurrentUrl } from '@/hooks/use-current-url';

const adminNavItems: NavItem[] = [
    {
        title: 'Gösterge Paneli',
        href: admin.dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Ürün',
        href: admin.products.index(),
        icon: Package,
        children: [
            {
                title: 'Listele',
                href: admin.products.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.products.create(),
                icon: Plus,
            },
        ]
    },
    {
        title: 'Görsel',
        href: admin.images.index(),
        icon: ImageIcon,
    },
    {
        title: 'İndirim',
        href: admin.discounts.index(),
        icon: Percent,
        children: [
            {
                title: 'Listele',
                href: admin.discounts.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.discounts.create(),
                icon: Plus,
            },
        ],
    },
    {
        title: 'Kullanıcılar',
        href: admin.users.index(),
        icon: User,
        children: [
            {
                title: 'Listele',
                href: admin.users.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.users.create(),
                icon: Plus,
            },
        ],
    },
];

const definitionsNavItems: NavItem[] = [
    {
        title: 'Kategori',
        href: admin.categories.index(),
        icon: Layers,
        children: [
            {
                title: 'Listele',
                href: admin.categories.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.categories.create(),
                icon: Plus,
            },
        ],
    },
    {
        title: 'Etiket',
        href: admin.tags.index(),
        icon: Tag,
        children: [
            {
                title: 'Listele',
                href: admin.tags.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.tags.create(),
                icon: Plus,
            }
        ],
    },
    {
        title: 'Marka',
        href: admin.brands.index(),
        icon: Tag,
        children: [
            {
                title: 'Listele',
                href: admin.brands.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.brands.create(),
                icon: Plus,
            },
        ],
    },
    {
        title: 'Malzeme',
        href: admin.ingredients.index(),
        icon: Leaf,
        children: [
            {
                title: 'Listele',
                href: admin.ingredients.index(),
                icon: List,
            },
            {
                title: 'Ekle',
                href: admin.ingredients.create(),
                icon: Plus,
            },
        ],
    },
];

export function AppSidebar() {
    const { currentUrl } = useCurrentUrl();
    const isAdminArea = currentUrl.startsWith('/suug');
    const mainNavItems = isAdminArea ? adminNavItems : [];
    const definitionItems = isAdminArea ? definitionsNavItems : [];

    const logoHref = isAdminArea ? admin.dashboard() : home();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={definitionItems} label="Tanımlamalar" />
            </SidebarContent>
        </Sidebar>
    );
}
