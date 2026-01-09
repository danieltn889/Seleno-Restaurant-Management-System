import { FaClipboardList, FaMoneyCheck, FaBox, FaTable } from "react-icons/fa";

export default function Dashboard() {
  const metrics = [
    { title: "Total Orders", value: 45, icon: <FaClipboardList className="w-8 h-8 text-blue-500" />},
    { title: "Pending Payments", value: 12, icon: <FaMoneyCheck className="w-8 h-8 text-yellow-500" />},
    { title: "Stock Items", value: 120, icon: <FaBox className="w-8 h-8 text-green-500" /> },
    { title: "Tables Available", value: 8, icon: <FaTable className="w-8 h-8 text-purple-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 font-medium">{m.title}</h3>
                <p className="text-3xl font-bold mt-2">{m.value}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">{m.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
