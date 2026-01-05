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
        Schema::create('risco_esquecimento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('topico_id')->constrained('topicos');
            $table->decimal('risco', 5, 2)->default(0);
            $table->string('motivo', 120)->nullable();
            $table->timestamp('calculado_em');
            $table->timestamps();

            $table->unique(['user_id', 'topico_id'], 'uq_risco');
            $table->index(['user_id', 'risco'], 'idx_risco_user_risco');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risco_esquecimento');
    }
};
