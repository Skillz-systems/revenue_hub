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
        Schema::create('nibss_keys', function (Blueprint $table) {
            $table->id();
            $table->string("key_name")->comment("the name of the key, like IV etc ");
            $table->string("key")->comment("the actual key");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nibbs_keys');
    }
};
