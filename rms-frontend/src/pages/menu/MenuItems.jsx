import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { listMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, listMenus } from "../../api/services/menu";
import { listStocks } from "../../api/services/inventory";

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [menus, setMenus] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, menusRes, stocksRes] = await Promise.all([
          listMenuItems(),
          listMenus(),
          listStocks()
        ]);
        
        if (itemsRes.status === 'success') setItems(itemsRes.data || []);
        if (menusRes.status === 'success') setMenus(menusRes.data || []);
        if (stocksRes.status === 'success') setStocks(stocksRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.menu_item_name.toLowerCase().includes(search.toLowerCase()) ||
    item.menu_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.stock_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    const menuOptions = menus.map(menu => 
      `<option value="${menu.menu_id}">${menu.menu_name}</option>`
    ).join('');

    const stockOptions = stocks.map(stock => 
      `<option value="${stock.stock_id}">${stock.stock_name} (Qty: ${stock.quantity})</option>`
    ).join('');

    const { value: formValues } = await Swal.fire({
      title: "Add Menu Item",
      html: `
        <select id="menu" class="swal2-input">
          <option value="">Select Menu</option>
          ${menuOptions}
        </select>
        <select id="stock" class="swal2-input">
          <option value="">Select Stock Item</option>
          ${stockOptions}
        </select>
        <input id="name" class="swal2-input" placeholder="Item Name" />
        <input id="desc" class="swal2-input" placeholder="Description" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        menu_id: document.getElementById("menu").value,
        stock_id: document.getElementById("stock").value,
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
      }),
    });

    if (!formValues?.menu_id) {
      return Swal.fire("Error", "Menu selection is required", "error");
    }

    if (!formValues?.stock_id) {
      return Swal.fire("Error", "Stock selection is required", "error");
    }

    if (!formValues?.name) {
      return Swal.fire("Error", "Name is required", "error");
    }

    const response = await addMenuItem({
      menu_id: formValues.menu_id,
      stock_id: formValues.stock_id,
      menu_item_name: formValues.name,
      menu_item_desc: formValues.desc || "",
    });

    if (response.status === 'success') {
      Swal.fire("Added!", "Menu item created", "success");
      // Refetch
      const res = await listMenuItems();
      if (res.status === 'success') setItems(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to add item", "error");
    }
  };

  const handleEdit = async (item) => {
    const menuOptions = menus.map(menu => 
      `<option value="${menu.menu_id}" ${menu.menu_id === item.menu_id ? 'selected' : ''}>${menu.menu_name}</option>`
    ).join('');

    const stockOptions = stocks.map(stock => 
      `<option value="${stock.stock_id}" ${stock.stock_id === item.stock_id ? 'selected' : ''}>${stock.stock_name} (Qty: ${stock.quantity})</option>`
    ).join('');

    const { value: formValues } = await Swal.fire({
      title: "Edit Menu Item",
      html: `
        <select id="menu" class="swal2-input">
          <option value="">Select Menu</option>
          ${menuOptions}
        </select>
        <select id="stock" class="swal2-input">
          <option value="">Select Stock Item</option>
          ${stockOptions}
        </select>
        <input id="name" class="swal2-input" value="${item.menu_item_name}" />
        <input id="desc" class="swal2-input" value="${item.menu_item_desc || ""}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        menu_id: document.getElementById("menu").value,
        stock_id: document.getElementById("stock").value,
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
      }),
    });

    if (!formValues?.menu_id) {
      return Swal.fire("Error", "Menu selection is required", "error");
    }

    if (!formValues?.stock_id) {
      return Swal.fire("Error", "Stock selection is required", "error");
    }

    if (!formValues?.name) {
      return Swal.fire("Error", "Name is required", "error");
    }

    const response = await updateMenuItem({
      menu_item_id: item.menu_item_id,
      menu_id: formValues.menu_id,
      stock_id: formValues.stock_id,
      menu_item_name: formValues.name,
      menu_item_desc: formValues.desc,
    });

    if (response.status === 'success') {
      Swal.fire("Updated!", "Menu item updated", "success");
      // Refetch
      const res = await listMenuItems();
      if (res.status === 'success') setItems(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to update item", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    const response = await deleteMenuItem(id);

    if (response.status === 'success') {
      Swal.fire("Deleted!", "Menu item removed", "success");
      // Refetch
      const res = await listMenuItems();
      if (res.status === 'success') setItems(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to delete item", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Menu Items</h2>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name, menu, or stock..."
                className="border rounded-lg px-3 py-2 w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                <FaPlus /> Add Item
              </button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mb-6">
            {filteredItems.map((item, index) => (
              <div key={item.menu_item_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.menu_item_name}</h3>
                    <p className="text-sm text-gray-500">Menu: {item.menu_name}</p>
                    <p className="text-sm text-blue-600">Stock: {item.stock_name} (Qty: {item.quantity})</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-yellow-500 hover:text-yellow-600 p-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.menu_item_id)}
                      className="text-red-500 hover:text-red-600 p-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {item.menu_item_desc && (
                  <p className="text-sm text-gray-600 mb-3">{item.menu_item_desc}</p>
                )}
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Created: {item.menu_item_created_date}</p>
                  <p>#{index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Item Name</th>
                  <th className="p-3 text-left">Menu</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item.menu_item_id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">{item.menu_item_name}</td>
                      <td className="p-3">{item.menu_name}</td>
                      <td className="p-3">{item.stock_name}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{item.menu_item_desc || "-"}</td>
                      <td className="p-3 text-sm text-gray-500">{item.menu_item_created_date}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-yellow-500 hover:text-yellow-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.menu_item_id)}
                            className="text-red-500 hover:text-red-600"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
