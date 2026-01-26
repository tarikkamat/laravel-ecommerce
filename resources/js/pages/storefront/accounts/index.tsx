import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import type { User as UserType, Address as AddressType } from '@/types';
import { AccountSidebar } from './components/AccountSidebar';
import { AddressSection } from './components/AddressSection';

type AccountPageProps = {
    user: UserType;
    addresses: AddressType[];
};

export default function Account({ user, addresses }: AccountPageProps) {
    const billingAddresses = addresses.filter((addr) => addr.type === 'billing');
    const shippingAddresses = addresses.filter((addr) => addr.type === 'shipping');

    return (
        <StorefrontLayout title="Hesabım">
            <main className="mx-auto w-full max-w-[1200px] px-6 py-10 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Hesabım
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kişisel bilgilerinizi ve sipariş tercihlerinizi yönetin.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <AccountSidebar user={user} />
                    </aside>

                    {/* Content */}
                    <div className="space-y-12 lg:col-span-9">
                        <AddressSection
                            title="Teslimat Adresleri"
                            addresses={shippingAddresses}
                            type="shipping"
                        />

                        <AddressSection
                            title="Fatura Adresleri"
                            addresses={billingAddresses}
                            type="billing"
                        />
                    </div>
                </div>
            </main>
        </StorefrontLayout>
    );
}
