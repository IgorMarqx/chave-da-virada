<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concurso extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nome',
        'orgao',
        'data_prova',
        'descricao',
    ];
}
