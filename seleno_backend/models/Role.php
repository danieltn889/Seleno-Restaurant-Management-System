<?php
// models/Role.php

namespace Models;

use PDO;

class Role extends BaseModel {
    protected $table = 'roles';
    protected $primaryKey = 'role_id';
    
    public function findByName($name) {
        $query = "SELECT * FROM {$this->table} WHERE role_name = :name";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
