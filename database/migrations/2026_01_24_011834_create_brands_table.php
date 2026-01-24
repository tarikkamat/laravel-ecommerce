<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->foreignId('image_id')->nullable()->constrained('images')->nullOnDelete();
            $table->string('slug');
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement('CREATE UNIQUE INDEX brands_slug_unique ON brands (slug) WHERE deleted_at IS NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
