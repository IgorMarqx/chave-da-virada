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
        Schema::create('metas_diarias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meta_id')->constrained('metas');
            $table->date('data');
            $table->integer('progresso')->default(0);
            $table->boolean('concluida')->default(false);
            $table->json('detalhes')->nullable();
            $table->timestamps();

            $table->unique(['meta_id', 'data'], 'uq_meta_dia');
            $table->index(['data'], 'idx_metas_diarias_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metas_diarias');
    }
};
