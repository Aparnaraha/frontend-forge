// Mappers + formatters for the invoice screen.

const STATUS_TONE = {
  open:        "pending",
  submitted:   "pending",
  draft:       "draft",
  paid:        "approved",
  approved:    "approved",
  overdue:     "rejected",
  cancelled:   "expired",
  "not started": "draft",
};

const STATUS_LABEL = {
  open:        "OPEN",
  submitted:   "SUBMITTED",
  draft:       "DRAFT",
  paid:        "PAID",
  approved:    "APPROVED",
  overdue:     "OVERDUE",
  cancelled:   "CANCELLED",
  "not started": "NOT STARTED",
};

export const invoiceStatusTone  = (s) => STATUS_TONE[(s || "").toLowerCase()]  ?? "draft";
export const invoiceStatusLabel = (s) => STATUS_LABEL[(s || "").toLowerCase()] ?? (s || "—").toUpperCase();

export const formatMoney = (amount, currency) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${currency} —`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(iso).slice(0, 10);
  }
};

/**
 * Maps the raw backend invoice record to the flat shape consumed by the UI.
 */
export function mapInvoice(raw) {
  return {
    invoiceId:   raw.Invoice_id        ?? "",     // used for routing/links
    displayId:   raw.Display_id        ?? "—",
    description: raw.Invoice_desc      ?? "",
    status:      raw.Invioce_Status    ?? "Draft",
    totalUSD:    raw.InvoiceTotalUSD   ?? 0,
    totalCAD:    raw.InvoiceTotalCAD   ?? 0,
    dueDate:     raw.InvoiceDueDate    ?? null,
    invoiceDate: raw.InvoiceDate       ?? null,
  };
}
