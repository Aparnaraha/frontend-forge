// Dummy data — replace by API response. Schema matches user's spec exactly.
const STATUSES = ["Open", "Paid", "Overdue", "Draft", "Submitted"];
const DESCS = [
  "Special Pricing Invoice",
  "Service Renewal",
  "Hardware Procurement",
  "Consulting Services",
  "Subscription Charge",
  "Annual Maintenance",
];

function pad(n) {
  return String(n).padStart(3, "0");
}

function isoDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

// 18 records → 5 pages at 4/page (last page partial — proves pagination works)
export const DUMMY_INVOICES = Array.from({ length: 18 }, (_, i) => {
  const idx = i + 1;
  const status = STATUSES[i % STATUSES.length];
  const usd = 1500 + i * 235;
  return {
    Invoice_id:      `INV-BE-${1000 + idx}`,                  // backend id
    Invoice_desc:    DESCS[i % DESCS.length],
    Display_id:      `INV - HBS - ${pad(137 - i)}`,           // visible id
    Invioce_Status:  status,
    InvoiceTotalUSD: usd.toFixed(2),
    InvoiceTotalCAD: (usd * 1.36).toFixed(2),
    InvoiceDueDate:  isoDate(14 - i),
    InvoiceDate:     isoDate(-30 + i),
  };
});
