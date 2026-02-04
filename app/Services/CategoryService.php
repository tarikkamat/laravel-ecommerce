<?php

namespace App\Services;

use App\Repositories\Contracts\ICategoryRepository;
use App\Services\Contracts\ICategoryService;
use App\Services\Contracts\IImageService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class CategoryService extends BaseService implements ICategoryService
{
    public function __construct(
        private readonly ICategoryRepository $categoryRepository,
        private readonly IImageService $imageService
    ) {
        parent::__construct($categoryRepository);
    }

    public function getRootCategories(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->categoryRepository->getRootCategories($columns, $relations);
    }

    /**
     * Get categories with nested children for mega menu (up to 3 levels).
     */
    public function getCategoriesForMegaMenu(): Collection
    {
        return $this->categoryRepository->getCategoriesForMegaMenu();
    }

    /**
     * Get products by category slug or id with pagination.
     */
    public function getProductsByCategorySlug(
        string|int $identifier,
        int $perPage = 15,
        ?string $sort = null,
        array|string|null $brand = null,
        ?string $search = null,
        ?float $priceMin = null,
        ?float $priceMax = null
    ): LengthAwarePaginator {
        return $this->categoryRepository->getProductsByCategorySlug(
            $identifier,
            $perPage,
            $sort,
            $brand,
            $search,
            $priceMin,
            $priceMax
        );
    }

    /**
     * Get price range (min/max) for products in a category.
     *
     * @return array{min: float, max: float}
     */
    public function getPriceRangeByCategory(string|int $identifier): array
    {
        return $this->categoryRepository->getPriceRangeByCategory($identifier);
    }

    public function create(array $data): Model
    {
        // Handle image upload
        if (isset($data['image_file']) && $data['image_file'] instanceof UploadedFile) {
            $imageMetadata = [
                'title' => $data['image_title'] ?? $data['title'],
                'slug' => $data['image_slug'] ?? $data['slug'],
                'description' => $data['image_description'] ?? null,
                'seo_title' => $data['image_seo_title'] ?? null,
                'seo_description' => $data['image_seo_description'] ?? null,
            ];

            $image = $this->imageService->upload($data['image_file'], $imageMetadata, 'categories');
            $data['image_id'] = $image->id;
        }

        // Remove non-model fields
        unset(
            $data['image_file'],
            $data['image_title'],
            $data['image_slug'],
            $data['image_description'],
            $data['image_seo_title'],
            $data['image_seo_description']
        );

        return parent::create($data);
    }

    public function update(int $id, array $data): Model
    {
        $category = $this->findOrFail($id);

        // Handle image upload
        if (isset($data['image_file']) && $data['image_file'] instanceof UploadedFile) {
            $imageMetadata = [
                'title' => $data['image_title'] ?? $data['title'],
                'slug' => $data['image_slug'] ?? $data['slug'],
                'description' => $data['image_description'] ?? null,
                'seo_title' => $data['image_seo_title'] ?? null,
                'seo_description' => $data['image_seo_description'] ?? null,
            ];

            // If category already has an image, update it
            if ($category->image_id) {
                $this->imageService->updateWithFile($category->image_id, $data['image_file'], $imageMetadata, 'categories');
            } else {
                // Create new image
                $image = $this->imageService->upload($data['image_file'], $imageMetadata, 'categories');
                $data['image_id'] = $image->id;
            }
        }

        // Remove non-model fields
        unset(
            $data['image_file'],
            $data['image_title'],
            $data['image_slug'],
            $data['image_description'],
            $data['image_seo_title'],
            $data['image_seo_description']
        );

        return parent::update($id, $data);
    }
}
