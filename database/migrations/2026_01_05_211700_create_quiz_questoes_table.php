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
        Schema::create('quiz_questoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes');
            $table->text('enunciado');
            $table->json('alternativas');
            $table->integer('correta_index');
            $table->text('explicacao')->nullable();
            $table->timestamps();

            $table->index('quiz_id', 'idx_quiz_questoes_quiz');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questoes');
    }
};
