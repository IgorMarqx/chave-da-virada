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
        Schema::create('metas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('nome', 140);
            $table->string('tipo', 20);
            $table->integer('alvo');
            $table->string('recorrencia', 20)->default('diaria');

            $table->foreignId('concurso_id')->nullable()->constrained('concursos');
            $table->foreignId('disciplina_id')->nullable()->constrained('disciplinas');
            $table->foreignId('topico_id')->nullable()->constrained('topicos');

            $table->string('status', 20)->default('ativa');
            $table->timestamps();

            $table->index(['user_id', 'status'], 'idx_metas_user_status');
            $table->index(['user_id', 'tipo'], 'idx_metas_user_tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metas');
    }
};
