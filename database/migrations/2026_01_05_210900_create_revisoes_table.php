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
        Schema::create('revisoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('topico_id')->constrained('topicos');
            $table->timestamp('data_revisao');
            $table->string('status', 20)->default('pendente');
            $table->string('tipo', 30)->nullable();
            $table->integer('intervalo_dias')->nullable();
            $table->decimal('ease_factor', 6, 3)->nullable();
            $table->integer('repeticoes')->default(0);
            $table->string('origem', 30)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status', 'data_revisao'], 'idx_revisoes_user_status_data');
            $table->index(['topico_id', 'data_revisao'], 'idx_revisoes_topico_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revisoes');
    }
};
