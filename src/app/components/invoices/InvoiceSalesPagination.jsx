import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Compact "‹ page of total ›" pagination, SAP Sales Cloud V2 style.
 *
 * @param {{
 *   page: number,
 *   totalPages: number,
 *   onChange: (nextPage: number) => void,
 * }} props
 */
export default function InvoiceSalesPagination({ page, totalPages, onChange }) {
  const safeTotal = Math.max(1, totalPages || 1);

  return (
    <div className="flex items-center justify-end gap-2 px-1 py-3 text-sm text-slate-500">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="grid h-8 w-8 place-items-center rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="font-medium text-slate-800">
        {page} of {safeTotal}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= safeTotal}
        className="grid h-8 w-8 place-items-center rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
