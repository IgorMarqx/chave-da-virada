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
        Schema::table('estudos', function (Blueprint $table) {
            $table->unsignedInteger('tempo_segundos')->default(0)->after('topico_id');
        });

        DB::statement('UPDATE estudos SET tempo_segundos = ROUND(tempo_minutos * 60)');

        Schema::table('estudos', function (Blueprint $table) {
            $table->dropColumn('tempo_minutos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estudos', function (Blueprint $table) {
            $table->float('tempo_minutos')->default(0)->after('topico_id');
        });

        DB::statement('UPDATE estudos SET tempo_minutos = tempo_segundos / 60');

        Schema::table('estudos', function (Blueprint $table) {
            $table->dropColumn('tempo_segundos');
        });
    }
};
