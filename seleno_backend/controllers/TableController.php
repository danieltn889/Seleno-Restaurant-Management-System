<?php
namespace Controllers;

use Models\TableGroup;
use Models\Table;

class TableController extends BaseController {
    public function addTableGroup($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($requestData['table_group_name'])) {
            return $this->error('Table group name is required. Please provide a name for the table group');
        }
        
        $model = new TableGroup();
        $id = $model->create($requestData);
        return $id ? $this->success('Table group added') : $this->error('Failed to add table group');
    }

    public function listTableGroups($params = []) {
        $model = new TableGroup();
        $data = $model->findAll();
        return $this->success('Table groups listed', $data);
    }

    public function updateTableGroup($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        $model = new TableGroup();
        $success = $model->update($requestData['table_group_id'], $requestData);
        return $success ? $this->success('Table group updated') : $this->error('Failed to update table group');
    }

    public function deleteTableGroup($params = []) {
        $id = $_GET['id'];
        $model = new TableGroup();
        $success = $model->delete($id);
        return $success ? $this->success('Table group deleted') : $this->error('Failed to delete table group');
    }

    public function addTable($params = []) {
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        $required = ['table_group_id', 'table_desc'];
        foreach ($required as $field) {
            if (empty($requestData[$field])) {
                return $this->error("The field '$field' is required and cannot be empty");
            }
        }
        
        // Check if table_group_id exists
        $groupModel = new TableGroup();
        if (!$groupModel->find($requestData['table_group_id'])) {
            return $this->error('Table group not found. Please check the table_group_id and ensure it exists');
        }
        
        $model = new Table();
        $id = $model->create($requestData);
        return $id ? $this->success('Table added') : $this->error('Failed to add table');
    }

    public function listTables($params = []) {
        $model = new Table();
        $data = $model->findAll();
        return $this->success('Tables listed', $data);
    }
}
