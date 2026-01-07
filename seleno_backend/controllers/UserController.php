<?php
namespace Controllers;

use Models\User;

class UserController extends BaseController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    // POST /users/add.php
    public function addUser($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        // Required fields validation
        $requiredFields = ['firstname', 'lastname', 'email', 'user_role', 'user_status', 'user_phone', 'password'];
        foreach ($requiredFields as $field) {
            if (empty($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        // Validate email format
        if (!filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->error('Invalid email format. Please provide a valid email address (e.g., user@example.com)');
        }
        
        // Check if email already exists
        $existingUser = $this->userModel->findByEmail($requestData['email']);
        if ($existingUser) {
            return $this->error('This email address is already registered. Please use a different email or login if you already have an account');
        }
        
        // Validate user_status
        if (!in_array($requestData['user_status'], ['active', 'inactive'])) {
            return $this->error("Invalid user status. Allowed values are: 'active' or 'inactive'");
        }
        
        // Validate user_role exists
        $roleModel = new \Models\Role();
        $role = $roleModel->findByName($requestData['user_role']);
        if (!$role) {
            return $this->error("Invalid user role. Please choose from existing roles: Admin, Manager, Waiter, or Cashier");
        }
        
        // Hash password
        $requestData['user_password'] = password_hash($requestData['password'], PASSWORD_DEFAULT);
        unset($requestData['password']);
        
        // Create user
        $userId = $this->userModel->create($requestData);
        
        if ($userId) {
            return $this->success('User registered successfully', ['user_id' => $userId]);
        }
        
        return $this->error('Failed to create user');
    }
    
    // GET /users/list.php
    public function listUsers($params = []) {
        $users = $this->userModel->findAll();
        return $this->success('Users retrieved successfully', $users);
    }
    
    // PUT /users/update.php
    public function updateUser($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($requestData['userid'])) {
            return $this->error('User ID is required. Please provide the userid of the user you want to update');
        }
        
        // Check if user exists
        $user = $this->userModel->find($requestData['userid']);
        if (!$user) {
            return $this->error('User not found. Please check the userid and ensure the user exists');
        }
        
        // Validate email if provided
        if (!empty($requestData['email'])) {
            if (!filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->error('Invalid email format. Please provide a valid email address (e.g., user@example.com)');
            }
            // Check uniqueness if email changed
            if ($requestData['email'] !== $user['email']) {
                $existing = $this->userModel->findByEmail($requestData['email']);
                if ($existing) {
                    return $this->error('This email address is already registered. Please use a different email');
                }
            }
        }
        
        // Validate user_status if provided
        if (isset($requestData['user_status']) && !in_array($requestData['user_status'], ['active', 'inactive'])) {
            return $this->error("Invalid user status. Allowed values are: 'active' or 'inactive'");
        }
        
        // Validate user_role if provided
        if (!empty($requestData['user_role'])) {
            $roleModel = new \Models\Role();
            $role = $roleModel->findByName($requestData['user_role']);
            if (!$role) {
                return $this->error("Invalid user role. Please choose from existing roles: Admin, Manager, Waiter, or Cashier");
            }
        }
        
        // Hash password if provided
        if (!empty($requestData['password'])) {
            $requestData['user_password'] = password_hash($requestData['password'], PASSWORD_DEFAULT);
            unset($requestData['password']);
        }
        
        $success = $this->userModel->update($requestData['userid'], $requestData);
        
        if ($success) {
            return $this->success('User updated successfully');
        }
        
        return $this->error('Failed to update user');
    }
    
    // DELETE /users/delete.php
    public function deleteUser($params = []) {
        $userId = $_GET['userid'] ?? null;
        
        if (!$userId) {
            return $this->error('User ID is required. Please provide userid as a query parameter (e.g., ?userid=1)');
        }
        
        // Check if user exists
        $user = $this->userModel->find($userId);
        if (!$user) {
            return $this->error('User not found. Please check the userid and ensure the user exists');
        }
        
        $success = $this->userModel->delete($userId);
        
        if ($success) {
            return $this->success('User deleted successfully');
        }
        
        return $this->error('Failed to delete user');
    }
}
