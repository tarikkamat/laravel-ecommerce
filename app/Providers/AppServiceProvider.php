<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $bindings = [
            \App\Repositories\Contracts\IAddressRepository::class => \App\Repositories\AddressRepository::class,
            \App\Repositories\Contracts\IBrandRepository::class => \App\Repositories\BrandRepository::class,
            \App\Repositories\Contracts\ICategoryRepository::class => \App\Repositories\CategoryRepository::class,
            \App\Repositories\Contracts\IDiscountRepository::class => \App\Repositories\DiscountRepository::class,
            \App\Repositories\Contracts\IImageRepository::class => \App\Repositories\ImageRepository::class,
            \App\Repositories\Contracts\IIngredientRepository::class => \App\Repositories\IngredientRepository::class,
            \App\Repositories\Contracts\IPageRepository::class => \App\Repositories\PageRepository::class,
            \App\Repositories\Contracts\IProductRepository::class => \App\Repositories\ProductRepository::class,
            \App\Repositories\Contracts\ITagRepository::class => \App\Repositories\TagRepository::class,
            \App\Repositories\Contracts\IUserRepository::class => \App\Repositories\UserRepository::class,
            \App\Services\Contracts\IAddressService::class => \App\Services\AddressService::class,
            \App\Services\Contracts\IBrandService::class => \App\Services\BrandService::class,
            \App\Services\Contracts\ICategoryService::class => \App\Services\CategoryService::class,
            \App\Services\Contracts\IDiscountService::class => \App\Services\DiscountService::class,
            \App\Services\Contracts\IDashboardService::class => \App\Services\DashboardService::class,
            \App\Services\Contracts\IImageService::class => \App\Services\ImageService::class,
            \App\Services\Contracts\IIngredientService::class => \App\Services\IngredientService::class,
            \App\Services\Contracts\IPageService::class => \App\Services\PageService::class,
            \App\Services\Contracts\IProductService::class => \App\Services\ProductService::class,
            \App\Services\Contracts\ITagService::class => \App\Services\TagService::class,
            \App\Services\Contracts\IUserService::class => \App\Services\UserService::class,
        ];

        foreach ($bindings as $abstract => $concrete) {
            $this->app->bind($abstract, $concrete);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Console\Commands\SyncSettingsDefaults::class,
            ]);
        }

        $this->configureDefaults();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction() ? Password::min(4) : null);
    }
}
