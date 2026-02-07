<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        if (! $this->migrator->exists('shipping.flat_rate_label')) {
            $this->migrator->add('shipping.flat_rate_label', (string) config('shipping.flat_rate_label', 'Standart Kargo'));
        }

        if (! $this->migrator->exists('shipping.flat_rate')) {
            $this->migrator->add('shipping.flat_rate', (float) config('shipping.flat_rate', 0));
        }
    }
};
