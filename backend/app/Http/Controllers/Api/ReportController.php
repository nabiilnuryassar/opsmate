<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DailyReportResource;
use App\Models\DailyReport;
use App\Services\Business\ReportService;
use App\Support\ActiveBusiness;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reports) {}

    public function daily(Request $request): JsonResponse
    {
        return $this->resolve($request, Carbon::today());
    }

    public function dailyForDate(Request $request, string $date): JsonResponse
    {
        return $this->resolve($request, $this->parseDate($date));
    }

    public function pdf(Request $request, string $date): Response
    {
        $business = ActiveBusiness::forUserOrFail($request->user());
        $report = $this->reports->generate($business, $this->parseDate($date));
        $summary = $report->ai_summary ?: $this->reports->fallbackSummary($report);

        $pdf = Pdf::loadView('pdf.daily-report', [
            'report' => $report,
            'business' => $business,
            'summary' => $summary,
        ])->setPaper('a4')->output();

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"laporan-{$report->report_date->toDateString()}.pdf\"",
        ]);
    }

    private function resolve(Request $request, Carbon $date): JsonResponse
    {
        $business = ActiveBusiness::forUserOrFail($request->user());
        $report = $this->reports->generate($business, $date);

        // Provide a usable summary even before the AI layer fills ai_summary (TASK-15).
        if (! $report->ai_summary) {
            $report->ai_summary = $this->reports->fallbackSummary($report);
        }

        return (new DailyReportResource($report))->response()->setStatusCode(200);
    }

    private function parseDate(string $date): Carbon
    {
        try {
            return Carbon::parse($date)->startOfDay();
        } catch (\Throwable) {
            abort(422, 'Format tanggal tidak valid.');
        }
    }
}
