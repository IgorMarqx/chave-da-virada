<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Revisao extends Model
{
    use HasFactory;

    protected $table = 'revisoes';

    protected $fillable = [
        'user_id',
        'topico_id',
        'data_revisao',
        'status',
        'tipo',
        'intervalo_dias',
        'ease_factor',
        'repeticoes',
        'origem',
    ];

    protected function casts(): array
    {
        return [
            'data_revisao' => 'datetime',
        ];
    }

    public function topico(): BelongsTo
    {
        return $this->belongsTo(Topico::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
