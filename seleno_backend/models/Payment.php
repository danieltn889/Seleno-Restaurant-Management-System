<?php
// models/Payment.php

namespace Models;

use PDO;

class Payment extends BaseModel {
    protected $table = 'payments';
    protected $primaryKey = 'payment_id';

    public function getPaymentStatus($orderId) {
        $query = "SELECT SUM(amount_paid) as paid FROM {$this->table} WHERE order_id = :order_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        $paid = $stmt->fetch(PDO::FETCH_ASSOC)['paid'] ?? 0;

        // Get order total
        $orderModel = new Order();
        $order = $orderModel->find($orderId);
        $orderItems = (new OrderItem())->findByOrderId($orderId);
        $total = 0;
        foreach ($orderItems as $item) {
            $total += $item['order_item_price'] * $item['order_qty'];
        }

        $balance = $total - $paid;
        $status = $balance <= 0 ? 'paid' : ($paid > 0 ? 'partial' : 'unpaid');

        return [
            'total' => $total,
            'paid' => $paid,
            'balance' => $balance,
            'status' => $status
        ];
    }

    public function findByDateRange($startDate, $endDate) {
        $query = "SELECT p.*, o.order_code, CONCAT(u.firstname, ' ', u.lastname) as user_names
                  FROM {$this->table} p
                  LEFT JOIN orders o ON p.order_id = o.order_id
                  LEFT JOIN users u ON o.userid = u.userid
                  WHERE DATE(p.payment_created_date) BETWEEN ? AND ?
                  ORDER BY p.payment_created_date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([$startDate, $endDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

