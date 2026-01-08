<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('revisao_configuracoes', function (Blueprint $table) {
            $table->json('dias_revisao')->nullable()->after('dia_revisao');
        });

        DB::statement('UPDATE revisao_configuracoes SET dias_revisao = JSON_ARRAY(dia_revisao)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revisao_configuracoes', function (Blueprint $table) {
            $table->dropColumn('dias_revisao');
        });
    }
};
