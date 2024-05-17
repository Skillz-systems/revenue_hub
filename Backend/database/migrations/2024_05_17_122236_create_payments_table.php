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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string("tx_ref")->comment("Transaction reference created when creating account number");
            $table->string("demand_notice_id")->comment("Demand notice is like an invoice, so this helps us know what invoice has the payment");
            $table->string("actual_amount")->comment("The actual amount expected to be paid by the occupier");
            $table->string("charged_amount")->comment("This is amount that was charged on the actual amount from payment vendor");
            $table->string("app_fee")->comment("This is another amount that was charged on the actual amount from payment vendor");
            $table->string("merchant_fee")->comment("This is another amount that was charged on the actual amount from payment vendor");
            $table->integer("status")->default(1)->comment("This is a status to indicate if the payment is approved or not and 1 stands for approve while 0 indicate a pending state ");
            $table->string("webhook_string")->comment("This is the payload sent by the payment vendor powered by json_encode");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
