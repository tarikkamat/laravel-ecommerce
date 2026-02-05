<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        if (! $this->migrator->exists('tax.prices_include_tax')) {
            $this->migrator->add('tax.prices_include_tax', false);
        }
    }
};
