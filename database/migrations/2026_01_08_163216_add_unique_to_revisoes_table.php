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
        Schema::table('revisoes', function (Blueprint $table) {
            $table->unique(['user_id', 'topico_id', 'data_revisao', 'tipo'], 'uniq_revisoes_user_topico_data_tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revisoes', function (Blueprint $table) {
            $table->dropUnique('uniq_revisoes_user_topico_data_tipo');
        });
    }
};
