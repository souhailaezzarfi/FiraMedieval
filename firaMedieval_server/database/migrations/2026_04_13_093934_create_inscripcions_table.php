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
        Schema::create('inscripcions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('activitat_id');
            $table->foreign('activitat_id')->references('id')->on('activitats')->onDelete('cascade');

            $table->unsignedBigInteger('horari_id');
            $table->foreign('horari_id')->references('id')->on('horaris_activitat')->onDelete('cascade');

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->enum('estat', ['confirmada', 'espera', 'cancel·lada']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripcions');
    }
};
