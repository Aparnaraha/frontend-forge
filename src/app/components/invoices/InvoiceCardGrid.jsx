import { InvoiceCard } from "./InvoiceCard";

/**
 * 2-column responsive grid of invoice cards.
 * @param {{ invoices: any[], onClose?: (id:string)=>void }} props
 */
export function InvoiceCardGrid({ invoices, onClose }) {
  if (!invoices?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {invoices.map((inv) => (
        <InvoiceCard key={inv.invoiceId} invoice={inv} onClose={onClose} />
      ))}
    </div>
  );
}
