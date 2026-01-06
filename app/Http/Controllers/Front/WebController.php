<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Topico;
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

    public function concursoDisciplinas(Concurso $concurso)
    {
        return Inertia::render('Estudos/Concursos/index', [
            'concurso' => $concurso->only('id', 'nome'),
        ]);
    }

    public function disciplinaTopicos(Disciplina $disciplina)
    {
        return Inertia::render('Estudos/Disciplinas/index', [
            'disciplina' => $disciplina->only('id', 'nome', 'concurso_id'),
        ]);
    }

    public function topicoDetalhe(Topico $topico)
    {
        $topico->load('disciplina:id,concurso_id');

        return Inertia::render('Estudos/Topicos/index', [
            'topico' => [
                'id' => $topico->id,
                'nome' => $topico->nome,
                'disciplina_id' => $topico->disciplina_id,
                'concurso_id' => $topico->disciplina->concurso_id ?? null,
            ],
        ]);
    }
}
