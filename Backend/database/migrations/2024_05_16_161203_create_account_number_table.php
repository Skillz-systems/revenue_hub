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
        Schema::create('account_number', function (Blueprint $table) {
            $table->id();
            $table->string('demand_notice_id');
            $table->string('response_code');
            $table->string('response_message');
            $table->string('order_ref');
            $table->string('account_number');
            $table->string('bank_name');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_number');
    }
};
