<?php

namespace App\Services\AI;

interface LlmClient
{
    /**
     * Produce an assistant reply given the system prompt, prior turns, and a
     * pre-resolved business-context block.
     *
     * @param  array<int, array{role: string, content: string}>  $history
     */
    public function reply(string $systemPrompt, array $history, string $contextBlock): string;

    /** Whether a real provider is configured (false → deterministic fallback). */
    public function isLive(): bool;
}
