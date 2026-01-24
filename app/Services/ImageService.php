<?php

namespace App\Services;

use App\Models\Image;
use App\Repositories\Contracts\IImageRepository;
use App\Services\Contracts\IImageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService extends BaseService implements IImageService
{
    public function __construct(IImageRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Upload an image file and create Image record
     */
    public function upload(UploadedFile $file, array $metadata = [], string $directory = 'images'): Image
    {
        // Generate unique filename
        $extension = $file->getClientOriginalExtension();
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($metadata['slug'] ?? $originalName);
        $filename = $slug . '-' . Str::random(8) . '.' . $extension;
        
        // Store file
        $path = $file->storeAs($directory, $filename, 'public');
        
        // Create image record
        return $this->create([
            'slug' => $slug,
            'path' => $path,
            'title' => $metadata['title'] ?? $originalName,
            'description' => $metadata['description'] ?? null,
            'seo_title' => $metadata['seo_title'] ?? null,
            'seo_description' => $metadata['seo_description'] ?? null,
        ]);
    }

    /**
     * Update image metadata and optionally replace file
     */
    public function updateWithFile(int $id, ?UploadedFile $file = null, array $metadata = [], string $directory = 'images'): Image
    {
        $image = $this->findOrFail($id);
        
        // If new file provided, delete old and upload new
        if ($file) {
            // Delete old file
            if ($image->path && Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }
            
            // Upload new file
            $extension = $file->getClientOriginalExtension();
            $slug = Str::slug($metadata['slug'] ?? $image->slug);
            $filename = $slug . '-' . Str::random(8) . '.' . $extension;
            $path = $file->storeAs($directory, $filename, 'public');
            
            $metadata['path'] = $path;
        }
        
        // Update slug if provided
        if (isset($metadata['slug'])) {
            $metadata['slug'] = Str::slug($metadata['slug']);
        }
        
        return $this->update($id, $metadata);
    }

    /**
     * Delete image record and file
     */
    public function deleteWithFile(int $id): bool
    {
        $image = $this->findOrFail($id);
        
        // Delete file from storage
        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }
        
        return $this->delete($id);
    }
}
