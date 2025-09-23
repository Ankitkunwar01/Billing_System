function calcTotals(lines, taxRate = 0.13, discount = 0) {
  const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const disc = discount > 0 ? sub * (discount / 100) : 0;
  const taxable = Math.max(0, sub - disc);
  const tax = taxable * taxRate;
  const total = taxable + tax;
  return { sub, disc, tax, total };
}

export { calcTotals };