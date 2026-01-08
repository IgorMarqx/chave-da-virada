<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disciplina extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'concurso_id',
        'nome',
    ];

    public function topicos(): HasMany
    {
        return $this->hasMany(Topico::class);
    }

    public function concurso(): BelongsTo
    {
        return $this->belongsTo(Concurso::class);
    }
}
