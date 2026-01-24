<?php

namespace App\Services;

use App\Repositories\Contracts\IBrandRepository;
use App\Services\Contracts\IBrandService;
use App\Services\Contracts\IImageService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class BrandService extends BaseService implements IBrandService
{
    public function __construct(
        IBrandRepository $repository,
        private readonly IImageService $imageService
    ) {
        parent::__construct($repository);
    }

    public function create(array $data): Model
    {
        // Handle image upload
        if (isset($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
            $imageMetadata = [
                'title' => $data['image_title'] ?? $data['title'],
                'slug' => $data['image_slug'] ?? $data['slug'],
                'description' => $data['image_description'] ?? null,
                'seo_title' => $data['image_seo_title'] ?? null,
                'seo_description' => $data['image_seo_description'] ?? null,
            ];
            
            $image = $this->imageService->upload($data['logo_file'], $imageMetadata, 'brands');
            $data['image_id'] = $image->id;
        }
        
        // Remove non-model fields
        unset($data['logo_file'], $data['logo_url'], $data['image'], $data['image_title'], $data['image_slug'], $data['image_description'], $data['image_seo_title'], $data['image_seo_description']);
        
        return parent::create($data);
    }

    public function update(int $id, array $data): Model
    {
        $brand = $this->findOrFail($id);
        
        // Handle image upload
        if (isset($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
            $imageMetadata = [
                'title' => $data['image_title'] ?? $data['title'],
                'slug' => $data['image_slug'] ?? $data['slug'],
                'description' => $data['image_description'] ?? null,
                'seo_title' => $data['image_seo_title'] ?? null,
                'seo_description' => $data['image_seo_description'] ?? null,
            ];
            
            // If brand already has an image, update it
            if ($brand->image_id) {
                $this->imageService->updateWithFile($brand->image_id, $data['logo_file'], $imageMetadata, 'brands');
            } else {
                // Create new image
                $image = $this->imageService->upload($data['logo_file'], $imageMetadata, 'brands');
                $data['image_id'] = $image->id;
            }
        }
        
        // Remove non-model fields
        unset($data['logo_file'], $data['logo_url'], $data['image'], $data['image_title'], $data['image_slug'], $data['image_description'], $data['image_seo_title'], $data['image_seo_description']);
        
        return parent::update($id, $data);
    }
}
