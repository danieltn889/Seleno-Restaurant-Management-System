export default function PosPrint({ items, table, category }) {
  if (!items || items.length === 0) return null;

  const printPOS = () => {
    const win = window.open("", "", "width=300,height=600");
    win.document.write(`
      <html>
        <head>
          <title>POS_${category}_${table}</title>
          <style>
            body { font-family: monospace; font-size: 12px; background: white; color: black; width: 80mm; }
            hr { border-top: 1px dashed #000; }
          </style>
        </head>
        <body>
          <p style="text-align:center;font-weight:bold;">SERENO POS</p>
          <p style="text-align:center;">${category.toUpperCase()}</p>
          <hr/>
          <p>Table: ${table}</p>
          <hr/>
          ${items.map(i => `<p>${i.name} x ${i.qty} = ${i.price*i.qty} RWF</p>`).join('')}
          <hr/>
          <p style="text-align:center;">--- PAYMENT NOTE ---</p>
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
      onClick={printPOS}
      className="bg-green-600 text-white px-3 py-1 mt-2 rounded text-sm"
    >
      Print {category} Note
    </button>
  );
}
