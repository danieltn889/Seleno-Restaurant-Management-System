import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaLayerGroup } from "react-icons/fa";
import Swal from "sweetalert2";

export default function MenuCategory() {
  // 🔹 Dummy groups (would come from backend)
  const [groups, setGroups] = useState([
    { menu_cat_group_id: 1, menu_cat_group_name: "Main Dishes" },
    { menu_cat_group_id: 2, menu_cat_group_name: "Drinks" },
  ]);

  // 🔹 Dummy categories (would come from backend)
  const [categories, setCategories] = useState([
    {
      menu_cat_id: 1,
      menu_cat_group_id: 1,
      menu_cat_name: "African Food",
      menu_cat_desc: "Traditional meals",
      menu_cat_created_date: "2026-01-01",
      menu_cat_updated_date: null,
    },
    {
      menu_cat_id: 2,
      menu_cat_group_id: 2,
      menu_cat_name: "Soft Drinks",
      menu_cat_desc: "Cold beverages",
      menu_cat_created_date: "2026-01-02",
      menu_cat_updated_date: null,
    },
  ]);

  /* ---------------- ADD ---------------- */
  const addCategory = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Menu Category",
      html: `
        <select id="group" class="swal2-input">
          <option value="">Select Category Group</option>
          ${groups.map(
            (g) =>
              `<option value="${g.menu_cat_group_id}">${g.menu_cat_group_name}</option>`
          )}
        </select>
        <input id="name" class="swal2-input" placeholder="Category Name">
        <input id="desc" class="swal2-input" placeholder="Description">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        group_id: document.getElementById("group").value,
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
      }),
    });

    if (!formValues?.name || !formValues?.group_id) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    setCategories([
      ...categories,
      {
        menu_cat_id: Date.now(),
        menu_cat_group_id: Number(formValues.group_id),
        menu_cat_name: formValues.name,
        menu_cat_desc: formValues.desc || "-",
        menu_cat_created_date: new Date().toISOString().split("T")[0],
        menu_cat_updated_date: null,
      },
    ]);

    Swal.fire("Added!", "Category created successfully", "success");
  };

  /* ---------------- EDIT ---------------- */
  const editCategory = async (category) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Category",
      html: `
        <select id="group" class="swal2-input">
          ${groups
            .map(
              (g) =>
                `<option value="${g.menu_cat_group_id}" ${
                  g.menu_cat_group_id === category.menu_cat_group_id
                    ? "selected"
                    : ""
                }>${g.menu_cat_group_name}</option>`
            )
            .join("")}
        </select>
        <input id="name" class="swal2-input" value="${category.menu_cat_name}">
        <input id="desc" class="swal2-input" value="${category.menu_cat_desc}">
      `,
      showCancelButton: true,
      preConfirm: () => ({
        group_id: document.getElementById("group").value,
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
      }),
    });

    if (!formValues?.name || !formValues?.group_id) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    setCategories(
      categories.map((c) =>
        c.menu_cat_id === category.menu_cat_id
          ? {
              ...c,
              menu_cat_group_id: Number(formValues.group_id),
              menu_cat_name: formValues.name,
              menu_cat_desc: formValues.desc,
              menu_cat_updated_date: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );

    Swal.fire("Updated!", "Category updated successfully", "success");
  };

  /* ---------------- DELETE ---------------- */
  const deleteCategory = (id) => {
    Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(categories.filter((c) => c.menu_cat_id !== id));
        Swal.fire("Deleted!", "Category removed", "success");
      }
    });
  };

  // Helper to get group name by id
  const getGroupName = (id) =>
    groups.find((g) => g.menu_cat_group_id === id)?.menu_cat_group_name || "-";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaLayerGroup className="text-blue-600" />
          Menu Categories
        </h2>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left hidden md:table-cell">Group</th>
              <th className="p-4 text-left hidden md:table-cell">Description</th>
              <th className="p-4 text-left hidden md:table-cell">Created</th>
              <th className="p-4 text-left hidden md:table-cell">Updated</th>
              <th className="p-4 text-center w-32">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr
                  key={c.menu_cat_id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{c.menu_cat_name}</td>
                  <td className="p-4 hidden md:table-cell text-gray-600">
                    {getGroupName(c.menu_cat_group_id)}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-600">
                    {c.menu_cat_desc}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-500">
                    {c.menu_cat_created_date}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-500">
                    {c.menu_cat_updated_date || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => editCategory(c)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCategory(c.menu_cat_id)}
                        className="text-red-600 hover:text-red-800"
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
    </div>
  );
}
