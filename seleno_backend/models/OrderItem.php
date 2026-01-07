<?php
// models/OrderItem.php

namespace Models;

use PDO;

class OrderItem extends BaseModel {
    protected $table = 'order_items';
    protected $primaryKey = 'order_item_id';

    public function findByOrderId($orderId) {
        $query = "SELECT * FROM {$this->table} WHERE order_id = :order_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
