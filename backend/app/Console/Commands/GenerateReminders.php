<?php

namespace App\Console\Commands;

use App\Models\Business;
use App\Services\Business\ReminderService;
use Illuminate\Console\Command;

class GenerateReminders extends Command
{
    protected $signature = 'reminders:generate';

    protected $description = 'Generate operational reminders for every business (unpaid orders, overdue invoices, low stock, etc.)';

    public function handle(ReminderService $service): int
    {
        $total = 0;

        Business::query()->chunkById(50, function ($businesses) use ($service, &$total) {
            foreach ($businesses as $business) {
                $total += $service->generateForBusiness($business);
            }
        });

        $this->info("Generated {$total} reminder(s).");

        return self::SUCCESS;
    }
}
