<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * OpenAI-compatible chat client. Context (tool results) is pre-resolved by the
 * assistant service and injected as a system message, so this client stays a
 * thin transport with no DB access.
 */
class OpenAiLlmClient implements LlmClient
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $baseUrl,
        private readonly string $model,
        private readonly int $timeout,
    ) {}

    public function isLive(): bool
    {
        return $this->apiKey !== '';
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $history
     */
    public function reply(string $systemPrompt, array $history, string $contextBlock): string
    {
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'system', 'content' => "Data bisnis terkini (jangan mengarang di luar ini):\n".$contextBlock],
            ...$history,
        ];

        $response = Http::timeout($this->timeout)
            ->withToken($this->apiKey)
            ->post("{$this->baseUrl}/chat/completions", [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => 0.4,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('AI provider error: '.$response->status());
        }

        $content = $response->json('choices.0.message.content');

        if (! is_string($content) || $content === '') {
            throw new RuntimeException('AI provider returned an empty response.');
        }

        return $content;
    }
}
