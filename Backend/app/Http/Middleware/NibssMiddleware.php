<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Service\PaymentService;
use Symfony\Component\HttpFoundation\Response;

class NibssMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next)
    {
        $date = now()->format('Ymd');
        $secret = $this->nibssModel()->getNibssKey("SECRET_KEY")->key;
        $billerName = strtolower(trim(env('BILLER_NAME')));
        $signature = hash('sha256', $date . $secret);
        $authHeader = base64_encode($billerName);

        if ($signature === $request->header("SIGNATURE")) {
            return $next($request);
        }

        return response()->json(["status" => "error", "message" => "you do not have access to this route "], 400);
    }

    private function nibssModel()
    {
        return (new PaymentService());
    }
}
