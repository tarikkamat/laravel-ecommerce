<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->unsignedInteger('qty');
            $table->decimal('unit_price_snapshot', 12, 2);
            $table->decimal('unit_sale_price_snapshot', 12, 2)->nullable();
            $table->string('title_snapshot');
            $table->string('sku_snapshot')->nullable();
            $table->unsignedInteger('stock_snapshot')->nullable();
            $table->timestamps();

            $table->unique(['cart_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
