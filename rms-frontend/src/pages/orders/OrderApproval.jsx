import { useState, useEffect } from "react";
import Swal from "sweetalert2";

/* Dummy Orders */
const dummyOrders = [
  {
    order_id: 1,
    order_code: "ORD-1001",
    table_id: "Table 5",
    userid: "Waiter John",
    order_status: "PENDING",
    created_at: "2026-01-08",
    items: [
      { name: "Burger", qty: 2, price: 5000 },
      { name: "Coke", qty: 1, price: 1000 },
    ],
  },
  {
    order_id: 2,
    order_code: "ORD-1002",
    table_id: "Table 2",
    userid: "Waiter Alice",
    order_status: "PENDING",
    created_at: "2026-01-08",
    items: [{ name: "Beer", qty: 3, price: 3000 }],
  },
];

export default function OrderApproval() {
  const [orders, setOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [partialReason, setPartialReason] = useState("");

  const calculateTotal = (items = []) =>
    items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const total = selectedOrder ? calculateTotal(selectedOrder.items) : 0;

  /* Auto-fill FULL payment */
  useEffect(() => {
    if (paymentMode === "FULL") {
      setPaidAmount(total);
      setPartialReason("");
    }
    if (!paymentMode) {
      setPaidAmount("");
      setPartialReason("");
    }
  }, [paymentMode, total]);

  /* Approve order + send dummy payment to backend */
  const approveOrder = async () => {
    if (!paymentMode) {
      Swal.fire("Error", "Select payment mode", "error");
      return;
    }

    if (!paymentMethod) {
      Swal.fire("Error", "Select payment method", "error");
      return;
    }

    if (paymentMode === "FULL" && Number(paidAmount) !== total) {
      Swal.fire("Error", "Full payment must equal total amount", "error");
      return;
    }

    if (paymentMode === "PARTIAL") {
      if (!paidAmount || paidAmount <= 0 || paidAmount >= total) {
        Swal.fire("Error", "Enter valid partial amount", "error");
        return;
      }
      if (!partialReason.trim()) {
        Swal.fire("Error", "Partial payment reason is required", "error");
        return;
      }
    }

    // 🔹 Prepare dummy payment payload
    const paymentPayload = {
      payment_id: Date.now(), // dummy PK
      order_id: selectedOrder.order_id,
      payment_method: paymentMethod,
      amount_paid: Number(paidAmount),
      payment_status:
        paymentMode === "FULL" ? "paid" : paymentMode === "PARTIAL" ? "partial" : "unpaid",
      payment_txid: `TX-${Date.now()}`,
      payment_txref: `REF-${Math.floor(Math.random() * 100000)}`,
      payment_created_date: new Date().toISOString(),
      payment_updated_date: new Date().toISOString(),
      partial_reason: paymentMode === "PARTIAL" ? partialReason : "",
    };

    console.log("💰 Sending payment to backend (dummy):", paymentPayload);

    // 🔹 Update order status locally
    setOrders(prev =>
      prev.map(o =>
        o.order_id === selectedOrder.order_id
          ? { ...o, order_status: "APPROVED" }
          : o
      )
    );

    Swal.fire({
      title: "Payment Confirmed",
      html: `
        <b>Order:</b> ${selectedOrder.order_code}<br/>
        <b>Mode:</b> ${paymentMode}<br/>
        <b>Method:</b> ${paymentMethod}<br/>
        <b>Paid:</b> ${paidAmount} RWF
      `,
      icon: "success",
    });

    // Reset
    setSelectedOrder(null);
    setPaymentMode("");
    setPaymentMethod("");
    setPaidAmount("");
    setPartialReason("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Cashier Order Approval
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Pending Orders</h2>

          {orders.filter(o => o.order_status === "PENDING").length === 0 && (
            <p className="text-gray-500 text-center">No pending orders</p>
          )}

          <div className="space-y-3">
            {orders
              .filter(o => o.order_status === "PENDING")
              .map(order => (
                <div
                  key={order.order_id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-xl border cursor-pointer transition
                    ${
                      selectedOrder?.order_id === order.order_id
                        ? "border-green-500 bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{order.order_code}</span>
                    <span className="text-sm text-gray-500">
                      {order.table_id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Waiter: {order.userid}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Approval Panel */}
        {selectedOrder && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4">
              Approve {selectedOrder.order_code}
            </h2>

            {/* Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((i, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{i.name}</td>
                      <td className="p-2 text-center">{i.qty}</td>
                      <td className="p-2 text-right">{i.price}</td>
                      <td className="p-2 text-right">
                        {i.qty * i.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-gray-50 rounded-xl p-3 text-right font-bold">
              Total: {total} RWF
            </div>

            {/* PAYMENT FORM */}
            <div className="mt-6 bg-gray-50 border rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-700">
                Payment Details
              </h3>

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Payment Mode
                </label>
                <div className="flex gap-3">
                  {["FULL", "PARTIAL"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`flex-1 py-2 rounded-xl border font-semibold transition
                        ${
                          paymentMode === mode
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full border rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  <option value="CASH">Cash</option>
                  <option value="MOMO">Mobile Money</option>
                  <option value="CARD">Card</option>
                  <option value="BANK">Bank Transfer</option>
                </select>
              </div>

              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Paid Amount (RWF)
                </label>
                <input
                  type="number"
                  className={`w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none
                    ${
                      paymentMode === "FULL"
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  placeholder="Enter paid amount"
                  value={paidAmount}
                  readOnly={paymentMode === "FULL"}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>

              {/* Partial Payment */}
              {paymentMode === "PARTIAL" && (
                <>
                  <div className="text-sm font-medium text-gray-600">
                    Remaining Balance:{" "}
                    <span className="text-red-600">
                      {total - paidAmount || total} RWF
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Reason for Partial Payment
                    </label>
                    <textarea
                      className="w-full border rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      rows={3}
                      placeholder="Explain why payment is partial..."
                      value={partialReason}
                      onChange={(e) => setPartialReason(e.target.value)}
                    />
                  </div>
                </>
              )}

              <button
                onClick={approveOrder}
                className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition shadow-md"
              >
                Confirm & Approve Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
