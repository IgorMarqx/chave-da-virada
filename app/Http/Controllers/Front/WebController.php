<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class WebController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('dashboard');
    }

    public function estudos()
    {
        return Inertia::render('Estudos/index');
    }
}
