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
        Schema::create('demand_notice_accounts', function (Blueprint $table) {
            $table->id();
            $table->integer("demand_notice_id")->comment("the demand notice , that would have the associated account number ");
            $table->string("tx_ref")->comment("generated reference for the transaction ");
            $table->string("account_number")->comment("generated account number  for the transaction ");
            $table->string("account_name")->comment("generated account name  for the transaction ");
            $table->string("account_bank_name")->comment("generated account bank name  for the transaction ");
            $table->string("account_email")->comment("generated account email  for the transaction ");
            $table->string("amount")->comment("amount to be paid");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demand_notice_accounts');
    }
};
