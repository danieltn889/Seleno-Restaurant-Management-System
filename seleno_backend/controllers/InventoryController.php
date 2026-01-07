<?php
namespace Controllers;

use Models\Stock;
use Models\StockCategory;
use Models\StockItemCategoryGroup;
use Models\StockItemCategory;
use Models\StockIn;
use Models\StockOut;

class InventoryController extends BaseController
{
    private $stockModel;

    public function __construct()
    {
        $this->stockModel = new Stock();
    }

    public function listStockCategories($params = [])
    {
        $model = new StockCategory();
        $data = $model->findAll();
        return $this->success('Stock categories listed', $data);
    }

    public function listStockGroups($params = [])
    {
        $model = new StockItemCategoryGroup();
        $data = $model->findAll();
        return $this->success('Stock groups listed', $data);
    }

    public function listStockItemCategories($params = [])
    {
        $model = new StockItemCategory();
        $data = $model->findAll();
        return $this->success('Stock item categories listed', $data);
    }

    public function listStocks($params = [])
    {
        $model = new Stock();
        $data = $model->findAll();
        return $this->success('Stocks listed', $data);
    }

    public function updateStockCategory($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        if (empty($requestData['stockcat_id'])) {
            return $this->error('Stock category ID is required. Please provide the stockcat_id of the category you want to update');
        }

        $model = new StockCategory();
        $existing = $model->find($requestData['stockcat_id']);
        if (!$existing) {
            return $this->error('Stock category not found. Please check the stockcat_id and ensure the category exists');
        }

        if (isset($requestData['stockcat_status']) && !in_array($requestData['stockcat_status'], ['active', 'inactive'])) {
            return $this->error("Invalid status. Allowed values are: 'active' or 'inactive'");
        }

        $success = $model->update($requestData['stockcat_id'], $requestData);
        return $success ? $this->success('Stock category updated') : $this->error('Failed to update stock category');
    }

    public function deleteStockCategory($params = [])
    {
        $id = $_GET['stockcat_id'] ?? null;
        if (!$id) {
            return $this->error('Stock category ID is required. Please provide stockcat_id as a query parameter (e.g., ?stockcat_id=1)');
        }

        $model = new StockCategory();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->error('Stock category not found. Please check the stockcat_id and ensure the category exists');
        }

