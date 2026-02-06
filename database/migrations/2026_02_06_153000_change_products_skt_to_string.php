<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'skt')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE products MODIFY skt VARCHAR(255) NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE products ALTER COLUMN skt TYPE VARCHAR(255)');
            DB::statement('ALTER TABLE products ALTER COLUMN skt DROP NOT NULL');
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('products', 'skt')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE products MODIFY skt DATE NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE products ALTER COLUMN skt TYPE DATE USING skt::date');
            DB::statement('ALTER TABLE products ALTER COLUMN skt DROP NOT NULL');
        }
    }
};
