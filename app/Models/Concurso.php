<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function disciplinas(): HasMany
    {
        return $this->hasMany(Disciplina::class);
    }
}
