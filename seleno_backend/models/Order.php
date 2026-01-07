<?php
// models/Order.php

namespace Models;

use PDO;

class Order extends BaseModel {
    protected $table = 'orders';
    protected $primaryKey = 'order_id';

    public function create($data) {
        // Generate order_code
        $year = date('Y');
        $count = $this->getNextOrderNumber();
        $data['order_code'] = 'ORD-' . $year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        return parent::create($data);
    }

    private function getNextOrderNumber() {
        $query = "SELECT COUNT(*) as count FROM {$this->table} WHERE YEAR(created_at) = YEAR(CURDATE())";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($result['count'] ?? 0) + 1;
    }

    public function findByDateRange($startDate, $endDate, $status = null) {
        $query = "SELECT o.*, ot.order_type_name, t.table_desc, CONCAT(u.firstname, ' ', u.lastname) as user_names, tg.table_group_name
                  FROM {$this->table} o
                  LEFT JOIN order_type ot ON o.order_type_id = ot.order_type_id
                  LEFT JOIN tables_available t ON o.table_id = t.table_id
                  LEFT JOIN users u ON o.userid = u.userid
                  LEFT JOIN tables_group tg ON t.table_group_id = tg.table_group_id
                  WHERE DATE(o.created_at) BETWEEN ? AND ?";
        
        $params = [$startDate, $endDate];
        
        if ($status) {
            $query .= " AND o.order_status = ?";
            $params[] = $status;
        }
        
        $query .= " ORDER BY o.created_at DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderItems($orderId) {
        $query = "SELECT oi.*, m.menu_name, m.menu_price
                  FROM order_items oi
                  JOIN menu m ON oi.menu_id = m.menu_id
                  WHERE oi.order_id = ?
                  ORDER BY oi.order_item_created_date";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([$orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

