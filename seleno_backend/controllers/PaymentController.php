<?php
namespace Controllers;

use Models\Payment;

class PaymentController extends BaseController {
    private $paymentModel;
    
    public function __construct() {
        $this->paymentModel = new Payment();
    }
    
    public function addPayment($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['order_id', 'amount_paid'];
        foreach ($required as $field) {
            if (!isset($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        if (!is_numeric($requestData['amount_paid'])) {
            return $this->error('Amount paid must be a number. Please provide a valid numeric value');
        }
        
        // Check if order_id exists
        $orderModel = new \Models\Order();
        if (!$orderModel->find($requestData['order_id'])) {
            return $this->error('Order not found. Please check the order_id and ensure the order exists');
        }
        
        if (isset($requestData['payment_method']) && !in_array($requestData['payment_method'], ['cash', 'card', 'mobile'])) {
            return $this->error("Invalid payment method. Allowed values are: 'cash', 'card', or 'mobile'");
        }
        
        $model = new Payment();
        $id = $model->create($requestData);
        if ($id) {
            $status = $model->getPaymentStatus($requestData['order_id']);
            return $this->success('Payment added', ['payment_status' => $status['status']]);
        }
        return $this->error('Failed to add payment');
    }
    
    public function checkPaymentStatus($params = []) {
        $orderId = $_GET['order_id'] ?? null;
        if (!$orderId) {
            return $this->error('Order ID is required. Please provide order_id as a query parameter (e.g., ?order_id=1)');
        }
        
        // Check if order exists
        $orderModel = new \Models\Order();
        if (!$orderModel->find($orderId)) {
            return $this->error('Order not found. Please check the order_id and ensure the order exists');
        }
        
        $status = $this->paymentModel->getPaymentStatus($orderId);
        return $this->success('Payment status checked', $status);
    }
}
