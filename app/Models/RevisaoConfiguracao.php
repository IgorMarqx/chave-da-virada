<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RevisaoConfiguracao extends Model
{
    use HasFactory;

    protected $table = 'revisao_configuracoes';

    protected $fillable = [
        'user_id',
        'ativo',
        'modo',
        'dias_estudo',
        'dia_revisao',
        'dias_revisao',
        'usar_ultima_revisao',
        'janela_estudo_dias',
        'timezone',
    ];

    protected function casts(): array
    {
        return [
            'ativo' => 'boolean',
            'usar_ultima_revisao' => 'boolean',
            'dias_revisao' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
