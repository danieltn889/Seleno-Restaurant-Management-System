import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function MenuCategoryGroup() {
  // 🔹 Dummy data (acts like backend response)
  const [groups, setGroups] = useState([
    {
      menu_cat_group_id: 1,
      menu_cat_group_name: "Main Dishes",
      menu_cat_group_desc: "Primary meals",
      menu_cat_created_date: "2026-01-01",
      menu_cat_update_date: null,
    },
    {
      menu_cat_group_id: 2,
      menu_cat_group_name: "Drinks",
      menu_cat_group_desc: "Beverages",
      menu_cat_created_date: "2026-01-02",
      menu_cat_update_date: null,
    },
  ]);

  // 🔹 ADD
  const addGroup = async () => {
    const { value } = await Swal.fire({
      title: "Add Category Group",
      html: `
        <input id="name" class="swal2-input" placeholder="Group Name" />
        <input id="desc" class="swal2-input" placeholder="Description" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
      }),
    });

    if (!value?.name) {
      Swal.fire("Error", "All required fields must be filled", "error");
      return;
    }

    setGroups((prev) => [
      ...prev,
      {
        menu_cat_group_id: Date.now(), // simulate PK from backend
        menu_cat_group_name: value.name,
        menu_cat_group_desc: value.desc,
        menu_cat_created_date: new Date().toISOString().split("T")[0],
        menu_cat_update_date: null,
      },
    ]);

    Swal.fire("Added!", "Category group created", "success");
  };

  // 🔹 EDIT
  const editGroup = async (group) => {
    const { value } = await Swal.fire({
      title: "Edit Category Group",
      html: `
        <input id="name" class="swal2-input" value="${group.menu_cat_group_name}" />
        <input id="desc" class="swal2-input" value="${group.menu_cat_group_desc}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => ({
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
      }),
    });

    if (!value?.name) {
      Swal.fire("Error", "All required fields must be filled", "error");
      return;
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.menu_cat_group_id === group.menu_cat_group_id
          ? {
              ...g,
              menu_cat_group_name: value.name,
              menu_cat_group_desc: value.desc,
              menu_cat_update_date: new Date().toISOString().split("T")[0],
            }
          : g
      )
    );

    Swal.fire("Updated!", "Category group updated", "success");
  };

  // 🔹 DELETE
  const deleteGroup = (id) => {
    Swal.fire({
      title: "Delete this group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((res) => {
      if (res.isConfirmed) {
        setGroups((prev) =>
          prev.filter((g) => g.menu_cat_group_id !== id)
        );
        Swal.fire("Deleted!", "Category group removed", "success");
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Menu Category Groups
        </h2>
        <button
          onClick={addGroup}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <FaPlus /> Add Group
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Group Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Created Date</th>
              <th className="p-3 text-left">Updated Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No category groups found
                </td>
              </tr>
            ) : (
              groups.map((g, index) => (
                <tr
                  key={g.menu_cat_group_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{g.menu_cat_group_name}</td>
                  <td className="p-3 text-gray-600">{g.menu_cat_group_desc}</td>
                  <td className="p-3 text-sm text-gray-500">{g.menu_cat_created_date}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {g.menu_cat_update_date || "-"}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => editGroup(g)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteGroup(g.menu_cat_group_id)}
                        className="text-red-500 hover:text-red-600"
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
