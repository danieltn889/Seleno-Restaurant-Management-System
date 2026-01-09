<?php
// models/User.php

namespace Models;

use PDO;

class User extends BaseModel {
    protected $table = 'users';
    protected $primaryKey = 'userid';
    
    // Custom methods
    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function authenticate($email, $password) {
        $user = $this->findByEmail($email);
        
        if ($user && password_verify($password, $user['user_password'])) {
            return $user;
        }
        
        return false;
    }

    public function setSessionToken($userid, $token) {
        $query = "UPDATE {$this->table} SET session_token = :token WHERE userid = :userid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':userid', $userid);
        return $stmt->execute();
    }

    public function validateSessionToken($userid, $token) {
        $query = "SELECT session_token FROM {$this->table} WHERE userid = :userid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':userid', $userid);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result && $result['session_token'] === $token;
    }

    public function clearSessionToken($userid) {
        $query = "UPDATE {$this->table} SET session_token = NULL WHERE userid = :userid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':userid', $userid);
        return $stmt->execute();
    }

    public function findByDateRange($startDate, $endDate) {
        $query = "SELECT * FROM {$this->table} WHERE DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$startDate, $endDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
