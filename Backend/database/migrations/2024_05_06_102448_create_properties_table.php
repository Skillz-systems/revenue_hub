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
            $table->foreignId('street_id')->nullOnDelete();
            $table->string('asset_no');
            $table->foreignId('cadastral_zone_id')->nullOnDelete();
            $table->foreignId('property_type_id')->nullOnDelete();
            $table->foreignId('property_use_id')->nullOnDelete();
            $table->foreignId('rating_district_id')->nullOnDelete();
            $table->string('annual_value');
            $table->string('rate_payable');
            $table->string('grand_total');
            $table->foreignId('category_id')->nullable();
            $table->foreignId('group_id')->nullOnDelete();
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
