// src/types/index.ts
export interface Receipt {
  id: string;
  date: string;
  customer: string;
  paymentMethod: string;
  discount: number;
  taxRate: number;
  lines: LineItem[];
  totals: { sub: number; disc: number; tax: number; total: number };
}

export interface LineItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  sku: string;
}

export interface StockItem {
  sku: string;
  item: string;
  onHand: number;
  uom: string;
  reorder: number;
  cost: number;
  supplier: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}