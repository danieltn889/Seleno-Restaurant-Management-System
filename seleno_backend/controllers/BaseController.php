<?php
// controllers/BaseController.php

namespace Controllers;

class BaseController {
    protected function jsonResponse($data, $status = 200) {
        // CORS headers - dynamic based on origin
        $allowed_origins = [
            'http://localhost',
            'https://gakoshop.xyz',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:8082',
            'http://localhost:8083',
            'http://localhost:8084'
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
    
    protected function success($message = '', $data = []) {
        return $this->jsonResponse([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ]);
    }
    
    protected function error($message, $status = 400) {
        return $this->jsonResponse([
            'status' => 'error',
            'message' => $message
        ], $status);
    }
}
