<?php

namespace App\Services\Contracts;

interface IDashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function summary(): array;
}
