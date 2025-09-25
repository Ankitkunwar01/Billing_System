// src/utils/currency.ts
export function currency(value: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
  }).format(value);
}
