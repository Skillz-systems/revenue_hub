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
            $table->integer("property_id")->comment("the property of he demand notice ");
            $table->string("arrears_amount")->default(0)->comment("the arrears amount if any");
            $table->string("amount")->comment("the final amount to be payed ");
            $table->string("penalty")->default(0)->comment("the penalty amount to be payed if any ");
            $table->integer("status")->default(0)->comment("the status of the demand notice ");
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
