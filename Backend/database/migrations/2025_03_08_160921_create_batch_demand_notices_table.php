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
        Schema::create('batch_demand_notices', function (Blueprint $table) {
            $table->id();
            $table->integer("rating_district_id")->comment("rating district id");
            $table->integer("cadastral_zone_id")->comment("cadastral zone id");
            $table->integer("street_id")->comment("street id");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_demand_notices');
    }
};
