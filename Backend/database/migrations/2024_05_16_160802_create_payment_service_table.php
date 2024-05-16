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
        Schema::create('payment_service', function (Blueprint $table) {
            $table->id();
            $table->string('demand_notice_id')->unique();
            $table->decimal('amount', 15, 2);
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_service');
    }
};
