<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductCommentModerationRequest;
use App\Http\Requests\Admin\ProductCommentReplyRequest;
use App\Models\Product;
use App\Models\ProductComment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductCommentController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);
        $status = $request->string('status')->toString();
        $productId = $request->integer('product_id') ?: null;
        $search = $request->string('search')->toString();

        $query = ProductComment::query()
            ->with([
                'product:id,title',
                'user:id,name,email',
                'replies' => function ($builder) {
                    $builder
                        ->with('user:id,name,email')
                        ->orderBy('created_at', 'asc');
                },
            ])
            ->whereNull('parent_id');

        if ($status !== '') {
            $query->where('status', $status);
        }

        if ($productId) {
            $query->where('product_id', $productId);
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('body', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($inner) use ($search) {
                        $inner->where('title', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($inner) use ($search) {
                        $inner
                            ->where('email', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        $items = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $products = Product::query()
            ->select(['id', 'title'])
            ->orderBy('title')
            ->get()
            ->map(static fn (Product $product): array => [
                'value' => $product->id,
                'label' => $product->title,
            ])
            ->values()
            ->all();

        return Inertia::render('admin/comments/index', [
            'items' => $items,
            'filters' => [
                'status' => $status !== '' ? $status : null,
                'product_id' => $productId ? (string) $productId : null,
                'search' => $search !== '' ? $search : null,
            ],
            'products' => $products,
            'statusOptions' => [
                ['value' => ProductComment::STATUS_PENDING, 'label' => 'Beklemede'],
                ['value' => ProductComment::STATUS_APPROVED, 'label' => 'Onaylandı'],
                ['value' => ProductComment::STATUS_REJECTED, 'label' => 'Reddedildi'],
            ],
        ]);
    }

    public function approve(ProductCommentModerationRequest $request, ProductComment $comment)
    {
        $comment->update([
            'status' => ProductComment::STATUS_APPROVED,
            'approved_at' => now(),
            'approved_by' => $request->user()?->id,
        ]);

        return back();
    }

    public function reject(ProductCommentModerationRequest $request, ProductComment $comment)
    {
        $comment->update([
            'status' => ProductComment::STATUS_REJECTED,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        return back();
    }

    public function reply(ProductCommentReplyRequest $request, ProductComment $comment)
    {
        if ($comment->parent_id !== null) {
            throw ValidationException::withMessages([
                'body' => 'Sadece ana yorumlara cevap verilebilir.',
            ]);
        }

        $user = $request->user();

        ProductComment::create([
            'product_id' => $comment->product_id,
            'user_id' => $user?->id,
            'parent_id' => $comment->id,
            'body' => $request->validated('body'),
            'status' => ProductComment::STATUS_APPROVED,
            'approved_at' => now(),
            'approved_by' => $user?->id,
        ]);

        return back();
    }

    public function destroy(ProductCommentModerationRequest $request, ProductComment $comment)
    {
        $comment->replies()->delete();
        $comment->delete();

        return back();
    }
}
