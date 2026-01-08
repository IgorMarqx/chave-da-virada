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
        Schema::create('revisao_configuracoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->unique()->onDelete('cascade');
            $table->boolean('ativo')->default(true);
            $table->string('modo', 20)->default('semanal');
            $table->unsignedTinyInteger('dias_estudo')->default(5);
            $table->unsignedTinyInteger('dia_revisao')->default(6);
            $table->boolean('usar_ultima_revisao')->default(true);
            $table->unsignedTinyInteger('janela_estudo_dias')->nullable();
            $table->string('timezone', 60)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revisao_configuracoes');
    }
};
