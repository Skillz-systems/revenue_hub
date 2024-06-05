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
            $table->string('street_name');
            $table->string('asset_no');
            $table->string('cadastral_zone');
            $table->string('prop_type');
            $table->string('prop_use');
            $table->string('rating_dist');
            $table->string('annual_value');
            $table->string('rate_payable');
            $table->string('grand_total');
            $table->string('category')->nullable();
            $table->string('group');
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
