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
        Schema::create('demand_notices', function (Blueprint $table) {
            $table->id();
            $table->string("property_id")->comment("the property of he demand notice ");
            $table->string("amount")->comment("the final amount to be payed ");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demand_notices');
    }
};
