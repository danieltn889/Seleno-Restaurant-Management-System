export default function OrderNotePrint({ table, category, items, servedBy, orderId, orderDate }) {
  if (!items || items.length === 0) return null;

  const printOrderNote = () => {
    const win = window.open("", "", "width=300,height=600");
    win.document.write(`
      <html>
        <head>
          <title>OrderNote_${category}_${table}</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 80mm; }
            h2 { text-align: center; font-weight: bold; }
            hr { border-top: 1px dashed #000; }
          </style>
        </head>
        <body>
          <h2>SERENO ORDER NOTE</h2>
          <p>Order ID: ${orderId}</p>
          <p>Date: ${orderDate}</p>
          <p>Category: ${category}</p>
          <p>Table: ${table}</p>
          <p>Served By: ${servedBy.firstname} ${servedBy.lastname}</p>
          <hr/>
          ${items.map(i => `<p>${i.name} x ${i.qty}</p>`).join('')}
          <hr/>
          <p style="text-align:center;">--- ORDER NOTE ---</p>
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
      onClick={printOrderNote}
      className="bg-green-600 text-white px-3 py-1 mt-2 rounded text-sm"
    >
      Print Order Note
    </button>
  );
}
