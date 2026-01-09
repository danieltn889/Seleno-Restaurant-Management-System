import { useState } from "react";
import Swal from "sweetalert2";

export default function StockGroups() {
  const [groups, setGroups] = useState([
    { group_id: 1, group_name: "Fresh Items", group_desc: "Daily use", status: "active" },
  ]);

  const [form, setForm] = useState({
    group_name: "",
    group_desc: "",
    status: "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setGroups([...groups, { group_id: Date.now(), ...form }]);
    Swal.fire("Added", "Group added", "success");
    setForm({ group_name: "", group_desc: "", status: "active" });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Groups</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded grid gap-4 md:grid-cols-3 mb-6">
        <input className="border p-2 rounded" placeholder="Group name"
          value={form.group_name}
          onChange={(e) => setForm({ ...form, group_name: e.target.value })}
        />
        <input className="border p-2 rounded" placeholder="Description"
          value={form.group_desc}
          onChange={(e) => setForm({ ...form, group_desc: e.target.value })}
        />
        <button className="bg-blue-600 text-white rounded px-4 py-2">Add Group</button>
      </form>

      <div className="space-y-3">
        {groups.map(g => (
          <div key={g.group_id} className="bg-white shadow p-4 rounded">
            <h4 className="font-semibold">{g.group_name}</h4>
            <p className="text-sm text-gray-500">{g.group_desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
