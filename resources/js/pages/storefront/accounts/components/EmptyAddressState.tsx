import { MapPin, Plus } from 'lucide-react';

type EmptyAddressStateProps = {
    type: 'billing' | 'shipping';
};

export function EmptyAddressState({ type }: EmptyAddressStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-100 py-8 text-center dark:border-gray-800">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-300 dark:bg-gray-900/50">
                <MapPin className="h-6 w-6" />
            </div>
            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                {type === 'shipping' ? 'Kayıtlı teslimat adresi bulunamadı.' : 'Kayıtlı fatura adresi bulunamadı.'}
            </p>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                <Plus className="h-3 w-3" />
                Adres Ekle
            </button>
        </div>
    );
}
