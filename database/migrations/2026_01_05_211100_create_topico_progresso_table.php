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
        Schema::create('topico_progresso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('topico_id')->constrained('topicos');
            $table->decimal('mastery_score', 5, 2)->default(0);
            $table->timestamp('ultima_atividade')->nullable();
            $table->timestamp('proxima_revisao')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'topico_id'], 'uq_prog');
            $table->index(['user_id', 'mastery_score'], 'idx_prog_user_mastery');
            $table->index(['user_id', 'proxima_revisao'], 'idx_prog_user_proxima_rev');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topico_progresso');
    }
};