        $success = $model->delete($id);
        return $success ? $this->success('Stock category deleted') : $this->error('Failed to delete stock category');
    }

    public function addStockGroup($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        if (empty($requestData['group_name'])) {
            return $this->error('Group name is required. Please provide a name for the group');
        }

        if (isset($requestData['status']) && !in_array($requestData['status'], ['active', 'inactive'])) {
            return $this->error("Invalid status. Allowed values are: 'active' or 'inactive'");
        }

        // Map fields to match schema
        $data = [
            'stock_item_cat_group_name' => $requestData['group_name'],
            'stock_item_cat_group_desc' => $requestData['group_desc'] ?? null,
            'stock_item_cat_group_status' => $requestData['status'] ?? 'active'
        ];

        $model = new StockItemCategoryGroup();
        $id = $model->create($data);
        return $id ? $this->success('Stock group added') : $this->error('Failed to add stock group');
    }


    public function updateStockGroup($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        if (empty($requestData['group_id'])) {
            return $this->error('Group ID is required. Please provide the group_id of the group you want to update');
        }

        $model = new StockItemCategoryGroup();
        $existing = $model->find($requestData['group_id']);
        if (!$existing) {
            return $this->error('Stock group not found. Please check the group_id and ensure the group exists');
        }

        if (isset($requestData['status']) && !in_array($requestData['status'], ['active', 'inactive'])) {
            return $this->error("Invalid status. Allowed values are: 'active' or 'inactive'");
        }

        // Map fields
        $data = [];
        if (isset($requestData['group_name']))
            $data['stock_item_cat_group_name'] = $requestData['group_name'];
        if (isset($requestData['group_desc']))
            $data['stock_item_cat_group_desc'] = $requestData['group_desc'];
        if (isset($requestData['status']))
            $data['stock_item_cat_group_status'] = $requestData['status'];

        $success = $model->update($requestData['group_id'], $data);
        return $success ? $this->success('Stock group updated') : $this->error('Failed to update stock group');
    }

    public function deleteStockGroup($params = [])
    {
        $id = $_GET['group_id'];
        $model = new StockItemCategoryGroup();
        $success = $model->delete($id);
        return $success ? $this->success('Stock group deleted') : $this->error('Failed to delete stock group');
    }

    public function addStockItemCategory($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        $required = ['stockcat_id', 'group_id', 'name'];
        foreach ($required as $field) {
            if (empty($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }

        // Check if stockcat_id exists
        $catModel = new StockCategory();
        if (!$catModel->find($requestData['stockcat_id'])) {
            return $this->error('Stock category not found. Please check the stockcat_id and ensure it exists');
        }

        // Check if group_id exists
        $groupModel = new StockItemCategoryGroup();
        if (!$groupModel->find($requestData['group_id'])) {
            return $this->error('Stock group not found. Please check the group_id and ensure it exists');
        }

        if (isset($requestData['status']) && !in_array($requestData['status'], ['active', 'inactive'])) {
            return $this->error("Invalid status. Allowed values are: 'active' or 'inactive'");
        }

        // Map fields
        $data = [
            'stockcat_id' => $requestData['stockcat_id'],
            'stock_item_cat_group_id' => $requestData['group_id'],
            'stock_item_cat_name' => $requestData['name'],
            'stock_item_cat_desc' => $requestData['desc'] ?? null,
            'stock_item_cat_status' => $requestData['status'] ?? 'active'
        ];

        $model = new StockItemCategory();
        $id = $model->create($data);
        return $id ? $this->success('Stock item category added') : $this->error('Failed to add stock item category');
    }

    public function updateStockItemCategory($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        if (empty($requestData['stock_item_cat_id'])) {
            return $this->error('Stock item category ID is required. Please provide the stock_item_cat_id of the category you want to update');
        }

        $model = new StockItemCategory();
        $existing = $model->find($requestData['stock_item_cat_id']);
        if (!$existing) {
            return $this->error('Stock item category not found. Please check the stock_item_cat_id and ensure the category exists');
        }

        if (isset($requestData['status']) && !in_array($requestData['status'], ['active', 'inactive'])) {
            return $this->error("Invalid status. Allowed values are: 'active' or 'inactive'");
        }

        // Map fields
        $data = [];
        if (isset($requestData['name']))
            $data['stock_item_cat_name'] = $requestData['name'];
        if (isset($requestData['desc']))
            $data['stock_item_cat_desc'] = $requestData['desc'];
        if (isset($requestData['status']))
            $data['stock_item_cat_status'] = $requestData['status'];

        $success = $model->update($requestData['stock_item_cat_id'], $data);
        return $success ? $this->success('Stock item category updated') : $this->error('Failed to update stock item category');
    }

    public function deleteStockItemCategory($params = [])
    {
        $id = $_GET['id'];
        $model = new StockItemCategory();
        $success = $model->delete($id);
        return $success ? $this->success('Stock item category deleted') : $this->error('Failed to delete stock item category');
    }

    public function addStock($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        $required = ['stock_item_cat_id', 'stock_name'];
        foreach ($required as $field) {
            if (empty($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }

        if (!is_numeric($requestData['stock_qty'] ?? null)) {
            return $this->error('Stock quantity must be a number. Please provide a valid numeric value');
        }

        // Check if stock_item_cat_id exists
        $catModel = new StockItemCategory();
        if (!$catModel->find($requestData['stock_item_cat_id'])) {
            return $this->error('Stock item category not found. Please check the stock_item_cat_id and ensure it exists');
        }

        if (isset($requestData['stock_status']) && !in_array($requestData['stock_status'], ['available', 'unavailable'])) {
            return $this->error("Invalid status. Allowed values are: 'available' or 'unavailable'");
        }

        $model = new Stock();
        $id = $model->create($requestData);
        return $id ? $this->success('Stock added') : $this->error('Failed to add stock');
    }

    public function updateStock($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new Stock();
        $success = $model->update($requestData['stock_id'], $requestData);
        return $success ? $this->success('Stock updated') : $this->error('Failed to update stock');
    }

    public function deleteStock($params = [])
    {
        $id = $_GET['stock_id'];
        $model = new Stock();
        $success = $model->delete($id);
        return $success ? $this->success('Stock deleted') : $this->error('Failed to delete stock');
    }

    public function addStockIn($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        $required = ['stock_id', 'stockin_qty', 'userid'];
        foreach ($required as $field) {
            if (!isset($requestData[$field]) || $requestData[$field] === '') {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }

        if (!is_numeric($requestData['stockin_qty'])) {
            return $this->error('Stock in quantity must be a number. Please provide a valid numeric value');
        }

        // Check if stock_id exists
        $stockModel = new Stock();
        if (!$stockModel->find($requestData['stock_id'])) {
            return $this->error('Stock not found. Please check the stock_id and ensure the stock item exists');
        }

        // Check if userid exists
        $userModel = new \Models\User();
        if (!$userModel->find($requestData['userid'])) {
            return $this->error('User not found. Please check the userid and ensure the user exists');
        }

        $model = new StockIn();
        $id = $model->create($requestData);
        if ($id) {
            $stock = $stockModel->find($requestData['stock_id']);
            return $this->success('Stock added successfully', ['current_qty' => $stock['stock_qty']]);
        }
        return $this->error('Failed to add stock in. Please check if the operation would result in valid stock levels');
    }

    public function addStockOut($params = [])
    {
        $requestData = json_decode(file_get_contents('php://input'), true);

        $required = ['stock_id', 'stockout_qty', 'userid'];
        foreach ($required as $field) {
            if (!isset($requestData[$field]) || $requestData[$field] === '') {
                return $this->error("$field is required");
            }
        }

        if (!is_numeric($requestData['stockout_qty'])) {
            return $this->error('Stock out quantity must be numeric');
        }

        // Check if stock_id exists
        $stockModel = new Stock();
        if (!$stockModel->find($requestData['stock_id'])) {
            return $this->error('Stock not found');
        }

        // Check if userid exists
        $userModel = new \Models\User();
        if (!$userModel->find($requestData['userid'])) {
            return $this->error('User not found');
        }

        $model = new StockOut();
        $id = $model->create($requestData);
        if ($id) {
            $updatedStock = $stockModel->find($requestData['stock_id']);
            return $this->success('Stock deducted successfully', ['current_qty' => $updatedStock['stock_qty']]);
        }
        return $this->error('Failed to add stock out. Please check if there is sufficient stock quantity');
    }
}

