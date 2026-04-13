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
        Schema::create('activitat_categoria', function (Blueprint $table) {
            $table->unsignedBigInteger('activitat_id');
            $table->foreign('activitat_id')->references('id')->on('activitats')->onDelete('cascade');
            $table->unsignedBigInteger('categoria_id');
            $table->foreign('categoria_id')->references('id')->on('categories')->onDelete('cascade');
            $table->primary(['activitat_id', 'categoria_id']);   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activitat_categoria');
    }
};
