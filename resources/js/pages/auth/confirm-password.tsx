import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Şifreyi Onayla"
            description="Bu, uygulamanın güvenli bir alanıdır. Lütfen devam etmeden önce şifrenizi onaylayın."
        >
            <Head title="Şifreyi Onayla" />

            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-6">
                {({ processing, errors }) => (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Şifre
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                autoFocus
                                className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            disabled={processing}
                        >
                            {processing ? <Spinner className="mr-2" /> : null}
                            Şifreyi Onayla
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
