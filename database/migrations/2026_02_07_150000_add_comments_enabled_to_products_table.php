<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'comments_enabled')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('comments_enabled')->default(true)->after('active');
                $table->index('comments_enabled');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'comments_enabled')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropIndex(['comments_enabled']);
                $table->dropColumn('comments_enabled');
            });
        }
    }
};
