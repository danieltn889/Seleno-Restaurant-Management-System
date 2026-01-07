<?php
// core/Request.php

namespace Core;

class Request {
    public function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    public function getUri() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Get the script directory (path to the directory containing index.php)
        $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
        
        // Remove the script directory from the URI
        if (strpos($uri, $scriptDir) === 0) {
            $uri = substr($uri, strlen($scriptDir));
        }
        
        // Ensure URI starts with /
        return '/' . trim($uri, '/');
    }
    
    public function getBody() {
        $input = json_decode(file_get_contents('php://input'), true);
        return $input ?? [];
    }
    
    public function getQueryParams() {
        return $_GET;
    }
    
    public function getHeaders() {
        if (function_exists('getallheaders')) {
            return getallheaders();
        }

        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}
