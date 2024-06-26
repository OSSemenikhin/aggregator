<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Constants\CookieConstants;
use App\Models\City;
use App\Models\Region;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use \App\Http\Controllers\CookieController;

class LocationController extends Controller
{
    public $errors = [];
    public $response;


    public static function getCityID(): int
    {
        $city = CookieController::getCookie(CookieConstants::LOCATION) ?? null;
        if (!$city) $city = City::START_CITY;
        CookieController::setCookie(CookieConstants::LOCATION, $city, CookieController::getYears(1));
        return $city;
    }

    public function getCityInfo(Request $request): JsonResponse
    {
        $id = $request->input('id', CookieController::getCookie(CookieConstants::LOCATION));
        $city = City::find($id);
        return response()->json($city);
    }

    public function cities(): Response
    {
        return response(City::getAll()->get());
    }

    public function location(): Response
    {
        $filter = app(\App\Services\FilterService::class)->getFilterByName('location');
        return response($filter->getItems(self::getCityID()));
    }

    public function allLocations(): Response
    {
        return response(\App\Models\Region::full()->get());
    }
}


