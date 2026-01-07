<?php
// middleware/AuthMiddleware.php

class AuthMiddleware
{
    private static $excludedRoutes = [
        '/login.php',  // Allow login without authentication
        '/login',      // Allow login without .php extension
    ];

    private static $currentUser = null;

    /**
     * Check if authentication is required for the current route
     */
    public static function requiresAuth($uri)
    {
        // Remove query parameters for route matching
        $path = parse_url($uri, PHP_URL_PATH);

        // Check if route is in excluded list
        foreach (self::$excludedRoutes as $excluded) {
            if ($path === $excluded) {
                return false;
            }
        }

        // All other routes require authentication
        return true;
    }

    /**
     * Validate authentication token/session
     * This validates the Bearer token from login
     */
    public static function validateAuth()
    {
        // Check for Authorization header (Bearer token)
        $headers = self::getAllHeaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

        if (empty($authHeader)) {
            self::unauthorized('No authorization token provided. Please login first and include "Authorization: Bearer <token>" header');
        }

        // Check if it's a Bearer token
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            self::unauthorized('Invalid authorization format. Use: Authorization: Bearer <token>');
        }

        $token = trim($matches[1]);

        if (empty($token)) {
            self::unauthorized('Empty token provided');
        }

        // Decode and validate token
        try {
            $payload = json_decode(base64_decode($token), true);

            if (!$payload) {
                self::unauthorized('Invalid token format');
            }

            // Check if token has expired
            if (isset($payload['expires']) && $payload['expires'] < time()) {
                self::unauthorized('Token has expired. Please login again');
            }

            // Check required fields
            if (!isset($payload['userid']) || !isset($payload['email']) || !isset($payload['role'])) {
                self::unauthorized('Invalid token structure');
            }

            // Store current user info for use in controllers
            self::$currentUser = $payload;

            return true;

        } catch (Exception $e) {
            self::unauthorized('Token validation failed');
        }
    }

    /**
     * Send unauthorized response
     */
    private static function unauthorized($message = 'Authentication required')
    {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'code' => 'AUTH_REQUIRED'
        ]);
        exit;
    }

    /**
     * Send forbidden response
     */
    public static function forbidden($message = 'Access denied')
    {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'code' => 'ACCESS_DENIED'
        ]);
        exit;
    }

    /**
     * Get all headers (compatible with all PHP versions)
     */
    private static function getAllHeaders()
    {
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
?>