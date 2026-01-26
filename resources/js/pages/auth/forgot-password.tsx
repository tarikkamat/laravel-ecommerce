import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Şifremi Unuttum"
            description="Şifre sıfırlama bağlantısı almak için e-posta adresinizi girin"
        >
            <Head title="Şifremi Unuttum" />

            {status && (
                <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-center text-xs font-medium text-emerald-600 dark:bg-emerald-950/20">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()} className="space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    E-posta Adresi
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="ornek@eposta.com"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sıfırlama Bağlantısı Gönder
                            </Button>
                        </>
                    )}
                </Form>

                <div className="text-center">
                    <Link 
                        href={login()} 
                        className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#ec135b] transition-colors"
                    >
                        Giriş Ekranına Dön
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
