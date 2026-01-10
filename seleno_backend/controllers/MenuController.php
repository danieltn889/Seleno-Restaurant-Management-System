<?php
namespace Controllers;

use Models\Menu;
use Models\MenuCategory;
use Models\MenuCategoryGroup;
use Models\MenuItem;
use PDO;

class MenuController extends BaseController {
    private $menuModel;
    
    public function __construct() {
        $this->menuModel = new Menu();
    }
    
    public function addMenuCategoryGroup($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($requestData['menu_cat_group_name'])) {
            return $this->error('Menu category group name is required');
        }
        
        $model = new MenuCategoryGroup();
        $id = $model->create($requestData);
        return $id ? $this->success('Menu category group added') : $this->error('Failed to add menu category group');
    }
    
    public function listMenuCategoryGroups($params = []) {
        $model = new MenuCategoryGroup();
        $data = $model->findAll();
        return $this->success('Menu category groups listed', $data);
    }
    
    public function updateMenuCategoryGroup($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new MenuCategoryGroup();
        $success = $model->update($requestData['menu_cat_group_id'], $requestData);
        return $success ? $this->success('Menu category group updated') : $this->error('Failed to update menu category group');
    }
    
    public function deleteMenuCategoryGroup($params = []) {
        $id = $_GET['id'];
        $model = new MenuCategoryGroup();
        $success = $model->delete($id);
        return $success ? $this->success('Menu category group deleted') : $this->error('Failed to delete menu category group');
    }
    
    public function addMenuCategory($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['menu_cat_group_id', 'menu_cat_name'];
        foreach ($required as $field) {
            if (empty($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        // Check if group_id exists
        $groupModel = new MenuCategoryGroup();
        if (!$groupModel->find($requestData['menu_cat_group_id'])) {
            return $this->error('Menu category group not found. Please check the menu_cat_group_id and ensure it exists');
        }
        
        // Map fields
        $data = [
            'menu_cat_group_id' => $requestData['menu_cat_group_id'],
            'menu_cat_name' => $requestData['menu_cat_name'],
            'menu_cat_desc' => $requestData['menu_cat_desc'] ?? null
        ];
        
        $model = new MenuCategory();
        $id = $model->create($data);
        return $id ? $this->success('Menu category added') : $this->error('Failed to add menu category');
    }
    
    public function listMenuCategories($params = []) {
        $model = new MenuCategory();
        $data = $model->findAll();
        return $this->success('Menu categories listed', $data);
    }
    
    public function updateMenuCategory($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new MenuCategory();
        $success = $model->update($requestData['menu_cat_id'], $requestData);
        return $success ? $this->success('Menu category updated') : $this->error('Failed to update menu category');
    }
    
    public function deleteMenuCategory($params = []) {
        $id = $_GET['id'];
        $model = new MenuCategory();
        $success = $model->delete($id);
        return $success ? $this->success('Menu category deleted') : $this->error('Failed to delete menu category');
    }
    
    public function addMenu($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['menu_cat_id', 'menu_name', 'menu_price'];
        foreach ($required as $field) {
            if (!isset($requestData[$field]) || $requestData[$field] === '') {
                return $this->error("$field is required");
            }
        }
        
        if (!is_numeric($requestData['menu_price'])) {
            return $this->error('Menu price must be numeric');
        }
        
        // Check if menu_cat_id exists
        $catModel = new MenuCategory();
        if (!$catModel->find($requestData['menu_cat_id'])) {
            return $this->error('Menu category not found');
        }
        
        if (isset($requestData['menu_status']) && !in_array($requestData['menu_status'], ['available', 'unavailable'])) {
            return $this->error('Invalid status');
        }
        
        $model = new Menu();
        $id = $model->create($requestData);
        return $id ? $this->success('Menu added') : $this->error('Failed to add menu');
    }
    
    public function listMenus($params = []) {
        $model = new Menu();
        $data = $model->findAll();
        return $this->success('Menus listed', $data);
    }
    
    public function updateMenu($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new Menu();
        $success = $model->update($requestData['menu_id'], $requestData);
        return $success ? $this->success('Menu updated') : $this->error('Failed to update menu');
    }
    
    public function deleteMenu($params = []) {
        $id = $_GET['id'];
        $model = new Menu();
        $success = $model->delete($id);
        return $success ? $this->success('Menu deleted') : $this->error('Failed to delete menu');
    }
    
    public function addMenuItem($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['menu_id', 'stock_id', 'menu_item_name'];
        foreach ($required as $field) {
            if (empty($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        // Check if menu_id exists
        $menuModel = new Menu();
        if (!$menuModel->find($requestData['menu_id'])) {
            return $this->error('Menu not found. Please check the menu_id and ensure the menu item exists');
        }
        
        // Check if stock_id exists
        $stockModel = new \Models\Stock();
        if (!$stockModel->find($requestData['stock_id'])) {
            return $this->error('Stock not found. Please check the stock_id and ensure the stock item exists');
        }
        
        $model = new MenuItem();
        $id = $model->create($requestData);
        return $id ? $this->success('Menu item added') : $this->error('Failed to add menu item');
    }

    public function listMenuItems($params = []) {
        $model = new MenuItem();
        $query = "SELECT mi.*, s.stock_name, s.stock_qty as quantity, m.menu_name, m.menu_price, mc.menu_cat_name as category
                  FROM menu_item mi
                  LEFT JOIN stock s ON mi.stock_id = s.stock_id
                  LEFT JOIN menu m ON mi.menu_id = m.menu_id
                  LEFT JOIN menu_category mc ON m.menu_cat_id = mc.menu_cat_id
                  ORDER BY mi.menu_item_created_date DESC";
        $stmt = $model->getDb()->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $this->success('Menu items listed', $data);
    }

    public function updateMenuItem($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);

        if (empty($requestData['menu_item_id'])) {
            return $this->error('Menu item ID is required');
        }

        $model = new MenuItem();
        $existing = $model->find($requestData['menu_item_id']);
        if (!$existing) {
            return $this->error('Menu item not found');
        }

        if (isset($requestData['menu_id'])) {
            $menuModel = new Menu();
            if (!$menuModel->find($requestData['menu_id'])) {
                return $this->error('Menu not found');
            }
        }

        if (isset($requestData['stock_id'])) {
            $stockModel = new \Models\Stock();
            if (!$stockModel->find($requestData['stock_id'])) {
                return $this->error('Stock not found');
            }
        }

        $success = $model->update($requestData['menu_item_id'], $requestData);
        return $success ? $this->success('Menu item updated') : $this->error('Failed to update menu item');
    }

    public function deleteMenuItem($params = []) {
        $menu_item_id = $_GET['id'];
        $model = new MenuItem();
        $success = $model->delete($menu_item_id);
        return $success ? $this->success('Menu item deleted') : $this->error('Failed to delete menu item');
    }
}
