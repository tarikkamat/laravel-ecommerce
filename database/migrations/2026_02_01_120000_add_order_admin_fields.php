<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable()->after('status');
            $table->timestamp('refunded_at')->nullable()->after('cancelled_at');
            $table->string('cancel_reason', 500)->nullable()->after('refunded_at');
            $table->string('refund_reason', 500)->nullable()->after('cancel_reason');

            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropColumn(['cancelled_at', 'refunded_at', 'cancel_reason', 'refund_reason']);
        });
    }
};
