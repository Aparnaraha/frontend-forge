import { ChevronDown, Filter, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Blue filter-chip bar with dropdowns — Qnovate "All Accounts | Status | …" style.
 *
 * @param {{
 *  primary: { label: string; icon?: any; options?: { label: string; value: string }[]; value?: string; onChange?: (v:string)=>void };
 *  filters: { key: string; label: string; options: { label: string; value: string }[]; value: string; onChange: (v:string)=>void }[];
 *  onOpenFilters?: () => void;
 * }} props
 */
export function QnovateFilterChips({ primary, filters, onOpenFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
      <Chip
        label={primary.label}
        icon={primary.icon ?? Tag}
        primary
        options={primary.options}
        value={primary.value}
        onChange={primary.onChange}
      />
      {filters.map((f) => (
        <Chip
          key={f.key}
          label={f.label}
          options={f.options}
          value={f.value}
          onChange={f.onChange}
        />
      ))}

      <button
        onClick={onOpenFilters}
        className="ml-auto grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-accent"
        aria-label="More filters"
      >
        <Filter className="h-4 w-4" />
      </button>
    </div>
  );
}

function Chip({ label, icon: Icon, primary, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = options?.find((o) => o.value === value);
  const display = current?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => options && setOpen((v) => !v)}
        className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
          primary
            ? "border border-brand/20 bg-brand-soft text-brand"
            : "border border-transparent text-brand hover:bg-brand-soft"
        }`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{display}</span>
        {options && <ChevronDown className="h-4 w-4 opacity-70" />}
      </button>

      {open && options && (
        <div className="absolute left-0 top-full z-30 mt-1 min-w-[200px] rounded-md border border-border bg-popover py-1 shadow-lg">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange?.(o.value); setOpen(false); }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-accent ${
                o.value === value ? "font-semibold text-brand" : "text-popover-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
