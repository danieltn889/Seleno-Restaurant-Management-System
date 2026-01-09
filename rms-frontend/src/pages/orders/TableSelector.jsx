import { useState } from "react";

export default function TableSelector({ setTable }) {
  // Dummy tables (replace with backend later)
  const [tables] = useState([
    "Table 1",
    "Table 2",
    "Table 3",
    "Table 4",
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Select Table</h2>
      <div className="grid grid-cols-2 gap-2">
        {tables?.map((t, index) => (
          <button
            key={index}
            onClick={() => setTable(t)}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
