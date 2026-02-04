<?php

return [
    'iyzico' => [
        'api_key' => env('IYZICO_API_KEY'),
        'secret_key' => env('IYZICO_SECRET_KEY'),
        'base_url' => env('IYZICO_BASE_URL', 'https://sandbox-api.iyzipay.com'),
        'callback_url' => env('IYZICO_CALLBACK_URL'),
        'webhook_secret' => env('IYZICO_WEBHOOK_SECRET'),
    ],
];
