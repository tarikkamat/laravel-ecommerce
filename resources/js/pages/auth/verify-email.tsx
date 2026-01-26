import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head, Link } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="E-postayı Doğrula"
            description="Lütfen az önce size e-postayla gönderdiğimiz bağlantıya tıklayarak e-posta adresinizi doğrulayın."
        >
            <Head title="E-posta Doğrulama" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-center text-xs font-medium text-emerald-600 dark:bg-emerald-950/20">
                    Kayıt sırasında verdiğiniz e-posta adresine yeni bir doğrulama bağlantısı gönderildi.
                </div>
            )}

            <Form {...send.form()} className="space-y-6">
                {({ processing }) => (
                    <div className="flex flex-col gap-4">
                        <Button 
                            disabled={processing} 
                            className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                        >
                            {processing ? <Spinner className="mr-2" /> : null}
                            Doğrulama E-postasını Tekrar Gönder
                        </Button>

                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#ec135b] transition-colors"
                        >
                            Çıkış Yap
                        </Link>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
