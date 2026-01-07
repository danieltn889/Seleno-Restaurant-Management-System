<?php
// models/StockOut.php

namespace Models;

use Models\Stock;
use PDO;
use Exception;

class StockOut extends BaseModel {
    protected $table = 'stock_out';
    protected $primaryKey = 'stockout_id';

    public function create($data) {
        $stockId = $data['stock_id'];
        $qty = $data['stockout_qty'];

        // Start transaction
        $this->db->beginTransaction();

        try {
            // Get current qty
            $stockModel = new Stock();
            $stock = $stockModel->find($stockId);
            $currentQty = $stock['stock_qty'] ?? 0;
            $newQty = $currentQty - $qty;

            if ($newQty < 0) {
                throw new Exception('Insufficient stock quantity');
            }

            // Update stock qty
            $stockModel->update($stockId, ['stock_qty' => $newQty]);

            // Add to data
            $data['stockout_current_qty'] = $newQty;

            // Insert stockout record
            $result = parent::create($data);

            // Commit transaction
            $this->db->commit();

            return $result;
        } catch (Exception $e) {
            // Rollback on error
            $this->db->rollBack();
            return false;
        }
    }

    public function findByDateRange($startDate, $endDate, $stockId = null) {
        $query = "SELECT so.*, s.stock_name, CONCAT(u.firstname, ' ', u.lastname) as user_names
                  FROM {$this->table} so
                  JOIN stock s ON so.stock_id = s.stock_id
                  LEFT JOIN users u ON so.userid = u.userid
                  WHERE DATE(so.stockout_created_date) BETWEEN ? AND ?";
        
        $params = [$startDate, $endDate];
        
        if ($stockId) {
            $query .= " AND so.stock_id = ?";
            $params[] = $stockId;
        }
        
        $query .= " ORDER BY so.stockout_created_date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
