<?php
return [
    // Authentication
    ['POST', '/login', 'AuthController@login'],
    ['POST', '/validate-token', 'AuthController@validateToken'],
    ['POST', '/logout', 'AuthController@logout'],

    // User Management
    ['POST', '/users/add', 'UserController@addUser'],
    ['GET', '/users/list', 'UserController@listUsers'],
    ['PUT', '/users/update', 'UserController@updateUser'],
    ['DELETE', '/users/delete', 'UserController@deleteUser'],

    // Inventory Management - Stock Categories
    ['POST', '/inventory/stock-category/add', 'InventoryController@addStockCategory'],
    ['GET', '/inventory/stock-category/list', 'InventoryController@listStockCategories'],
    ['PUT', '/inventory/stock-category/update', 'InventoryController@updateStockCategory'],
    ['DELETE', '/inventory/stock-category/delete', 'InventoryController@deleteStockCategory'],

    // Inventory Management - Stock Groups
    ['POST', '/inventory/stock-group/add', 'InventoryController@addStockGroup'],
    ['GET', '/inventory/stock-group/list', 'InventoryController@listStockGroups'],
    ['PUT', '/inventory/stock-group/update', 'InventoryController@updateStockGroup'],
    ['DELETE', '/inventory/stock-group/delete', 'InventoryController@deleteStockGroup'],

    // Inventory Management - Stock Item Categories
    ['POST', '/inventory/stock-item-category/add', 'InventoryController@addStockItemCategory'],
    ['GET', '/inventory/stock-item-category/list', 'InventoryController@listStockItemCategories'],
    ['PUT', '/inventory/stock-item-category/update', 'InventoryController@updateStockItemCategory'],
    ['DELETE', '/inventory/stock-item-category/delete', 'InventoryController@deleteStockItemCategory'],

    // Inventory Management - Stocks
    ['POST', '/inventory/stocks/add', 'InventoryController@addStock'],
    ['GET', '/inventory/stocks/list', 'InventoryController@listStocks'],
    ['PUT', '/inventory/stocks/update', 'InventoryController@updateStock'],
    ['DELETE', '/inventory/stocks/delete', 'InventoryController@deleteStock'],

    // Inventory Management - Stock IN/OUT
    ['POST', '/inventory/stockin/add', 'InventoryController@addStockIn'],
    ['POST', '/inventory/stockout/add', 'InventoryController@addStockOut'],

    // Menu Management - Category Groups
    ['POST', '/menu/category-group/add', 'MenuController@addMenuCategoryGroup'],
    ['GET', '/menu/category-group/list', 'MenuController@listMenuCategoryGroups'],
    ['PUT', '/menu/category-group/update', 'MenuController@updateMenuCategoryGroup'],
    ['DELETE', '/menu/category-group/delete', 'MenuController@deleteMenuCategoryGroup'],

    // Menu Management - Categories
    ['POST', '/menu/category/add', 'MenuController@addMenuCategory'],
    ['GET', '/menu/category/list', 'MenuController@listMenuCategories'],
    ['PUT', '/menu/category/update', 'MenuController@updateMenuCategory'],
    ['DELETE', '/menu/category/delete', 'MenuController@deleteMenuCategory'],

    // Menu Management - Menus
    ['POST', '/menu/add', 'MenuController@addMenu'],
    ['GET', '/menu/list', 'MenuController@listMenus'],
    ['PUT', '/menu/update', 'MenuController@updateMenu'],
    ['DELETE', '/menu/delete', 'MenuController@deleteMenu'],

    // Menu Management - Menu Items
    ['POST', '/menu/items/add', 'MenuController@addMenuItem'],

    // Tables Management - Table Groups
    ['POST', '/tables/group/add', 'TableController@addTableGroup'],
    ['GET', '/tables/group/list', 'TableController@listTableGroups'],
    ['PUT', '/tables/group/update', 'TableController@updateTableGroup'],
    ['DELETE', '/tables/group/delete', 'TableController@deleteTableGroup'],

    // Tables Management - Tables
    ['POST', '/tables/add', 'TableController@addTable'],
    ['GET', '/tables/list', 'TableController@listTables'],

    // Orders Management - Order Types
    ['POST', '/orders/type/add', 'OrderController@addOrderType'],
    ['GET', '/orders/type/list', 'OrderController@listOrderTypes'],
    ['PUT', '/orders/type/update', 'OrderController@updateOrderType'],
    ['DELETE', '/orders/type/delete', 'OrderController@deleteOrderType'],

    // Orders Management - Special Orders
    ['POST', '/orders/special/add', 'OrderController@addSpecialOrder'],
    ['GET', '/orders/special/list', 'OrderController@listSpecialOrders'],
    ['PUT', '/orders/special/update', 'OrderController@updateSpecialOrder'],
    ['DELETE', '/orders/special/delete', 'OrderController@deleteSpecialOrder'],

    // Orders Management - Orders
    ['POST', '/orders/create', 'OrderController@createOrder'],
    ['GET', '/orders/list', 'OrderController@listOrders'],
    ['PUT', '/orders/update', 'OrderController@updateOrder'],
    ['DELETE', '/orders/delete', 'OrderController@deleteOrder'],

    // Orders Management - Order Items
    ['POST', '/orders/items/add', 'OrderController@addOrderItem'],

    // Payments
    ['POST', '/payments/add', 'PaymentController@addPayment'],
    ['GET', '/payments/status', 'PaymentController@checkPaymentStatus'],

    // Reports
    ['GET', '/reports/sales.php', 'ReportsController@salesReport'],
    ['GET', '/reports/inventory.php', 'ReportsController@inventoryReport'],
    ['GET', '/reports/stock-movement.php', 'ReportsController@stockMovementReport'],
    ['GET', '/reports/orders.php', 'ReportsController@orderReport'],
    ['GET', '/reports/payments.php', 'ReportsController@paymentReport'],
    ['GET', '/reports/user-activity.php', 'ReportsController@userActivityReport'],
];
