import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Receipt } from "lucide-react";

import { QnovateShell } from "../components/qnovate/QnovateShell";
import { QStatusPill } from "../components/qnovate/QnovateStatusPill";
import { Banner } from "../components/ui/Banner";
import { fetchInvoiceById } from "../lib/invoicesApi";
import {
  formatDate,
  formatMoney,
  invoiceStatusLabel,
  invoiceStatusTone,
  mapInvoice,
} from "../lib/invoiceFormat";

/**
 * Placeholder Invoice "TI" screen — replace with the real detail layout when
 * porting into your C4C project. Demonstrates the click-through navigation.
 */
export default function InvoiceDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await fetchInvoiceById(id);
        setInv(raw ? mapInvoice(raw) : null);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [id]);

  return (
    <QnovateShell>
      <div className="space-y-4 p-6">
        <Banner type={err ? "error" : ""} message={err} onClose={() => setErr("")} />

        <Link to="/invoices" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Link>

        {!inv ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700">
                <Receipt className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-foreground">{inv.displayId}</h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">{inv.invoiceId}</span>
                  <QStatusPill tone={invoiceStatusTone(inv.status)}>
                    {invoiceStatusLabel(inv.status)}
                  </QStatusPill>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Description" value={inv.description} />
              <Field label="Invoice Date" value={formatDate(inv.invoiceDate)} />
              <Field label="Due Date" value={formatDate(inv.dueDate)} />
              <Field label="Total (USD)" value={formatMoney(inv.totalUSD, "USD")} />
              <Field label="Total (CAD)" value={formatMoney(inv.totalCAD, "CAD")} />
            </dl>
          </div>
        )}
      </div>
    </QnovateShell>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}
