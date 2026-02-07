<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\ProductCommentStoreRequest;
use App\Models\Product;
use App\Models\ProductComment;
use Illuminate\Http\RedirectResponse;

class ProductCommentController extends Controller
{
    public function store(ProductCommentStoreRequest $request, Product $product): RedirectResponse
    {
        if (! $product->comments_enabled) {
            abort(403);
        }

        $user = $request->user();

        ProductComment::create([
            'product_id' => $product->id,
            'user_id' => $user?->id,
            'body' => $request->validated('body'),
            'status' => ProductComment::STATUS_PENDING,
        ]);

        return back();
    }
}
