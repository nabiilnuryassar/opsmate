<?php

namespace App\Services\AI;

use App\Models\Business;
use Illuminate\Support\Facades\Log;

/**
 * Generates promo ideas grounded in the business's top-selling products.
 * Falls back to a deterministic template when no provider is configured.
 */
class AIPromoService
{
    public function __construct(
        private readonly LlmClient $llm,
        private readonly AIToolService $tools,
        private readonly AIPromptBuilder $prompts,
    ) {}

    /**
     * @param  'this_week'|'this_month'  $period
     */
    public function generate(Business $business, string $period = 'this_week'): string
    {
        $days = $period === 'this_month' ? 30 : 7;
        $topProducts = $this->tools->getTopProducts($business, $days);

        $template = $this->template($topProducts);

        if (! $this->llm->isLive()) {
            return $template;
        }

        $context = "Bisnis: {$business->name}\n".$this->productLines($topProducts)
            ."\nContoh ide: {$template}";

        try {
            return $this->llm->reply(
                $this->prompts->systemPrompt(),
                [['role' => 'user', 'content' => 'Beri 1-2 ide promo singkat berdasarkan produk terlaris, sertakan alasannya.']],
                $context,
            );
        } catch (\Throwable $e) {
            Log::warning('AI promo fallback', ['error' => $e->getMessage()]);

            return $template;
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $topProducts
     */
    private function template(array $topProducts): string
    {
        $top = $topProducts[0] ?? null;

        if ($top === null) {
            return 'Belum ada cukup data penjualan untuk ide promo. Mulai catat lebih banyak order dulu ya.';
        }

        return "Karena {$top['name']} paling sering dibeli, kamu bisa membuat promo:\n"
            ."\"Beli 3 {$top['name']} gratis 1 untuk order sebelum jam 12 siang.\"\n"
            .'Promo ini mendorong pembelian jumlah banyak tanpa langsung menurunkan harga utama.';
    }

    /**
     * @param  array<int, array<string, mixed>>  $topProducts
     */
    private function productLines(array $topProducts): string
    {
        if ($topProducts === []) {
            return 'Belum ada produk terlaris.';
        }

        $lines = ['Produk terlaris:'];
        foreach ($topProducts as $p) {
            $lines[] = "- {$p['name']}: {$p['quantity']}x";
        }

        return implode("\n", $lines);
    }
}
