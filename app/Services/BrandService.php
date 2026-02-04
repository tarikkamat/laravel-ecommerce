<?php

namespace App\Services;

use App\Repositories\Contracts\IBrandRepository;
use App\Services\Contracts\IBrandService;
use App\Services\Contracts\IImageService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class BrandService extends BaseService implements IBrandService
{
    public function __construct(
        private readonly IBrandRepository $brandRepository,
        private readonly IImageService $imageService
    ) {
        parent::__construct($brandRepository);
    }

    /**
     * Get products by brand slug or id with pagination.
     */
    public function getProductsByBrandSlug(
        string|int $identifier,
        int $perPage = 15,
        ?string $sort = null,
        array|string|null $category = null,
        ?string $search = null,
        ?float $priceMin = null,
        ?float $priceMax = null
    ): LengthAwarePaginator
    {
        return $this->brandRepository->getProductsByBrandSlug(
            $identifier,
            $perPage,
            $sort,
            $category,
            $search,
            $priceMin,
            $priceMax
        );
    }

    /**
     * Get all brands with images for mega menu.
     */
    public function getBrandsForMegaMenu(): Collection
    {
        return $this->brandRepository->all(['id', 'title', 'slug', 'image_id'], ['image:id,path']);
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
