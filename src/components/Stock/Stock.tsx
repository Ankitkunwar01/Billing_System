import React, { useState } from "react";
import Card from "../common/Card";
import Pill from "../common/Pill";
import Select from "../common/Select";
import Input from "../common/Input";
import Button from "../common/Button";

function Stock({ stock, movements, setMovements }) {
  const [reason, setReason] = useState("Purchase");
  const [qty, setQty] = useState(1);
  const [sku, setSku] = useState(stock[0]?.sku ?? "");

  const record = () => {
    if (!sku) return;
    const line = stock.find((s) => s.sku === sku);
    setMovements((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        sku,
        item: line?.item || sku,
        qty,
        reason,
      },
      ...prev,
    ]);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card
        className="col-span-12"
        title="Stock Movements"
        action={<Pill>{movements.length} records</Pill>}
      >
        <div className="mb-4 grid grid-cols-5 gap-2">
          <Select label="SKU" value={sku} onChange={(e) => setSku(e.target.value)}>
            {stock.map((s) => (
              <option key={s.sku} value={s.sku}>
                {s.sku} — {s.item}
              </option>
            ))}
          </Select>

          <Input
            label="Qty (+/-)"
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />

          <Select label="Reason" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>Purchase</option>
            <option>Sale</option>
            <option>Waste/Spoilage</option>
            <option>Stocktake Adjustment</option>
          </Select>

          <div className="flex items-end">
            <Button variant="primary" onClick={record}>
              Record
            </Button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">Date</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="p-2">{new Date(m.date).toLocaleString()}</td>
                  <td className="p-2 font-mono">{m.sku}</td>
                  <td className="p-2">{m.item}</td>
                  <td className="p-2">{m.qty}</td>
                  <td className="p-2">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Stock;
