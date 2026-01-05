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
        Schema::create('ia_resumos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('topico_id')->constrained('topicos');
            $table->string('fonte', 30);
            $table->unsignedBigInteger('fonte_id')->nullable();
            $table->string('conteudo_hash', 64)->nullable();
            $table->text('resumo_gerado');
            $table->string('modelo', 80)->default('gemini');
            $table->integer('prompt_tokens')->nullable();
            $table->integer('output_tokens')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'topico_id'], 'idx_ia_resumos_user_topico');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ia_resumos');
    }
};
