import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Kayıt Ol"
            description="Aramıza katılmak için bilgilerinizi girin"
        >
            <Head title="Kayıt Ol" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Ad Soyad
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Adınız Soyadınız"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError
                                    message={errors.name}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    E-posta Adresi
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="ornek@eposta.com"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Şifre
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Şifre Tekrarı
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing ? <Spinner className="mr-2" /> : null}
                                Kayıt Ol
                            </Button>
                        </div>

                        <div className="text-center text-xs text-gray-500">
                            Zaten bir hesabınız var mı?{' '}
                            <Link 
                                href={login()} 
                                className="font-bold text-[#ec135b] hover:underline" 
                                tabIndex={6}
                            >
                                Giriş Yapın
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
