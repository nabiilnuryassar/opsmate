<?php

namespace App\Http\Resources;

use App\Models\DailyReport;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin DailyReport
 */
class DailyReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'report_date' => $this->report_date?->toDateString(),
            'total_orders' => $this->total_orders,
            'total_revenue' => (float) $this->total_revenue,
            'total_unpaid' => (float) $this->total_unpaid,
            'total_completed' => $this->total_completed,
            'new_customers' => $this->new_customers,
            'top_products' => $this->top_products_json ?? [],
            'low_stock' => $this->low_stock_json ?? [],
            'ai_summary' => $this->ai_summary,
        ];
    }
}
