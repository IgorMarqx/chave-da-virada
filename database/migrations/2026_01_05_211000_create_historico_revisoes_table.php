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
        Schema::create('historico_revisoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('revisao_id')->constrained('revisoes');
            $table->timestamp('data_realizada');
            $table->integer('nivel_dificuldade');
            $table->integer('acertos_percent')->nullable();
            $table->text('observacao')->nullable();
            $table->timestamps();

            $table->index('revisao_id', 'idx_hist_revisao_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historico_revisoes');
    }
};
