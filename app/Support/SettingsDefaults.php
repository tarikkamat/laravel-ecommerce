<?php

namespace App\Support;

use Illuminate\Support\Collection;
use ReflectionProperty;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;
use Spatie\LaravelSettings\SettingsConfig;
use Spatie\LaravelSettings\SettingsContainer;

class SettingsDefaults
{
    public function __construct(
        private readonly SettingsContainer $settingsContainer,
        private readonly SettingsMigrator $settingsMigrator,
    ) {
    }

    public function sync(array $settingsClasses = []): int
    {
        $classes = $settingsClasses === []
            ? $this->settingsContainer->getSettingClasses()
            : collect($settingsClasses);

        $added = 0;

        $classes->each(function (string $settingsClass) use (&$added): void {
            $config = new SettingsConfig($settingsClass);
            $group = $settingsClass::group();

            $config->getReflectedProperties()
                ->each(function (ReflectionProperty $property, string $name) use ($config, $group, &$added): void {
                    $key = "{$group}.{$name}";

                    if ($this->settingsMigrator->exists($key)) {
                        return;
                    }

                    $value = $property->hasDefaultValue() ? $property->getDefaultValue() : null;

                    $this->settingsMigrator->add($key, $value, $config->isEncrypted($name));
                    $added++;
                });
        });

        return $added;
    }
}
