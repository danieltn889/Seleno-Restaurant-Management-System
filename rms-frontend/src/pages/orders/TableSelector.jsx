import { useState, useEffect } from "react";
import { listTables } from "../../api/services/tables";

export default function TableSelector({ setTable, selectedTable }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await listTables();
        if (res.status === 'success') {
          setTables(res.data.map(table => table.table_name));
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  if (loading) return <div className="text-center p-2">Loading tables...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Select Table</h2>
      <div className="grid grid-cols-2 gap-2">
        {tables?.map((t, index) => (
          <button
            key={index}
            onClick={() => setTable(t)}
            className={`px-4 py-2 rounded text-white font-medium ${
              selectedTable === t ? "bg-yellow-600" : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
