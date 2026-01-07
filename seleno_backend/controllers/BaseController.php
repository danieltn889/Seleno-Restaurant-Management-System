<?php
// controllers/BaseController.php

namespace Controllers;

class BaseController {
    protected function jsonResponse($data, $status = 200) {
        // CORS headers
        header('Access-Control-Allow-Origin: http://localhost:8080');
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
