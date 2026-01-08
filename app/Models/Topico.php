<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Topico extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'disciplina_id',
        'nome',
        'descricao',
        'ordem',
    ];

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class);
    }

    public function revisoes(): HasMany
    {
        return $this->hasMany(Revisao::class);
    }
}
