<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->date('report_date');
            $table->integer('total_orders')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->decimal('total_unpaid', 12, 2)->default(0);
            $table->integer('total_completed')->default(0);
            $table->integer('new_customers')->default(0);
            $table->json('top_products_json')->nullable();
            $table->json('low_stock_json')->nullable();
            $table->text('ai_summary')->nullable();
            $table->timestamps();

            $table->unique(['business_id', 'report_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
