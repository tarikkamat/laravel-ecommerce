<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        if (! $this->migrator->exists('site.announcement_texts')) {
            $this->migrator->add('site.announcement_texts', []);
        }
    }
};
