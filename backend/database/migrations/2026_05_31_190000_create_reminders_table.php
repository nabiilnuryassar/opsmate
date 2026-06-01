<?php

use App\Enums\ReminderPriority;
use App\Enums\ReminderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('related_type')->nullable();
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type');
            $table->string('status')->default(ReminderStatus::Pending->value);
            $table->string('priority')->default(ReminderPriority::Later->value);
            $table->timestamp('due_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('snoozed_until')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'status']);
            // Used to dedupe auto-generated reminders for the same source row.
            $table->index(['business_id', 'type', 'related_type', 'related_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
