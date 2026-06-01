<?php

namespace App\Services\AI;

use App\Models\Business;
use App\Services\Business\DashboardService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Dashboard AI summary. Caches per business (15 min) and falls back to a
 * template so the dashboard always renders (PRD §11.3, §12.3).
 */
class AISummaryService
{
    public function __construct(
        private readonly LlmClient $llm,
        private readonly AIToolService $tools,
        private readonly AIPromptBuilder $prompts,
        private readonly DashboardService $dashboard,
    ) {}

    public function forBusiness(Business $business): string
    {
        return Cache::remember(
            "ai-summary:{$business->id}:".now()->format('Y-m-d-H').':'.intdiv((int) now()->format('i'), 15),
            now()->addMinutes(15),
            fn () => $this->build($business),
        );
    }

    private function build(Business $business): string
    {
        $metrics = $this->tools->getTodaySummary($business);
        $template = $this->template($metrics);

        if (! $this->llm->isLive()) {
            return $template;
        }

        $unpaid = $this->tools->getUnpaidOrders($business);
        $lowStock = $this->tools->getLowStockProducts($business);
        $top = $this->tools->getTopProducts($business);
        $context = $this->prompts->contextBlock($business, $metrics, $unpaid, $lowStock, $top);

        try {
            return $this->llm->reply(
                $this->prompts->systemPrompt(),
                [['role' => 'user', 'content' => 'Buatkan ringkasan bisnis hari ini dalam 2-3 kalimat, ramah dan actionable.']],
                $context,
            );
        } catch (\Throwable $e) {
            Log::warning('AI summary fallback', ['error' => $e->getMessage()]);

            return $template;
        }
    }

    /**
     * @param  array<string, mixed>  $m
     */
    private function template(array $m): string
    {
        if (($m['orders_today'] ?? 0) <= 0) {
            return 'Belum ada order hari ini. Mulai catat order pertama supaya saya bisa bantu rangkum bisnismu.';
        }

        $rp = fn ($n) => 'Rp'.number_format((float) $n, 0, ',', '.');
        $text = "Hari ini ada {$m['orders_today']} order dengan estimasi omzet ".$rp($m['revenue_today']).'.';

        if (($m['unpaid_count'] ?? 0) > 0) {
            $text .= " Ada {$m['unpaid_count']} order belum dibayar";
        }
        if (($m['low_stock_count'] ?? 0) > 0) {
            $text .= " dan {$m['low_stock_count']} stok produk hampir habis";
        }

        return rtrim($text, '.').'.';
    }
}
