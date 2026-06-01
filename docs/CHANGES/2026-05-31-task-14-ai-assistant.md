# TASK-14 — AI Business Assistant

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Fourteenth task from `docs/plans/14-TASK-ai-assistant.md`. The differentiator: an AI chat that answers from real, business-scoped data via controlled tools — never fabricating numbers, never reaching another business's data, and never breaking core features when the provider is down (PRD §12.3, §16).

## What changed

### Backend
- `config/ai.php` — provider key/base/model/timeout, rate limit, history limit.
- Migration `ai_messages` + `App\Models\AIMessage` (metadata_json, `forBusiness`).
- `App\Services\AI\AIToolService` — controlled tools (today summary, unpaid orders, low stock, top products, inactive customers), all business-scoped.
- `App\Services\AI\LlmClient` contract + `OpenAiLlmClient` (HTTP transport) + `FallbackLlmClient` (deterministic, keyless).
- `App\Services\AI\AIPromptBuilder` — PRD system prompt + compact context block (the only facts the model sees).
- `App\Services\AI\AIAssistantService` — persists turns, resolves tool context, calls the LLM, degrades gracefully on error.
- `AppServiceProvider` binds `LlmClient` (fallback when no key, OpenAI otherwise).
- `AIMessageResource`, `AIController` (chat with per-user hourly rate limit, messages history) + routes.

### Frontend
- `features/ai/api/ai-api.ts` — `useAIMessages`, `useSendMessage`, types.
- Components: `ChatBubble`, `AIDataCard` (embedded unpaid order + WA action), `SuggestedPromptChips`, `AITypingIndicator`, `ChatInput`, `AIChatPanel` (auto-scroll).
- `pages/AIAssistantPage.tsx` — business context header, chat, prompts, input.
- `App.tsx` — `/ai` route.

## How to test

- Backend: `php artisan test --filter=AIAssistantTest` → 7 passing (auth, validation, grounded reply, persistence, tenant-scoped history, rate limit 429, no cross-tenant leak).
- Frontend: `npx vitest run` → 52 passing incl. `ChatBubble.test.tsx` (user/assistant render, data cards only for assistant).
- Build clean. The fallback client keeps the assistant working with no API key.

## Rollback plan

- Drop `ai_messages` migration; delete `app/Services/AI/*`, AIMessage, AIController, AIMessageResource, config/ai.php; revert AppServiceProvider binding + routes; delete `features/ai`; revert `App.tsx`.
