<?php
// 1. CORS CONFIGURATION
$allowed_origins = [
    'http://localhost',
    'https://gakoshop.xyz',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
    'http://localhost:8084',
    'http://localhost:8085',
    'http://localhost:8086'
];

// Get the origin from the request headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if origin is allowed
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Type: application/json');
    header('Content-Length: 0');
    http_response_code(200);
    exit; // Stop execution here
}

// 2. BOOTSTRAPPING
require_once 'config/Database.php';
require_once 'core/Router.php';
require_once 'core/Request.php';
require_once 'middleware/AuthMiddleware.php';

// Auto-load classes
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

// 3. ROUTING
$router = new Core\Router();
$routes = require_once 'routes/api.php';

foreach ($routes as $route) {
    // Format: ['GET', '/path', 'Controller@method']
    if (count($route) === 3 && strpos($route[2], '@') !== false) {
        list($method, $path, $controllerAction) = $route;
        list($controller, $action) = explode('@', $controllerAction);
        $router->addRoute($method, $path, $controller, $action);
    } 
    // Format: ['GET', '/path', 'Controller', 'method']
    elseif (count($route) === 4) {
        $router->addRoute($route[0], $route[1], $route[2], $route[3]);
    }
}

// 4. DISPATCH
$request = new Core\Request();

// Check Auth BEFORE dispatching
if (AuthMiddleware::requiresAuth($request->getUri())) {
    AuthMiddleware::validateAuth(); // This should exit() if auth fails
}

$router->dispatch($request->getMethod(), $request->getUri());
?>