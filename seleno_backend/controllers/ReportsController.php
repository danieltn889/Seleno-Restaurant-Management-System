<?php
namespace Controllers;

use Models\Order;
use Models\Payment;
use Models\Stock;
use Models\StockIn;
use Models\StockOut;
use Models\Menu;
use Models\User;

class ReportsController extends BaseController {

    public function salesReport($params = []) {
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;
        $menuId = $_GET['menu_id'] ?? null;

        // Convert MM/DD/YYYY to YYYY-MM-DD if needed
        if ($startDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $startDate)) {
            $parts = explode('/', $startDate);
            $startDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }
        if ($endDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $endDate)) {
            $parts = explode('/', $endDate);
            $endDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }

        // If no dates provided, show all data
        if (!$startDate && !$endDate) {
            $startDate = '2000-01-01'; // Very early date
            $endDate = date('Y-m-d'); // Today
        } elseif (!$startDate) {
            $startDate = '2000-01-01';
        } elseif (!$endDate) {
            $endDate = date('Y-m-d');
        }

        // Get orders within date range
        $orderModel = new Order();
        $orders = $orderModel->findByDateRange($startDate, $endDate);

        $totalSales = 0;
        $menuSales = [];
        $dailySales = [];

        foreach ($orders as $order) {
            if ($order['order_status'] === 'completed') {
                $orderItems = $orderModel->getOrderItems($order['order_id']);
                foreach ($orderItems as $item) {
                    if (!$menuId || $item['menu_id'] == $menuId) {
                        $totalSales += $item['order_item_price'] * $item['order_qty'];

                        if (!isset($menuSales[$item['menu_id']])) {
                            $menuSales[$item['menu_id']] = [
                                'menu_name' => $item['menu_name'],
                                'quantity' => 0,
                                'revenue' => 0
                            ];
                        }
                        $menuSales[$item['menu_id']]['quantity'] += $item['order_qty'];
                        $menuSales[$item['menu_id']]['revenue'] += $item['order_item_price'] * $item['order_qty'];
                    }
                }

                $orderDate = date('Y-m-d', strtotime($order['created_at']));
                if (!isset($dailySales[$orderDate])) {
                    $dailySales[$orderDate] = 0;
                }
                // Calculate order total from order items
                $orderTotal = 0;
                foreach ($orderItems as $item) {
                    if (!$menuId || $item['menu_id'] == $menuId) {
                        $orderTotal += $item['order_item_price'] * $item['order_qty'];
                    }
                }
                $dailySales[$orderDate] += $orderTotal;
            }
        }

        return $this->success('Sales report generated', [
            'period' => ['start' => $startDate, 'end' => $endDate],
            'total_sales' => $totalSales,
            'menu_sales' => array_values($menuSales),
            'daily_sales' => $dailySales
        ]);
    }

    public function inventoryReport($params = []) {
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;

        // Convert MM/DD/YYYY to YYYY-MM-DD if needed
        if ($startDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $startDate)) {
            $parts = explode('/', $startDate);
            $startDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }
        if ($endDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $endDate)) {
            $parts = explode('/', $endDate);
            $endDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }

        $stockModel = new Stock();
        if ($startDate && $endDate) {
            $stocks = $stockModel->findByDateRange($startDate, $endDate);
        } else {
            $stocks = $stockModel->findAll();
        }

        $lowStock = [];
        $outOfStock = [];
        $totalValue = 0;

        foreach ($stocks as $stock) {
            if ($stock['stock_qty'] <= 0) {
                $outOfStock[] = $stock;
            } elseif ($stock['stock_qty'] < 10) { // Assuming 10 is low threshold
                $lowStock[] = $stock;
            }

            // Calculate value if price available (from stockin)
            $stockInModel = new StockIn();
            $lastStockIn = $stockInModel->findLastByStockId($stock['stock_id']);
            if ($lastStockIn) {
                $totalValue += $stock['stock_qty'] * $lastStockIn['stockin_price_init'];
            }
        }

        return $this->success('Inventory report generated', [
            'period' => $startDate && $endDate ? ['start' => $startDate, 'end' => $endDate] : null,
            'total_items' => count($stocks),
            'low_stock_items' => $lowStock,
            'out_of_stock_items' => $outOfStock,
            'total_inventory_value' => $totalValue,
            'filtered_by_date' => ($startDate && $endDate)
        ]);
    }

    public function stockMovementReport($params = []) {
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;
        $stockId = $_GET['stock_id'] ?? null;

        // Convert MM/DD/YYYY to YYYY-MM-DD if needed
        if ($startDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $startDate)) {
            $parts = explode('/', $startDate);
            $startDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }
        if ($endDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $endDate)) {
            $parts = explode('/', $endDate);
            $endDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }

        // If no dates provided, show all data
        if (!$startDate && !$endDate) {
            $startDate = '2000-01-01'; // Very early date
            $endDate = date('Y-m-d'); // Today
        } elseif (!$startDate) {
            $startDate = '2000-01-01';
        } elseif (!$endDate) {
            $endDate = date('Y-m-d');
        }

        $stockInModel = new StockIn();
        $stockOutModel = new StockOut();

        $stockIns = $stockInModel->findByDateRange($startDate, $endDate, $stockId);
        $stockOuts = $stockOutModel->findByDateRange($startDate, $endDate, $stockId);

        $movements = [];

        foreach ($stockIns as $in) {
            $movements[] = [
                'date' => $in['stockin_created_date'],
                'type' => 'IN',
                'stock_name' => $in['stock_name'],
                'quantity' => $in['stockin_qty'],
                'user' => $in['user_names']
            ];
        }

        foreach ($stockOuts as $out) {
            $movements[] = [
                'date' => $out['stockout_created_date'],
                'type' => 'OUT',
                'stock_name' => $out['stock_name'],
                'quantity' => $out['stockout_qty'],
                'user' => $out['user_names']
            ];
        }

        // Sort by date
        usort($movements, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return $this->success('Stock movement report generated', [
            'period' => ['start' => $startDate, 'end' => $endDate],
            'movements' => $movements
        ]);
    }

    public function orderReport($params = []) {
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;
        $status = $_GET['status'] ?? null;

        // Convert MM/DD/YYYY to YYYY-MM-DD if needed
        if ($startDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $startDate)) {
            $parts = explode('/', $startDate);
            $startDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }
        if ($endDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $endDate)) {
            $parts = explode('/', $endDate);
            $endDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }

        // If no dates provided, show all data
        if (!$startDate && !$endDate) {
            $startDate = '2000-01-01'; // Very early date
            $endDate = date('Y-m-d'); // Today
        } elseif (!$startDate) {
            $startDate = '2000-01-01';
        } elseif (!$endDate) {
            $endDate = date('Y-m-d');
        }

        $orderModel = new Order();
        $orders = $orderModel->findByDateRange($startDate, $endDate, $status);

        $statusCounts = [];
        $totalOrders = count($orders);
        $completedOrders = 0;

        foreach ($orders as $order) {
            $statusCounts[$order['order_status']] = ($statusCounts[$order['order_status']] ?? 0) + 1;
            if ($order['order_status'] === 'completed') {
                $completedOrders++;
            }
        }

        return $this->success('Order report generated', [
            'period' => ['start' => $startDate, 'end' => $endDate],
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
            'status_breakdown' => $statusCounts,
            'orders' => $orders
        ]);
    }

    public function paymentReport($params = []) {
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;

        // Convert MM/DD/YYYY to YYYY-MM-DD if needed
        if ($startDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $startDate)) {
            $parts = explode('/', $startDate);
            $startDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }
        if ($endDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $endDate)) {
            $parts = explode('/', $endDate);
            $endDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }

        // If no dates provided, show all data
        if (!$startDate && !$endDate) {
            $startDate = '2000-01-01'; // Very early date
            $endDate = date('Y-m-d'); // Today
        } elseif (!$startDate) {
            $startDate = '2000-01-01';
        } elseif (!$endDate) {
            $endDate = date('Y-m-d');
        }

        $paymentModel = new Payment();
        $payments = $paymentModel->findByDateRange($startDate, $endDate);

        $methodTotals = [];
        $totalAmount = 0;

        foreach ($payments as $payment) {
            $methodTotals[$payment['payment_method']] = ($methodTotals[$payment['payment_method']] ?? 0) + $payment['amount_paid'];
            $totalAmount += $payment['amount_paid'];
        }

        return $this->success('Payment report generated', [
            'period' => ['start' => $startDate, 'end' => $endDate],
            'total_payments' => $totalAmount,
            'method_breakdown' => $methodTotals,
            'payments' => $payments
        ]);
    }

    public function userActivityReport($params = []) {
        $startDate = $_GET['start_date'] ?? null;
        $endDate = $_GET['end_date'] ?? null;

        // Convert MM/DD/YYYY to YYYY-MM-DD if needed
        if ($startDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $startDate)) {
            $parts = explode('/', $startDate);
            $startDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }
        if ($endDate && preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $endDate)) {
            $parts = explode('/', $endDate);
            $endDate = sprintf('%04d-%02d-%02d', $parts[2], $parts[0], $parts[1]);
        }

        // If no dates provided, show all data
        if (!$startDate && !$endDate) {
            $startDate = '2000-01-01'; // Very early date
            $endDate = date('Y-m-d'); // Today
        } elseif (!$startDate) {
            $startDate = '2000-01-01';
        } elseif (!$endDate) {
            $endDate = date('Y-m-d');
        }

        // Get users within date range if dates provided, else all users
        $userModel = new User();
        if ($startDate && $endDate && $startDate !== '2000-01-01' && $endDate !== date('Y-m-d')) {
            $users = $userModel->findByDateRange($startDate, $endDate);
        } else {
            $users = $userModel->findAll();
        }

        $roleCounts = [];
        $activeUsers = 0;

        foreach ($users as $user) {
            $roleCounts[$user['user_role']] = ($roleCounts[$user['user_role']] ?? 0) + 1;
            if ($user['user_status'] === 'active') {
                $activeUsers++;
            }
        }

        return $this->success('User activity report generated', [
            'period' => ['start' => $startDate, 'end' => $endDate],
            'total_users' => count($users),
            'active_users' => $activeUsers,
            'role_breakdown' => $roleCounts,
            'filtered_by_date' => ($startDate !== '2000-01-01' || $endDate !== date('Y-m-d'))
        ]);
    }
}