<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IImageService;
use Illuminate\Http\Request;

class ImagePickerController extends Controller
{
    public function __construct(private readonly IImageService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 24);

        return response()->json(
            $this->service->paginate($perPage)
        );
    }
}
