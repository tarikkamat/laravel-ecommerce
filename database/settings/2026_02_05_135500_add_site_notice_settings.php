<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->addIfMissing('site.whatsapp_enabled', false);
        $this->addIfMissing('site.whatsapp_phone', '');
        $this->addIfMissing('site.whatsapp_message', 'Selamlar, bu ürünü almak istiyorum.');
        $this->addIfMissing('site.announcement_enabled', false);
        $this->addIfMissing('site.announcement_text', '');
        $this->addIfMissing('site.announcement_speed_seconds', 18);
        $this->addIfMissing('site.announcement_background', '#181113');
        $this->addIfMissing('site.announcement_text_color', '#ffffff');
    }

    private function addIfMissing(string $property, $value): void
    {
        if (! $this->migrator->exists($property)) {
            $this->migrator->add($property, $value);
        }
    }
};
