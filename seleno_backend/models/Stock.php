<?php
// models/Stock.php

namespace Models;

use PDO;

class Stock extends BaseModel {
    protected $table = 'stock';
    protected $primaryKey = 'stock_id';

    public function findByDateRange($startDate, $endDate) {
        $query = "SELECT * FROM {$this->table} WHERE DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$startDate, $endDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

