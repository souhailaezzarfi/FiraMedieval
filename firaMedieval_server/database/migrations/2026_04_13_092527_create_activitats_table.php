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
        Schema::create('activitats', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('organitzador');
            $table->longText('descripcio');
            $table->string('ubicacio');
            $table->integer('aforament')->nullable();
            $table->string('imatge')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activitats');
    }
};
