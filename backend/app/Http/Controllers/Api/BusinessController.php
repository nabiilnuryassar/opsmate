<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBusinessRequest;
use App\Http\Resources\BusinessResource;
use App\Support\ActiveBusiness;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BusinessController extends Controller
{
    public function show(Request $request): BusinessResource
    {
        $business = ActiveBusiness::forUser($request->user());

        abort_if($business === null, Response::HTTP_NOT_FOUND, 'Bisnis tidak ditemukan.');

        return new BusinessResource($business);
    }

    public function update(UpdateBusinessRequest $request): BusinessResource
    {
        $business = ActiveBusiness::forUser($request->user());

        abort_if($business === null, Response::HTTP_NOT_FOUND, 'Bisnis tidak ditemukan.');

        $business->update($request->validated());

        return new BusinessResource($business->fresh());
    }
}
