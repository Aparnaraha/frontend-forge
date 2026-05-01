import { ChevronsUpDown } from "lucide-react";

/**
 * Borderless, airy table matching the Qnovate Accounts screenshot.
 *
 * @param {{
 *  columns: { key: string; label: string; align?: "left"|"right"; sortable?: boolean; width?: string; render: (row:any) => any }[];
 *  rows: any[];
 *  rowKey: (row:any) => string;
 *  onRowClick?: (row:any) => void;
 *  emptyMessage?: string;
 * }} props
 */
export function QnovateTable({ columns, rows, rowKey, onRowClick, emptyMessage = "No data" }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground ${
                  c.align === "right" ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {c.label}
                  {c.sortable && <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-border/60 transition ${
                onRowClick ? "cursor-pointer hover:bg-brand-soft/40" : ""
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-4 align-middle ${c.align === "right" ? "text-right" : ""}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-16 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * "Avatar + label" cell renderer used for the primary column.
 */
export function AvatarCell({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
        {Icon ? <Icon className="h-4 w-4" /> : <span className="text-xs font-semibold">{label?.[0]}</span>}
      </span>
      <div className="min-w-0">
        <div className="truncate font-semibold text-foreground">{label}</div>
        {sub && <div className="truncate text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

/**
 * Compact pagination footer used under tables.
 */
export function QnovatePagination({ page = 1, totalPages = 1, onChange }) {
  return (
    <div className="flex items-center justify-end gap-1 px-5 py-3 text-sm">
      <PagerArrow disabled={page <= 1} onClick={() => onChange?.(page - 1)} dir="prev" />
      {Array.from({ length: totalPages }).map((_, i) => {
        const n = i + 1;
        const active = n === page;
        return (
          <button
            key={n}
            onClick={() => onChange?.(n)}
            className={`grid h-8 min-w-8 place-items-center rounded-md px-2 text-sm font-medium ${
              active
                ? "border border-brand-ring bg-brand-soft text-brand"
                : "text-brand hover:bg-brand-soft"
            }`}
          >
            {n}
          </button>
        );
      })}
      <PagerArrow disabled={page >= totalPages} onClick={() => onChange?.(page + 1)} dir="next" />
    </div>
  );
}

function PagerArrow({ disabled, onClick, dir }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-md text-brand hover:bg-brand-soft disabled:opacity-30"
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
