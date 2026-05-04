import { useEffect, useMemo, useState } from "react";
import InvoiceSalesCard from "./InvoiceSalesCard";
import InvoiceSalesPagination from "./InvoiceSalesPagination";
import { getInvoicesByAccount } from "./api/invoiceApi";

const PAGE_SIZE = 4;

/**
 * Fetches invoices for an account from the CAP backend and renders
 * them in a paginated 2-column grid (4 per page).
 *
 * @param {{ accountId: string, pageSize?: number }} props
 */
export default function InvoiceSalesList({ accountId, pageSize = PAGE_SIZE }) {
  const [items, setItems]     = useState([]);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getInvoicesByAccount(accountId)
      .then((rows) => {
        if (cancelled) return;
        setItems(Array.isArray(rows) ? rows : []);
        setPage(1);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [accountId]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems  = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading invoices…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No invoices found for account {accountId}.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Invoices ({items.length})
        </h2>
        <span className="text-sm text-slate-500">| Sorted by Invoice Date</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {pageItems.map((inv) => (
          <InvoiceSalesCard key={inv.Invoice_id} invoice={inv} />
        ))}
      </div>

      <InvoiceSalesPagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => setPage(Math.min(Math.max(1, p), totalPages))}
      />
    </div>
  );
}
