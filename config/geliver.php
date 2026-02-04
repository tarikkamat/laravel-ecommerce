<?php

return [
    'token' => env('GELIVER_TOKEN'),
    'sender_address_id' => env('GELIVER_SENDER_ADDRESS_ID'),
    'source_identifier' => env('GELIVER_SOURCE_IDENTIFIER', config('app.url')),

    'webhook' => [
        // Geliver SDK's verification is currently a stub; keep disabled.
        'verify' => (bool) env('GELIVER_WEBHOOK_VERIFY', false),
        'secret' => env('GELIVER_WEBHOOK_SECRET'),
    ],

    // Defaults used for rate estimation in checkout.
    'defaults' => [
        'city_code' => env('GELIVER_DEFAULT_CITY_CODE', '34'),
        'distance_unit' => env('GELIVER_DISTANCE_UNIT', 'cm'),
        'mass_unit' => env('GELIVER_MASS_UNIT', 'kg'),
        'length' => env('GELIVER_DEFAULT_LENGTH', '10.0'),
        'width' => env('GELIVER_DEFAULT_WIDTH', '10.0'),
        'height' => env('GELIVER_DEFAULT_HEIGHT', '10.0'),
        'weight' => env('GELIVER_DEFAULT_WEIGHT', '1.0'),
    ],
];
