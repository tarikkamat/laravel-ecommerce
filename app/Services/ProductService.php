<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\IProductRepository;
use App\Services\Contracts\IImageService;
use App\Services\Contracts\IProductService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class ProductService extends BaseService implements IProductService
{
    public function __construct(
        IProductRepository $repository,
        private readonly IImageService $imageService
    ) {
        parent::__construct($repository);
    }

    /**
     * Get products by brand ID with limit.
     *
     * @param  array<string>  $columns
     * @param  array<string>  $relations
     */
    public function getByBrandId(
        int $brandId,
        int $limit = 10,
        array $columns = ['*'],
        array $relations = [],
        ?string $orderBy = null,
        string $direction = 'desc'
    ): Collection
    {
        /** @var IProductRepository $repository */
        $repository = $this->repository;

        return $repository->getByBrandId($brandId, $limit, $columns, $relations, $orderBy, $direction);
    }

    public function create(array $data): Model
    {
        // Extract image upload data
        $imageFiles = $data['image_files'] ?? [];
        $imageTitles = $data['image_titles'] ?? [];
        $imageSlugs = $data['image_slugs'] ?? [];
        $imageDescriptions = $data['image_descriptions'] ?? [];
        $imageSeoTitles = $data['image_seo_titles'] ?? [];
        $imageSeoDescriptions = $data['image_seo_descriptions'] ?? [];

        // Remove image fields from product data
        unset(
            $data['image_files'],
            $data['image_titles'],
            $data['image_slugs'],
            $data['image_descriptions'],
            $data['image_seo_titles'],
            $data['image_seo_descriptions']
        );

        /** @var Product $product */
        $product = parent::create($data);

        // Upload new images and sync
        $imageIds = $this->uploadImages(
            $imageFiles,
            $imageTitles,
            $imageSlugs,
            $imageDescriptions,
            $imageSeoTitles,
            $imageSeoDescriptions
        );

        if (count($imageIds) > 0) {
            $product->images()->sync($imageIds);
        }

        return $product;
    }

    public function update(int $id, array $data): Model
    {
        /** @var Product $product */
        $product = $this->findOrFail($id);

        // Extract existing image ids to keep
        $existingImageIds = $data['existing_image_ids'] ?? [];

        // Extract new image upload data
        $imageFiles = $data['image_files'] ?? [];
        $imageTitles = $data['image_titles'] ?? [];
        $imageSlugs = $data['image_slugs'] ?? [];
        $imageDescriptions = $data['image_descriptions'] ?? [];
        $imageSeoTitles = $data['image_seo_titles'] ?? [];
        $imageSeoDescriptions = $data['image_seo_descriptions'] ?? [];

        // Remove image fields from product data
        unset(
            $data['existing_image_ids'],
            $data['image_files'],
            $data['image_titles'],
            $data['image_slugs'],
            $data['image_descriptions'],
            $data['image_seo_titles'],
            $data['image_seo_descriptions']
        );

        $product = parent::update($id, $data);

        // Upload new images
        $newImageIds = $this->uploadImages(
            $imageFiles,
            $imageTitles,
            $imageSlugs,
            $imageDescriptions,
            $imageSeoTitles,
            $imageSeoDescriptions
        );

        // Merge existing and new image ids
        $allImageIds = array_merge(
            array_map('intval', $existingImageIds),
            $newImageIds
        );

        // Sync all images
        $product->images()->sync($allImageIds);

        return $product;
    }

    /**
     * Upload multiple images and return their IDs
     *
     * @param  array<UploadedFile>  $files
     * @param  array<string>  $titles
     * @param  array<string>  $slugs
     * @param  array<string>  $descriptions
     * @param  array<string>  $seoTitles
     * @param  array<string>  $seoDescriptions
     * @return array<int>
     */
    private function uploadImages(
        array $files,
        array $titles,
        array $slugs,
        array $descriptions,
        array $seoTitles,
        array $seoDescriptions
    ): array {
        $imageIds = [];

        foreach ($files as $index => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $imageMetadata = [
                'title' => $titles[$index] ?? null,
                'slug' => $slugs[$index] ?? null,
                'description' => $descriptions[$index] ?? null,
                'seo_title' => $seoTitles[$index] ?? null,
                'seo_description' => $seoDescriptions[$index] ?? null,
            ];

            $image = $this->imageService->upload($file, $imageMetadata, 'products');
            $imageIds[] = $image->id;
        }

        return $imageIds;
    }
}
