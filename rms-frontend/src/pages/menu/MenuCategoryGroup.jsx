import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { listMenuCategoryGroups, addMenuCategoryGroup, updateMenuCategoryGroup, deleteMenuCategoryGroup } from "../../api/services/menu";

export default function MenuCategoryGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listMenuCategoryGroups();
        if (res.status === 'success') setGroups(res.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

    const response = await addMenuCategoryGroup({
      menu_cat_group_name: value.name,
      menu_cat_group_desc: value.desc,
    });

    if (response.status === 'success') {
      Swal.fire("Added!", "Category group created", "success");
      // Refetch
      const res = await listMenuCategoryGroups();
      if (res.status === 'success') setGroups(res.data || []);
    } else {
      console.error('API Error:', response);
      Swal.fire("Error", response.message || "Failed to add group", "error");
    }
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

    const response = await updateMenuCategoryGroup({
      menu_cat_group_id: group.menu_cat_group_id,
      menu_cat_group_name: value.name,
      menu_cat_group_desc: value.desc,
    });

    if (response.status === 'success') {
      Swal.fire("Updated!", "Category group updated", "success");
      // Refetch
      const res = await listMenuCategoryGroups();
      if (res.status === 'success') setGroups(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to update group", "error");
    }
  };

  // 🔹 DELETE
  const deleteGroup = async (id) => {
    const result = await Swal.fire({
      title: "Delete this group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const response = await deleteMenuCategoryGroup(id);

    if (response.status === 'success') {
      Swal.fire("Deleted!", "Category group removed", "success");
      // Refetch
      const res = await listMenuCategoryGroups();
      if (res.status === 'success') setGroups(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to delete group", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mb-6">
            {groups.map((g, index) => (
              <div key={g.menu_cat_group_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{g.menu_cat_group_name}</h3>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editGroup(g)}
                      className="text-yellow-500 hover:text-yellow-600 p-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteGroup(g.menu_cat_group_id)}
                      className="text-red-500 hover:text-red-600 p-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {g.menu_cat_group_desc && (
                  <p className="text-sm text-gray-600 mb-3">{g.menu_cat_group_desc}</p>
                )}
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Created: {g.menu_cat_created_date}</p>
                  {g.menu_cat_update_date && (
                    <p>Updated: {g.menu_cat_update_date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
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
        </>
      )}
    </div>
  );
}
