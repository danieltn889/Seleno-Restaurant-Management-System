<?php
namespace Controllers;

use Models\User;

class AuthController extends BaseController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    public function login($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);

        if (empty($requestData['email']) || empty($requestData['password'])) {
            return $this->error('Email and password are both required. Please provide both fields to login');
        }

        // Validate email format
        if (!filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->error('Invalid email format. Please provide a valid email address (e.g., user@example.com)');
        }

        $user = $this->userModel->authenticate($requestData['email'], $requestData['password']);

        if ($user) {
            // Generate a simple token (you can replace this with JWT or more secure token generation)
            $token = $this->generateToken($user);

            // Set session token for single session login
            $this->userModel->setSessionToken($user['userid'], $token);

            return $this->success('Login successful', [
                'userid' => $user['userid'],
                'role' => $user['user_role'],
                'names' => $user['firstname'] . ' ' . $user['lastname'],
                'token' => $token,
                'token_type' => 'Bearer'
            ]);
        }

        return $this->error('Invalid credentials', 401);
    }

    /**
     * Generate authentication token
     * Note: This is a basic implementation. Consider using JWT for production
     */
    private function generateToken($user) {
        // Create a simple token with user info and timestamp
        $payload = [
            'userid' => $user['userid'],
            'email' => $user['email'],
            'role' => $user['user_role'],
            'timestamp' => time(),
            'expires' => time() + (24 * 60 * 60) // 24 hours
        ];

        // Encode payload (you can use JWT here for better security)
        $token = base64_encode(json_encode($payload));

        return $token;
    }

    public function validateToken($params = []) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $this->error('Authorization header missing or invalid', 401);
        }
        
        $token = $matches[1];
        
        // Decode and validate token
        $payload = json_decode(base64_decode($token), true);
        
        if (!$payload || !isset($payload['userid'])) {
            return $this->error('Invalid token', 401);
        }
        
        // Check if token is expired
        if (isset($payload['expires']) && time() > $payload['expires']) {
            return $this->error('Token expired', 401);
        }
        
        // Check if this is the active session token for the user
        if (!$this->userModel->validateSessionToken($payload['userid'], $token)) {
            return $this->error('Session expired. Please login again.', 401);
        }
        
        return $this->success('Token valid', [
            'userid' => $payload['userid'],
            'role' => $payload['role'],
            'email' => $payload['email']
        ]);
    }

    public function logout($params = []) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            $payload = json_decode(base64_decode($token), true);
            
            if ($payload && isset($payload['userid'])) {
                $this->userModel->clearSessionToken($payload['userid']);
            }
        }
        
        return $this->success('Logged out successfully');
    }
}
