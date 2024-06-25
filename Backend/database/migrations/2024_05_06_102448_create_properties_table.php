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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('pid');
            $table->string('occupant');
            $table->string('prop_addr');
            $table->string('street_id');
            $table->string('asset_no');
            $table->string('cadastral_zone_id');
            $table->string('property_type_id');
            $table->string('property_use_id');
            $table->string('rating_district_id');
            $table->string('annual_value');
            $table->string('rate_payable');
            $table->string('grand_total');
            $table->string('category_id')->nullable();
            $table->string('group_id');
            $table->string('active');
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
