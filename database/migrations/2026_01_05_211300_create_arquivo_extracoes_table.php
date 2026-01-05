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
        Schema::create('arquivo_extracoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('arquivo_id')->constrained('arquivos');
            $table->string('status', 20)->default('pendente');
            $table->text('texto_extraido')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('arquivo_id', 'idx_extracoes_arquivo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arquivo_extracoes');
    }
};
