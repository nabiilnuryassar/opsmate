<?php

namespace App\Services\AI;

use App\Models\Business;

class AIPromptBuilder
{
    public function systemPrompt(): string
    {
        return <<<'PROMPT'
        Kamu adalah AI Ops Manager untuk UMKM Indonesia.
        Tugas kamu membantu pemilik bisnis memahami kondisi operasional hariannya.

        Kamu boleh:
        - merangkum data order
        - memberi insight customer
        - memberi insight stok
        - membuat draft pesan follow-up
        - membuat ide promo
        - menjelaskan laporan harian

        Kamu tidak boleh:
        - mengarang data yang tidak tersedia
        - mengubah data tanpa persetujuan user
        - membuat janji bahwa pesan sudah dikirim
        - memberi saran finansial mutlak
        - menyebut angka jika tidak ada di data

        Gunakan bahasa Indonesia yang ramah, jelas, dan praktis.
        Prioritaskan jawaban singkat, actionable, dan cocok untuk owner UMKM.
        PROMPT;
    }

    /**
     * A compact, human-readable context block built from controlled tool data.
     * This is the ONLY business data the model sees, so it cannot invent figures.
     *
     * @param  array<string, mixed>  $summary
     * @param  array<int, array<string, mixed>>  $unpaid
     * @param  array<int, array<string, mixed>>  $lowStock
     * @param  array<int, array<string, mixed>>  $topProducts
     */
    public function contextBlock(
        Business $business,
        array $summary,
        array $unpaid,
        array $lowStock,
        array $topProducts,
    ): string {
        $rp = fn ($n) => 'Rp'.number_format((float) $n, 0, ',', '.');
        $lines = [];

        $lines[] = "Bisnis: {$business->name}".($business->category ? " ({$business->category})" : '');
        $lines[] = "Order hari ini: {$summary['orders_today']}";
        $lines[] = 'Omzet hari ini: '.$rp($summary['revenue_today']);
        $lines[] = "Order belum dibayar: {$summary['unpaid_count']} (".$rp($summary['unpaid_total']).')';
        $lines[] = "Order diproses: {$summary['processing_count']}";
        $lines[] = "Stok rendah: {$summary['low_stock_count']} produk";

        if ($unpaid !== []) {
            $lines[] = '';
            $lines[] = 'Daftar belum bayar:';
            foreach ($unpaid as $o) {
                $lines[] = "- {$o['customer']} ({$o['order_number']}): ".$rp($o['total']);
            }
        }

        if ($topProducts !== []) {
            $lines[] = '';
            $lines[] = 'Produk terlaris (7 hari):';
            foreach ($topProducts as $p) {
                $lines[] = "- {$p['name']}: {$p['quantity']}x";
            }
        }

        if ($lowStock !== []) {
            $lines[] = '';
            $lines[] = 'Stok hampir habis:';
            foreach ($lowStock as $p) {
                $lines[] = "- {$p['name']}: sisa {$p['stock']}";
            }
        }

        return implode("\n", $lines);
    }
}
