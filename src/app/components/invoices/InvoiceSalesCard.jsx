import { Link } from "react-router-dom";
import { Receipt, User, X } from "lucide-react";

// ---------- tiny inline helpers (kept local so the file is self-contained) ----
const STATUS_STYLES = {
  open:        "bg-amber-100 text-amber-800",
  submitted:   "bg-amber-100 text-amber-800",
  draft:       "bg-slate-100 text-slate-700",
  paid:        "bg-emerald-100 text-emerald-800",
  approved:    "bg-emerald-100 text-emerald-800",
  overdue:     "bg-rose-100 text-rose-800",
  cancelled:   "bg-slate-200 text-slate-600",
};

const statusClass = (s) =>
  STATUS_STYLES[(s || "").toLowerCase()] ?? "bg-slate-100 text-slate-700";

const formatMoney = (amount, currency) => {
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

const formatDate = (iso) => {
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
 * SAP Sales Cloud V2 styled invoice card.
 *
 * @param {{
 *   invoice: {
 *     Invoice_id: string,
 *     Invoice_desc: string,
 *     Display_id: string,
 *     Invoice_Status: string,
 *     InvoiceTotalUSD: number|string,
 *     InvoiceTotalCAD: number|string,
 *     InvoiceDueDate: string,
 *     InvoiceDate: string,
 *   },
 *   accountName?: string,
 *   contactName?: string,
 *   onClose?: (invoiceId: string) => void,
 *   detailPathPrefix?: string,   // defaults to "/invoices"
 * }} props
 */
export default function InvoiceSalesCard({
  invoice,
  accountName = "A Plus Inc.",
  contactName = "Joe Smith",
  onClose,
  detailPathPrefix = "/invoices",
}) {
  const detailHref = `${detailPathPrefix}/${encodeURIComponent(invoice.Invoice_id)}`;

  return (
    <article className="group relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
          <Receipt className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-900">
            SPR – {accountName}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Link
              to={detailHref}
              className="font-medium text-slate-900 decoration-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
              title={`Open invoice ${invoice.Invoice_id}`}
            >
              {invoice.Display_id || "—"}
            </Link>
            <span className="text-slate-400">•</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass(
                invoice.Invoice_Status,
              )}`}
            >
              {invoice.Invoice_Status || "—"}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5">
              <User className="h-3 w-3" />
              {accountName}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-800">{contactName}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => onClose(invoice.Invoice_id)}
            aria-label="Dismiss"
            className="grid h-7 w-7 place-items-center rounded-md text-blue-600 opacity-60 hover:bg-blue-50 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Description / dates */}
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <span className="font-medium text-slate-800">
          {invoice.Invoice_desc || "—"}
        </span>
        <span>•</span>
        <span>
          Invoice Date:{" "}
          <span className="font-medium text-slate-800">
            {formatDate(invoice.InvoiceDate)}
          </span>
        </span>
        <span>•</span>
        <span>
          Due Date:{" "}
          <span className="font-medium text-slate-800">
            {formatDate(invoice.InvoiceDueDate)}
          </span>
        </span>
      </div>

      {/* Totals + invoice id link */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 text-xs">
        <div>
          <div className="text-slate-500">USD</div>
          <div className="font-semibold text-slate-900">
            {formatMoney(invoice.InvoiceTotalUSD, "USD")}
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-500">CAD</div>
          <div className="font-semibold text-slate-900">
            {formatMoney(invoice.InvoiceTotalCAD, "CAD")}
          </div>
        </div>
        <div className="col-span-2 mt-1 truncate text-slate-500">
          Invoice ID:{" "}
          <Link
            to={detailHref}
            className="font-mono text-blue-700 decoration-blue-700 underline-offset-2 hover:underline"
          >
            {invoice.Invoice_id}
          </Link>
        </div>
      </div>
    </article>
  );
}
