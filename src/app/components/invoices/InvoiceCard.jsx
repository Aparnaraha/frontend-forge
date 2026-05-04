import { Link } from "react-router-dom";
import { Receipt, User, X } from "lucide-react";
import { QStatusPill } from "../qnovate/QnovateStatusPill";
import {
  formatDate,
  formatMoney,
  invoiceStatusLabel,
  invoiceStatusTone,
} from "../../lib/invoiceFormat";

/**
 * Single invoice card.
 * Hovering "Display ID" or "Invoice ID" triggers underline + navigates to the
 * Invoice "TI" detail screen (`/invoices/:invoiceId`).
 *
 * @param {{
 *   invoice: ReturnType<typeof import("../../lib/invoiceFormat").mapInvoice>,
 *   accountName?: string,
 *   contactName?: string,
 *   onClose?: (invoiceId: string) => void,
 * }} props
 */
export function InvoiceCard({
  invoice,
  accountName = "A Plus Inc.",
  contactName = "Joe Smith",
  onClose,
}) {
  const detailHref = `/invoices/${encodeURIComponent(invoice.invoiceId)}`;

  return (
    <article className="group relative rounded-lg border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
          <Receipt className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-foreground">
            SPR – {accountName}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {/* Hoverable, navigable Display ID */}
            <Link
              to={detailHref}
              className="font-medium text-foreground decoration-brand underline-offset-2 hover:text-brand hover:underline"
              title={`Open invoice ${invoice.invoiceId}`}
            >
              {invoice.displayId}
            </Link>
            <span className="text-muted-foreground">•</span>
            <QStatusPill tone={invoiceStatusTone(invoice.status)}>
              {invoiceStatusLabel(invoice.status)}
            </QStatusPill>
          </div>

          {/* Account + Contact line */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5">
              <User className="h-3 w-3" />
              {accountName}
            </span>
            <span>•</span>
            <span className="font-medium text-foreground">{contactName}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => onClose(invoice.invoiceId)}
            aria-label="Dismiss"
            className="grid h-7 w-7 place-items-center rounded-md text-brand opacity-60 hover:bg-brand-soft hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Footer row — meta */}
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{invoice.description || "—"}</span>
        <span>•</span>
        <span>
          Termination Date:{" "}
          <span className="font-medium text-foreground">{formatDate(invoice.dueDate)}</span>
        </span>
      </div>

      {/* Hidden line shown on hover — totals + invoice id link */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
        <div>
          <div className="text-muted-foreground">USD</div>
          <div className="font-semibold text-foreground">{formatMoney(invoice.totalUSD, "USD")}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground">CAD</div>
          <div className="font-semibold text-foreground">{formatMoney(invoice.totalCAD, "CAD")}</div>
        </div>
        <div className="col-span-2 mt-1 truncate text-muted-foreground">
          Invoice ID:{" "}
          <Link
            to={detailHref}
            className="font-mono text-brand decoration-brand underline-offset-2 hover:underline"
          >
            {invoice.invoiceId}
          </Link>
        </div>
      </div>
    </article>
  );
}
