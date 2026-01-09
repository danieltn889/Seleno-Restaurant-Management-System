// src/pages/orders/InvoicePrint.jsx
export default function InvoicePrint({ table, tableOrders, servedBy, orderId, orderDate }) {
  if (!tableOrders || !tableOrders[table]) return null;

  const allCategories = Object.keys(tableOrders[table] || {});

  const allItems = allCategories.flatMap(cat => {
    const catData = tableOrders[table][cat];
    if (!catData?.items || !Array.isArray(catData.items)) return [];
    return catData.items.map(i => ({
      id: i.id || 0,
      name: i.name || "Item",
      qty: i.qty || 0,
      price: i.price || 0
    }));
  });

  if (!allItems.length) return null;

  const totalAmount = allItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const printInvoice = () => {
    const win = window.open("", "", "width=300,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Invoice_${table}</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 80mm; }
            h2 { text-align: center; font-weight: bold; }
            hr { border-top: 1px dashed #000; }
          </style>
        </head>
        <body>
          <h2>SERENO RESTAURANT</h2>
          <p>Order ID: ${orderId}</p>
          <p>Date: ${orderDate}</p>
          <p>Table: ${table}</p>
          <p>Served By: ${servedBy.firstname} ${servedBy.lastname}</p>
          <hr/>
          ${allItems.map(i => `<p>${i.name} x ${i.qty} = ${i.price*i.qty} RWF</p>`).join('')}
          <hr/>
          <p style="text-align:right;font-weight:bold;">Grand Total: ${totalAmount} RWF</p>
          <p style="text-align:center;">--- CUSTOMER COPY ---</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <button
      onClick={printInvoice}
      className="bg-indigo-600 text-white px-3 py-2 mt-2 rounded text-sm font-semibold"
    >
      Print Customer Invoice
    </button>
  );
}
