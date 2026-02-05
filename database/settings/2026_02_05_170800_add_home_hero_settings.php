<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->addIfMissing('home.hero_autoplay_ms', 6000);
        $this->addIfMissing('home.hero_slides', []);
    }

    private function addIfMissing(string $property, $value): void
    {
        if (! $this->migrator->exists($property)) {
            $this->migrator->add($property, $value);
        }
    }
};
