  import React, { useMemo, useState } from "react";
  import Card from "../common/Card";
  import Pill from "../common/Pill";
  import Input from "../common/Input";
  import Select from "../common/Select";
  import Button from "../common/Button";
  import MENU from "../../constants/menu";
  import { currency } from "../../utils/currency";
  import { calcTotals } from "../../utils/calcTotals";
  // import "../../style/pos.css"

  function POS({ onCompleteOrder }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [lines, setLines] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0.13);
    const [customer, setCustomer] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    const cats = useMemo(() => ["All", ...Array.from(new Set(MENU.map((m) => m.category)))], []);

    const filtered = useMemo(() => {
      return MENU.filter(
        (m) =>
          (category === "All" || m.category === category) &&
          (m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.sku.toLowerCase().includes(query.toLowerCase()))
      );
    }, [query, category]);

    const addLine = (m) => {
      setLines((prev) => {
        const found = prev.find((l) => l.id === m.id);
        if (found) return prev.map((l) => (l.id === m.id ? { ...l, qty: l.qty + 1 } : l));
        return [...prev, { id: m.id, name: m.name, price: m.price, qty: 1, sku: m.sku }];
      });
    };

    const changeQty = (id, d) =>
      setLines((prev) =>
        prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + d) } : l))
      );

    const removeLine = (id) => setLines((prev) => prev.filter((l) => l.id !== id));

    const totals = calcTotals(lines, taxRate, discount);

    const canCheckout = lines.length > 0;

    const handleCheckout = () => {
      const receipt = {
        id: "R" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toISOString(),
        customer: customer || "Walk-in",
        paymentMethod,
        discount,
        taxRate,
        lines,
        totals,
      };
      onCompleteOrder(receipt);
      setLines([]);
      setDiscount(0);
      setCustomer("");
      setPaymentMethod("Cash");
    };

    return (
      <div className="grid grid-cols-12 gap-4">
        {/* Catalog */}
        <Card className="col-span-5" title="Catalog" action={<Pill>{filtered.length} items</Pill>}>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Input
              label="Search"
              placeholder="Search by name or SKU"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((m) => (
              <button
                key={m.id}
                className="flex items-center justify-between rounded-xl border p-3 text-left hover:shadow"
                onClick={() => addLine(m)}
              >
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">
                    {m.category} · {m.sku}
                  </div>
                </div>
                <div className="text-sm font-semibold">{currency(m.price)}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Current Order */}
        <Card className="col-span-4" title="Current Order" action={<Pill>{lines.length} lines</Pill>}>
          {lines.length === 0 ? (
            <div className="grid h-40 place-items-center text-sm text-gray-500">
              Add items from the catalog →
            </div>
          ) : (
            <div className="space-y-2">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-xl border p-2">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-gray-500">{l.sku}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="soft" onClick={() => changeQty(l.id, -1)}>
                      -
                    </Button>
                    <span className="w-6 text-center">{l.qty}</span>
                    <Button variant="soft" onClick={() => changeQty(l.id, +1)}>
                      +
                    </Button>
                  </div>
                  <div className="w-20 text-right font-semibold">{currency(l.price * l.qty)}</div>
                  <button onClick={() => removeLine(l.id)} className="text-gray-400 hover:text-red-600">
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Checkout */}
        <Card className="col-span-3" title="Checkout">
          <div className="grid gap-2">
            <Input
              label="Customer"
              placeholder="Walk-in or name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Cash</option>
              <option>Card</option>
              <option>QR / Wallet</option>
              <option>Gift Card</option>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Discount %"
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              <Input
                label="Tax %"
                type="number"
                min={0}
                max={99}
                value={taxRate * 100}
                onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
              />
            </div>
            <div className="my-2 rounded-xl bg-gray-50 p-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency(totals.sub)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{currency(totals.disc)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{currency(totals.tax)}</span>
              </div>
              <div className="mt-2 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{currency(totals.total)}</span>
              </div>
            </div>
            <Button variant="primary" onClick={handleCheckout} className="w-full" disabled={!canCheckout}>
              Complete Order
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  export default POS;
