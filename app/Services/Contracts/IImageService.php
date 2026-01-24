<?php

namespace App\Services\Contracts;

use App\Models\Image;
use Illuminate\Http\UploadedFile;

interface IImageService extends IBaseService
{
    public function upload(UploadedFile $file, array $metadata = [], string $directory = 'images'): Image;

    public function updateWithFile(int $id, ?UploadedFile $file = null, array $metadata = [], string $directory = 'images'): Image;

    public function deleteWithFile(int $id): bool;
}
