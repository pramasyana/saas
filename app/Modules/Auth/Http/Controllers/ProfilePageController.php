<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProfilePageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tenant/account/Profile', [
            'title' => 'My Account',
        ]);
    }
}
