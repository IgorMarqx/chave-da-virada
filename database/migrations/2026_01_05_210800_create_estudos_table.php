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
        Schema::create('estudos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('topico_id')->constrained('topicos');
            $table->float('tempo_minutos')->default(0);
            $table->timestamp('data_estudo');
            $table->string('origem', 30)->nullable();
            $table->text('observacao')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'data_estudo'], 'idx_estudos_user_data');
            $table->index(['topico_id', 'data_estudo'], 'idx_estudos_topico_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudos');
    }
};
