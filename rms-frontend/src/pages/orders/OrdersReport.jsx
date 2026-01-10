import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { listOrders } from "../../api/services/orders";

export default function OrdersReport() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listOrders();
        if (res.status === 'success') setOrders(res.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Unique users for filter
  const users = ["ALL", ...Array.from(new Set(orders.map((o) => o.userid)))];

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const statusMatch = statusFilter === "ALL" || o.order_status === statusFilter;
    const userMatch = userFilter === "ALL" || o.userid === userFilter;
    const date = new Date(o.created_at);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    const dateMatch = (!from || date >= from) && (!to || date <= to);
    return statusMatch && userMatch && dateMatch;
  });

  // Calculate daily sales
  const salesByDate = {};
  filteredOrders.forEach((o) => {
    const dateKey = new Date(o.created_at).toLocaleDateString();
    const total = o.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    if (!salesByDate[dateKey]) salesByDate[dateKey] = 0;
    salesByDate[dateKey] += total;
  });
  const overallTotal = Object.values(salesByDate).reduce((a, b) => a + b, 0);

  // PDF export
  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(14);
    doc.text("Sereno Orders Report", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateFrom || "Start"} - ${dateTo || "End"}`, 105, y, { align: "center" });
    y += 6;
    doc.text(`Status Filter: ${statusFilter}`, 105, y, { align: "center" });
    y += 6;
    doc.text(`User Filter: ${userFilter}`, 105, y, { align: "center" });
    y += 10;

    filteredOrders.forEach((order) => {
      const orderTotal = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);
      doc.setFont(undefined, "bold");
      doc.text(
        `Order ${order.order_id} (${order.order_code}) | Table: ${order.table_id} | User: ${order.userid} | Status: ${order.order_status} | Total: ${orderTotal} RWF`,
        10,
        y
      );
      y += 6;
      doc.setFont(undefined, "normal");
      order.items.forEach((i) => {
        doc.text(` - ${i.name} x ${i.qty} = ${i.qty * i.price} RWF`, 12, y);
        y += 6;
      });
      y += 4;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    y += 4;
    doc.setFont(undefined, "bold");
    doc.text("Daily Sales Summary:", 10, y);
    y += 6;
    Object.entries(salesByDate).forEach(([date, total]) => {
      doc.text(`${date}: ${total} RWF`, 12, y);
      y += 6;
    });
    y += 4;
    doc.text(`Overall Total: ${overallTotal} RWF`, 12, y);

    doc.save("orders_report_full.pdf");
  };

  // Status badge
  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "APPROVED":
        return "bg-green-200 text-green-800";
      case "CANCELLED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">Orders Report</h1>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3 items-center bg-white p-4 rounded shadow">
            <label className="font-semibold">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="ALL">ALL</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <label className="font-semibold">User:</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {users.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <label className="font-semibold">From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />

            <label className="font-semibold">To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border rounded px-2 py-1"
            />

            <button
              onClick={exportPDF}
              className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              Export PDF
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto bg-white rounded shadow mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Table</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total (RWF)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const total = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);
                    return (
                      <tr key={order.order_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{order.order_id}</td>
                        <td className="px-4 py-2">{order.order_code}</td>
                        <td className="px-4 py-2">{order.table_id}</td>
                        <td className="px-4 py-2">{order.userid}</td>
                        <td className={`px-4 py-2 w-24 text-center rounded ${statusBadge(order.order_status)}`}>
                          {order.order_status}
                        </td>
                        <td className="px-4 py-2">{total}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-right">Overall Total</td>
                  <td className="px-4 py-2">{overallTotal} RWF</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
