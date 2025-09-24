import React, { useState, useMemo } from "react";
import Card from "../common/Card";
import Pill from "../common/Pill";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Badge from "../common/Badge";
import { currency } from "../../utils/currency";

function Receipts({ receipts }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const openReceipt = (r) => {
    setActive(r);
    setOpen(true);
  };

  const printReceipt = () => {
    window.print();
  };

  // Filtered receipts
  const filtered = useMemo(() => {
    return receipts.filter((r) => {
      const receiptDate = new Date(r.date);

      // Date range filter
      if (dateFrom && receiptDate < new Date(dateFrom)) return false;
      if (dateTo && receiptDate > new Date(dateTo + "T23:59:59")) return false;

      // Payment method filter
      if (paymentFilter !== "All" && r.paymentMethod !== paymentFilter) return false;

      // Amount range filter
      if (minAmount && r.totals.total < parseFloat(minAmount)) return false;
      if (maxAmount && r.totals.total > parseFloat(maxAmount)) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          r.id.toLowerCase(),
          r.customer.toLowerCase(),
          r.paymentMethod.toLowerCase(),
          r.lines.map((l) => l.name.toLowerCase()).join(" "),
          r.lines.map((l) => l.sku.toLowerCase()).join(" "),
          r.totals.total.toFixed(2),
          r.totals.sub.toFixed(2),
        ];
        if (!searchFields.some((field) => field.includes(query))) return false;
      }

      return true;
    });
  }, [receipts, searchQuery, dateFrom, dateTo, paymentFilter, minAmount, maxAmount]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    setPaymentFilter("All");
    setMinAmount("");
    setMaxAmount("");
  };

  const hasActiveFilters =
    searchQuery || dateFrom || dateTo || paymentFilter !== "All" || minAmount || maxAmount;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Search & Filters */}
      <Card className="col-span-12" title="Search & Filters">
        <div className="grid grid-cols-6 gap-3 mb-3">
          <Input
            label="Search Receipts"
            placeholder="Search by receipt #, customer, items, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            label="Payment Method"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option>All</option>
            <option>Cash</option>
            <option>Card</option>
            <option>QR / Wallet</option>
            <option>Gift Card</option>
          </Select>
          <Input type="date" label="Date From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" label="Date To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <Input
            type="number"
            step="0.01"
            label="Min Amount"
            placeholder="0.00"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            label="Max Amount"
            placeholder="999.99"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
            Clear All Filters
          </Button>
        </div>
      </Card>

      {/* Receipts Table */}
      <Card
        className="col-span-12"
        title="Receipts"
        action={
          <div className="flex items-center gap-2">
            <Pill>
              {filtered.length} of {receipts.length} receipts
            </Pill>
            {hasActiveFilters && <Badge tone="blue">Filtered</Badge>}
          </div>
        }
      >
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">Receipt #</th>
                <th className="p-2">Date</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Tax</th>
                <th className="p-2">Total</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2 font-medium">{r.id}</td>
                    <td className="p-2">{new Date(r.date).toLocaleString()}</td>
                    <td className="p-2">{r.customer}</td>
                    <td className="p-2">{r.paymentMethod}</td>
                    <td className="p-2">{currency(r.totals.sub)}</td>
                    <td className="p-2">{currency(r.totals.tax)}</td>
                    <td className="p-2 font-semibold">{currency(r.totals.total)}</td>
                    <td className="p-2">
                      <Button variant="outline" onClick={() => openReceipt(r)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {hasActiveFilters
                      ? "No receipts match the current filters"
                      : "No receipts found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active ? `Receipt ${active.id}` : "Receipt"}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button variant="primary" onClick={printReceipt}>
              Print
            </Button>
          </>
        }
      >
        {active && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Sunrise Cafe</div>
                <div className="text-xs text-gray-600">123 Main St · (555) 010-1234</div>
              </div>
              <div className="text-right text-sm">
                <div>{new Date(active.date).toLocaleString()}</div>
                <div>
                  Receipt: <span className="font-medium">{active.id}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-600">
                    <th className="p-2">Item</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {active.lines.map((l) => (
                    <tr key={l.id} className="border-b">
                      <td className="p-2">{l.name}</td>
                      <td className="p-2">{l.qty}</td>
                      <td className="p-2">{currency(l.price)}</td>
                      <td className="p-2">{currency(l.qty * l.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div>
                  Customer: <span className="font-medium">{active.customer}</span>
                </div>
                <div>
                  Payment: <span className="font-medium">{active.paymentMethod}</span>
                </div>
                <div>Discount: {active.discount}%</div>
                <div>Tax: {(active.taxRate * 100).toFixed(1)}%</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency(active.totals.sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{currency(active.totals.disc)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currency(active.totals.tax)}</span>
                </div>
                <div className="mt-2 flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{currency(active.totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">Thank you! Come again.</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Receipts;
