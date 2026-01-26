import { Plus } from 'lucide-react';
import { AddressCard } from './AddressCard';
import { EmptyAddressState } from './EmptyAddressState';
import type { Address as AddressType } from '@/types';

type AddressSectionProps = {
    title: string;
    addresses: AddressType[];
    type: 'billing' | 'shipping';
};

export function AddressSection({
    title,
    addresses,
    type,
}: AddressSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{title}</h3>
                <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ec135b] hover:opacity-80 transition-opacity">
                    <Plus className="h-3 w-3" />
                    Yeni Ekle
                </button>
            </div>

            {addresses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </div>
            ) : (
                <EmptyAddressState type={type} />
            )}
        </div>
    );
}
