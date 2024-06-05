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
        Schema::create('rating_districts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment("Rating district name");
            $table->integer('office_zone_id')->nullable()->comment("Office zone id");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rating_districts');
    }
};
