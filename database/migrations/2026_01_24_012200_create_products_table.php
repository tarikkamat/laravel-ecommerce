<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('sku');
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->string('barcode')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE UNIQUE INDEX products_slug_unique ON products (slug) WHERE deleted_at IS NULL');
            DB::statement('CREATE UNIQUE INDEX products_sku_unique ON products (sku) WHERE deleted_at IS NULL');
            DB::statement('CREATE UNIQUE INDEX products_barcode_unique ON products (barcode) WHERE deleted_at IS NULL AND barcode IS NOT NULL');
        } else {
            Schema::table('products', function (Blueprint $table) {
                $table->unique('slug');
                $table->unique('sku');
                $table->unique('barcode');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
