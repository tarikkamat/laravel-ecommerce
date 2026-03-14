<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('contact_name');
            $table->string('tax_number', 20)->nullable()->after('company_name');
            $table->string('tax_office', 100)->nullable()->after('tax_number');
        });
    }

    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'tax_number', 'tax_office']);
        });
    }
};
