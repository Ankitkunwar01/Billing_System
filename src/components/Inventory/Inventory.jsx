import React, { useState } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { currency } from "../../utils/currency";

function Inventory({ stock, setStock }) {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ sku: "", item: "", onHand: 0, uom: "pcs", reorder: 0, cost: 0, supplier: "" });

  const filtered = stock.filter(
    (s) => s.item.toLowerCase().includes(q.toLowerCase()) || s.sku.toLowerCase().includes(q.toLowerCase())
  );

  const openNew = () => {
    setForm({ sku: "", item: "", onHand: 0, uom: "pcs", reorder: 0, cost: 0, supplier: "" });
    setModal(true);
  };

  const save = () => {
    setStock((prev) => {
      const idx = prev.findIndex((p) => p.sku == form.sku);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = form;
        return next;
      }
      return [...prev, form];
    });
    setModal(false);
  };

  const adjust = (sku, delta) => {
    setStock((prev) => prev.map((p) => (p.sku === sku ? { ...p, onHand: Math.max(0, p.onHand + delta) } : p)));
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12" title="Inventory" action={<div className="flex items-center gap-2"><Input label="Search" value={q} onChange={(e)=>setQ(e.target.value)} /><Button variant="primary" onClick={openNew}>Add Item</Button></div>}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">SKU</th>
                <th className="p-2">Item</th>
                <th className="p-2">On Hand</th>
                <th className="p-2">UoM</th>
                <th className="p-2">Reorder @</th>
                <th className="p-2">Unit Cost</th>
                <th className="p-2">Supplier</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.sku} className="border-b">
                  <td className="p-2 font-mono">{s.sku}</td>
                  <td className="p-2">{s.item}</td>
                  <td className="p-2">{s.onHand}</td>
                  <td className="p-2">{s.uom}</td>
                  <td className="p-2">{s.reorder}</td>
                  <td className="p-2">{currency(s.cost)}</td>
                  <td className="p-2">{s.supplier}</td>
                  <td className="p-2">{s.onHand <= s.reorder ? <Badge tone="red">Reorder</Badge> : <Badge tone="green">OK</Badge>}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button variant="soft" onClick={() => adjust(s.sku, +1)}>+1</Button>
                      <Button variant="soft" onClick={() => adjust(s.sku, -1)}>-1</Button>
                      <Button variant="outline" onClick={() => { setForm(s); setModal(true); }}>Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={form.sku ? `Edit ${form.sku}` : "New Item"} footer={<>
        <Button onClick={() => setModal(false)}>Cancel</Button>
        <Button variant="primary" onClick={save}>Save</Button>
      </>}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="SKU" value={form.sku} onChange={(e)=>setForm({...form, sku: e.target.value})} />
          <Input label="Item Name" value={form.item} onChange={(e)=>setForm({...form, item: e.target.value})} />
          <Input label="On Hand" type="number" value={form.onHand} onChange={(e)=>setForm({...form, onHand: Number(e.target.value)})} />
          <Input label="Unit of Measure" value={form.uom} onChange={(e)=>setForm({...form, uom: e.target.value})} />
          <Input label="Reorder Point" type="number" value={form.reorder} onChange={(e)=>setForm({...form, reorder: Number(e.target.value)})} />
          <Input label="Unit Cost" type="number" step="0.01" value={form.cost} onChange={(e)=>setForm({...form, cost: Number(e.target.value)})} />
          <Input label="Supplier" value={form.supplier} onChange={(e)=>setForm({...form, supplier: e.target.value})} />
        </div>
      </Modal>
    </div>
  );
}

export default Inventory;