import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Compact "‹ 1 of N ›" pagination matching the screenshot.
 * @param {{ page:number, totalPages:number, onChange:(p:number)=>void }} props
 */
export function InvoicePagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-end gap-2 px-1 py-3 text-sm text-muted-foreground">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="grid h-8 w-8 place-items-center rounded-md text-brand hover:bg-brand-soft disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="font-medium text-foreground">
        {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="grid h-8 w-8 place-items-center rounded-md text-brand hover:bg-brand-soft disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
