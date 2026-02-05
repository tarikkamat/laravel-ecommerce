<?php

namespace App\Console\Commands;

use App\Support\SettingsDefaults;
use Illuminate\Console\Command;

class SyncSettingsDefaults extends Command
{
    protected $signature = 'settings:sync-defaults {--dry-run : Only report missing settings}';

    protected $description = 'Add missing settings records using default values from settings classes.';

    public function handle(SettingsDefaults $defaults): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if ($dryRun) {
            $missing = $this->countMissing($defaults);
            $this->info("Missing settings: {$missing}");

            return Command::SUCCESS;
        }

        $added = $defaults->sync();
        $this->info("Added {$added} missing settings.");

        return Command::SUCCESS;
    }

    private function countMissing(SettingsDefaults $defaults): int
    {
        $container = app(\Spatie\LaravelSettings\SettingsContainer::class);
        $migrator = app(\Spatie\LaravelSettings\Migrations\SettingsMigrator::class);

        $missing = 0;

        $container->getSettingClasses()->each(function (string $settingsClass) use ($migrator, &$missing): void {
            $config = new \Spatie\LaravelSettings\SettingsConfig($settingsClass);
            $group = $settingsClass::group();

            $config->getReflectedProperties()->each(function (\ReflectionProperty $property, string $name) use ($migrator, $group, &$missing): void {
                $key = "{$group}.{$name}";
                if (! $migrator->exists($key)) {
                    $missing++;
                }
            });
        });

        return $missing;
    }
}
