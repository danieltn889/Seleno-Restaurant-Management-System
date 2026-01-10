import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { listOrders, updateOrderStatus } from "../../api/services/orders";
import { addPayment } from "../../api/services/payments";

export default function OrderApproval() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [partialReason, setPartialReason] = useState("");

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

  // Determine if Approve button should be enabled
  const canApprove = (() => {
    if (!selectedOrder) return false;
    if (!paymentMode || !paymentMethod) return false;

    if (paymentMode === "FULL") {
      return Number(paidAmount) === total;
    }

    if (paymentMode === "PARTIAL") {
      return (
        Number(paidAmount) > 0 &&
        Number(paidAmount) < total &&
        partialReason.trim() !== ""
      );
    }

    return false;
  })();

  const approveDisabledReason = !paymentMode
    ? "Select payment mode"
    : !paymentMethod
    ? "Select payment method"
    : paymentMode === "FULL" && Number(paidAmount) !== total
    ? "Full payment must equal total"
    : paymentMode === "PARTIAL" && (!paidAmount || paidAmount <= 0 || paidAmount >= total)
    ? "Enter valid partial amount"
    : paymentMode === "PARTIAL" && !partialReason.trim()
    ? "Partial payment reason is required"
    : "";

  /* Approve order + send payment to backend */
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

    // 🔹 Prepare payment payload
    const paymentPayload = {
      order_id: selectedOrder.order_id,
      payment_method: paymentMethod,
      amount_paid: Number(paidAmount),
      payment_status:
        paymentMode === "FULL" ? "paid" : paymentMode === "PARTIAL" ? "partial" : "unpaid",
      partial_reason: paymentMode === "PARTIAL" ? partialReason : "",
    };

    // Frontend validation for allowed methods
    if (!['cash', 'card', 'mobile'].includes(paymentMethod)) {
      Swal.fire("Error", "Invalid payment method selected. Allowed: cash, card, mobile", "error");
      return;
    }

    // Add payment
    const paymentRes = await addPayment(paymentPayload);
    if (paymentRes.status !== 'success') {
      Swal.fire("Error", paymentRes.message || "Failed to process payment", "error");
      return;
    }

    // Update order status
    const updateRes = await updateOrderStatus({
      order_id: selectedOrder.order_id,
      order_status: "confirmed",
    });

    if (updateRes.status === 'success') {
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

      // Refetch orders
      const res = await listOrders();
      if (res.status === 'success') setOrders(res.data || []);

      // Reset
      setSelectedOrder(null);
      setPaymentMode("");
      setPaymentMethod("");
      setPaidAmount("");
      setPartialReason("");
    } else {
      Swal.fire("Error", updateRes.message || "Failed to update order", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">
            Cashier Order Approval
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold mb-4">Pending Orders</h2>

              {orders.filter(o => (o.order_status || "").toLowerCase() === "pending").length === 0 && (
                <p className="text-gray-500 text-center">No pending orders</p>
              )}

              <div className="space-y-3">
                {orders
                  .filter(o => (o.order_status || "").toLowerCase() === "pending")
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
                      <option value="cash">Cash</option>
                      <option value="mobile">Mobile Money</option>
                      <option value="card">Card</option>
                      <option value="card">Bank Transfer</option>
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
                    disabled={!canApprove}
                    title={!canApprove ? approveDisabledReason : ""}
                    className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                      !canApprove
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-amber-700 text-white hover:bg-amber-800"
                    }`}
                  >
                    Confirm & Approve Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
