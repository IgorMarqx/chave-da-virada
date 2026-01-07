<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Anotacao extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'anotacoes';

    protected $fillable = [
        'topico_id',
        'user_id',
        'titulo',
        'conteudo',
    ];

    public function topico(): BelongsTo
    {
        return $this->belongsTo(Topico::class);
    }
}
