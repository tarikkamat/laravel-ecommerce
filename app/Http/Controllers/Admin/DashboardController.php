<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IDashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private readonly IDashboardService $service) {}

    public function index()
    {
        return Inertia::render('admin/dashboard', $this->service->summary());
    }
}
