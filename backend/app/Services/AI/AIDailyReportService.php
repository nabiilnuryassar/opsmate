<?php

namespace App\Services\AI;

use App\Models\Business;
use App\Models\DailyReport;
use App\Services\Business\ReportService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Generates and persists the daily_reports.ai_summary. Falls back to the
 * ReportService template when no provider is configured (PRD §12.3, §27.1).
 */
class AIDailyReportService
{
    public function __construct(
        private readonly LlmClient $llm,
        private readonly AIPromptBuilder $prompts,
        private readonly ReportService $reports,
    ) {}

    public function generate(Business $business, ?Carbon $date = null): DailyReport
    {
        $report = $this->reports->generate($business, $date);
        $report->ai_summary = $this->summary($business, $report);
        $report->save();

        return $report;
    }

    private function summary(Business $business, DailyReport $report): string
    {
        $template = $this->reports->fallbackSummary($report);

        if (! $this->llm->isLive() || $report->total_orders === 0) {
            return $template;
        }

        try {
            return $this->llm->reply(
                $this->prompts->systemPrompt(),
                [['role' => 'user', 'content' => 'Buatkan ringkasan laporan harian beserta 2-3 saran tindakan praktis.']],
                $this->context($business, $report),
            );
        } catch (\Throwable $e) {
            Log::warning('AI daily summary fallback', ['error' => $e->getMessage()]);

            return $template;
        }
    }

    private function context(Business $business, DailyReport $report): string
    {
        $rp = fn ($n) => 'Rp'.number_format((float) $n, 0, ',', '.');
        $lines = [
            "Bisnis: {$business->name}",
            "Tanggal: {$report->report_date->toDateString()}",
            "Total order: {$report->total_orders}",
            'Omzet: '.$rp($report->total_revenue),
            'Belum dibayar: '.$rp($report->total_unpaid),
            "Order selesai: {$report->total_completed}",
        ];

        foreach (($report->top_products_json ?? []) as $p) {
            $lines[] = "Terlaris: {$p['name']} ({$p['quantity']}x)";
        }
        foreach (($report->low_stock_json ?? []) as $p) {
            $lines[] = "Stok rendah: {$p['name']} (sisa {$p['stock']})";
        }

        return implode("\n", $lines);
    }
}
