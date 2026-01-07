<?php
// core/Router.php

namespace Core;

class Router {
    private $routes = [];
    private $params = [];
    
    public function addRoute($method, $path, $controller, $action) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }
    
    public function dispatch($requestMethod, $requestUri) {
        foreach ($this->routes as $route) {
            // Convert route path to regex pattern
            $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $route['path']);
            $pattern = "#^" . $pattern . "$#";
            
            if ($route['method'] === $requestMethod && preg_match($pattern, $requestUri, $matches)) {
                $this->params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                $controllerClass = "Controllers\\" . $route['controller'];
                $action = $route['action'];
                
                if (class_exists($controllerClass)) {
                    $controller = new $controllerClass();
                    if (method_exists($controller, $action)) {
                        return $controller->$action($this->params);
                    }
                }
            }
        }
        
        // No route found
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);
    }
}
