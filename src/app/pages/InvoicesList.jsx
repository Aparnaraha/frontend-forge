import { useCallback, useEffect, useState } from "react";
import { Receipt } from "lucide-react";

import { QnovateShell } from "../components/qnovate/QnovateShell";
import { QnovateFilterChips } from "../components/qnovate/QnovateFilterChips";
import { Banner } from "../components/ui/Banner";
import { InvoiceCardGrid } from "../components/invoices/InvoiceCardGrid";
import { InvoicePagination } from "../components/invoices/InvoicePagination";

import { fetchInvoices } from "../lib/invoicesApi";
import { mapInvoice } from "../lib/invoiceFormat";

const PAGE_SIZE = 4;

const STATUS_OPTS = [
  { label: "All Statuses", value: "all" },
  { label: "Open",         value: "Open" },
  { label: "Submitted",    value: "Submitted" },
  { label: "Paid",         value: "Paid" },
  { label: "Overdue",      value: "Overdue" },
  { label: "Draft",        value: "Draft" },
];

const VIEW_OPTS = [
  { label: "All Invoices",     value: "all" },
  { label: "My Invoices",      value: "mine" },
  { label: "Awaiting Payment", value: "awaiting" },
];

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [count,    setCount]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [banner,   setBanner]   = useState({ type: "", message: "" });

  const [view,    setView]    = useState("all");
  const [status,  setStatus]  = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { value, count } = await fetchInvoices({ page, pageSize: PAGE_SIZE, status });
      setInvoices(value.map(mapInvoice));
      setCount(count);
    } catch (err) {
      setBanner({ type: "error", message: `Could not load invoices: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <QnovateShell>
      <div className="space-y-4 p-6">
        <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />

        <QnovateFilterChips
          primary={{
            label: "All Invoices",
            icon: Receipt,
            options: VIEW_OPTS,
            value: view,
            onChange: setView,
          }}
          filters={[
            { key: "status", label: "Status", options: STATUS_OPTS, value: status, onChange: (v) => { setStatus(v); setPage(1); } },
          ]}
        />

        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Invoices ({count})
          </h2>
          <span className="text-sm text-muted-foreground">| Sorted by Invoice Date</span>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Loading invoices…
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No invoices match the current filter.
          </div>
        ) : (
          <InvoiceCardGrid invoices={invoices} />
        )}

        <InvoicePagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </QnovateShell>
  );
}
