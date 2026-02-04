<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('provider')->default('geliver');
            $table->string('service_code')->nullable();
            $table->string('service_name')->nullable();
            $table->decimal('shipping_total', 12, 2)->default(0);
            $table->string('shipment_status')->default('draft')->index();
            $table->string('tracking_number')->nullable();
            $table->json('shipment_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_shipments');
    }
};
