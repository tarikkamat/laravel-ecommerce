<?php

return [
    'banks' => [
        'vakif_katilim' => [
            'gateway_class' => \Mews\Pos\Gateways\VakifKatilimPos::class,
            'lang' => \Mews\Pos\PosInterface::LANG_TR,
            'credentials' => [
                'payment_model' => \Mews\Pos\PosInterface::MODEL_3D_SECURE,
                'merchant_id' => env('VAKIF_KATILIM_MERCHANT_ID'),
                'terminal_id' => env('VAKIF_KATILIM_TERMINAL_ID'),
                'user_name' => env('VAKIF_KATILIM_USER_NAME'),
                'enc_key' => env('VAKIF_KATILIM_ENC_KEY'),
            ],
            'gateway_configs' => [
                'test_mode' => (bool) env('VAKIF_KATILIM_TEST_MODE', true),
                'disable_3d_hash_check' => (bool) env('VAKIF_KATILIM_DISABLE_3D_HASH_CHECK', false),
            ],
            'gateway_endpoints' => [
                'payment_api' => env('VAKIF_KATILIM_PAYMENT_API', 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/Home'),
                'gateway_3d' => env('VAKIF_KATILIM_GATEWAY_3D', 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/Home/ThreeDModelPayGate'),
                'gateway_3d_host' => env('VAKIF_KATILIM_GATEWAY_3D_HOST', 'https://boa.vakifkatilim.com.tr/VirtualPOS.Gateway/CommonPaymentPage/CommonPaymentPage'),
            ],
        ],
    ],
];
