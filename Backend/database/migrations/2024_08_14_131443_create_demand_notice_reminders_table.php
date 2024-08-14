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
        Schema::create('demand_notice_reminders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('demand_notice_id');
            $table->timestamps();
            $table->foreign('demand_notice_id')->references('id')->on('demand_notices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demand_notice_reminders');
    }
};

