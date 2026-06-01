<?php

namespace App\Providers;

use App\Services\AI\FallbackLlmClient;
use App\Services\AI\LlmClient;
use App\Services\AI\OpenAiLlmClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Real provider when a key is configured; deterministic fallback otherwise.
        $this->app->singleton(LlmClient::class, function () {
            $apiKey = (string) config('ai.api_key', '');
            if ($apiKey === '') {
                return new FallbackLlmClient;
            }
            return new OpenAiLlmClient(
                $apiKey,
                (string) config('ai.base_url'),
                (string) config('ai.model'),
                (int) config('ai.timeout', 20),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
