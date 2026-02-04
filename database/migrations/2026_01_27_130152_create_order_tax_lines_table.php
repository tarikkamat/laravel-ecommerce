<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_tax_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
            $table->string('scope')->default('order');
            $table->string('name');
            $table->decimal('rate', 5, 4);
            $table->decimal('base_amount', 12, 2);
            $table->decimal('tax_amount', 12, 2);
            $table->timestamps();

            $table->index(['order_id', 'scope']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_tax_lines');
    }
};
