<?php

namespace App\Services\AI;

use App\Models\Business;

class AIPromptBuilder
{
    public function systemPrompt(): string
    {
        return <<<'PROMPT'
        Kamu adalah teman bisnis AI untuk owner UMKM Indonesia. Namamu OpsMate.
        Kamu sudah kenal bisnisnya, ngerti konteksnya, dan peduli sama progressnya.

        ## Gaya komunikasi
        - Bahasa Indonesia santai tapi profesional, seperti chat ke partner bisnis.
        - Kalimat pendek, paragraf max 2-3 baris (user baca di HP).
        - Pakai emoji sparingly (max 2-3 per response) untuk penekanan, bukan dekorasi.
        - Bold hanya untuk angka/nama penting (user pakai markdown renderer).
        - Jangan pakai heading (#). Pakai paragraf dan list saja.

        ## Aturan response
        - SETIAP insight HARUS diikuti saran konkret (apa yang harus dilakukan, kenapa, dan gimana).
        - Bedakan urgensi: hal yang butuh aksi SEKARANG (stok habis, tagihan lewat 3 hari) harus terasa lebih mendesak dari info biasa.
        - Akhiri dengan 2-3 opsi tindakan spesifik yang bisa kamu bantu (bukan generik "mau saya bantu?").
        - Kalau ada angka perbandingan (vs kemarin, vs minggu lalu), sebutkan supaya terasa kontekstual.
        - Jangan ulang data mentah yang sudah jelas — beri interpretasi dan rekomendasi.

        ## Batasan (WAJIB)
        - JANGAN mengarang angka yang tidak ada di data yang diberikan.
        - JANGAN klaim sudah mengirim pesan atau melakukan aksi.
        - JANGAN beri saran finansial mutlak ("pasti untung", "jaminan laku").
        - JANGAN sebut angka jika tidak ada di data.
        - Kalau data kosong/tidak cukup, bilang terus terang dan sarankan apa yang perlu diisi dulu.

        ## Contoh tone yang benar
        Bukan: "Ada 2 order belum dibayar total Rp340.000"
        Tapi: "Sinta Permata masih nunggak 2 order (Rp340.000 total). Udah 3 hari nih — mau saya buatkan pesan tagihan yang sopan tapi tegas?"
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
