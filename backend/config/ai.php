<?php

return [
    /*
    | OpenAI-compatible API. When api_key is empty, the assistant falls back to
    | a deterministic, tool-driven responder so the feature still works in dev
    | and core features never depend on an external provider (PRD §12.3).
    */
    'api_key' => env('OPENAI_API_KEY', ''),
    'base_url' => rtrim(env('OPENAI_BASE_URL', 'https://api.openai.com/v1'), '/'),
    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),

    // Seconds to wait for the provider before giving up.
    'timeout' => (int) env('OPENAI_TIMEOUT', 20),

    // Max AI chat requests per user per hour (PRD §12.2).
    'rate_limit_per_hour' => (int) env('AI_RATE_LIMIT_PER_HOUR', 20),

    // Chat history turns included as context.
    'history_limit' => 20,
];
