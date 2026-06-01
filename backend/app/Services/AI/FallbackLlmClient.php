<?php

namespace App\Services\AI;

/**
 * Deterministic responder used when no provider key is configured. It does not
 * "reason" — it surfaces the already-resolved business context block as a
 * friendly Indonesian message so the assistant stays useful offline.
 */
class FallbackLlmClient implements LlmClient
{
    public function isLive(): bool
    {
        return false;
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $history
     */
    public function reply(string $systemPrompt, array $history, string $contextBlock): string
    {
        $lastUser = '';
        foreach (array_reverse($history) as $turn) {
            if (($turn['role'] ?? '') === 'user') {
                $lastUser = trim($turn['content'] ?? '');
                break;
            }
        }

        $intro = $lastUser !== ''
            ? 'Berikut ringkasan bisnismu berdasarkan data terbaru:'
            : 'Halo! Berikut kondisi bisnismu saat ini:';

        return $intro."\n\n".$contextBlock."\n\n"
            .'(Catatan: asisten AI penuh aktif setelah API key dikonfigurasi. '
            .'Untuk sekarang saya tampilkan data apa adanya tanpa mengarang angka.)';
    }
}
