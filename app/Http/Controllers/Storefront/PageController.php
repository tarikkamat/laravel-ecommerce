<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Enums\PageType;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('active', true)
            ->firstOrFail();

        $isContact = $this->isContactPage($page);

        return Inertia::render('storefront/pages/show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'type' => $page->type->value,
                'content' => $page->content,
                'contact_email' => $page->contact_email,
                'contact_phone' => $page->contact_phone,
                'contact_address' => $page->contact_address,
            ],
            'apiEndpoints' => [
                'contact' => $isContact ? route('storefront.pages.contact', $page->slug) : null,
            ],
        ]);
    }

    public function contact(Request $request, string $slug): JsonResponse
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('active', true)
            ->firstOrFail();

        $isContact = $this->isContactPage($page);

        if (! $isContact) {
            abort(404);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $recipient = $page->contact_email ?: config('mail.from.address');

        if (! is_string($recipient) || trim($recipient) === '') {
            return response()->json([
                'message' => 'İletişim e-postası tanımlı değil.',
            ], 422);
        }

        try {
            Mail::send('emails.contact-form', [
                'pageTitle' => $page->title,
                'pageSlug' => $page->slug,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'messageBody' => $data['message'],
            ], function ($message) use ($recipient, $data, $page) {
                $fromAddress = config('mail.from.address');
                $fromName = config('mail.from.name');

                if (is_string($fromAddress) && $fromAddress !== '') {
                    $message->from($fromAddress, is_string($fromName) ? $fromName : null);
                }

                $message->to($recipient)
                    ->replyTo($data['email'], $data['name'])
                    ->subject('İletişim Formu: '.$page->title);
            });
        } catch (\Throwable $e) {
            Log::error('Contact form mail failed.', [
                'page_id' => $page->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
            ], 500);
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Mesajınız iletildi.',
        ]);
    }

    private function isContactPage(Page $page): bool
    {
        $normalizedSlug = Str::of((string) $page->slug)->ascii()->lower()->toString();

        return $page->type === PageType::CONTACT || $normalizedSlug === 'iletisim';
    }
}
