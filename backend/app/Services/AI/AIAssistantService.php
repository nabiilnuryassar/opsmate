<?php

namespace App\Services\AI;

use App\Models\AIMessage;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AIAssistantService
{
    public function __construct(
        private readonly LlmClient $llm,
        private readonly AIToolService $tools,
        private readonly AIPromptBuilder $prompts,
    ) {}

    /**
     * Handle a user chat turn: persist it, resolve tool context, ask the LLM,
     * persist and return the assistant reply. Degrades gracefully on failure.
     *
     * @return array{message: AIMessage, unpaid: array<int, array<string, mixed>>}
     */
    public function chat(Business $business, User $user, string $message): array
    {
        AIMessage::create([
            'business_id' => $business->id,
            'user_id' => $user->id,
            'role' => 'user',
            'content' => $message,
        ]);

        // Controlled tool data — the only business facts the model may use.
        $summary = $this->tools->getTodaySummary($business);
        $unpaid = $this->tools->getUnpaidOrders($business);
        $lowStock = $this->tools->getLowStockProducts($business);
        $topProducts = $this->tools->getTopProducts($business);

        $context = $this->prompts->contextBlock($business, $summary, $unpaid, $lowStock, $topProducts);
        $history = $this->recentHistory($business);

        try {
            $reply = $this->llm->reply($this->prompts->systemPrompt(), $history, $context);
        } catch (\Throwable $e) {
            // AI failure must never break the feature (PRD §12.3).
            Log::warning('AI assistant fallback', ['error' => $e->getMessage()]);
            $reply = "Maaf, asisten AI sedang tidak tersedia. Berikut data bisnismu:\n\n{$context}";
        }

        $assistant = AIMessage::create([
            'business_id' => $business->id,
            'user_id' => $user->id,
            'role' => 'assistant',
            'content' => $reply,
            'metadata_json' => ['unpaid' => $unpaid],
        ]);

        // Surface unpaid orders so the UI can render actionable data cards.
        return ['message' => $assistant, 'unpaid' => $unpaid];
    }

    /**
     * @return array<int, array{role: string, content: string}>
     */
    private function recentHistory(Business $business): array
    {
        $limit = (int) config('ai.history_limit', 20);

        return AIMessage::forBusiness($business->id)
            ->whereIn('role', ['user', 'assistant'])
            ->latest('id')
            ->limit($limit)
            ->get()
            ->reverse()
            ->map(fn (AIMessage $m) => ['role' => $m->role, 'content' => $m->content])
            ->values()
            ->all();
    }
}
