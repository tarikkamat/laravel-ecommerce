import { MapPin, Trash2, Edit2 } from 'lucide-react';
import type { Address as AddressType } from '@/types';

type AddressCardProps = {
    address: AddressType;
};

export function AddressCard({ address }: AddressCardProps) {
    return (
        <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#ec135b]/10 group-hover:text-[#ec135b] dark:bg-gray-900">
                    <MapPin className="h-5 w-5" />
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
                        <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {address.contact_name || 'İsimsiz Adres'}
                </h4>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                    {address.address}
                </p>
                {(address.city || address.zip_code) && (
                    <p className="text-[11px] font-medium text-gray-400">
                        {address.zip_code && `${address.zip_code} `}
                        {address.city}
                        {address.country && `, ${address.country}`}
                    </p>
                )}
            </div>
        </div>
    );
}
