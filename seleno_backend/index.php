<?php
// index.php

// Handle CORS preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:8080');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Type: application/json');
    http_response_code(200);
    exit(0);
}

// Suppress warnings to prevent "headers already sent" errors
error_reporting(E_ERROR | E_PARSE);

// Auto-load controllers and models
spl_autoload_register(function ($class) {
    $parts = explode('\\', $class);
    $map = [
        'Config' => 'config',
        'Controllers' => 'controllers',
        'Models' => 'models',
        'Core' => 'core'
    ];
    if (isset($map[$parts[0]])) {
        $path = $map[$parts[0]] . '/' . implode('/', array_slice($parts, 1)) . '.php';
        if (file_exists($path)) {
            require_once $path;
        }
    }
});

require_once 'config/Database.php';
require_once 'core/Router.php';
require_once 'core/Request.php';
require_once 'middleware/AuthMiddleware.php';

// Create router
$router = new Core\Router();

// Load routes from routes/api.php
$routes = require_once 'routes/api.php';
foreach ($routes as $route) {
    try {
        // Handle both formats: ['method', 'path', 'Controller@method'] or ['method', 'path', 'Controller', 'method']
        if (count($route) === 3) {
            // Format: ['method', 'path', 'Controller@method']
            list($method, $path, $controllerAction) = $route;
            if (strpos($controllerAction, '@') === false) {
                continue; // Skip invalid routes
            }
            list($controller, $action) = explode('@', $controllerAction);
            $router->addRoute($method, $path, $controller, $action);
        } elseif (count($route) === 4) {
            // Format: ['method', 'path', 'Controller', 'method']
            $router->addRoute($route[0], $route[1], $route[2], $route[3]);
        }
    } catch (Exception $e) {
        // Skip invalid routes
        continue;
    }
}

// Handle the request
$request = new Core\Request();

// Check authentication for API routes
if (AuthMiddleware::requiresAuth($request->getUri())) {
    AuthMiddleware::validateAuth();
}

// Dispatch the request
$router->dispatch($request->getMethod(), $request->getUri());
