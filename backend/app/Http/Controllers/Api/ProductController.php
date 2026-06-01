<?php

namespace App\Http\Controllers\Api;

use App\Enums\StockMovementType;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\StockMovementResource;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\Business\StockService;
use App\Support\ActiveBusiness;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function __construct(private readonly StockService $stock) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $query = Product::forBusiness($business->id);

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($request->boolean('low_stock')) {
            $query->lowStock();
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $sort = in_array($request->query('sort'), ['name', 'price', 'stock', 'created_at'], true)
            ? $request->query('sort')
            : 'name';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

        return ProductResource::collection(
            $query->orderBy($sort, $direction)->paginate(20)->withQueryString(),
        );
    }

    public function lowStock(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        return ProductResource::collection(
            Product::forBusiness($business->id)->lowStock()->orderBy('stock')->get(),
        );
    }

    public function store(ProductRequest $request): ProductResource
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $product = Product::create([
            ...$request->validated(),
            'business_id' => $business->id,
        ]);

        return new ProductResource($product);
    }

    public function show(Request $request, Product $product): ProductResource
    {
        $this->authorizeProduct($request, $product);

        return new ProductResource($product);
    }

    public function update(ProductRequest $request, Product $product): ProductResource
    {
        $this->authorizeProduct($request, $product);

        $product->update($request->validated());

        return new ProductResource($product);
    }

    public function destroy(Request $request, Product $product): Response
    {
        $this->authorizeProduct($request, $product);

        $product->delete();

        return response()->noContent();
    }

    public function stockMovements(Request $request, Product $product): AnonymousResourceCollection
    {
        $this->authorizeProduct($request, $product);

        return StockMovementResource::collection(
            StockMovement::where('product_id', $product->id)->latest('id')->paginate(20),
        );
    }

    public function stockAdjustment(Request $request, Product $product): ProductResource
    {
        $this->authorizeProduct($request, $product);

        $validated = $request->validate([
            'type' => ['required', Rule::enum(StockMovementType::class)],
            'quantity' => ['required', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $this->stock->adjust(
            $product,
            StockMovementType::from($validated['type']),
            (int) $validated['quantity'],
            $validated['notes'] ?? null,
            $request->user()->id,
        );

        return new ProductResource($product->fresh());
    }

    /** Reject access to a product that belongs to a different business. */
    private function authorizeProduct(Request $request, Product $product): void
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        abort_unless($product->business_id === $business->id, 404, 'Produk tidak ditemukan.');
    }
}
