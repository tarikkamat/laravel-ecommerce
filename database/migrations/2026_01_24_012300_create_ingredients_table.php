<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE UNIQUE INDEX ingredients_slug_unique ON ingredients (slug) WHERE deleted_at IS NULL');
        } else {
            Schema::table('ingredients', function (Blueprint $table) {
                $table->unique('slug');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
