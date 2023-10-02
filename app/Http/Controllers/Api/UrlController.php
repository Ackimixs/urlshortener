<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreUrlRequest;
use App\Http\Requests\UpdateUrlRequest;
use App\Models\Url;
use App\Http\Controllers\Controller;
use App\Http\Resources\UrlResource;
use App\Http\Resources\UrlCollection;
use Illuminate\Http\Request;
use App\Filters\UrlFilter;

class UrlController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = new UrlFilter();
        $queryItems = $filter->transform($request);

        $urls = Url::where($queryItems)->paginate();

        return ['body' => ['url' => new UrlCollection($urls)]];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUrlRequest $request)
    {
        return ['body' => ['url' => new UrlResource(Url::create($request->all()))]];
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return ['body' => ['url' => new UrlResource(Url::findOrFail($id))]];
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Url $url)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUrlRequest $request, int $id)
    {
        $url = Url::findOrFail($id);

        $url->update($request->all());

        return ['body' => ['url' => new UrlResource($url)]];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $url = Url::findOrFail($id);

        $url->delete();

        return ['body' => ['url' => new UrlResource($url)]];
    }
}
