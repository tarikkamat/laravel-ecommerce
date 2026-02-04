<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->unsignedInteger('qty');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('unit_sale_price', 12, 2)->nullable();
            $table->decimal('line_subtotal', 12, 2);
            $table->decimal('line_tax_total', 12, 2)->default(0);
            $table->decimal('line_total', 12, 2);
            $table->string('title_snapshot');
            $table->string('sku_snapshot')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
