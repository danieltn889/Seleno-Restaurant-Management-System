<?php
// models/StockIn.php

namespace Models;

use Models\Stock;
use PDO;
use Exception;

class StockIn extends BaseModel {
    protected $table = 'stock_in';
    protected $primaryKey = 'stockin_id';

    public function create($data) {
        $stockId = $data['stock_id'];
        $qty = $data['stockin_qty'];

        // Start transaction
        $this->db->beginTransaction();

        try {
            // Get current qty
            $stockModel = new Stock();
            $stock = $stockModel->find($stockId);
            $currentQty = $stock['stock_qty'] ?? 0;
            $newQty = $currentQty + $qty;

            // Update stock qty
            $stockModel->update($stockId, ['stock_qty' => $newQty]);

            // Add to data
            $data['stock_current_qty'] = $newQty;

            // Insert stockin record
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
        $query = "SELECT si.*, s.stock_name, CONCAT(u.firstname, ' ', u.lastname) as user_names
                  FROM {$this->table} si
                  JOIN stock s ON si.stock_id = s.stock_id
                  LEFT JOIN users u ON si.userid = u.userid
                  WHERE DATE(si.stockin_created_date) BETWEEN ? AND ?";
        
        $params = [$startDate, $endDate];
        
        if ($stockId) {
            $query .= " AND si.stock_id = ?";
            $params[] = $stockId;
        }
        
        $query .= " ORDER BY si.stockin_created_date DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findLastByStockId($stockId) {
        $query = "SELECT * FROM {$this->table} WHERE stock_id = ? ORDER BY stockin_created_date DESC LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$stockId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
