<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AIMessageResource;
use App\Models\AIMessage;
use App\Services\AI\AIAssistantService;
use App\Services\AI\AIDailyReportService;
use App\Services\AI\AIFollowUpService;
use App\Services\AI\AIPromoService;
use App\Services\AI\AISummaryService;
use App\Models\Customer;
use App\Models\Order;
use App\Support\ActiveBusiness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\RateLimiter;

class AIController extends Controller
{
    public function __construct(
        private readonly AIAssistantService $assistant,
        private readonly AISummaryService $summary,
        private readonly AIFollowUpService $followUp,
        private readonly AIPromoService $promo,
        private readonly AIDailyReportService $dailyReport,
    ) {}

    public function chat(Request $request): JsonResponse
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        // Rate limit per user per hour (PRD §12.2).
        $key = 'ai-chat:'.$request->user()->id;
        $perHour = (int) config('ai.rate_limit_per_hour', 20);

        if (RateLimiter::tooManyAttempts($key, $perHour)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'message' => "Batas tanya AI tercapai. Coba lagi dalam {$seconds} detik.",
            ], 429);
        }

        RateLimiter::hit($key, 3600);

        $result = $this->assistant->chat($business, $request->user(), $validated['message']);

        return (new AIMessageResource($result['message']))->response();
    }

    public function messages(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $messages = AIMessage::forBusiness($business->id)
            ->whereIn('role', ['user', 'assistant'])
            ->orderBy('id')
            ->limit(100)
            ->get();

        return AIMessageResource::collection($messages);
    }

    public function dashboardSummary(Request $request): JsonResponse
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        return response()->json(['summary' => $this->summary->forBusiness($business)]);
    }

    public function generateFollowUp(Request $request): JsonResponse
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $validated = $request->validate([
            'customer_id' => ['required', 'integer'],
            'order_id' => ['nullable', 'integer'],
            'type' => ['required', 'in:payment,reorder,general'],
        ]);

        $customer = Customer::forBusiness($business->id)
            ->with('business')
            ->findOrFail($validated['customer_id']);

        $order = null;
        if (! empty($validated['order_id'])) {
            $order = Order::forBusiness($business->id)->find($validated['order_id']);
        }

        return response()->json([
            'message' => $this->followUp->generate($customer, $order, $validated['type']),
        ]);
    }

    public function generatePromoIdeas(Request $request): JsonResponse
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $validated = $request->validate([
            'period' => ['nullable', 'in:this_week,this_month'],
        ]);

        return response()->json([
            'ideas' => $this->promo->generate($business, $validated['period'] ?? 'this_week'),
        ]);
    }

    public function generateDailySummary(Request $request): JsonResponse
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $validated = $request->validate([
            'date' => ['nullable', 'date'],
        ]);

        $date = ! empty($validated['date']) ? \Illuminate\Support\Carbon::parse($validated['date']) : null;
        $report = $this->dailyReport->generate($business, $date);

        return response()->json(['summary' => $report->ai_summary]);
    }
}
