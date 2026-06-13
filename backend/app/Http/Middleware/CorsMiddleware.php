<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = array_filter(array_map('trim', explode(',', env(
            'FRONTEND_URLS',
            env('FRONTEND_URL', 'http://localhost:5173').',http://127.0.0.1:5173'
        ))));
        $origin = $request->headers->get('Origin');
        $allowOrigin = in_array($origin, $allowedOrigins, true) ? $origin : ($allowedOrigins[0] ?? '*');

        $headers = [
            'Access-Control-Allow-Origin' => $allowOrigin,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, Accept, X-Requested-With',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        if ($request->isMethod('OPTIONS')) {
            return response('', 204, $headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
