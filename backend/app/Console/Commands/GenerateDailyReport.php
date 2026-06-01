<?php

namespace App\Console\Commands;

use App\Models\Business;
use App\Services\Business\ReportService;
use Illuminate\Console\Command;

class GenerateDailyReport extends Command
{
    protected $signature = 'reports:daily';

    protected $description = 'Generate the daily report for every business';

    public function handle(ReportService $service): int
    {
        $count = 0;

        Business::query()->chunkById(50, function ($businesses) use ($service, &$count) {
            foreach ($businesses as $business) {
                $service->generate($business);
                $count++;
            }
        });

        $this->info("Generated daily report for {$count} business(es).");

        return self::SUCCESS;
    }
}
