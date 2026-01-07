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
}
