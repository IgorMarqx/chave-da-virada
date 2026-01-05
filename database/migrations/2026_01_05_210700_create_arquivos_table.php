<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('arquivos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('topico_id')->nullable()->constrained('topicos');
            $table->string('nome_original');
            $table->string('tipo', 40);
            $table->string('path', 500);
            $table->unsignedBigInteger('tamanho_bytes')->nullable();
            $table->string('hash_sha256', 64)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id', 'idx_arquivos_user_id');
            $table->index('topico_id', 'idx_arquivos_topico_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arquivos');
    }
};
