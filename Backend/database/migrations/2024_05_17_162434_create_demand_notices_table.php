<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDemandNoticesTable extends Migration
{
    public function up()
    {
        Schema::create('demand_notices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id');
            $table->date('date_issued');
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('demand_notices');
    }
}
