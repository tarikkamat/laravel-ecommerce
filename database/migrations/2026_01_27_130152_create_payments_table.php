<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('provider')->default('iyzico')->index();
            $table->string('status')->default('pending')->index();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('TRY');
            $table->string('conversation_id')->nullable()->index();
            $table->string('transaction_id')->nullable()->index();
            $table->json('raw_request')->nullable();
            $table->json('raw_response')->nullable();
            $table->json('raw_webhook')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
