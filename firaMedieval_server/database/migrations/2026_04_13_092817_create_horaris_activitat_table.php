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
        Schema::create('horaris_activitat', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('activitat_id');
            $table->foreign('activitat_id')->references('id')->on('activitats')->onDelete('cascade');
            $table->dateTime('hora_inici');
            $table->dateTime('hora_final')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horaris_activitat');
    }
};
