<?php
namespace Controllers;

use Models\Order;
use Models\OrderType;
use Models\SpecialOrder;
use Models\OrderItem;

class OrderController extends BaseController {
    private $orderModel;
    
    public function __construct() {
        $this->orderModel = new Order();
    }
    
    public function addOrderType($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($requestData['order_type_name'])) {
            return $this->error('Order type name is required. Please provide a name for the order type');
        }
        
        if (isset($requestData['order_type_status']) && !in_array($requestData['order_type_status'], ['active', 'inactive'])) {
            return $this->error("Invalid status. Allowed values are: 'active' or 'inactive'");
        }
        
        $model = new OrderType();
        $id = $model->create($requestData);
        return $id ? $this->success('Order type added') : $this->error('Failed to add order type');
    }
    
    public function listOrderTypes($params = []) {
        $model = new OrderType();
        $data = $model->findAll();
        return $this->success('Order types listed', $data);
    }
    
    public function updateOrderType($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new OrderType();
        $success = $model->update($requestData['order_type_id'], $requestData);
        return $success ? $this->success('Order type updated') : $this->error('Failed to update order type');
    }
    
    public function deleteOrderType($params = []) {
        $id = $_GET['id'];
        $model = new OrderType();
        $success = $model->delete($id);
        return $success ? $this->success('Order type deleted') : $this->error('Failed to delete order type');
    }
    
    public function addSpecialOrder($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new SpecialOrder();
        $id = $model->create($requestData);
        return $id ? $this->success('Special order added') : $this->error('Failed to add special order');
    }
    
    public function listSpecialOrders($params = []) {
        $model = new SpecialOrder();
        $data = $model->findAll();
        return $this->success('Special orders listed', $data);
    }
    
    public function updateSpecialOrder($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new SpecialOrder();
        $success = $model->update($requestData['special_order_id'], $requestData);
        return $success ? $this->success('Special order updated') : $this->error('Failed to update special order');
    }
    
    public function deleteSpecialOrder($params = []) {
        $id = $_GET['id'];
        $model = new SpecialOrder();
        $success = $model->delete($id);
        return $success ? $this->success('Special order deleted') : $this->error('Failed to delete special order');
    }
    
    public function createOrder($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['order_type_id', 'userid', 'table_id'];
        foreach ($required as $field) {
            if (!isset($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        // Check if order_type_id exists
        $typeModel = new OrderType();
        if (!$typeModel->find($requestData['order_type_id'])) {
            return $this->error('Order type not found. Please check the order_type_id and ensure it exists');
        }
        
        // Check if userid exists
        $userModel = new \Models\User();
        if (!$userModel->find($requestData['userid'])) {
            return $this->error('User not found. Please check the userid and ensure the user exists');
        }
        
        // Check if table_id exists
        $tableModel = new \Models\Table();
        if (!$tableModel->find($requestData['table_id'])) {
            return $this->error('Table not found. Please check the table_id and ensure the table exists');
        }
        
        $model = new Order();
        $id = $model->create($requestData);
        if ($id) {
            $order = $model->find($id);
            return $this->success('Order created', ['order_id' => $id, 'order_code' => $order['order_code']]);
        }
        return $this->error('Failed to create order');
    }
    
    public function listOrders($params = []) {
        $model = new Order();
        $data = $model->findAll();
        return $this->success('Orders listed', $data);
    }
    
    public function updateOrder($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new Order();
        $success = $model->update($requestData['order_id'], $requestData);
        return $success ? $this->success('Order updated') : $this->error('Failed to update order');
    }
    
    public function deleteOrder($params = []) {
        $id = $_GET['order_id'];
        $model = new Order();
        $success = $model->delete($id);
        return $success ? $this->success('Order deleted') : $this->error('Failed to delete order');
    }
    
    public function addOrderItem($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['order_id', 'menu_id', 'order_qty', 'order_item_price'];
        foreach ($required as $field) {
            if (!isset($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        if (!is_numeric($requestData['order_qty']) || !is_numeric($requestData['order_item_price'])) {
            return $this->error('Quantity and price must be numbers. Please provide valid numeric values');
        }
        
        // Check if order_id exists
        $orderModel = new Order();
        if (!$orderModel->find($requestData['order_id'])) {
            return $this->error('Order not found. Please check the order_id and ensure the order exists');
        }
        
        // Check if menu_id exists
        $menuModel = new \Models\Menu();
        if (!$menuModel->find($requestData['menu_id'])) {
            return $this->error('Menu not found. Please check the menu_id and ensure the menu item exists');
        }
        
        $model = new OrderItem();
        $id = $model->create($requestData);
        return $id ? $this->success('Order item added') : $this->error('Failed to add order item');
    }
}
