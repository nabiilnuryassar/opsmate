<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto-generate operational reminders every morning.
Schedule::command('reminders:generate')->dailyAt('06:00');

// Generate the daily report at end of day.
Schedule::command('reports:daily')->dailyAt('23:59');
