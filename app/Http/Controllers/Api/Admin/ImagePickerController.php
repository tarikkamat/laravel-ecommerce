<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Services\Contracts\IImageService;
use Illuminate\Http\Request;

class ImagePickerController extends Controller
{
    public function __construct(private readonly IImageService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 24);
        $search = trim((string) $request->query('search', ''));
        $order = $request->query('order', 'newest');

        $query = Image::query();

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($order === 'oldest') {
            $query->orderBy('id', 'asc');
        } else {
            $query->orderBy('id', 'desc');
        }

        return response()->json(
            $query->paginate($perPage)->withQueryString()
        );
    }
}
