<?php

use App\Enums\Role;
use App\Models\Brand;
use App\Models\Image;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can update a brand with a new logo even if its image relation is stale', function () {
    Storage::fake('public');

    $user = User::query()->create([
        'name' => 'Admin',
        'email' => 'admin@example.com',
        'email_verified_at' => now(),
        'password' => 'password',
        'role' => Role::ADMIN,
    ]);

    $image = Image::query()->create([
        'slug' => 'old-logo',
        'path' => 'brands/old-logo.jpg',
        'title' => 'Old Logo',
    ]);

    $image->delete();

    $brand = Brand::query()->create([
        'title' => 'Orzax',
        'slug' => 'orzax',
        'image_id' => $image->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('admin.brands.update', $brand->id), [
            '_method' => 'PUT',
            'title' => 'Orzax Updated',
            'slug' => 'orzax-updated',
            'description' => 'Updated description',
            'seo_title' => 'Updated SEO title',
            'seo_description' => 'Updated SEO description',
            'logo_file' => UploadedFile::fake()->image('logo.jpg'),
            'image_title' => 'Orzax Logo',
            'image_slug' => 'orzax-logo',
            'image_description' => 'Brand logo',
            'image_seo_title' => 'Logo SEO',
            'image_seo_description' => 'Logo SEO description',
        ]);

    $response->assertRedirect(route('admin.brands.index'));

    $brand->refresh();

    expect($brand->title)->toBe('Orzax Updated');
    expect($brand->image_id)->not->toBeNull();
    expect($brand->image)->not->toBeNull();

    Storage::disk('public')->assertExists($brand->image->path);
});
