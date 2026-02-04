<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImageStoreRequest;
use App\Http\Requests\Admin\ImageUpdateRequest;
use App\Services\Contracts\IImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImageController extends Controller
{
    public function __construct(private readonly IImageService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/images/index', [
            'items' => $this->service->paginate($perPage)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/images/create');
    }

    public function store(ImageStoreRequest $request)
    {
        $data = $request->validated();
        $file = $request->file('image_file');
        $files = $request->file('image_files', []);

        unset($data['image_file'], $data['image_files']);

        if (!empty($files)) {
            $baseMetadata = $data;
            $totalFiles = count($files);

            foreach ($files as $uploadedFile) {
                $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $metadata = $baseMetadata;
                $metadata['title'] = $totalFiles === 1 && !empty($data['title']) ? $data['title'] : $originalName;
                $metadata['slug'] = $totalFiles === 1 && !empty($data['slug']) ? $data['slug'] : $originalName;

                $this->service->upload($uploadedFile, $metadata);
            }
        } elseif ($file) {
            unset($data['path']);
            $this->service->upload($file, $data);
        } else {
            $this->service->create($data);
        }

        return redirect()->route('admin.images.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/images/show', [
            'item' => $this->service->findOrFail($id)
        ]);
    }

    public function edit(int $id)
    {
        return Inertia::render('admin/images/edit', [
            'item' => $this->service->findOrFail($id)
        ]);
    }

    public function update(ImageUpdateRequest $request, int $id)
    {
        $data = $request->validated();
        $file = $request->file('image_file');

        unset($data['image_file']);

        if ($file) {
            unset($data['path']);
            $this->service->updateWithFile($id, $file, $data);
        } else {
            $this->service->update($id, $data);
        }

        return redirect()->route('admin.images.index');
    }

    public function destroy(int $id)
    {
        $this->service->deleteWithFile($id);

        return redirect()->route('admin.images.index');
    }
}
