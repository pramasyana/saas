<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tenant/company/Rooms', [
            'title' => 'Ruangan',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tenant/company/RoomCreate', [
            'title' => 'Tambah Ruangan',
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('tenant/company/RoomEdit', [
            'title' => 'Edit Ruangan',
            'id' => $id,
        ]);
    }
}
