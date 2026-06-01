<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Support\ActiveBusiness;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $query = Customer::forBusiness($business->id)->withCount('orders');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($type = $request->query('type')) {
            $query->where('customer_type', $type);
        }

        $sort = in_array($request->query('sort'), ['name', 'last_order_at', 'created_at'], true)
            ? $request->query('sort')
            : 'name';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

        return CustomerResource::collection(
            $query->orderBy($sort, $direction)->paginate(20)->withQueryString(),
        );
    }

    public function store(CustomerRequest $request): CustomerResource
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $customer = Customer::create([
            ...$request->validated(),
            'business_id' => $business->id,
        ]);

        return new CustomerResource($customer);
    }

    public function show(Request $request, Customer $customer): CustomerResource
    {
        $this->authorizeCustomer($request, $customer);

        return new CustomerResource($customer->loadCount('orders'));
    }

    public function update(CustomerRequest $request, Customer $customer): CustomerResource
    {
        $this->authorizeCustomer($request, $customer);

        $customer->update($request->validated());

        return new CustomerResource($customer);
    }

    public function destroy(Request $request, Customer $customer): Response
    {
        $this->authorizeCustomer($request, $customer);

        $customer->delete();

        return response()->noContent();
    }

    public function orders(Request $request, Customer $customer): AnonymousResourceCollection
    {
        $this->authorizeCustomer($request, $customer);

        return OrderResource::collection(
            $customer->orders()->withCount('items')->latest('order_date')->latest('id')->paginate(20),
        );
    }

    /** Reject access to a customer that belongs to a different business. */
    private function authorizeCustomer(Request $request, Customer $customer): void
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        abort_unless($customer->business_id === $business->id, 404, 'Customer tidak ditemukan.');
    }
}
