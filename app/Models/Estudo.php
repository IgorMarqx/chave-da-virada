<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Estudo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'topico_id',
        'tempo_segundos',
        'data_estudo',
        'origem',
        'observacao',
    ];

    public function topico(): BelongsTo
    {
        return $this->belongsTo(Topico::class);
    }
}
