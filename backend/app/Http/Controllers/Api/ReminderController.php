<?php

namespace App\Http\Controllers\Api;

use App\Enums\ReminderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReminderResource;
use App\Models\Reminder;
use App\Services\Business\FollowUpMessageService;
use App\Support\ActiveBusiness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReminderController extends Controller
{
    public function __construct(private readonly FollowUpMessageService $followUp) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $reminders = Reminder::forBusiness($business->id)
            ->active()
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 0 WHEN 'today' THEN 1 ELSE 2 END")
            ->latest('id')
            ->get();

        return ReminderResource::collection($reminders);
    }

    public function done(Request $request, Reminder $reminder): ReminderResource
    {
        $this->authorizeReminder($request, $reminder);

        $reminder->update([
            'status' => ReminderStatus::Done->value,
            'completed_at' => now(),
        ]);

        return new ReminderResource($reminder);
    }

    public function snooze(Request $request, Reminder $reminder): ReminderResource
    {
        $this->authorizeReminder($request, $reminder);

        $validated = $request->validate([
            'until' => ['nullable', 'date', 'after:now'],
        ]);

        $reminder->update([
            'status' => ReminderStatus::Snoozed->value,
            'snoozed_until' => $validated['until'] ?? now()->addDay(),
        ]);

        return new ReminderResource($reminder);
    }

    public function generateMessage(Request $request, Reminder $reminder): JsonResponse
    {
        $this->authorizeReminder($request, $reminder);

        return response()->json([
            'message' => $this->followUp->forReminder($reminder),
        ]);
    }

    private function authorizeReminder(Request $request, Reminder $reminder): void
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        abort_unless($reminder->business_id === $business->id, 404, 'Reminder tidak ditemukan.');
    }
}
