<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Arquivo extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'arquivos';

    protected $fillable = [
        'user_id',
        'topico_id',
        'nome_original',
        'tipo',
        'path',
        'tamanho_bytes',
        'hash_sha256',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
