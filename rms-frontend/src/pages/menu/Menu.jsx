import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { listMenus, listMenuCategories, addMenu as apiAddMenu, updateMenu as apiUpdateMenu, deleteMenu as apiDeleteMenu } from "../../api/services/menu";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([listMenuCategories(), listMenus()]);
        if (catRes.status === 'success') setCategories(catRes.data || []);
        if (menuRes.status === 'success') setMenu(menuRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔍 Filter menu by search & category
  const filteredMenu = menu.filter((m) => {
    const matchesSearch = m.menu_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || m.menu_cat_id === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id) =>
    categories.find((c) => c.menu_cat_id === id)?.menu_cat_name || "-";

  // 🔹 ADD MENU
  const addMenu = async () => {
    const categoryOptions = categories
      .map(
        (c) =>
          `<option value="${c.menu_cat_id}" style="background:#FFD700;">${c.menu_cat_name}</option>`
      )
      .join("");

    const result = await Swal.fire({
      title: "Add Menu Item",
      html: `
        <select id="category" class="swal2-input">
          <option value="">Select Category</option>
          ${categoryOptions}
        </select>
        <input id="name" class="swal2-input" placeholder="Menu name" />
        <input id="price" type="number" class="swal2-input" placeholder="Price (RWF)" />
        <input id="desc" class="swal2-input" placeholder="Description (optional)" />
        <select id="status" class="swal2-input">
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      `,
      showCancelButton: true,
      preConfirm: () => ({
        category: document.getElementById("category").value,
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        desc: document.getElementById("desc").value,
        status: document.getElementById("status").value,
      }),
    });

    if (!result.value) return; // Cancel pressed

    const value = result.value;

    if (!value.name || !value.price || !value.category) {
      Swal.fire("Error", "All required fields must be filled", "error");
      return;
    }

    const response = await apiAddMenu({
      menu_name: value.name,
      menu_price: Number(value.price),
      menu_desc: value.desc,
      menu_cat_id: Number(value.category),
      menu_status: value.status,
    });

    if (response.status === 'success') {
      Swal.fire("Added!", "Menu item created", "success");
      // Refetch menus
      const menuRes = await listMenus();
      if (menuRes.status === 'success') setMenu(menuRes.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to add menu", "error");
    }
  };

  // 🔹 EDIT MENU
  const editMenu = async (item) => {
    const categoryOptions = categories
      .map(
        (c) =>
          `<option value="${c.menu_cat_id}" ${
            c.menu_cat_id === item.menu_cat_id ? "selected" : ""
          } style="background:#FFD700;">${c.menu_cat_name}</option>`
      )
      .join("");

    const result = await Swal.fire({
      title: "Edit Menu Item",
      html: `
        <select id="category" class="swal2-input">${categoryOptions}</select>
        <input id="name" class="swal2-input" value="${item.menu_name}" />
        <input id="price" type="number" class="swal2-input" value="${item.menu_price}" />
        <input id="desc" class="swal2-input" value="${item.menu_desc || ""}" />
        <select id="status" class="swal2-input">
          <option value="available" ${
            item.menu_status === "available" ? "selected" : ""
          }>Available</option>
          <option value="unavailable" ${
            item.menu_status === "unavailable" ? "selected" : ""
          }>Unavailable</option>
        </select>
      `,
      showCancelButton: true,
      preConfirm: () => ({
        category: document.getElementById("category").value,
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        desc: document.getElementById("desc").value,
        status: document.getElementById("status").value,
      }),
    });

    if (!result.value) return; // Cancel pressed

    const value = result.value;

    if (!value.name || !value.price || !value.category) {
      Swal.fire("Error", "All required fields must be filled", "error");
      return;
    }

    const response = await apiUpdateMenu({
      menu_id: item.menu_id,
      menu_name: value.name,
      menu_price: Number(value.price),
      menu_desc: value.desc,
      menu_cat_id: Number(value.category),
      menu_status: value.status,
    });

    if (response.status === 'success') {
      Swal.fire("Updated!", "Menu item updated", "success");
      // Refetch menus
      const menuRes = await listMenus();
      if (menuRes.status === 'success') setMenu(menuRes.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to update menu", "error");
    }
  };

  // 🔹 DELETE MENU
  const deleteMenuItem = async (id) => {
    const result = await Swal.fire({
      title: "Delete this menu item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    const response = await apiDeleteMenu(id);

    if (response.status === 'success') {
      Swal.fire("Deleted!", "Menu item removed", "success");
      // Refetch menus
      const menuRes = await listMenus();
      if (menuRes.status === 'success') setMenu(menuRes.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to delete menu", "error");
    }
  };

  // 🔹 PDF Export (Two Columns)
const exportPDF = () => {
  const doc = new jsPDF("l", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const colGap = 10;
  const colWidth = (pageWidth - margin * 2 - colGap) / 2;
  let yLeft = 20;
  let yRight = 20;
  let currentCol = "left";

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SERENO RESTAURANT MENU", pageWidth / 2, 10, { align: "center" });

  categories.forEach((cat) => {
    const catMenus = menu.filter((m) => m.menu_cat_id === cat.menu_cat_id);
    if (!catMenus.length) return;

    // Determine x position based on column
    const x = currentCol === "left" ? margin : margin + colWidth + colGap;
    let y = currentCol === "left" ? yLeft : yRight;

    // Category title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 204, 0);
    doc.text(cat.menu_cat_name.toUpperCase(), x, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0);

    catMenus.forEach((item) => {
      const priceX = x + colWidth - 30;

      doc.text(item.menu_name, x, y);

      // Dot leaders
      let dots = "";
      const dotsStart = x + doc.getTextWidth(item.menu_name) + 2;
      const dotsEnd = priceX - 5;
      while (doc.getTextWidth(dots) < dotsEnd - dotsStart) dots += ".";
      doc.text(dots, dotsStart, y);

      // Price
      doc.text(item.menu_price.toLocaleString() + " RWF", priceX, y, { align: "right" });

      // Description
      if (item.menu_desc) {
        y += 4;
        doc.setFontSize(9);
        doc.setTextColor(90);
        doc.text(`(${item.menu_desc})`, x, y, { maxWidth: colWidth - 30 });
        doc.setFontSize(11);
        doc.setTextColor(0);
      }

      y += 6;
    });

    // Update column positions
    if (currentCol === "left") {
      yLeft = y + 8;
      currentCol = "right";
    } else {
      yRight = y + 8;
      currentCol = "left";
      if (Math.max(yLeft, yRight) > pageHeight - 20) {
        doc.addPage();
        yLeft = 20;
        yRight = 20;
      }
    }
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Prepared by RSM • Powered by LMBTECH LTD", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save("sereno-menu.pdf");
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Menu Management</h2>

            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.menu_cat_id} value={c.menu_cat_id}>
                    {c.menu_cat_name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search menu..."
                  className="pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>

              {/* PDF Button */}
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow"
              >
                <FaFilePdf /> PDF
              </button>

              {/* Add Button */}
              <button
                onClick={addMenu}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
              >
                <FaPlus /> Add
              </button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mb-6">
            {filteredMenu.map((m, index) => (
              <div key={m.menu_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{m.menu_name}</h3>
                    <p className="text-sm text-gray-500">Category: {getCategoryName(m.menu_cat_id)}</p>
                    <p className="text-sm font-medium text-green-600">${m.menu_price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editMenu(m)}
                      className="text-yellow-500 hover:text-yellow-600 p-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteMenu(m.menu_id)}
                      className="text-red-500 hover:text-red-600 p-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      m.menu_status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {m.menu_status}
                  </span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                {m.menu_desc && (
                  <p className="text-sm text-gray-600 mb-3">{m.menu_desc}</p>
                )}
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Created: {m.menu_created_date}</p>
                  {m.menu_updated_date && (
                    <p>Updated: {m.menu_updated_date}</p>
                  )}
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
                  <th className="p-3 text-left">Menu</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  filteredMenu.map((m, i) => (
                    <tr key={m.menu_id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium">{m.menu_name}</td>
                      <td className="p-3">{getCategoryName(m.menu_cat_id)}</td>
                      <td className="p-3">{m.menu_price.toLocaleString()} RWF</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-white ${
                            m.menu_status === "available"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          } text-sm`}
                        >
                          {m.menu_status}
                        </span>
                      </td>
                      <td className="p-3">{m.menu_desc}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => editMenu(m)}
                            className="text-yellow-500"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteMenuItem(m.menu_id)}
                            className="text-red-500"
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
