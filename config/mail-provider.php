<?php

return [
    'default' => env('MAIL_PROVIDER', 'mailtrap'),

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@example.com'),
        'name' => env('MAIL_FROM_NAME', env('APP_NAME', 'No Reply')),
    ],

    'providers' => [
        'mailtrap' => [
            'driver' => 'mailtrap',
            'api_key' => env('MAILTRAP_API_KEY'),
            'from' => [
                'address' => env('MAILTRAP_FROM_ADDRESS', env('MAIL_FROM_ADDRESS', 'noreply@example.com')),
                'name' => env('MAILTRAP_FROM_NAME', env('MAIL_FROM_NAME', 'No Reply')),
            ],
        ],

        'log' => [
            'driver' => 'log',
            'channel' => env('LOG_MAIL_CHANNEL', 'stack'),
        ],
    ],
];
