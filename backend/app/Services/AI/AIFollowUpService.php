<?php

namespace App\Services\AI;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

/**
 * Generates WhatsApp follow-up drafts. Uses the LLM when configured, otherwise
 * deterministic Indonesian templates so the feature always works (PRD §12.3).
 */
class AIFollowUpService
{
    public function __construct(
        private readonly LlmClient $llm,
        private readonly AIPromptBuilder $prompts,
    ) {}

    /**
     * @param  'payment'|'reorder'|'general'  $type
     */
    public function generate(Customer $customer, ?Order $order, string $type): string
    {
        $template = $this->template($customer, $order, $type);

        if (! $this->llm->isLive()) {
            return $template;
        }

        $context = $this->context($customer, $order, $type, $template);

        try {
            return $this->llm->reply(
                $this->prompts->systemPrompt(),
                [['role' => 'user', 'content' => 'Tuliskan satu pesan WhatsApp follow-up yang sopan dan singkat.']],
                $context,
            );
        } catch (\Throwable $e) {
            Log::warning('AI follow-up fallback', ['error' => $e->getMessage()]);

            return $template;
        }
    }

    private function template(Customer $customer, ?Order $order, string $type): string
    {
        $businessName = $customer->business?->name ?? 'kami';
        $name = $customer->name;

        return match ($type) {
            'payment' => $this->payment($businessName, $name, $order),
            'reorder' => "Halo Kak {$name}, sudah lama tidak order di {$businessName}. "
                .'Minggu ini ada menu/produk baru lho. Mau pesan lagi Kak? Hubungi kami ya.',
            default => "Halo Kak {$name}, terima kasih sudah order di {$businessName}. "
                .'Semoga cocok ya. Kalau ada masukan, boleh langsung chat ke nomor ini. Terima kasih banyak!',
        };
    }

    private function payment(string $businessName, string $name, ?Order $order): string
    {
        $total = $order ? 'Rp'.number_format((float) $order->total, 0, ',', '.') : '';
        $ref = $order?->order_number ?? '';

        return "Halo Kak {$name}, ini kami dari {$businessName}. "
            ."Mau mengingatkan pembayaran order {$ref} sebesar {$total}. "
            .'Jika sudah transfer, boleh kirim bukti pembayaran ya Kak. Terima kasih.';
    }

    private function context(Customer $customer, ?Order $order, string $type, string $template): string
    {
        $lines = [
            "Bisnis: {$customer->business?->name}",
            "Customer: {$customer->name}",
            "Jenis follow-up: {$type}",
        ];
        if ($order) {
            $lines[] = "Order: {$order->order_number}, total Rp".number_format((float) $order->total, 0, ',', '.');
        }
        $lines[] = "Contoh nada pesan: {$template}";

        return implode("\n", $lines);
    }
}
